import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client,
});

export const createCalendarEvent = async (
  appointment,
  patientName,
  doctorName,
  patientEmail,
  doctorEmail
) => {
  try {
    const appointmentDate = new Date(
      appointment.appointmentDate
    );

    const [hours, minutes] =
      appointment.startTime
        .split(":")
        .map(Number);

    appointmentDate.setHours(
      hours,
      minutes,
      0,
      0
    );

    const endDate = new Date(
      appointmentDate
    );

    endDate.setMinutes(
      endDate.getMinutes() + 30
    );

    const event = {
      summary: `Consultation: ${patientName} & Dr. ${doctorName}`,
      description: `
Patient: ${patientName}

Symptoms:
${appointment.symptoms || "None provided"}
`,
      start: {
        dateTime:
          appointmentDate.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime:
          endDate.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      attendees: [
        { email: patientEmail },
        { email: doctorEmail },
      ]
    };

    const response =
      await calendar.events.insert({
        calendarId: "primary",
        resource: event,
        sendUpdates: "all",
      });

    return response.data.id;
  } catch (error) {
    console.log(
      "Google Calendar Error:",
      error.message
    );

    return null;
  }
};