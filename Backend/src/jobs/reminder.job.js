import cron from "node-cron";
import MedicationReminder from "../models/MedicationReminder.js";
import { sendEmail } from "../services/email.service.js";
import { medicationReminderEmail } from "../services/emailTemplates.js";

/**
 * Medication Reminder Cron Job
 *
 * Runs every 2 hours. Finds all MedicationReminder documents whose
 * nextReminderTime has passed, groups them by patient email, sends
 * a single consolidated email per patient, then updates nextReminderTime.
 *
 * Why consolidated emails?
 * Sending multiple separate reminder emails within minutes triggers
 * spam filters (high send frequency from same sender = spam signal).
 * One email per patient per reminder cycle avoids this.
 */
cron.schedule("0 */2 * * *", async () => {
  console.log("[Cron] Running medication reminder job...");

  try {
    const now = new Date();

    const reminders = await MedicationReminder.find({
      nextReminderTime: { $lte: now },
    }).populate("patient", "name email");

    if (reminders.length === 0) {
      console.log("[Cron] No reminders due.");
      return;
    }

    console.log(`[Cron] ${reminders.length} reminder(s) due.`);

    // Group medications by patient email for one consolidated email per patient
    const patientMap = {};

    for (const rem of reminders) {
      const email = rem.patient?.email;
      if (!email) continue;

      if (!patientMap[email]) {
        patientMap[email] = {
          name: rem.patient.name,
          meds: [],
        };
      }

      patientMap[email].meds.push({
        name: rem.medicineName,
        freq: rem.frequency,
      });

      // Update next reminder time BEFORE sending email.
      // This prevents double-sending if the job is interrupted after sending.
      rem.nextReminderTime = getNextReminderTime(rem.nextReminderTime, rem.frequency);
      await rem.save();
    }

    // Send one email per patient
    for (const [email, data] of Object.entries(patientMap)) {
      try {
        const { subject, html } = medicationReminderEmail({
          patientName: data.name,
          medications: data.meds,
        });

        await sendEmail(email, subject, html);
        console.log(`[Cron] Reminder sent to ${email}`);
      } catch (emailError) {
        // Log per-patient failures without stopping the rest
        console.error(`[Cron] Failed to send reminder to ${email}:`, emailError.message);
      }
    }

    console.log(`[Cron] Reminder job complete. Sent to ${Object.keys(patientMap).length} patient(s).`);
  } catch (error) {
    console.error("[Cron] Reminder job error:", error);
  }
});

/**
 * Calculates the next reminder time based on medication frequency.
 * All times are in UTC, converting to IST (+5:30) schedule.
 *
 * Schedule (IST):
 *   once   → 8:00 AM daily
 *   twice  → 8:00 AM and 8:00 PM
 *   thrice → 8:00 AM, 2:00 PM, 8:00 PM
 */
function getNextReminderTime(current, frequency) {
  const next = new Date(current);

  if (frequency === "once") {
    next.setDate(next.getDate() + 1);
    next.setUTCHours(2, 30, 0, 0); // 8:00 AM IST
  } else if (frequency === "twice") {
    if (next.getUTCHours() < 14) {
      next.setUTCHours(14, 30, 0, 0); // 8:00 PM IST
    } else {
      next.setDate(next.getDate() + 1);
      next.setUTCHours(2, 30, 0, 0); // 8:00 AM IST next day
    }
  } else if (frequency === "thrice") {
    if (next.getUTCHours() < 8) {
      next.setUTCHours(8, 30, 0, 0);  // 2:00 PM IST
    } else if (next.getUTCHours() < 14) {
      next.setUTCHours(14, 30, 0, 0); // 8:00 PM IST
    } else {
      next.setDate(next.getDate() + 1);
      next.setUTCHours(2, 30, 0, 0);  // 8:00 AM IST next day
    }
  } else {
    next.setDate(next.getDate() + 1);
  }

  return next;
}