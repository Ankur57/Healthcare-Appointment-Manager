import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import {
  generatePostVisitSummary,
} from "../services/ai.service.js";
import { postVisitPatientEmail, postVisitDoctorEmail } from '../services/emailTemplates.js';
import { sendEmail } from '../services/email.service.js';

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
        
        for (const med of medications) {
          if (med.medicineName && med.frequency) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            if (med.frequency === 'once') {
              tomorrow.setUTCHours(2, 30, 0, 0); // 8:00 AM IST
            } else if (med.frequency === 'twice') {
              tomorrow.setUTCHours(2, 30, 0, 0); // 8:00 AM IST
            } else if (med.frequency === 'thrice') {
              tomorrow.setUTCHours(2, 30, 0, 0); // 8:00 AM IST
            }
            
            await MedicationReminder.create({
              patient: appointment.patient._id,
              medicineName: med.medicineName,
              frequency: med.frequency,
              nextReminderTime: tomorrow
            });
          }
        }
      }

      // Email Patient
      if (appointment.patient?.email) {
        const patientEmail = postVisitPatientEmail({
          patientName: appointment.patient.name,
          doctorName: appointment.doctor?.user?.name || 'Doctor',
          aiSummary,
          prescription: prescription || 'No prescription provided',
          notes: visitNotes,
          medications: medications || []
        });
        await sendEmail(appointment.patient.email, patientEmail.subject, patientEmail.html);
      }

      // Email Doctor
      if (appointment.doctor?.user?.email) {
        const doctorEmailData = postVisitDoctorEmail({
          patientName: appointment.patient?.name,
          doctorName: appointment.doctor?.user?.name || 'Doctor'
        });
        await sendEmail(appointment.doctor.user.email, doctorEmailData.subject, doctorEmailData.html);
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