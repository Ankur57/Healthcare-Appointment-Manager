import cron from "node-cron";
import MedicationReminder from "../models/MedicationReminder.js";
import { sendEmail } from "../services/email.service.js";

// Run every 2 hours
cron.schedule("0 */2 * * *", async () => {
  console.log("Running Medication Reminder Job...");
  try {
    const now = new Date();

    const reminders = await MedicationReminder.find({
      nextReminderTime: { $lte: now }
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
      
      const getNextReminderTime = (current, frequency) => {
        const next = new Date(current);
        if (frequency === 'once') {
          next.setDate(next.getDate() + 1);
          next.setUTCHours(2, 30, 0, 0); // 8 AM IST
        } else if (frequency === 'twice') {
          if (next.getUTCHours() < 14) {
            next.setUTCHours(14, 30, 0, 0); // 8 PM IST
          } else {
            next.setDate(next.getDate() + 1);
            next.setUTCHours(2, 30, 0, 0); // 8 AM IST
          }
        } else if (frequency === 'thrice') {
          if (next.getUTCHours() < 8) {
            next.setUTCHours(8, 30, 0, 0); // 2 PM IST
          } else if (next.getUTCHours() < 14) {
            next.setUTCHours(14, 30, 0, 0); // 8 PM IST
          } else {
            next.setDate(next.getDate() + 1);
            next.setUTCHours(2, 30, 0, 0); // 8 AM IST
          }
        } else {
          next.setDate(next.getDate() + 1);
        }
        return next;
      };
      
      rem.nextReminderTime = getNextReminderTime(rem.nextReminderTime, rem.frequency);
      await rem.save();
    }

    for (const [email, data] of Object.entries(patientMap)) {
      let htmlList = data.meds.map(m => `<li><strong>${m.name}</strong> - Take ${m.freq} a day</li>`).join("");
      await sendEmail(
        email,
        "Your Medication Reminder 💊",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
          <div style="background-color: #0284c7; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">Medication Reminder</h2>
          </div>
          <div style="padding: 20px;">
            <p>Hello ${data.name},</p>
            <p>It's time to take your medication:</p>
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