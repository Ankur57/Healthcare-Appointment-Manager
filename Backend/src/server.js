import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import "./jobs/reminder.job.js";
import MedicationReminder from "./models/MedicationReminder.js"

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running on ${PORT}`
    );
  });
});

const reminders =
  await MedicationReminder.find({
    nextReminderTime: {
      $lte: new Date(),
    },
  });