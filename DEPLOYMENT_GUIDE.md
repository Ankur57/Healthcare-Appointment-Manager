# DEPLOYMENT_GUIDE.md — MediFlow Healthcare Appointment Manager

---

## Prerequisites Checklist

Before deploying, ensure you have:

- [ ] Node.js v18+ installed locally
- [ ] MongoDB Atlas cluster created
- [ ] Google Cloud Console project with Calendar API enabled
- [ ] Resend account with verified sending domain
- [ ] Google AI Studio API key (Gemini)
- [ ] GitHub repository with frontend and backend code pushed

---

## 1. MongoDB Setup (Atlas)

### Step 1: Create a Cluster

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0 cluster** (or paid tier for production)
3. Choose a cloud provider and region (prefer same region as backend host)

### Step 2: Create Database User

1. Go to **Security → Database Access**
2. Click **Add New Database User**
3. Username: `mediflow_user`
4. Password: Generate a secure password
5. Privileges: **Atlas admin** (or `readWriteAnyDatabase`)

### Step 3: Whitelist IP

1. Go to **Security → Network Access**
2. Click **Add IP Address**
3. For development: Add your IP
4. For production (Render/Railway): Add `0.0.0.0/0` (allow all) or specific host IPs

### Step 4: Get Connection String

1. Go to **Clusters → Connect → Connect your application**
2. Driver: Node.js, version 5.x or later
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
4. Replace `<username>`, `<password>`, and `<dbname>` with your values

---

## 2. Resend Email Setup

### Step 1: Create a Resend Account

