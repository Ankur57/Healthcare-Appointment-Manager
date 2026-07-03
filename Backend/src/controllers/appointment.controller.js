import Appointment
from "../models/Appointment.js";
import Doctor
from "../models/Doctor.js";
import {
  generatePreVisitSummary
}
from "../services/ai.service.js"
import {sendEmail} from "../services/email.service.js"
import { createCalendarEvent, deleteCalendarEvent } from "../services/calendar.service.js";
import { bookingConfirmationPatientEmail, bookingConfirmationDoctorEmail, bookingAdminEmail, cancellationPatientEmail, cancellationDoctorEmail } from '../services/emailTemplates.js';

export const createAppointment =
async (req, res) => {

  try {

    const {
      doctorId,
      appointmentDate,
      startTime,
      endTime,
      symptoms
    } = req.body;

    const normalizedDate = new Date(appointmentDate);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    const now = new Date();
    const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const todayStr = istNow.toISOString().split('T')[0];
    const appointmentDateStr = normalizedDate.toISOString().split('T')[0];

    if (appointmentDateStr === todayStr) {
      const [slotH, slotM] = startTime.split(':').map(Number);
      const slotMinutes = slotH * 60 + slotM;
      const currentMinutes = istNow.getHours() * 60 + istNow.getMinutes();
      if (slotMinutes <= currentMinutes) {
        return res.status(400).json({ success: false, message: 'Cannot book a slot that has already passed' });
      }
    }

    const doctor =
      await Doctor.findById(
        doctorId
      );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message:
          "Doctor not found"
      });
    }

    const existing =
      await Appointment.findOne({
        doctor: doctorId,
        appointmentDate: normalizedDate,
        startTime,
        status: "BOOKED"
      });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "Slot already booked"
      });
    }

    const patientConflict = await Appointment.findOne({
      patient: req.user._id,
      appointmentDate: normalizedDate,
      startTime,
      status: 'BOOKED'
    });
    if (patientConflict) {
      return res.status(400).json({ success: false, message: 'You already have an appointment booked at this time slot' });
    }

    const aiSummary =
    await generatePreVisitSummary(
      symptoms
    );
    const patient = req.user;

    const appointment =
      await Appointment.create({
        patient:
          req.user._id,
        doctor:
          doctorId,
        appointmentDate: normalizedDate,
        startTime,
        endTime,
        symptoms,
        aiPreVisitSummary:aiSummary  
      });

      // Fetch Doctor user for email and calendar
      const User = (await import("../models/User.js")).default;
      const doctorUser = await User.findById(doctor.user);

      // Fetch Admins for notifications
      const admins = await User.find({ role: "admin" });

      const patientEmailData = bookingConfirmationPatientEmail({
        patientName: patient.name,
        doctorName: doctorUser?.name || 'Doctor',
        specialization: doctor.specialization,
        date: new Date(appointmentDate).toDateString(),
        time: startTime,
        endTime,
        symptoms: symptoms || 'None provided',
        aiSummary: aiSummary,
        fee: doctor.consultationFee,
        qualification: doctor.qualification,
        experience: doctor.experience,
        workingHours: doctor.workingHours
      });
      await sendEmail(patient.email, patientEmailData.subject, patientEmailData.html);

      const doctorEmailData = bookingConfirmationDoctorEmail({
        patientName: patient.name,
        patientEmail: patient.email,
        doctorName: doctorUser?.name || 'Doctor',
        date: new Date(appointmentDate).toDateString(),
        time: startTime,
        endTime,
        symptoms: symptoms || 'None provided',
        aiSummary: aiSummary
      });
      if (doctorUser?.email) {
        await sendEmail(doctorUser.email, doctorEmailData.subject, doctorEmailData.html);
      }

      for (const admin of admins) {
        if (admin.email) {
          const adminEmailData = bookingAdminEmail({
            patientName: patient.name,
            patientEmail: patient.email,
            doctorName: doctorUser?.name || 'Unknown',
            date: new Date(appointmentDate).toDateString(),
            time: startTime
          });
          await sendEmail(admin.email, adminEmailData.subject, adminEmailData.html);
        }
      }

      // 4. Create Google Calendar Event
      try {
        const eventId = await createCalendarEvent(
          appointment,
          patient.name,
          doctorUser?.name || "Doctor",
          patient.email,
          doctorUser?.email
        );

        if (eventId) {
          appointment.googleEventId = eventId;
          await appointment.save();
        }
      } catch (error) {
        console.log("Calendar Error", error.message);
      }

    return res.status(201).json({
      success: true,
      appointment
    });

  } catch (error) {

    if (
      error.code === 11000
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Slot already booked"
      });
    }
    console.log("Error From Create catch")

    return res.status(500).json({
      success: false,
      message:
        error.message
    });
  }
};
export const cancelAppointment =
  async (req, res) => {
    try {
      const appointment = await Appointment.findById(req.params.id)
        .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } });

      if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found" });
      }

      if (appointment.patient.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Unauthorized" });
      }

      if (appointment.status === "CANCELLED") {
        return res.status(400).json({ success: false, message: "Appointment already cancelled" });
      }

      const now = new Date();
      const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const aptDate = new Date(appointment.appointmentDate);
      const aptDateStr = aptDate.toISOString().split('T')[0];
      const todayStr = istNow.toISOString().split('T')[0];

      if (aptDateStr < todayStr) {
        return res.status(400).json({ success: false, message: 'Cannot cancel a past appointment' });
      }
      if (aptDateStr === todayStr && appointment.startTime) {
        const [h, m] = appointment.startTime.split(':').map(Number);
        const slotMin = h * 60 + m;
        const currentMin = istNow.getHours() * 60 + istNow.getMinutes();
        if (slotMin <= currentMin) {
          return res.status(400).json({ success: false, message: 'Cannot cancel a past appointment' });
        }
      }

      appointment.status = "CANCELLED";
      await appointment.save();

      if (appointment.googleEventId) {
        await deleteCalendarEvent(appointment.googleEventId);
      }

      const patient = req.user;
      const doctorName = appointment.doctor?.user?.name || 'Doctor';
      const doctorEmail = appointment.doctor?.user?.email;
      const aptDateStrFormatted = new Date(appointment.appointmentDate).toDateString();

      const patientCancelEmail = cancellationPatientEmail({
        patientName: patient.name,
        doctorName,
        specialization: appointment.doctor?.specialization,
        date: aptDateStrFormatted,
        time: appointment.startTime,
        reason: 'Cancelled by patient'
      });
      await sendEmail(patient.email, patientCancelEmail.subject, patientCancelEmail.html);

      if (doctorEmail) {
        const doctorCancelEmail = cancellationDoctorEmail({
          patientName: patient.name,
          patientEmail: patient.email,
          doctorName,
          date: aptDateStrFormatted,
          time: appointment.startTime,
          reason: 'Cancelled by patient'
        });
        await sendEmail(doctorEmail, doctorCancelEmail.subject, doctorCancelEmail.html);
      }

      return res.status(200).json({
        success: true,
        message:
          "Appointment cancelled successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
export const getMyAppointments =
  async (req, res) => {
    try {
      const appointments =
        await Appointment.find({
          patient: req.user._id,
        })
          .populate({
            path: "doctor",
            populate: {
              path: "user",
              select: "name email",
            },
          })
          .sort({
            appointmentDate: -1,
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
;