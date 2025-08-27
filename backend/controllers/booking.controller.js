import mongoose from "mongoose";
import Booking from "../models/Booking.model.js";
import Home from "../models/home.model.js";
import { LedgerEntry } from "../models/ledger.model.js";

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const {
      homeId,
      guestName,
      phone,
      idCard,
      bookedDates,
      startDate,
      endDate,
    } = req.body;

    // Validate required fields
    if (
      !guestName ||
      !phone ||
      !idCard ||
      !bookedDates?.length ||
      !startDate ||
      !endDate
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Check if home exists
    const home = await Home.findById(homeId);
    if (!home) return res.status(404).json({ message: "Home not found" });

    // Convert bookedDates to Date objects
    const bookedDatesISO = bookedDates.map((d) => new Date(d));

    // Check if any bookedDates overlap with existing bookings for this home
    const overlap = await Booking.findOne({
      homeId: homeId,
      bookedDates: { $in: bookedDatesISO },
      status: { $ne: "cancelled" }, // allow booking if previous one is cancelled
    });

    if (overlap) {
      return res
        .status(409)
        .json({ message: "Selected dates are already booked" });
    }

    // Calculate total price (example: nights * price per night)
    const nights = bookedDates.length;
    const totalPrice = nights * home.price;

    const booking = await Booking.create({
      homeId,
      fullName: guestName,
      phoneNumber: phone,
      idCardNumber: idCard,
      bookedDates: bookedDatesISO,
      checkInDate: new Date(startDate),
      checkOutDate: new Date(endDate),
      totalPrice,
      status: "pending",
    });

    await LedgerEntry.create({
      bookingId: booking._id,
      type: "escrow_account", // correct type
      debit: 0, // money entering escrow
      credit: totalPrice,
      accounts: { from: "customer_wallet", to: "escrow_account" },
      note: "Payment held in escrow until checkout",
    });

    res.status(201).json({
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate(
      "homeId",
      "title price location"
    );
    res.json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("homeId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ data: booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get bookings for a specific home
export const getBookingsByHomeId = async (req, res) => {
  try {
    const bookings = await Booking.find({
      homeId: req.params.homeId,
      status: { $ne: "cancelled" },
    }).select("bookedDates -_id");
    res.json({ data: bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "cancelled";
    booking.refundReason = req.body.refundReason || "No reason provided";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", data: booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const completeBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("homeId");
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    if (booking.status === "completed") {
      return res
        .status(400)
        .json({ success: false, message: "Booking already completed" });
    }

    // Example: commission is 10%
    const commissionRate = 0.1;
    const commissionAmount = booking.totalPrice * commissionRate;
    const payoutToOwner = booking.totalPrice - commissionAmount;

    const ownerId = booking.homeId.ownerId; // must exist in Home model

    // 1. Pay owner
    await LedgerEntry.create({
      bookingId: booking._id,
      ownerId,
      type: "payout_owner",
      debit: 0,
      credit: payoutToOwner,
      accounts: { from: "escrow_account", to: "owner_wallet" },
      note: "Owner payout after successful checkout",
    });

    // 2. Commission income
    await LedgerEntry.create({
      bookingId: booking._id,
      type: "commission_income",
      debit: 0,
      credit: commissionAmount,
      accounts: { from: "escrow_account", to: "platform_wallet" },
      note: "Commission collected by platform",
    });

    // 3. Update booking status
    booking.status = "completed";
    await booking.save();

    res.json({ success: true, booking, payoutToOwner, commissionAmount });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to complete booking" });
  }
};

// Get bookings by Owner ID
export const getBookingByOwnerId = async (req, res) => {
  try {
    const { id: ownerId } = req.params;

    // Convert ownerId string to ObjectId
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    // Find all homes owned by this owner
    const homes = await Home.find({ ownerId: ownerObjectId }).select("_id");
    if (!homes.length) {
      return res.status(404).json({ message: "No homes found for this owner" });
    }

    // Extract home IDs
    const homeIds = homes.map((h) => h._id);

    // Find bookings related to those homes
    const bookings = await Booking.find({ homeId: { $in: homeIds } })
      .populate("homeId", "title location price")
      .sort({ createdAt: -1 });

    res.json({ data: bookings });
  } catch (err) {
    console.error("getBookingByOwnerId error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
