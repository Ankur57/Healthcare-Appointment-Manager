import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    specialization: {
      type: String,
      required: true,
      trim: true
    },

    qualification: {
      type: String,
      default: ""
    },

    experience: {
      type: Number,
      default: 0
    },

    consultationFee: {
      type: Number,
      default: 500
    },

    slotDuration: {
      type: Number,
      default: 30
    },

    workingHours: {
      start: {
        type: String,
        default: "09:00"
      },
      end: {
        type: String,
        default: "18:00"
      }
    },

    leaveDays: [
      {
        type: Date
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Doctor",
  doctorSchema
);