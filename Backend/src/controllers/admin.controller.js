import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

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
  export const updateDoctor =
  async (req, res) => {
    try {
      const doctor =
        await Doctor.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true
          }
        );

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

      await User.findByIdAndDelete(
        doctor.user
      );

      await doctor.deleteOne();

      return res.status(200).json({
        success: true,
        message:
          "Doctor deleted"
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  export const addLeave =
  async (req, res) => {
    try {
      const { date } =
        req.body;

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

      doctor.leaveDays.push(
        new Date(date)
      );

      await doctor.save();

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