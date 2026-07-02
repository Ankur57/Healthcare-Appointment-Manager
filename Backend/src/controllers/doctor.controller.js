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
        postVisitNotes,
        prescription,
        medications = [],
      } = req.body;

      // Accept either `notes` or `postVisitNotes` from the frontend
      const visitNotes = postVisitNotes || notes;

      const appointment = await Appointment.findById(req.params.id)
        .populate("patient", "name email")
        .populate({
          path: "doctor",
          populate: { path: "user", select: "name email" }
        });

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      appointment.postVisitNotes = visitNotes;
      appointment.prescription = prescription;

      const aiSummary = await generatePostVisitSummary(`
${visitNotes}

Prescription:
${prescription}
`);

      appointment.aiPostVisitSummary = aiSummary;
      appointment.status = "COMPLETED";

      await appointment.save();

      // Save Medications for Reminders
      if (medications.length > 0) {
        const MedicationReminder = (await import("../models/MedicationReminder.js")).default;
        
        const nextDay = new Date();
        nextDay.setUTCHours(0, 0, 0, 0);
        nextDay.setDate(nextDay.getDate() + 1);

        for (const med of medications) {
          if (med.medicineName && med.frequency) {
            await MedicationReminder.create({
              patient: appointment.patient._id,
              medicineName: med.medicineName,
              frequency: med.frequency,
              nextReminderTime: nextDay
            });
          }
        }
      }

      // Send Email Service Import
      const { sendEmail } = await import("../services/email.service.js");

      // Email Patient
      if (appointment.patient?.email) {
        await sendEmail(
          appointment.patient.email,
          "Your Post-Visit Summary & Prescription",
          `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0d9488; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 24px;">Consultation Summary</h2>
            <p style="margin: 5px 0 0; opacity: 0.9;">MediFlow Healthcare</p>
          </div>
          <div style="padding: 20px; color: #374151;">
            <p style="font-size: 16px;">Dear <strong>${appointment.patient.name}</strong>,</p>
            <p>Your recent consultation with <strong>Dr. ${appointment.doctor?.user?.name || "Doctor"}</strong> has been successfully completed. Below is the AI-generated summary and your doctor's official prescription.</p>
            
            <div style="background-color: #f3f4f6; border-left: 4px solid #0d9488; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;">
              <h3 style="margin-top: 0; color: #111827;">AI Post-Visit Summary</h3>
              <p style="margin-bottom: 8px;"><strong>Diagnosis / Summary:</strong><br/> ${aiSummary?.summary || "Not available"}</p>
              <p style="margin-bottom: 8px;"><strong>Medication Schedule:</strong><br/> ${aiSummary?.medicationSchedule || "Not available"}</p>
              <p style="margin: 0;"><strong>Follow-Up Steps:</strong><br/> ${aiSummary?.followUpSteps || "Not available"}</p>
            </div>

            <h3 style="color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Doctor's Prescription</h3>
            <div style="white-space: pre-wrap; background-color: #fff; border: 1px solid #e5e7eb; padding: 15px; border-radius: 4px; font-family: monospace;">
${prescription || "No prescription provided."}
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">
              This is an automated message from MediFlow. If you have any questions, please contact our support team.
            </p>
          </div>
        </div>
        `
        );
      }

      // Email Doctor
      if (appointment.doctor?.user?.email) {
        await sendEmail(
          appointment.doctor.user.email,
          "Consultation Notes Saved",
          `
        <h2>Consultation Completed</h2>
        <p>You have successfully completed the consultation with ${appointment.patient?.name}.</p>
        <p>The notes and prescription have been saved to their file, and an AI summary was generated.</p>
        `
        );
      }

      return res.status(200).json({
        success: true,
        message: "Notes added successfully",
        appointment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };