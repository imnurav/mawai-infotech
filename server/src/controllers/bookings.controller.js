import moment from "moment";
import { Booking } from "../models/booking.model.js";

import {
  generateDailySlots,
  isHoliday,
  isSlotInBreakTime,
} from "../utils/generateSlots.js";
import { SLOT_CONFIG } from "../config/constant.js";

export const createBooking = async (req, res, next) => {
  try {
    const { name, phone, date, time } = req.body;
    const exists = await Booking.findOne({
      date,
      time,
      phone,
      isDeleted: false,
    });

    if (exists) {
      return res.status(400).json({ message: "Slot already booked." });
    }
    const allSlots = generateDailySlots();
    if (!allSlots.includes(time)) {
      return res.status(400).json({ message: "Invalid slot time." });
    }

    if (isSlotInBreakTime(time)) {
      return res.status(400).json({ message: "Slot is in break time." });
    }

    const currentCount = await Booking.countDocuments({
      date,
      time,
      isDeleted: false,
    });

    if (currentCount >= SLOT_CONFIG.maxPerSlot) {
      return res.status(400).json({ message: "Slot is full." });
    }

    const booking = new Booking({ name, phone, date, time });
    await booking.save();

    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (err) {
    next(err);
  }
};

export const getAvailableSlots = async (req, res, next) => {
  try {
    const startDate = req.query.start || moment().format("YYYY-MM-DD");
    const now = moment();
    const allDays = [];

    for (let i = 0; i < 7; i++) {
      const date = moment(startDate).add(i, "days").format("YYYY-MM-DD");

      if (isHoliday(date)) continue;

      const slots = generateDailySlots();
      const bookings = await Booking.find({ date, isDeleted: false });

      const slotData = slots.map((time) => {
        const slotStart = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");
        const slotEnd = slotStart.clone().add(SLOT_CONFIG.interval, "minute");
        const lastBookingTime = slotEnd
          .clone()
          .subtract(SLOT_CONFIG.intervalMinutes, "minute");

        const count = bookings.filter((b) => b.time === time).length;
        const availableCount = SLOT_CONFIG.maxPerSlot - count;
        const isBreak = isSlotInBreakTime(time);

        return {
          time,
          availableCount: isBreak ? 0 : availableCount,
          ...(isBreak && { reason: "Lunch break" }),
          maxCount: SLOT_CONFIG.maxPerSlot,
          available:
            availableCount > 0 && now.isBefore(lastBookingTime) && !isBreak,
        };
      });

      allDays.push({ date, slots: slotData });
    }

    res.json(allDays);
  } catch (err) {
    next(err);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    next(err);
  }
};
