import express from "express";
import {
  bookAppointment,
  getAllAppointments,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/book", bookAppointment);
router.get("/appointments", getAllAppointments);

export default router;