import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    homeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    idCardNumber: { type: String, required: true },

    // Array of booked nights (excluding check-out day)
    bookedDates: [{ type: Date, required: true }],
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },

    totalPrice: { type: Number },

    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled", "refunded"],
      default: "pending",
    },

    refundReason: { type: String }, // only if user cancels
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
