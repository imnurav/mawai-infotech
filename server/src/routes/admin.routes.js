import express from "express";
import {
  adminLogin,
  getAllBookings,
  updateBooking,
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { deleteBooking } from "../controllers/bookings.controller.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/bookings", verifyToken, getAllBookings);
router.put("/bookings/:id", verifyToken, updateBooking); // 🆕
router.delete("/bookings/:id", verifyToken, deleteBooking);

export default router;
