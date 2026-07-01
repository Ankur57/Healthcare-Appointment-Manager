import dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";

const oauth2Client =
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

const scopes = [
  "https://www.googleapis.com/auth/calendar",
];

const url =
  oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });

console.log(url);