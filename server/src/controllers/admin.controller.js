import { Booking } from "../models/booking.model.js";
import jwt from "jsonwebtoken";
import { isHoliday, isSlotInBreakTime } from "../utils/generateSlots.js";
import { SLOT_CONFIG } from "../config/constant.js";
import moment from "moment";

export const adminLogin = (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return res.json({ token });
  }
  return res.status(401).json({ message: "Invalid credentials" });
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ isDeleted: false }).sort({
      date: 1,
      time: 1,
    });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const { date, time } = req.body;

    const bookingDateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");

    if (bookingDateTime.isBefore(moment())) {
      return res
        .status(400)
        .json({ message: "❌ Cannot book or update to a past date/time" });
    }

    if (isHoliday(date)) {
      return res.status(400).json({ message: "❌ Cannot book on a holiday" });
    }

    if (isSlotInBreakTime(time)) {
      return res
        .status(400)
        .json({ message: "❌ Cannot book during break time" });
    }

    const bookings = await Booking.find({ date, time, isDeleted: false });
    const filteredBookings = bookings.filter(
      (b) => b._id.toString() !== req.params.id
    );
    if (filteredBookings.length >= SLOT_CONFIG.maxPerSlot) {
      return res.status(400).json({ message: "❌ Slot is already full" });
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!booking) {
      return res.status(404).json({ message: "❌ Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
};
