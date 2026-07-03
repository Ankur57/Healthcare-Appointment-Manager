# 🏥 MediFlow — Healthcare Appointment Manager

> A full-stack, production-ready Healthcare Appointment Management System with AI-powered summaries, Google Calendar integration, and automated email notifications.

![MediFlow Banner](https://img.shields.io/badge/MediFlow-Healthcare-0d9488?style=for-the-badge&logo=heart)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Installation Instructions](#-installation-instructions)
- [Environment Variables](#-environment-variables)
- [Local Setup](#-local-setup)
- [Deployment Instructions](#-deployment-instructions)
- [Screenshots](#-screenshots)
- [Hosted URLs](#-hosted-urls)
- [Future Improvements](#-future-improvements)

---

## 🌟 Project Overview

**MediFlow** is a full-stack Healthcare Appointment Management System designed to streamline the interaction between patients, doctors, and administrators in a healthcare setting.

The platform enables:
- **Patients** to search for doctors by specialization, book appointments, and view AI-generated pre-visit summaries.
- **Doctors** to manage their schedules, view patient appointments, add post-visit notes, prescribe medications, and generate AI post-visit summaries.
- **Admins** to manage the entire doctor roster, approve leaves, monitor all appointments, and receive system notifications.

The system integrates **Google Gemini AI** for intelligent clinical summaries, **Google Calendar API** for calendar event management, and **Resend** for professional HTML email notifications — making it a complete, real-world healthcare solution.

---

## ✨ Features

### 🧑‍⚕️ Patient Features
- [x] Patient Registration & Login (JWT + Cookie Authentication)
- [x] Search doctors by specialization (regex-based, case-insensitive)
- [x] View doctor details (qualification, experience, consultation fee, working hours)
- [x] View available time slots for any date
- [x] Book appointments with symptom input
- [x] AI Pre-Visit Summary generated automatically on booking
- [x] View all personal appointments with status tracking
- [x] Cancel upcoming appointments (past appointment protection)
- [x] Booking confirmation email with AI summary
- [x] Google Calendar event created on booking
- [x] Medication reminder emails (once/twice/thrice daily)
- [x] Post-visit summary emailed after doctor completes visit

### 👨‍⚕️ Doctor Features
- [x] Doctor Dashboard
- [x] View all assigned appointments (sorted by date)
- [x] View individual appointment details including AI pre-visit summary
- [x] Add post-visit clinical notes and prescriptions
- [x] AI Post-Visit Summary generated from clinical notes
- [x] Add medications with frequency to trigger automated reminders
- [x] Email notifications on appointment booking/cancellation

### 🔧 Admin Features
- [x] Admin Dashboard with appointment statistics
- [x] Create new doctor profiles
- [x] View all doctors
- [x] Update doctor details (specialization, fee, working hours, etc.)
- [x] Delete doctor profiles
- [x] Mark doctor leave days (auto-cancels affected appointments)
- [x] View all system appointments with patient and doctor details
- [x] Email notifications for all key system events

### 🔒 Security Features
- [x] JWT Authentication (7-day expiry)
- [x] HTTP-Only Cookie Storage (prevents XSS)
- [x] Role-Based Access Control (patient / doctor / admin)
- [x] Double Booking Prevention (MongoDB unique index)
- [x] Patient self-booking conflict check
- [x] Past appointment protection (cannot book or cancel past slots)
- [x] Email format validation
- [x] Password hashing with bcryptjs (salt rounds: 10)
- [x] CORS whitelist protection

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI Framework |
| Vite | 8.x | Build Tool & Dev Server |
| Tailwind CSS | 4.x | Utility-first CSS Styling |
| React Router DOM | 7.x | Client-side Routing |
| Axios | 1.x | HTTP Client |
| TanStack React Query | 5.x | Server State Management |
| Framer Motion | 12.x | Animations |
| React Hook Form | 7.x | Form State Management |
| Zod | 4.x | Schema Validation |
| Recharts | 3.x | Dashboard Charts |
| Lucide React | 1.x | Icon Library |
| React Hot Toast | 2.x | Toast Notifications |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime Environment |
| Express.js | 5.x | Web Framework |
| MongoDB | Atlas | Database |
| Mongoose | 9.x | ODM |
| JSON Web Token | 9.x | Authentication Tokens |
| bcryptjs | 3.x | Password Hashing |
| cookie-parser | 1.x | Cookie Parsing |
| node-cron | 4.x | Scheduled Jobs |
| dotenv | 17.x | Environment Variables |
| cors | 2.x | CORS Middleware |
| nodemon | 3.x | Dev Hot Reload |

### External Integrations
| Service | Purpose |
|---|---|
| Google Gemini API (gemini-2.5-flash) | AI Pre/Post Visit Summaries |
| Google Calendar API v3 | Calendar Event Management |
| Resend | Transactional Email Service |
| MongoDB Atlas | Cloud Database Hosting |

---

## 📁 Folder Structure

```
Healthcare-Appointment-Manager/
├── Backend/
│   ├── .env                        # Environment variables
│   ├── package.json
│   └── src/
│       ├── server.js               # Entry point
│       ├── app.js                  # Express app setup, CORS, routes
│       ├── config/
│       │   └── db.js               # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.js  # Register, Login, Logout, GetMe
│       │   ├── admin.controller.js # CRUD Doctors, Leave, All Appointments
│       │   ├── patient.controller.js # Get Doctors, Get Slots
│       │   ├── doctor.controller.js  # Doctor Appointments, Notes
│       │   └── appointment.controller.js # Book, Cancel, My Appointments
│       ├── middlewares/
│       │   ├── auth.middleware.js  # JWT Cookie verification
│       │   └── role.middleware.js  # Role-based access control
│       ├── models/
│       │   ├── User.js             # User schema (patient/doctor/admin)
│       │   ├── Doctor.js           # Doctor profile schema
│       │   ├── Appointment.js      # Appointment schema with AI fields
│       │   └── MedicationReminder.js # Medication reminder schema
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── admin.routes.js
│       │   ├── patient.routes.js
│       │   ├── appointment.routes.js
│       │   └── doctor.routes.js
│       ├── services/
│       │   ├── ai.service.js       # Gemini API integration
│       │   ├── calendar.service.js # Google Calendar API
│       │   ├── email.service.js    # Resend email sender
│       │   ├── emailTemplates.js   # HTML email templates
│       │   ├── slot.service.js     # Time slot generation logic
│       │   └── postVisit.service.js
│       ├── jobs/
│       │   └── reminder.job.js     # Cron job for medication reminders
│       └── utils/
│           ├── ApiError.js
│           ├── ApiResponse.js
│           ├── asyncHandler.js
│           └── cookieOptions.js
│
└── frontend/
    ├── .env                        # Frontend environment variables
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx                # React root
        ├── App.jsx                 # Route definitions
        ├── index.css               # Global styles
        ├── context/                # React Context (Auth)
        ├── routes/
        │   └── ProtectedRoute.jsx  # Role-based route guard
        ├── components/
        │   ├── layout/             # MainLayout, PatientLayout, DoctorLayout, AdminLayout
        │   ├── navbar/
        │   ├── footer/
        │   ├── home/
        │   ├── patient/
        │   └── ui/
        ├── pages/
        │   ├── home/Home.jsx
        │   ├── auth/Login.jsx, Register.jsx
        │   ├── patient/Dashboard, Doctors, MyAppointments, DoctorDetails
        │   ├── doctor/Dashboard, Appointments
        │   └── admin/Dashboard, Doctors, Appointments
        ├── services/               # Axios API call functions
        └── utils/                  # Utility helpers
```

---

## ⚙️ Installation Instructions

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB Atlas** account (or local MongoDB)
- **Google Cloud Console** account (for Calendar API)
- **Resend** account (for email)
- **Google AI Studio** account (for Gemini API key)

### Clone the Repository

```bash
git clone https://github.com/Ankur57/Healthcare-Appointment-Manager.git
cd Healthcare-Appointment-Manager
```

### Install Backend Dependencies

```bash
cd Backend
npm install
```

### Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

### Backend `.env`

```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Client URL (for CORS)
CLIENT_URL=https://hopeful-radiance-production-dce4.up.railway.app/

# Email (Resend)
EMAIL_USER=HealthcareAppointment@soandita.shop
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx

# Gemini AI
GEMINI_API_KEY=gemini_api_key_here

# Google Calendar OAuth
GOOGLE_CLIENT_ID=google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_google_client_secret
GOOGLE_REDIRECT_URI=http://healthcare-appointment-manager-production-3b9a.up.railway.app/auth/google/callback
GOOGLE_REFRESH_TOKEN=your_google_refresh_token_here
```

### Frontend `.env`

```env
VITE_API_URL=https://healthcare-appointment-manager-production-3b9a.up.railway.app/api/v1
```

---

## 🚀 Local Setup

### 1. Configure Environment Variables

Copy and fill in both `.env` files as described above.

### 2. Start the Backend

```bash
cd Backend
npm run dev
# Server runs at http://healthcare-appointment-manager-production-3b9a.up.railway.app
```

### 3. Start the Frontend

```bash
cd frontend
npm run dev
# Frontend runs at https://hopeful-radiance-production-dce4.up.railway.app
```

### 4. Seed an Admin User

Manually create an admin user in MongoDB Atlas:

```javascript
// In MongoDB Atlas Shell
db.users.insertOne({
  name: "Admin",
  email: "admin@mediflow.com",
  password: "<bcrypt-hashed-password>",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 📦 Deployment Instructions

### Backend (Railway)

1. Push the `Backend/` folder to a GitHub repository.
2. Create a new **Web Service** on Render.
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add all Backend environment variables.
6. Update `CLIENT_URL` to your deployed frontend URL.

### Frontend (Railway)

1. Push the `frontend/` folder to GitHub.
2. Import project in Vercel.
3. Set **Framework Preset**: `Vite`.
4. Add environment variable: `VITE_API_URL=https://hopeful-radiance-production-dce4.up.railway.app/`
5. Deploy.

### Important Production Changes

- Update `allowedOrigins` in `Backend/src/app.js` with production frontend URL.
- Set cookie options `secure: true`, `sameSite: 'none'` for cross-domain cookies.
- Update Google Calendar redirect URI in Google Cloud Console to production backend URL.

---

## 📸 Screenshots

Patient Dashboard

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c8273007-361b-457a-babd-9f65adf46f51" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/96a307f5-0d43-4d4e-ab8d-749bcdb53d3d" />

Admin dashboard


<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/efe189e9-68fc-4a54-a988-b5033b3b7f7c" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3f07de67-4af1-45ef-98e0-ac3e92809c15" />


Email notification 


<img width="660" height="886" alt="image" src="https://github.com/user-attachments/assets/cfa1be32-b1d0-4f81-87b8-81d0b15777a7" />
<img width="687" height="801" alt="image" src="https://github.com/user-attachments/assets/16edef9c-cb46-4074-a1c5-eeb0c860b7d8" />


| Page | Description |
|---|---|
| Home Page | Landing page with features overview |
| Patient Dashboard | Upcoming appointments and quick actions |
| Doctor Search | Filter doctors by specialization |
| Appointment Booking | Slot selection and symptom entry |
| AI Summary | Pre-visit AI analysis displayed |
| Doctor Portal | Appointment list with patient details |
| Admin Dashboard | System-wide statistics and management |

---

## 🌐 Hosted URLs

| Service | URL |
|---|---|
| Frontend | `https://hopeful-radiance-production-dce4.up.railway.app/` |
| Backend API | `https://healthcare-appointment-manager-production-3b9a.up.railway.app/api/v1` |

---

## 🔮 Future Improvements

- [ ] **Real-time Notifications** — WebSocket/Socket.IO for live appointment updates
- [ ] **Payment Integration** — Razorpay/Stripe for consultation fee collection
- [ ] **Video Consultation** — WebRTC-based telemedicine support
- [ ] **Prescription PDF Generation** — Downloadable PDF prescriptions
- [ ] **Patient Medical History** — Longitudinal health records
- [ ] **Refresh Token Rotation** — Enhanced JWT security
- [ ] **Rate Limiting** — API throttling using `express-rate-limit`
- [ ] **Search Pagination** — Infinite scroll for doctor/appointment lists
- [ ] **Multilingual Support** — i18n for regional language accessibility
- [ ] **Admin Analytics** — Revenue, doctor performance, patient retention metrics
- [ ] **SMS Reminders** — Twilio integration for SMS medication reminders
- [ ] **Mobile App** — React Native companion app

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

Built with ❤️ for the company technical assessment.

> For documentation, see: [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
