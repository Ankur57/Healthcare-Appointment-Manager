import dotenv from "dotenv";
dotenv.config();
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
        from: `MediFlow Healthcare <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });

    console.log(
      "Resend Response:",
      response
    );

    if (response.error) {
      throw new Error(
        response.error.message
      );
    }

    console.log(
      `Email sent to ${to}`
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