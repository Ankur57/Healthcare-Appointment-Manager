import mongoose from "mongoose";

const appointmentSchema =
  new mongoose.Schema(
    {
      patient: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User"
      },

      doctor: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Doctor"
      },

      appointmentDate: Date,

      startTime: String,

      endTime: String,

      status: {
        type: String,
        enum: [
          "BOOKED",
          "COMPLETED",
          "CANCELLED"
        ],
        default: "BOOKED"
      },

      symptoms: String,

      aiPreVisitSummary: {
        urgencyLevel: String,
        chiefComplaint: String,
        suggestedQuestions: [String]
      },

      postVisitNotes: String,

      aiPostVisitSummary: {
        summary: String,
        medicationSchedule: String,
        followUpSteps: String
      },

      googleEventId: String
    },
    {
      timestamps: true
    }
  );
  appointmentSchema.index(
  {
    doctor: 1,
    appointmentDate: 1,
    startTime: 1
  },
  {
    unique: true
  }
);
export default mongoose.model(
  "Appointment",
  appointmentSchema
);