import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import {sendEmail} from './services/email.service.js'


const app = express();

const allowedOrigins = [
  "https://hopeful-radiance-production-dce4.up.railway.app",
  "http://localhost:5174"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(
          new Error("Not allowed by CORS")
        );
      }
    },
    credentials: true,
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
app.get(
  "/api/v1/test-email",
  async (req, res) => {
    try {
      await sendEmail(
        "bajpaikur0206@gmail.com",
        "Test Email",
        "<h1>Resend is working!</h1>"
      );

      res.json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default app;