1. Sign up at [https://resend.com](https://resend.com)
2. Go to **API Keys → Create API Key**
3. Name: `mediflow-production`
4. Copy the key: `re_xxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Verify a Sending Domain

1. Go to **Domains → Add Domain**
2. Add your domain (e.g., `yourdomain.com`)
3. Add the DNS records provided (MX, TXT, DKIM) to your domain registrar
4. Wait for verification (typically 5-30 minutes)

### Step 3: Configure Environment Variable

```env
EMAIL_USER=noreply@yourdomain.com
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Note**: For testing without a domain, Resend allows sending from `onboarding@resend.dev` to your verified personal email only.

---

## 3. Google Calendar API Setup

### Step 1: Create a Google Cloud Project

1. Go to [https://console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project: **MediFlow**
3. Enable the **Google Calendar API**:
   - Go to **APIs & Services → Library**
   - Search for "Google Calendar API" → Enable

### Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Name: `MediFlow Server`
5. Authorized redirect URIs: `http://localhost:5000/auth/google/callback`
6. Copy:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### Step 3: Generate Refresh Token

Use the OAuth 2.0 Playground or a one-time local script:

```javascript
// getRefreshToken.js — run once locally
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:5000/auth/google/callback'
);

// Step 1: Get auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar'],
});
console.log('Visit this URL:', authUrl);

// Step 2: After redirect, use the code to get tokens
const { tokens } = await oauth2Client.getToken('<code_from_redirect>');
console.log('Refresh Token:', tokens.refresh_token);
```

4. Set environment variable:
   ```env
   GOOGLE_REFRESH_TOKEN=your_refresh_token_here
   ```

> **Important**: The refresh token is long-lived. Store it securely and never commit it to Git.

### Step 4: Update Redirect URI for Production

After deploying the backend:
1. Go to Google Cloud Console → Credentials → Your OAuth client
2. Add production URI: `https://your-backend.onrender.com/auth/google/callback`

---

## 4. Backend Deployment (Render)

### Step 1: Push Backend to GitHub

```bash
git add Backend/
git commit -m "Production ready backend"
git push origin main
```

### Step 2: Create Render Web Service

1. Go to [https://render.com](https://render.com)
2. New → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `mediflow-backend`
   - **Root Directory**: `Backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: 18+

### Step 3: Set Environment Variables

In Render dashboard → Environment → Add the following:

| Key | Value |
|---|---|
| `PORT` | `5000` |
| `MONGO_URI` | Your Atlas connection string |
| `JWT_SECRET` | A strong random string (min 32 chars) |
| `CLIENT_URL` | Your frontend URL (e.g., `https://mediflow.vercel.app`) |
| `EMAIL_USER` | `noreply@yourdomain.com` |
| `RESEND_API_KEY` | Your Resend API key |
| `GEMINI_API_KEY` | Your Gemini API key |
| `GOOGLE_CLIENT_ID` | Your Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | `https://mediflow-backend.onrender.com/auth/google/callback` |
| `GOOGLE_REFRESH_TOKEN` | Your Google refresh token |

### Step 4: Update CORS in app.js

```javascript
// Backend/src/app.js
const allowedOrigins = [
  "http://localhost:5174",
  "https://your-frontend.vercel.app"  // Add production URL
];
```

### Step 5: Update Cookie Options for Production

```javascript
// Backend/src/utils/cookieOptions.js
export const cookieOptions = {
  httpOnly: true,
  secure: true,           // Required for HTTPS
  sameSite: "none",       // Required for cross-domain cookies
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
};

export const clearCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none"
};
```

---

## 5. Frontend Deployment (Vercel)

### Step 1: Push Frontend to GitHub

```bash
git add frontend/
git commit -m "Production ready frontend"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Import Git Repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Set Frontend Environment Variable

In Vercel → Settings → Environment Variables:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://mediflow-backend.onrender.com/api/v1` |

### Step 4: Configure Vite for Production

Ensure `frontend/vite.config.js` does not hardcode localhost:

```javascript
// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

---

## 6. Production Configuration Checklist

### Security
- [ ] `JWT_SECRET` is a cryptographically strong random string (32+ chars)
- [ ] Cookie `secure: true` and `sameSite: "none"` set for HTTPS
- [ ] CORS `allowedOrigins` only includes production frontend URL
- [ ] `.env` files are in `.gitignore` and never committed
- [ ] MongoDB Atlas IP whitelist is configured

### Performance
- [ ] MongoDB Atlas cluster is in the same region as backend host
- [ ] Vite production build (`npm run build`) is used (not `npm run dev`)
- [ ] Node.js runs in production mode (`NODE_ENV=production`)

### Monitoring
- [ ] Server logs are accessible (Render provides built-in logging)
- [ ] MongoDB Atlas has performance alerts configured
- [ ] Resend dashboard shows email delivery metrics

---

## 7. Seeding the Admin User

Admin accounts must be manually seeded (no self-registration for admin):

### Option A: MongoDB Atlas Shell

```javascript
// In Atlas Data Explorer or Shell
db.users.insertOne({
  name: "Admin User",
  email: "admin@mediflow.com",
  password: "$2b$10$hashedpasswordhere",  // bcrypt hash
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Option B: Seed Script

Create a temporary seed script:

```javascript
// seed-admin.js
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

await mongoose.connect(process.env.MONGO_URI);

const hash = await bcrypt.hash("Admin@123", 10);
await mongoose.connection.db.collection("users").insertOne({
  name: "Admin",
  email: "admin@mediflow.com",
  password: hash,
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
});

console.log("Admin seeded");
process.exit(0);
```

Run: `node seed-admin.js`

---

## 8. Troubleshooting

### Backend Issues

| Problem | Likely Cause | Fix |
|---|---|---|
| `MongoServerError: Authentication failed` | Wrong MongoDB credentials | Re-check `MONGO_URI` username/password |
| `CORS error` on frontend | allowedOrigins mismatch | Add exact frontend URL to `allowedOrigins` |
| `401 Unauthorized` on all protected routes | Cookie not sent cross-domain | Set `credentials: true` in Axios; set `sameSite: "none"` in cookie options |
| `Calendar Error: invalid_grant` | Expired or invalid refresh token | Re-generate Google refresh token |
| `Resend Error: 403` | Domain not verified | Verify domain in Resend dashboard |
| Server crashes on startup | Missing env variable | Check all required env vars are set |
| `jwt malformed` error | Token corrupted | Clear browser cookies and re-login |

### Frontend Issues

| Problem | Likely Cause | Fix |
|---|---|---|
| API calls return CORS error | `VITE_API_URL` wrong | Check env variable in Vercel dashboard |
| Login succeeds but redirects fail | Cookie not received | Ensure `withCredentials: true` in Axios config |
| Build fails | Missing env variable in Vercel | Add `VITE_API_URL` in Vercel environment settings |
| Blank page after deploy | Routing issue | Add `vercel.json` with SPA redirect rules |

### `vercel.json` for React Router SPA:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 9. Environment Variables Reference

### Backend `.env` (Complete)

```env
# Server Configuration
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mediflow

# Authentication
JWT_SECRET=your_super_long_random_secret_key_here_min_32_chars

# CORS
CLIENT_URL=https://your-frontend.vercel.app

# Resend Email
EMAIL_USER=noreply@yourdomain.com
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Google Calendar
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret
GOOGLE_REDIRECT_URI=https://your-backend.onrender.com/auth/google/callback
GOOGLE_REFRESH_TOKEN=your_long_refresh_token_here
```

### Frontend `.env`

```env
VITE_API_URL=https://your-backend.onrender.com/api/v1
```
