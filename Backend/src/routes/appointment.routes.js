import express from "express";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import { createAppointment, getMyAppointments, cancelAppointment } from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", protect, authorize("patient"), createAppointment);
router.get("/my", protect, authorize("patient"), getMyAppointments);
router.delete("/:id", protect, authorize("patient"), cancelAppointment);

export default router;