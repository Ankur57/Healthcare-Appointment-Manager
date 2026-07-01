import express from "express";
import protect from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

import {
  createDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  addLeave
} from "../controllers/admin.controller.js";

const router =
  express.Router();

router.use(
  protect,
  authorize("admin")
);

router.post(
  "/doctors",
  createDoctor
);

router.get(
  "/doctors",
  getDoctors
);

router.get(
  "/doctors/:id",
  getDoctor
);

router.put(
  "/doctors/:id",
  updateDoctor
);

router.delete(
  "/doctors/:id",
  deleteDoctor
);

router.put(
  "/doctors/:id/leave",
  addLeave
);

export default router;