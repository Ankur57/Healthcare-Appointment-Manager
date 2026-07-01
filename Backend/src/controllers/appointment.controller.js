import Appointment
from "../models/Appointment.js";
import Doctor
from "../models/Doctor.js";
import {
  generatePreVisitSummary
}
from "../services/ai.service.js"
import {sendEmail} from "../services/email.service.js"

import { createCalendarEvent } from "../services/calendar.service.js";

export const createAppointment =
async (req, res) => {

  try {

    const {
      doctorId,
      appointmentDate,
      startTime,
      symptoms
    } = req.body;

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
        appointmentDate,
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
        appointmentDate,
        startTime,
        endTime,
        symptoms,
        aiPreVisitSummary:aiSummary  
      });

      await sendEmail(
        patient.email,
        "Appointment Booked",
        `
      <h2>Appointment Confirmed</h2>
      <p>Date:
      ${appointmentDate}</p>

      <p>Time:
      ${startTime}</p>
      `
      );

      try {
        const eventId =
          await createCalendarEvent(
            appointment
          );

        appointment.googleEventId =
          eventId;

        await appointment.save();
      } catch (error) {
        console.log(
          "Calendar Error",
          error
        );
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

      // Only owner can cancel
      if (
        appointment.patient.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Unauthorized",
        });
      }

      if (
        appointment.status ===
        "CANCELLED"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Appointment already cancelled",
        });
      }

      appointment.status =
        "CANCELLED";

      await appointment.save();

      const patient = req.user;

      await sendEmail(
        patient.email,
        "Appointment Cancelled",
        `
      <h2>Appointment Cancelled</h2>
      `
      );

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