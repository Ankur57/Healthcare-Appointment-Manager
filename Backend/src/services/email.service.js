import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export const sendEmail = async (
  to,
  subject,
  html
) => {
  try {
    const response =
      await resend.emails.send({
        from: `Healthcare Appointment Manager <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });

    console.log(
      `Email sent to ${to}`,
      response.id
    );

    return response;
  } catch (error) {
    console.error(
      `Email Service Error for ${to}:`,
      error
    );

      throw error;
  }
};
