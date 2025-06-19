import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
      match: [/^\d{2}:\d{2}$/, "Time must be in HH:mm format"],
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bookingSchema.index({ date: 1, time: 1, phone: 1 }, { unique: true });
export const Booking = mongoose.model("Booking", bookingSchema);
