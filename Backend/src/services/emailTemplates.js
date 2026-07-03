export function baseTemplate(title, content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 30px 20px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .content { padding: 30px; color: #374151; line-height: 1.6; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; }
        .card { background-color: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 8px; padding: 20px; margin: 20px 0; }
        h2 { color: #0f766e; margin-top: 0; }
        .button { display: inline-block; padding: 12px 24px; background-color: #0d9488; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>MediFlow Healthcare</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>MediFlow Healthcare · Automated Notification</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function bookingConfirmationPatientEmail({ patientName, doctorName, specialization, date, time, endTime, symptoms, aiSummary, fee, qualification, experience, workingHours }) {
  const content = `
    <h2>Appointment Confirmed</h2>
    <p>Dear ${patientName},</p>
    <p>Your appointment with Dr. ${doctorName} has been successfully confirmed.</p>
    <div class="card">
      <h3 style="margin-top: 0; color: #0d9488;">Appointment Details</h3>
      <p><strong>Doctor:</strong> Dr. ${doctorName} (${specialization})</p>
      <p><strong>Qualification:</strong> ${qualification} | <strong>Experience:</strong> ${experience} years</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time} - ${endTime}</p>
      <p><strong>Consultation Fee:</strong> ₹${fee}</p>
      ${workingHours ? `<p><strong>Doctor's Working Hours:</strong> ${workingHours.start} - ${workingHours.end}</p>` : ''}
    </div>
    ${symptoms ? `<p><strong>Symptoms Provided:</strong> ${symptoms}</p>` : ''}
    ${aiSummary ? `
    <div class="card" style="background-color: #eef2ff; border-color: #e0e7ff;">
      <h3 style="margin-top: 0; color: #4338ca;">✨ AI Pre-Visit Summary</h3>
      <p><strong>Urgency:</strong> ${aiSummary.urgencyLevel || 'Standard'}</p>
      <p><strong>Chief Complaint:</strong> ${aiSummary.chiefComplaint || 'Not specified'}</p>
      ${aiSummary.suggestedQuestions && aiSummary.suggestedQuestions.length > 0 ? `
        <p><strong>Suggested questions for your doctor:</strong></p>
        <ul>
          ${aiSummary.suggestedQuestions.map(q => `<li>${q}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
    ` : ''}
    <p>A calendar invitation has been sent to your email.</p>
    <p>Thank you for choosing MediFlow.</p>
  `;
  return { subject: 'Appointment Confirmed — MediFlow', html: baseTemplate('Appointment Confirmed', content) };
}

export function bookingConfirmationDoctorEmail({ patientName, patientEmail, doctorName, date, time, endTime, symptoms, aiSummary }) {
  const content = `
    <h2>New Appointment Booking</h2>
    <p>Dear Dr. ${doctorName},</p>
    <p>You have a new appointment scheduled.</p>
    <div class="card">
      <h3 style="margin-top: 0; color: #0d9488;">Appointment Details</h3>
      <p><strong>Patient:</strong> ${patientName} (${patientEmail})</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time} - ${endTime}</p>
    </div>
    ${symptoms ? `<p><strong>Symptoms Provided:</strong> ${symptoms}</p>` : ''}
    ${aiSummary ? `
    <div class="card" style="background-color: #eef2ff; border-color: #e0e7ff;">
      <h3 style="margin-top: 0; color: #4338ca;">✨ AI Pre-Visit Summary</h3>
      <p><strong>Urgency:</strong> ${aiSummary.urgencyLevel || 'Standard'}</p>
      <p><strong>Chief Complaint:</strong> ${aiSummary.chiefComplaint || 'Not specified'}</p>
    </div>
    ` : ''}
  `;
  return { subject: 'New Appointment Booking — MediFlow', html: baseTemplate('New Appointment', content) };
}

export function bookingAdminEmail({ patientName, patientEmail, doctorName, date, time }) {
  const content = `
    <h2>System Alert: New Appointment</h2>
    <p>A new appointment has been booked in the system.</p>
    <div class="card">
      <p><strong>Patient:</strong> ${patientName} (${patientEmail})</p>
      <p><strong>Doctor:</strong> Dr. ${doctorName}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
    </div>
  `;
  return { subject: 'System Alert: New Appointment — MediFlow', html: baseTemplate('New Appointment System Alert', content) };
}

export function cancellationPatientEmail({ patientName, doctorName, specialization, date, time, reason }) {
  const content = `
    <h2>Appointment Cancelled</h2>
    <p>Dear ${patientName},</p>
    <p>Your appointment with Dr. ${doctorName} has been cancelled.</p>
    <div class="card" style="background-color: #fef2f2; border-color: #fecaca;">
      <h3 style="margin-top: 0; color: #b91c1c;">Cancelled Details</h3>
      <p><strong>Doctor:</strong> Dr. ${doctorName} (${specialization})</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    </div>
  `;
  return { subject: 'Appointment Cancelled — MediFlow', html: baseTemplate('Appointment Cancelled', content) };
}

export function cancellationDoctorEmail({ patientName, patientEmail, doctorName, date, time, reason }) {
  const content = `
    <h2>Appointment Cancelled by Patient</h2>
    <p>Dear Dr. ${doctorName},</p>
    <p>An upcoming appointment has been cancelled by the patient.</p>
    <div class="card" style="background-color: #fef2f2; border-color: #fecaca;">
      <h3 style="margin-top: 0; color: #b91c1c;">Cancelled Details</h3>
      <p><strong>Patient:</strong> ${patientName} (${patientEmail})</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    </div>
  `;
  return { subject: 'Appointment Cancelled by Patient — MediFlow', html: baseTemplate('Appointment Cancelled', content) };
}

export function doctorWelcomeEmail({ doctorName, email, specialization, qualification }) {
  const content = `
    <h2>Welcome to MediFlow</h2>
    <p>Dear Dr. ${doctorName},</p>
    <p>Your account has been created successfully.</p>
    <div class="card">
      <p><strong>Specialization:</strong> ${specialization}</p>
      <p><strong>Qualification:</strong> ${qualification}</p>
      <p><strong>Email (Login ID):</strong> ${email}</p>
    </div>
    <p>You can now log in to the portal to manage your schedule, complete consultations, and view patient appointments.</p>
  `;
  return { subject: 'Welcome to MediFlow — Your Account is Ready', html: baseTemplate('Welcome to MediFlow', content) };
}

export function doctorAddedAdminEmail({ doctorName, email, specialization }) {
  const content = `
    <h2>New Doctor Registered</h2>
    <p>A new doctor has been registered in the system.</p>
    <div class="card">
      <p><strong>Doctor Name:</strong> Dr. ${doctorName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Specialization:</strong> ${specialization}</p>
    </div>
  `;
  return { subject: 'New Doctor Registered — MediFlow', html: baseTemplate('New Doctor Registered', content) };
}

export function doctorRemovedDoctorEmail({ doctorName }) {
  const content = `
    <h2>Account Deactivated</h2>
    <p>Dear Dr. ${doctorName},</p>
    <p>Your MediFlow account has been removed from the system. If you believe this was in error, please contact the administration.</p>
  `;
  return { subject: 'Account Deactivated — MediFlow', html: baseTemplate('Account Deactivated', content) };
}

export function doctorRemovedAdminEmail({ doctorName, email }) {
  const content = `
    <h2>Doctor Removed</h2>
    <p>A doctor has been removed from the system.</p>
    <div class="card">
      <p><strong>Doctor Name:</strong> Dr. ${doctorName}</p>
      <p><strong>Email:</strong> ${email}</p>
    </div>
  `;
  return { subject: 'Doctor Removed — MediFlow', html: baseTemplate('Doctor Removed', content) };
}

export function leaveApprovedDoctorEmail({ doctorName, date, affectedCount }) {
  const content = `
    <h2>Leave Approved</h2>
    <p>Dear Dr. ${doctorName},</p>
    <p>Your leave on <strong>${date}</strong> has been approved.</p>
    <p>Number of appointments cancelled due to this leave: ${affectedCount}</p>
    <p>All affected patients have been notified.</p>
  `;
  return { subject: 'Leave Approved — MediFlow', html: baseTemplate('Leave Approved', content) };
}

export function leaveApprovedAdminEmail({ doctorName, date, affectedCount }) {
  const content = `
    <h2>Leave Approved for Doctor</h2>
    <p>Leave for Dr. ${doctorName} on <strong>${date}</strong> has been approved and recorded.</p>
    <p>Number of appointments cancelled: ${affectedCount}</p>
  `;
  return { subject: `Leave Approved for Dr. \${doctorName} — MediFlow\`, html: baseTemplate('Leave Approved', content)` };
}

export function leaveAppointmentCancelledEmail({ patientName, doctorName, date, time }) {
  const content = `
    <h2>Appointment Cancelled</h2>
    <p>Dear ${patientName},</p>
    <p>We apologize, but your appointment with Dr. ${doctorName} on <strong>${date}</strong> at <strong>${time}</strong> has been cancelled as the doctor is unexpectedly on leave.</p>
    <p>Please log in to the portal to rebook your appointment for another date.</p>
    <p>We apologize for any inconvenience caused.</p>
  `;
  return { subject: 'Appointment Cancelled — Doctor on Leave', html: baseTemplate('Appointment Cancelled', content) };
}

export function postVisitPatientEmail({ patientName, doctorName, aiSummary, prescription, notes, medications }) {
  const content = `
    <h2>Your Consultation Summary</h2>
    <p>Dear ${patientName},</p>
    <p>Your consultation with Dr. ${doctorName} is complete. Here is your post-visit summary.</p>
    
    ${aiSummary ? `
    <div class="card" style="background-color: #f0fdf4; border-color: #bbf7d0;">
      <h3 style="margin-top: 0; color: #166534;">✨ AI Post-Visit Summary</h3>
      <p>${aiSummary.summary || ''}</p>
      ${aiSummary.medicationSchedule ? `<p><strong>💊 Medication Schedule:</strong> ${aiSummary.medicationSchedule}</p>` : ''}
      ${aiSummary.followUpSteps ? `<p><strong>📋 Follow-up Steps:</strong> ${aiSummary.followUpSteps}</p>` : ''}
    </div>
    ` : ''}
    
    <div class="card">
      <h3 style="margin-top: 0; color: #0d9488;">Doctor's Notes & Prescription</h3>
      <p><strong>Notes:</strong><br/>${notes ? notes.replace(/\\n/g, '<br/>') : 'No additional notes.'}</p>
      <p><strong>Prescription:</strong><br/>${prescription ? prescription.replace(/\\n/g, '<br/>') : 'No prescription provided.'}</p>
    </div>

    ${medications && medications.length > 0 ? `
    <div class="card">
      <h3 style="margin-top: 0; color: #0d9488;">Medication Reminders Scheduled</h3>
      <ul>
        ${medications.map(m => `<li>${m.medicineName} (${m.frequency})</li>`).join('')}
      </ul>
      <p><small>You will receive email reminders for these medications.</small></p>
    </div>
    ` : ''}
  `;
  return { subject: 'Your Consultation Summary — MediFlow', html: baseTemplate('Consultation Summary', content) };
}

export function postVisitDoctorEmail({ patientName, doctorName }) {
  const content = `
    <h2>Consultation Notes Saved</h2>
    <p>Dear Dr. ${doctorName},</p>
    <p>Your consultation notes for patient <strong>${patientName}</strong> have been successfully saved.</p>
    <p>The patient has been notified with the post-visit summary and prescription.</p>
  `;
  return { subject: 'Consultation Notes Saved — MediFlow', html: baseTemplate('Notes Saved', content) };
}
