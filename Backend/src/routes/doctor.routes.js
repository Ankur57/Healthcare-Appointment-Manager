import express from "express";

import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

import {
  getAppointments,
  getAppointment,
  addNotes,
} from "../controllers/doctor.controller.js";

const router =
  express.Router();

router.use(
  protect,
  authorize("doctor")
);

router.get(
  "/appointments",
  getAppointments
);

router.get(
  "/appointments/:id",
  getAppointment
);

router.post(
  "/appointments/:id/notes",
  addNotes
);

export default router;

