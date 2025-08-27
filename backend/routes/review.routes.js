import express from "express";
import {
  addReview,
  getReviewsByBooking,
  deleteReview,
  getReviewsByHomeId,
} from "../controllers/review.controller.js";

const router = express.Router();

// Add review for a booking (auth required)
router.post("/:bookingId", addReview);

// Get all reviews for a home
router.get("/home/:homeId", getReviewsByHomeId);

// Get reviews for a booking
router.get("/:bookingId", getReviewsByBooking);

// Delete review (auth required)
router.delete("/:reviewId", deleteReview);

export default router;
