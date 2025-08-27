import Review from "../models/review.model.js";
import Booking from "../models/booking.model.js";
import Home from "../models/home.model.js";

// ➕ Add or update review for a booking
export const addReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, comment } = req.body;
    const userId = "68a4a5e378a4252b74d85dcc"; // replace with auth user

    // 1️⃣ Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // 2️⃣ Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already submitted a review for this booking" });
    }

    // 3️⃣ Create new review
    const review = await Review.create({
      booking: bookingId,
      user: userId,
      rating,
      comment,
    });

    // 4️⃣ Update home's rating summary
    const homeId = booking.homeId;
    const stats = await Review.aggregate([
      { $lookup: { from: "bookings", localField: "booking", foreignField: "_id", as: "booking" } },
      { $unwind: "$booking" },
      { $match: { "booking.homeId": homeId } },
      { $group: { _id: "$booking.homeId", averageRating: { $avg: "$rating" }, reviewsCount: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      await Home.findByIdAndUpdate(homeId, {
        averageRating: stats[0].averageRating,
        reviewsCount: stats[0].reviewsCount,
      });
    }

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};


// 📖 Get all reviews for a booking
export const getReviewsByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const reviews = await Review.find({ booking: bookingId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 📖 Get all reviews for a home (all bookings)
export const getReviewsByHomeId = async (req, res) => {
  try {
    const { homeId } = req.params;

    // Find all bookings of this home
    const bookings = await Booking.find({ homeId }).select("_id");
    const bookingIds = bookings.map(b => b._id);

    // Find all reviews for these bookings
    const reviews = await Review.find({ booking: { $in: bookingIds } });

    res.json({ success: true, data: reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ❌ Delete review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const booking = await Booking.findById(review.booking);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await Review.findByIdAndDelete(reviewId);

    // Recalculate home's rating summary
    const homeId = booking.homeId;
    const stats = await Review.aggregate([
      { $lookup: { from: "bookings", localField: "booking", foreignField: "_id", as: "booking" } },
      { $unwind: "$booking" },
      { $match: { "booking.homeId": homeId } },
      { $group: { _id: "$booking.homeId", averageRating: { $avg: "$rating" }, reviewsCount: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      await Home.findByIdAndUpdate(homeId, {
        averageRating: stats[0].averageRating,
        reviewsCount: stats[0].reviewsCount,
      });
    } else {
      await Home.findByIdAndUpdate(homeId, {
        averageRating: 0,
        reviewsCount: 0,
      });
    }

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
