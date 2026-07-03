import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import { sendEmail } from '../services/email.service.js';
import { doctorWelcomeEmail, doctorAddedAdminEmail, doctorRemovedDoctorEmail, doctorRemovedAdminEmail, leaveApprovedDoctorEmail, leaveApprovedAdminEmail, leaveAppointmentCancelledEmail } from '../services/emailTemplates.js';
import { deleteCalendarEvent } from '../services/calendar.service.js';

export const createDoctor =
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        specialization,
        qualification,
        experience,
        consultationFee,
        slotDuration,
        workingHours
      } = req.body;

      const requiredFields = { name, email, password, specialization, qualification, experience, consultationFee, slotDuration };
      const missing = Object.entries(requiredFields).filter(([_, v]) => v === undefined || v === '' || v === null).map(([k]) => k);
      if (missing.length > 0) {
        return res.status(400).json({ success: false, message: `Missing required fields: ${missing.join(', ')}` });
      }
      if (!workingHours || !workingHours.start || !workingHours.end) {
        return res.status(400).json({ success: false, message: 'Working hours (start and end) are required' });
      }

      const existing =
        await User.findOne({
          email
        });

      if (existing) {
        return res.status(400).json({
          success: false,
          message:
            "Doctor already exists"
        });
      }

      const user =
        await User.create({
          name,
          email,
          password,
          role: "doctor"
        });

      const doctor =
        await Doctor.create({
          user: user._id,
          specialization,
          qualification,
          experience,
          consultationFee,
          slotDuration,
          workingHours
        });

      const welcomeEmail = doctorWelcomeEmail({ doctorName: name, email, specialization, qualification });
      await sendEmail(email, welcomeEmail.subject, welcomeEmail.html);

      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        const adminNotif = doctorAddedAdminEmail({ doctorName: name, email, specialization });
        await sendEmail(admin.email, adminNotif.subject, adminNotif.html);
      }

      return res.status(201).json({
        success: true,
        doctor
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  export const getDoctors =
  async (req, res) => {
    try {
      const doctors =
        await Doctor.find()
          .populate(
            "user",
            "name email"
          );

      return res.status(200).json({
        success: true,
        doctors
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  export const getDoctor =
  async (req, res) => {
    try {
      const doctor =
        await Doctor.findById(
          req.params.id
        ).populate(
          "user",
          "name email"
        );

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message:
            "Doctor not found"
        });
      }

      return res.status(200).json({
        success: true,
        doctor
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  export const updateDoctor = async (req, res) => {
    try {
      const { name, email, ...doctorFields } = req.body;
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
      
      if (name || email) {
        const userUpdate = {};
        if (name) userUpdate.name = name;
        if (email) userUpdate.email = email;
        await User.findByIdAndUpdate(doctor.user, userUpdate);
      }
      
      const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, doctorFields, { new: true }).populate('user', 'name email');

      return res.status(200).json({
        success: true,
        doctor: updatedDoctor
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  export const deleteDoctor =
  async (req, res) => {
    try {
      const doctor =
        await Doctor.findById(
          req.params.id
        );

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message:
            "Doctor not found"
        });
      }

      const doctorUser = await User.findById(doctor.user);
      const doctorName = doctorUser?.name;
      const doctorEmail = doctorUser?.email;

      await User.findByIdAndDelete(doctor.user);
      await doctor.deleteOne();

      if (doctorEmail) {
        const removeEmail = doctorRemovedDoctorEmail({ doctorName });
        await sendEmail(doctorEmail, removeEmail.subject, removeEmail.html);
      }
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        const adminNotif = doctorRemovedAdminEmail({ doctorName, email: doctorEmail });
        await sendEmail(admin.email, adminNotif.subject, adminNotif.html);
      }

      return res.status(200).json({
        success: true,
        message: "Doctor deleted"
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  export const addLeave = async (req, res) => {
    try {
      const { date } = req.body;
      const doctor = await Doctor.findById(req.params.id).populate("user", "name");

      if (!doctor) {
        return res.status(404).json({ success: false, message: "Doctor not found" });
      }

      const normalizedDate = new Date(date);
      normalizedDate.setUTCHours(0, 0, 0, 0);

      const alreadyOnLeave = doctor.leaveDays.some(d => {
        const existing = new Date(d);
        existing.setUTCHours(0, 0, 0, 0);
        return existing.getTime() === normalizedDate.getTime();
      });
      if (alreadyOnLeave) {
        return res.status(400).json({ success: false, message: 'Doctor is already on leave on this date' });
      }

      doctor.leaveDays.push(normalizedDate);
      await doctor.save();

      const Appointment = (await import("../models/Appointment.js")).default;

      const affectedAppointments = await Appointment.find({
        doctor: doctor._id,
        appointmentDate: normalizedDate,
        status: "BOOKED"
      }).populate("patient", "name email");

      for (const apt of affectedAppointments) {
        apt.status = "CANCELLED";
        await apt.save();

        if (apt.googleEventId) {
          await deleteCalendarEvent(apt.googleEventId);
        }

        if (apt.patient?.email) {
          const cancelEmail = leaveAppointmentCancelledEmail({ patientName: apt.patient.name, doctorName: doctor.user?.name || "Doctor", date: normalizedDate.toDateString(), time: apt.startTime });
          await sendEmail(apt.patient.email, cancelEmail.subject, cancelEmail.html);
        }
      }

      const doctorUser = await User.findById(doctor.user);
      if (doctorUser?.email) {
        const leaveEmail = leaveApprovedDoctorEmail({ doctorName: doctor.user?.name || doctorUser.name, date: normalizedDate.toDateString(), affectedCount: affectedAppointments.length });
        await sendEmail(doctorUser.email, leaveEmail.subject, leaveEmail.html);
      }

      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        const adminLeaveEmail = leaveApprovedAdminEmail({ doctorName: doctor.user?.name || doctorUser?.name, date: normalizedDate.toDateString(), affectedCount: affectedAppointments.length });
        await sendEmail(admin.email, adminLeaveEmail.subject, adminLeaveEmail.html);
      }

      return res.status(200).json({
        success: true,
        message: `Leave added and ${affectedAppointments.length} appointments cancelled.`,
        doctor
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

export const getAllAppointments = async (req, res) => {
  try {
    const Appointment = (await import('../models/Appointment.js')).default;
    const appointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
      .sort({ appointmentDate: -1 });
    return res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};