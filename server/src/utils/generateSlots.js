import moment from "moment";
import { SLOT_CONFIG } from "../config/constant.js";

export const generateDailySlots = () => {
  const slots = [];
  const [start, end] = SLOT_CONFIG.workingHours;
  let current = moment(`2000-01-01T${start}`);
  const endTime = moment(`2000-01-01T${end}`);

  while (current.isBefore(endTime)) {
    slots.push(current.format("HH:mm"));
    current.add(SLOT_CONFIG.interval, "minute");
  }
  return slots;
};

export const isHoliday = (dateStr) => {
  const day = moment(dateStr).format("dddd");
  return SLOT_CONFIG.holidays.includes(day);
};

export const isSlotInBreakTime = (timeStr) => {
  const breakStart = moment(`2000-01-01T${SLOT_CONFIG.breakTime[0]}`);
  const breakEnd = moment(`2000-01-01T${SLOT_CONFIG.breakTime[1]}`);
  const slotTime = moment(`2000-01-01T${timeStr}`);
  return slotTime.isSameOrAfter(breakStart) && slotTime.isBefore(breakEnd);
};
