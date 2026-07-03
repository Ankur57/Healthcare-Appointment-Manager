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
    const dateStr = new Date(appointment.appointmentDate).toISOString().split("T")[0];
    const startDateTime = `${dateStr}T${appointment.startTime}:00+05:30`;
    
    let endDateTime = "";
    if (appointment.endTime) {
      endDateTime = `${dateStr}T${appointment.endTime}:00+05:30`;
    } else {
      const [hours, minutes] = appointment.startTime.split(":").map(Number);
      let endM = minutes + 30;
      let endH = hours + Math.floor(endM / 60);
      endM = endM % 60;
      endDateTime = `${dateStr}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00+05:30`;
    }

    const event = {
      summary: `🏥 MediFlow: ${patientName} & Dr. ${doctorName}`,
      description: `
<h3>🏥 MediFlow Healthcare — Appointment Details</h3>
<p><b>Patient:</b> ${patientName}</p>
<p><b>Doctor:</b> Dr. ${doctorName}</p>
<hr/>
<p><b>📝 Reported Symptoms:</b></p>
<p>${appointment.symptoms || "None provided"}</p>
<br/>
<p><i>💡 Tip: You can view or cancel your appointment directly from your <a href="http://localhost:5173/">MediFlow Dashboard</a>.</i></p>
      `.trim(),
      start: {
        dateTime: startDateTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDateTime,
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

export const deleteCalendarEvent = async (eventId) => {
  try {
    if (!eventId) return;
    await calendar.events.delete({
      calendarId: "primary",
      eventId: eventId,
      sendUpdates: "all",
    });
  } catch (error) {
    console.log("Google Calendar Delete Error:", error.message);
  }
};