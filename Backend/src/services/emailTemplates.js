/**
 * emailTemplates.js
 *
 * All transactional email HTML templates for MediFlow Healthcare.
 *
 * Anti-spam improvements applied:
 * 1. Preheader text uses a proper hidden span (color:transparent removed — it's a spam signal)
 * 2. Physical address in footer (required by CAN-SPAM)
 * 3. Unsubscribe link in every email footer (CAN-SPAM / GDPR)
 * 4. All CSS is inline or in <style> — no external stylesheets (blocked by email clients)
 * 5. Em-dashes (—) removed from subject lines (flagged by some spam filters)
 * 6. Proper role="presentation" on layout tables for accessibility
 * 7. Consistent From name matches sending domain
 */

const APP_URL = process.env.CLIENT_URL || "https://mediflow.vercel.app";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@mediflow.com";
const UNSUBSCRIBE_EMAIL = process.env.EMAIL_REPLY_TO || process.env.EMAIL_USER || "support@mediflow.com";

export function baseTemplate(title, preheader, content) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <title>${title}</title>
  <style>
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }

    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f3f4f6;
      margin: 0 !important;
      padding: 0 !important;
    }
    .wrapper {
      background-color: #f3f4f6;
      padding: 30px 15px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }
    .header {
      background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
      padding: 28px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.3px;
    }
    .header p {
      margin: 6px 0 0;
      font-size: 13px;
      color: rgba(255,255,255,0.82);
    }
    .content {
      padding: 28px 28px 20px;
      color: #374151;
      line-height: 1.65;
      font-size: 15px;
    }
    .content h2 {
      color: #0f766e;
      font-size: 18px;
      margin: 0 0 14px;
    }
    .card {
      background-color: #f0fdfa;
      border: 1px solid #ccfbf1;
      border-radius: 8px;
      padding: 18px 20px;
      margin: 18px 0;
    }
    .card-red {
      background-color: #fef2f2;
      border-color: #fecaca;
    }
    .card-purple {
      background-color: #eef2ff;
      border-color: #e0e7ff;
    }
    .card-green {
      background-color: #f0fdf4;
      border-color: #bbf7d0;
    }
    .card h3 {
      margin: 0 0 12px;
      font-size: 15px;
    }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-green  { background: #dcfce7; color: #166534; }
    .badge-yellow { background: #fef9c3; color: #854d0e; }
    .badge-red    { background: #fee2e2; color: #991b1b; }
    .footer {
      background-color: #f8fafc;
      padding: 20px 24px;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      border-top: 1px solid #e5e7eb;
      line-height: 1.6;
    }
    .footer a { color: #0d9488; text-decoration: underline; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
    @media only screen and (max-width: 600px) {
      .content { padding: 20px 16px; }
    }
  </style>
</head>
<body>

  <!--
    Preheader: shown in inbox preview next to subject line.
    Using display:none + max-height/overflow is the standard technique.
    Avoid color:transparent — it is flagged as a cloaking signal by SpamAssassin.
  -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${preheader} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <div class="wrapper">
    <div class="container">

      <div class="header">
        <h1>MediFlow Healthcare</h1>
        <p>Your trusted healthcare companion</p>
      </div>

      <div class="content">
        ${content}
      </div>

      <div class="footer">
        <p>
          <strong>MediFlow Healthcare</strong><br>
          Kanpur, Uttar Pradesh, India<br>
          <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
        </p>
        <hr class="divider" style="border:none;border-top:1px solid #e5e7eb;margin:12px 0;">
        <p>
          You received this email because you have an account on MediFlow.<br>
          If you did not expect this email, you can safely ignore it.
        </p>
        <!--
          Unsubscribe link is required by CAN-SPAM Act and GDPR.
          Its absence is one of the strongest spam indicators.
        -->
        <p>
          <a href="mailto:${UNSUBSCRIBE_EMAIL}?subject=unsubscribe" style="color:#6b7280;font-size:11px;">Unsubscribe from these emails</a>
        </p>
      </div>

    </div>
  </div>

</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Booking Confirmation — Patient
// ---------------------------------------------------------------------------
export function bookingConfirmationPatientEmail({
  patientName, doctorName, specialization, date, time, endTime,
  symptoms, aiSummary, fee, qualification, experience, workingHours
}) {
  const urgencyBadge = aiSummary?.urgencyLevel
    ? getUrgencyBadge(aiSummary.urgencyLevel)
    : "";

  const content = `
    <h2>Appointment Confirmed</h2>
    <p>Dear ${patientName},</p>
    <p>Your appointment has been successfully booked. We look forward to your visit.</p>

    <div class="card">
      <h3 style="color:#0d9488;">Appointment Details</h3>
      <p><strong>Doctor:</strong> Dr. ${doctorName} &mdash; ${specialization}</p>
      ${qualification ? `<p><strong>Qualification:</strong> ${qualification}</p>` : ""}
      ${experience ? `<p><strong>Experience:</strong> ${experience} years</p>` : ""}
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}${endTime ? ` - ${endTime}` : ""}</p>
      ${fee ? `<p><strong>Consultation Fee:</strong> &#8377;${fee}</p>` : ""}
      ${workingHours ? `<p><strong>Clinic Hours:</strong> ${workingHours.start} &ndash; ${workingHours.end}</p>` : ""}
    </div>

    ${symptoms ? `<p><strong>Symptoms Reported:</strong> ${symptoms}</p>` : ""}

    ${aiSummary ? `
    <div class="card card-purple">
      <h3 style="color:#4338ca;">AI Pre-Visit Summary</h3>
      <p><strong>Urgency:</strong> ${urgencyBadge} ${aiSummary.urgencyLevel || "Standard"}</p>
      <p><strong>Chief Complaint:</strong> ${aiSummary.chiefComplaint || "Not specified"}</p>
      ${aiSummary.suggestedQuestions && aiSummary.suggestedQuestions.length > 0 ? `
        <p><strong>Suggested questions for your doctor:</strong></p>
        <ul style="padding-left:20px;margin:8px 0;">
          ${aiSummary.suggestedQuestions.map(q => `<li style="margin-bottom:4px;">${q}</li>`).join("")}
        </ul>
      ` : ""}
    </div>
    ` : ""}

    <p>A Google Calendar invite has been sent to your email address.</p>
    <p>Thank you for choosing MediFlow.</p>
  `;

  return {
    subject: "Your Appointment is Confirmed | MediFlow",
    html: baseTemplate(
      "Appointment Confirmed",
      `Your appointment with Dr. ${doctorName} on ${date} at ${time} is confirmed.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Booking Notification — Doctor
// ---------------------------------------------------------------------------
export function bookingConfirmationDoctorEmail({
  patientName, patientEmail, doctorName, date, time, endTime, symptoms, aiSummary
}) {
  const content = `
    <h2>New Appointment Scheduled</h2>
    <p>Dear Dr. ${doctorName},</p>
    <p>A new appointment has been booked for you.</p>

    <div class="card">
      <h3 style="color:#0d9488;">Appointment Details</h3>
      <p><strong>Patient:</strong> ${patientName} &lt;${patientEmail}&gt;</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}${endTime ? ` - ${endTime}` : ""}</p>
    </div>

    ${symptoms ? `<p><strong>Reported Symptoms:</strong> ${symptoms}</p>` : ""}

    ${aiSummary ? `
    <div class="card card-purple">
      <h3 style="color:#4338ca;">AI Pre-Visit Analysis</h3>
      <p><strong>Urgency:</strong> ${aiSummary.urgencyLevel || "Standard"}</p>
      <p><strong>Chief Complaint:</strong> ${aiSummary.chiefComplaint || "Not specified"}</p>
    </div>
    ` : ""}
  `;

  return {
    subject: "New Patient Appointment | MediFlow",
    html: baseTemplate(
      "New Appointment",
      `New appointment: ${patientName} on ${date} at ${time}.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Booking Alert — Admin
// ---------------------------------------------------------------------------
export function bookingAdminEmail({ patientName, patientEmail, doctorName, date, time }) {
  const content = `
    <h2>New Appointment Booked</h2>
    <p>A new appointment has been booked in the system.</p>

    <div class="card">
      <p><strong>Patient:</strong> ${patientName} &lt;${patientEmail}&gt;</p>
      <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
    </div>
  `;

  return {
    subject: "System Alert: New Appointment | MediFlow",
    html: baseTemplate(
      "New Appointment Alert",
      `New appointment booked: ${patientName} with Dr. ${doctorName} on ${date}.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Cancellation — Patient
// ---------------------------------------------------------------------------
export function cancellationPatientEmail({ patientName, doctorName, specialization, date, time, reason }) {
  const content = `
    <h2>Appointment Cancelled</h2>
    <p>Dear ${patientName},</p>
    <p>Your appointment has been cancelled. We hope to see you again soon.</p>

    <div class="card card-red">
      <h3 style="color:#b91c1c;">Cancelled Appointment</h3>
      <p><strong>Doctor:</strong> Dr. ${doctorName}${specialization ? ` (${specialization})` : ""}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
    </div>

    <p>You can book a new appointment anytime through the <a href="${APP_URL}" style="color:#0d9488;">MediFlow portal</a>.</p>
  `;

  return {
    subject: "Appointment Cancelled | MediFlow",
    html: baseTemplate(
      "Appointment Cancelled",
      `Your appointment with Dr. ${doctorName} on ${date} has been cancelled.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Cancellation — Doctor
// ---------------------------------------------------------------------------
export function cancellationDoctorEmail({ patientName, patientEmail, doctorName, date, time, reason }) {
  const content = `
    <h2>Appointment Cancelled by Patient</h2>
    <p>Dear Dr. ${doctorName},</p>
    <p>An appointment has been cancelled by the patient.</p>

    <div class="card card-red">
      <h3 style="color:#b91c1c;">Cancelled Appointment</h3>
      <p><strong>Patient:</strong> ${patientName} &lt;${patientEmail}&gt;</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
    </div>
  `;

  return {
    subject: "Patient Cancelled Appointment | MediFlow",
    html: baseTemplate(
      "Appointment Cancelled",
      `${patientName} cancelled their appointment on ${date} at ${time}.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Doctor Welcome
// ---------------------------------------------------------------------------
export function doctorWelcomeEmail({ doctorName, email, specialization, qualification }) {
  const content = `
    <h2>Welcome to MediFlow, Dr. ${doctorName}</h2>
    <p>Your account has been created and is ready to use.</p>

    <div class="card">
      <h3 style="color:#0d9488;">Your Account Details</h3>
      <p><strong>Specialization:</strong> ${specialization}</p>
      ${qualification ? `<p><strong>Qualification:</strong> ${qualification}</p>` : ""}
      <p><strong>Login Email:</strong> ${email}</p>
    </div>

    <p>Log in to the portal to view your appointments, manage your schedule, and add consultation notes.</p>
    <p><a href="${APP_URL}" style="display:inline-block;padding:11px 22px;background-color:#0d9488;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">Go to Portal</a></p>
  `;

  return {
    subject: "Welcome to MediFlow | Your Account is Ready",
    html: baseTemplate(
      "Welcome to MediFlow",
      `Welcome, Dr. ${doctorName}. Your MediFlow doctor account is ready.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Doctor Added — Admin Notification
// ---------------------------------------------------------------------------
export function doctorAddedAdminEmail({ doctorName, email, specialization }) {
  const content = `
    <h2>New Doctor Registered</h2>
    <p>A new doctor account has been created in the system.</p>

    <div class="card">
      <p><strong>Name:</strong> Dr. ${doctorName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Specialization:</strong> ${specialization}</p>
    </div>
  `;

  return {
    subject: "New Doctor Account Created | MediFlow",
    html: baseTemplate(
      "New Doctor Registered",
      `Dr. ${doctorName} (${specialization}) has been added to MediFlow.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Doctor Removed — Doctor Notification
// ---------------------------------------------------------------------------
export function doctorRemovedDoctorEmail({ doctorName }) {
  const content = `
    <h2>Account Deactivated</h2>
    <p>Dear Dr. ${doctorName},</p>
    <p>Your MediFlow account has been deactivated by the administration.</p>
    <p>If you believe this was done in error, please contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#0d9488;">${SUPPORT_EMAIL}</a>.</p>
  `;

  return {
    subject: "Your Account Has Been Deactivated | MediFlow",
    html: baseTemplate(
      "Account Deactivated",
      `Dr. ${doctorName}, your MediFlow account has been deactivated.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Doctor Removed — Admin Notification
// ---------------------------------------------------------------------------
export function doctorRemovedAdminEmail({ doctorName, email }) {
  const content = `
    <h2>Doctor Account Removed</h2>
    <p>A doctor account has been removed from the system.</p>

    <div class="card">
      <p><strong>Name:</strong> Dr. ${doctorName}</p>
      <p><strong>Email:</strong> ${email}</p>
    </div>
  `;

  return {
    subject: "Doctor Account Removed | MediFlow",
    html: baseTemplate(
      "Doctor Removed",
      `Dr. ${doctorName}'s account has been removed from MediFlow.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Leave Approved — Doctor
// ---------------------------------------------------------------------------
export function leaveApprovedDoctorEmail({ doctorName, date, affectedCount }) {
  const content = `
    <h2>Leave Approved</h2>
    <p>Dear Dr. ${doctorName},</p>
    <p>Your leave on <strong>${date}</strong> has been recorded in the system.</p>
    <p>
      <strong>${affectedCount}</strong> appointment${affectedCount !== 1 ? "s" : ""} on that date
      ${affectedCount > 0 ? "have been cancelled and patients have been notified." : "were affected."}
    </p>
  `;

  return {
    subject: "Leave Approved | MediFlow",
    html: baseTemplate(
      "Leave Approved",
      `Your leave on ${date} has been approved. ${affectedCount} appointment(s) cancelled.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Leave Approved — Admin Notification
// ---------------------------------------------------------------------------
export function leaveApprovedAdminEmail({ doctorName, date, affectedCount }) {
  const content = `
    <h2>Doctor Leave Recorded</h2>
    <p>Leave for Dr. ${doctorName} on <strong>${date}</strong> has been recorded.</p>
    <p><strong>${affectedCount}</strong> appointment${affectedCount !== 1 ? "s" : ""} cancelled as a result.</p>
  `;

  return {
    subject: `Leave Approved: Dr. ${doctorName} | MediFlow`,
    html: baseTemplate(
      "Leave Approved",
      `Dr. ${doctorName} leave on ${date}. ${affectedCount} appointment(s) cancelled.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Appointment Cancelled Due to Doctor Leave — Patient
// ---------------------------------------------------------------------------
export function leaveAppointmentCancelledEmail({ patientName, doctorName, date, time }) {
  const content = `
    <h2>Appointment Cancelled</h2>
    <p>Dear ${patientName},</p>
    <p>We regret to inform you that your appointment with Dr. ${doctorName} on <strong>${date}</strong> at <strong>${time}</strong> has been cancelled because the doctor is unavailable on that date.</p>
    <p>We sincerely apologize for the inconvenience. Please log in to book a new appointment at your convenience.</p>
    <p><a href="${APP_URL}" style="display:inline-block;padding:11px 22px;background-color:#0d9488;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">Book a New Appointment</a></p>
  `;

  return {
    subject: "Appointment Cancelled - Doctor Unavailable | MediFlow",
    html: baseTemplate(
      "Appointment Cancelled",
      `Your appointment with Dr. ${doctorName} on ${date} has been cancelled due to doctor leave.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Post-Visit Summary — Patient
// ---------------------------------------------------------------------------
export function postVisitPatientEmail({ patientName, doctorName, aiSummary, prescription, notes, medications }) {
  const content = `
    <h2>Your Consultation Summary</h2>
    <p>Dear ${patientName},</p>
    <p>Your consultation with Dr. ${doctorName} is complete. Below is your visit summary.</p>

    ${aiSummary ? `
    <div class="card card-green">
      <h3 style="color:#166534;">AI Post-Visit Summary</h3>
      ${aiSummary.summary ? `<p>${aiSummary.summary}</p>` : ""}
      ${aiSummary.medicationSchedule ? `<p><strong>Medication Schedule:</strong> ${aiSummary.medicationSchedule}</p>` : ""}
      ${aiSummary.followUpSteps ? `<p><strong>Follow-up Steps:</strong> ${aiSummary.followUpSteps}</p>` : ""}
    </div>
    ` : ""}

    <div class="card">
      <h3 style="color:#0d9488;">Doctor's Notes and Prescription</h3>
      <p><strong>Notes:</strong><br>${notes ? notes.replace(/\n/g, "<br>") : "No additional notes."}</p>
      <p><strong>Prescription:</strong><br>${prescription ? prescription.replace(/\n/g, "<br>") : "No prescription provided."}</p>
    </div>

    ${medications && medications.length > 0 ? `
    <div class="card">
      <h3 style="color:#0d9488;">Medication Reminders Scheduled</h3>
      <ul style="padding-left:20px;margin:8px 0;">
        ${medications.map(m => `<li style="margin-bottom:4px;"><strong>${m.medicineName}</strong> &mdash; ${m.frequency} time(s) daily</li>`).join("")}
      </ul>
      <p style="font-size:13px;color:#6b7280;">You will receive email reminders for each of these medications.</p>
    </div>
    ` : ""}

    <p>Take care and follow your doctor's advice. We wish you a speedy recovery.</p>
  `;

  return {
    subject: "Your Consultation Summary | MediFlow",
    html: baseTemplate(
      "Consultation Summary",
      `Your consultation with Dr. ${doctorName} is complete. View your summary inside.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Post-Visit Notes Saved — Doctor
// ---------------------------------------------------------------------------
export function postVisitDoctorEmail({ patientName, doctorName }) {
  const content = `
    <h2>Consultation Notes Saved</h2>
    <p>Dear Dr. ${doctorName},</p>
    <p>Your consultation notes for <strong>${patientName}</strong> have been saved successfully.</p>
    <p>The patient has been notified with their post-visit summary and prescription.</p>
  `;

  return {
    subject: "Consultation Notes Saved | MediFlow",
    html: baseTemplate(
      "Notes Saved",
      `Consultation notes for ${patientName} have been saved.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Medication Reminder (used in reminder.job.js)
// ---------------------------------------------------------------------------
export function medicationReminderEmail({ patientName, medications }) {
  const medList = medications
    .map(m => `<li style="margin-bottom:6px;"><strong>${m.name}</strong> &mdash; Take ${m.freq} time(s) daily</li>`)
    .join("");

  const content = `
    <h2>Time to Take Your Medication</h2>
    <p>Hello ${patientName},</p>
    <p>This is a friendly reminder to take your prescribed medication.</p>

    <div class="card">
      <h3 style="color:#0d9488;">Your Medications</h3>
      <ul style="padding-left:20px;margin:8px 0;">
        ${medList}
      </ul>
    </div>

    <p>Staying consistent with your medication schedule is important for your recovery. If you have any concerns about your medications, please consult your doctor.</p>
    <p>Stay healthy,<br><strong>MediFlow Care Team</strong></p>
  `;

  return {
    subject: "Medication Reminder | MediFlow",
    html: baseTemplate(
      "Medication Reminder",
      `Reminder: It's time to take your medication, ${patientName}.`,
      content
    ),
  };
}

// ---------------------------------------------------------------------------
// Helper: urgency level badge HTML
// ---------------------------------------------------------------------------
function getUrgencyBadge(level) {
  const l = (level || "").toLowerCase();
  if (l === "high" || l === "emergency") {
    return `<span class="badge badge-red">${level}</span>`;
  }
  if (l === "medium" || l === "moderate") {
    return `<span class="badge badge-yellow">${level}</span>`;
  }
  return `<span class="badge badge-green">${level}</span>`;
}
