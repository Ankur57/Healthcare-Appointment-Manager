import cron from "node-cron";
import MedicationReminder from "../models/MedicationReminder.js";
import { sendEmail } from "../services/email.service.js";

// Run every day at 8:00 AM
cron.schedule("0 8 * * *", async () => {
  console.log("Running Daily Medication Reminder Job...");
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const reminders = await MedicationReminder.find({
      nextReminderTime: { $lte: today }
    }).populate("patient", "name email");

    if (reminders.length === 0) return;

    const patientMap = {};
    for (const rem of reminders) {
      const email = rem.patient?.email;
      if (!email) continue;
      if (!patientMap[email]) {
        patientMap[email] = { name: rem.patient.name, meds: [] };
      }
      patientMap[email].meds.push({ name: rem.medicineName, freq: rem.frequency });
      
      const nextDay = new Date(rem.nextReminderTime);
      nextDay.setDate(nextDay.getDate() + 1);
      rem.nextReminderTime = nextDay;
      await rem.save();
    }

    for (const [email, data] of Object.entries(patientMap)) {
      let htmlList = data.meds.map(m => `<li><strong>${m.name}</strong> - Take ${m.freq} a day</li>`).join("");
      await sendEmail(
        email,
        "Your Daily Medication Reminder 💊",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="background-color: #0284c7; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">Daily Health Digest</h2>
          </div>
          <div style="padding: 20px;">
            <p>Good morning ${data.name},</p>
            <p>Here is your medication schedule for today:</p>
            <ul>${htmlList}</ul>
            <p style="margin-top:20px; color: #4b5563;">Stay healthy,<br/>MediFlow Care Team</p>
          </div>
        </div>
        `
      );
    }
  } catch (error) {
    console.error("Cron Job Error:", error);
  }
});