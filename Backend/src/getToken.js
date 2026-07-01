import dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";

const oauth2Client =
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

const code =
  "4/0AdkVLPxnoOZVizUYZDkMoChTHsREGi2vFM7j9nHUDeoWdbSDIyT1PIrJGiZd1yAiGxY7yQ";

async function getToken() {
  const {
    tokens,
  } =
    await oauth2Client.getToken(
      code
    );

  console.log(tokens);
}

getToken();