import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByHomeId,
  cancelBooking,
  getBookingByOwnerId,
  completeBooking,
} from "../controllers/booking.controller.js";

const router = express.Router();

// POST - Create new booking
router.post("/", createBooking);

router.post("/complete/:id", completeBooking);

// GET - All bookings
router.get("/", getAllBookings);


// GET - Bookings for specific home (for disabling dates in calendar)
router.get("/home/:homeId", getBookingsByHomeId);

// GET - Bookings by owner ID
router.get("/owner/:id", getBookingByOwnerId);

// PUT - Cancel booking
router.put("/:id/cancel", cancelBooking);

// GET - Single booking by ID
router.get("/:id", getBookingById);

export default router;
