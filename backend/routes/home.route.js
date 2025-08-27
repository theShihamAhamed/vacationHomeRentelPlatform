import express from "express";
import multer from "multer";
import {
  createHome,
  getAllHomes,
  getHomeById,
  getHomesByOwner,
  updateHome,
  hideHomeByAdmin,
  markHomeAsUnavailable,
} from "../controllers/home.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temp folder

// 🏠 Create a new home with image upload
router.post("/", upload.array("images", 10), createHome);

// 🔍 Get a single home by ID
router.get("/:id", getHomeById);

// 📋 Get all homes
router.get("/", getAllHomes);

// 👤 Get homes by owner ID
router.get("/owner/:ownerId", getHomesByOwner);

// ✏️ Update home details (owner or admin)
router.put("/:id", updateHome);

// 🚫 Admin hides home due to violation
router.put("/admin/hide/:id", hideHomeByAdmin);

// 🕶️ Owner marks home as unavailable
router.put("/owner/unavailable/:id", markHomeAsUnavailable);

export default router;
