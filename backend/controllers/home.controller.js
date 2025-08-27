import Home from "../models/home.model.js";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";

export const createHome = async (req, res) => {
  try {

    const HARD_CODED_OWNER_ID = "64f5a2d9f2d7b23e5a1f2b22";

    const files = req.files; // multer handles this
    const body = JSON.parse(req.body.data); // frontend sends JSON string in 'data'

    console.log("Incoming home data:", body);
    console.log("Cloudinary config:", cloudinary.config());

    if (!process.env.CLOUDINARY_API_KEY) {
      throw new Error("Missing Cloudinary API key");
    }

    // ✅ Upload images to Cloudinary
    const imageUploadPromises = files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: "homes",
      })
    );

    const uploadedImages = await Promise.all(imageUploadPromises);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

    // ✅ Clean up local files
    files.forEach((file) => fs.unlinkSync(file.path));

    // ✅ Restructure location fields
    const location = {
      longitude: body.longitude,
      latitude: body.latitude,
      address: body.address,
      city: body.city,
      district: body.district,
      province: body.province,
    };

    body.ownerId = HARD_CODED_OWNER_ID;
    
    // ✅ Remove top-level location fields
    delete body.longitude;
    delete body.latitude;
    delete body.address;
    delete body.city;
    delete body.district;
    delete body.province;

    // ✅ Create new Home document
    const newHome = new Home({
      ...body,
      location,
      images: imageUrls,
    });

    await newHome.save();
    console.log("Home uploaded");

    res.status(201).json({
      success: true,
      message: "Home created successfully",
      data: newHome,
    });
  } catch (error) {
    console.error("Error creating home:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getHomeById = async (req, res) => {
  try {
    const homeId = req.params.id;
    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).json({ success: false, message: "Home not found" });
    }

    res.status(200).json({ success: true, data: home });
  } catch (error) {
    console.error("Error fetching home:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAllHomes = async (req, res) => {
  try {
    const homes = await Home.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: homes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get homes by owner ID
export const getHomesByOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const homes = await Home.find({ ownerId }).sort({ createdAt: -1 });

    if (!homes.length) {
      return res.status(404).json({ success: false, message: "No homes found for this owner" });
    }

    res.status(200).json({ success: true, data: homes });
  } catch (error) {
    console.error("Error fetching homes by owner:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateHome = async (req, res) => {
  try {
    const homeId = req.params.id;
    const updates = req.body;

    const updatedHome = await Home.findByIdAndUpdate(homeId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedHome) {
      return res.status(404).json({ success: false, message: "Home not found" });
    }

    res.status(200).json({ success: true, message: "Home updated", data: updatedHome });
  } catch (error) {
    console.error("Error updating home:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🚫 Admin hide home if it violates rules
export const hideHomeByAdmin = async (req, res) => {
  try {
    const homeId = req.params.id;
    const reason = req.body.reason || "Violation of platform rules";

    const home = await Home.findById(homeId);
    if (!home) {
      return res.status(404).json({ success: false, message: "Home not found" });
    }

    home.status = "hidden";
    home.approvalDetails.additionalInfo = reason;

    await home.save();

    res.status(200).json({
      success: true,
      message: "Home status updated to hidden due to violation",
      data: home,
    });
  } catch (error) {
    console.error("Error hiding home:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const markHomeAsUnavailable = async (req, res) => {
  try {
    const homeId = req.params.id;
    const ownerId = req.body.ownerId;

    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).json({ success: false, message: "Home not found" });
    }

    // Ensure the requester is the owner
    if (home.ownerId.toString() !== ownerId) {
      return res.status(403).json({ success: false, message: "Unauthorized: Not the owner" });
    }

    home.status = "unavailable";
    await home.save();

    res.status(200).json({
      success: true,
      message: "Home marked as unavailable",
      data: home,
    });
  } catch (error) {
    console.error("Error updating home status:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
