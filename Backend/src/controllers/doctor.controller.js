import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import {
  generatePostVisitSummary,
} from "../services/ai.service.js";

export const getAppointments =
  async (req, res) => {
    try {
      const doctor =
        await Doctor.findOne({
          user: req.user._id,
        });

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message:
            "Doctor profile not found",
        });
      }

      const appointments =
        await Appointment.find({
          doctor: doctor._id,
        })
          .populate(
            "patient",
            "name email"
          )
          .sort({
            appointmentDate: 1,
          });

      return res.status(200).json({
        success: true,
        count:
          appointments.length,
        appointments,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

export const getAppointment =
  async (req, res) => {
    try {
      const appointment =
        await Appointment.findById(
          req.params.id
        )
          .populate(
            "patient",
            "name email"
          )
          .populate({
            path: "doctor",
            populate: {
              path: "user",
              select:
                "name email",
            },
          });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message:
            "Appointment not found",
        });
      }

      return res.status(200).json({
        success: true,
        appointment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
export const addNotes =
  async (req, res) => {
    try {
      const {
        notes,
        prescription,
      } = req.body;

      const appointment =
        await Appointment.findById(
          req.params.id
        );

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message:
            "Appointment not found",
        });
      }

      appointment.postVisitNotes =
        notes;

      appointment.prescription =
        prescription;

      const aiSummary =
        await generatePostVisitSummary(
          `
${notes}

Prescription:
${prescription}
`
        );

      appointment.aiPostVisitSummary =
        aiSummary;

      appointment.status =
        "COMPLETED";

      await appointment.save();

      return res.status(200).json({
        success: true,
        message:
          "Notes added successfully",
        appointment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };