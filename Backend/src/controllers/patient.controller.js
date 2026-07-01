import Doctor from "../models/Doctor.js";
import generateSlots
from "../services/slot.service.js";

export const getDoctors =
async (req, res) => {
  try {
    const { specialization } =
      req.query;

    const query = {};

    if (specialization) {
      query.specialization =
        new RegExp(
          specialization,
          "i"
        );
    }

    const doctors =
      await Doctor.find(query)
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
      message:
        error.message
    });
  }
};

export const getSlots =
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

    const date =
      new Date(
        req.query.date
      );

    const isLeave =
      doctor.leaveDays.some(
        (leave) =>
          leave.toDateString() ===
          date.toDateString()
      );

    if (isLeave) {
      return res.status(200).json({
        success: true,
        slots: []
      });
    }

    const slots =
      await generateSlots(
        doctor,
        date
      );

    return res.status(200).json({
      success: true,
      slots
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message
    });
  }
};
