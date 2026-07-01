import mongoose from "mongoose";

const medicationReminderSchema =
  new mongoose.Schema(
    {
      patient: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
      },

      medicineName: String,

      frequency: {
        type: String,
        enum: [
          "once",
          "twice",
          "thrice",
        ],
      },

      nextReminderTime:
        Date,
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "MedicationReminder",
  medicationReminderSchema
);