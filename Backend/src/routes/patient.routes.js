import express from "express";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import { getDoctors, getSlots } from "../controllers/patient.controller.js";

const router = express.Router();

router.get(
  "/doctors",
  protect,
  authorize("patient"),
  getDoctors
);

router.get(
  "/doctors/:id/slots",
  protect,
  authorize("patient"),
  getSlots
);

export default router;