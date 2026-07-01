import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";


const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use(cookieParser());
app.use(
  "/api/v1/auth",
  authRoutes
);
app.use(
  "/api/v1/admin",
  adminRoutes
);
app.use(
  "/api/v1/patient",
  patientRoutes
);
app.use(
  "/api/v1/appointments",
  appointmentRoutes
);
app.use(
  "/api/v1/doctor",
  doctorRoutes
);

export default app;