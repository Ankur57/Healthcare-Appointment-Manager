# API_DOCUMENTATION.md — MediFlow Healthcare Appointment Manager

> Base URL: `http://localhost:5000/api/v1`  
> All requests that require authentication must include a valid `accessToken` cookie.  
> All responses follow the format: `{ success: boolean, message?: string, data? }`

---

## 📌 Table of Contents

1. [Authentication APIs](#1-authentication-apis)
2. [Patient APIs](#2-patient-apis)
3. [Doctor APIs](#3-doctor-apis)
4. [Admin APIs](#4-admin-apis)
5. [Appointment APIs](#5-appointment-apis)

---

## 1. Authentication APIs

Base path: `/api/v1/auth`

---

### POST `/api/v1/auth/register`

Register a new patient account.

| Property | Value |
|---|---|
| **Method** | POST |
| **Authentication** | Not required |
| **Role** | Public |

**Request Body:**
```json
{
  "name": "Ankur Bajpai",
  "email": "ankur@example.com",
  "password": "securePass123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "_id": "64a1b2c3d4e5f6789abc1234",
    "name": "Ankur Bajpai",
    "email": "ankur@example.com",
    "role": "patient",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```
Sets Cookie: `accessToken=<JWT>; HttpOnly`

**Error Responses:**
| Status | Message |
|---|---|
| 400 | `"Please enter a valid email address"` |
| 400 | `"User already exists"` |
| 500 | `"Internal server error"` |

**Sample cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ankur","email":"ankur@test.com","password":"test1234"}'
```

---

### POST `/api/v1/auth/login`

Login with email and password.

| Property | Value |
|---|---|
| **Method** | POST |
| **Authentication** | Not required |
| **Role** | Public |

**Request Body:**
```json
{
  "email": "ankur@example.com",
  "password": "securePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "64a1b2c3d4e5f6789abc1234",
    "name": "Ankur Bajpai",
    "email": "ankur@example.com",
    "role": "patient"
  }
}
```
Sets Cookie: `accessToken=<JWT>; HttpOnly`

**Error Responses:**
| Status | Message |
|---|---|
| 400 | `"Please enter a valid email address"` |
| 400 | `"Invalid credentials"` |
| 500 | `"Internal server error"` |

**Sample cURL:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"ankur@test.com","password":"test1234"}'
```

---

### POST `/api/v1/auth/logout`

Logout and clear the auth cookie.

| Property | Value |
|---|---|
| **Method** | POST |
| **Authentication** | Not required |
| **Role** | Public |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```
Clears Cookie: `accessToken`

---

### GET `/api/v1/auth/me`

Get the currently authenticated user's profile.

| Property | Value |
|---|---|
| **Method** | GET |
| **Authentication** | Required |
| **Role** | Any authenticated user |

**Headers / Cookie:** `accessToken=<JWT>`

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "64a1b2c3d4e5f6789abc1234",
    "name": "Ankur Bajpai",
    "email": "ankur@example.com",
    "role": "patient",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
| Status | Message |
|---|---|
| 401 | `"Unauthorized"` |

---

## 2. Patient APIs

Base path: `/api/v1/patient`  
**Authentication required. Role: `patient` only.**

---

### GET `/api/v1/patient/doctors`

Search and list all available doctors, optionally filtered by specialization.

| Property | Value |
|---|---|
| **Method** | GET |
| **Authentication** | Required |
| **Role** | patient |

**Query Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `specialization` | string | No | Filter by specialization (case-insensitive regex) |

**Sample Requests:**
```
GET /api/v1/patient/doctors
GET /api/v1/patient/doctors?specialization=cardiology
GET /api/v1/patient/doctors?specialization=dermatologist
```

**Success Response (200):**
```json
{
  "success": true,
  "doctors": [
    {
      "_id": "64b1c3d4e5f6789abcdef012",
      "user": {
        "_id": "64a1b2c3d4e5f6789abc1234",
        "name": "Dr. Priya Sharma",
        "email": "dr.priya@mediflow.com"
      },
      "specialization": "Cardiology",
      "qualification": "MBBS, MD (Cardiology)",
      "experience": 12,
      "consultationFee": 1500,
      "slotDuration": 30,
      "workingHours": {
        "start": "09:00",
        "end": "17:00"
      },
      "leaveDays": []
    }
  ]
}
```

---

### GET `/api/v1/patient/doctors/:id/slots`

Get available (un-booked) time slots for a specific doctor on a given date.

| Property | Value |
|---|---|
| **Method** | GET |
| **Authentication** | Required |
| **Role** | patient |

**URL Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | ObjectId | Yes | Doctor's MongoDB `_id` |

**Query Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `date` | ISO 8601 date string | Yes | Date to check slots for (e.g. `2024-01-20`) |

**Sample Request:**
```
GET /api/v1/patient/doctors/64b1c3d4e5f6789abcdef012/slots?date=2024-01-20
```

**Success Response (200) — Available Slots:**
```json
{
  "success": true,
  "slots": [
    { "startTime": "09:00", "endTime": "09:30" },
    { "startTime": "09:30", "endTime": "10:00" },
    { "startTime": "10:30", "endTime": "11:00" }
  ]
}
```

**Success Response (200) — Doctor on Leave:**
```json
{
  "success": true,
  "slots": []
}
```

**Error Responses:**
| Status | Message |
|---|---|
| 404 | `"Doctor not found"` |
| 401 | `"Unauthorized"` |
| 403 | `"Login as Patient"` |

---

## 3. Doctor APIs

Base path: `/api/v1/doctor`  
**Authentication required. Role: `doctor` only.**

---

### GET `/api/v1/doctor/appointments`

Get all appointments assigned to the logged-in doctor.

| Property | Value |
|---|---|
| **Method** | GET |
| **Authentication** | Required |
| **Role** | doctor |

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "appointments": [
    {
      "_id": "64c2d4e5f6789abcdef01234",
      "patient": {
        "_id": "64a1b2c3d4e5f6789abc1234",
        "name": "Ankur Bajpai",
        "email": "ankur@example.com"
      },
      "appointmentDate": "2024-01-20T00:00:00.000Z",
      "startTime": "10:00",
      "endTime": "10:30",
      "status": "BOOKED",
      "symptoms": "Chest pain and shortness of breath",
      "aiPreVisitSummary": {
        "urgencyLevel": "High",
        "chiefComplaint": "Chest pain with dyspnea",
        "suggestedQuestions": [
          "When did the chest pain start?",
          "Is it radiating to the arm or jaw?"
        ]
      }
    }
  ]
}
```

---

### GET `/api/v1/doctor/appointments/:id`

Get a single appointment's full detail.

| Property | Value |
|---|---|
| **Method** | GET |
| **Authentication** | Required |
| **Role** | doctor |

**URL Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | ObjectId | Yes | Appointment `_id` |

**Success Response (200):**
```json
{
  "success": true,
  "appointment": {
    "_id": "64c2d4e5f6789abcdef01234",
    "patient": { "name": "Ankur Bajpai", "email": "ankur@example.com" },
    "doctor": {
      "_id": "64b1c3d4",
      "specialization": "Cardiology",
      "user": { "name": "Dr. Priya Sharma", "email": "dr.priya@mediflow.com" }
    },
    "appointmentDate": "2024-01-20T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "10:30",
    "status": "BOOKED",
    "symptoms": "Chest pain",
    "aiPreVisitSummary": { "urgencyLevel": "High", "chiefComplaint": "..." }
  }
}
```

**Error Responses:**
| Status | Message |
|---|---|
| 404 | `"Appointment not found"` |

---

### POST `/api/v1/doctor/appointments/:id/notes`

Add post-visit notes, prescription, and medications to an appointment. Triggers AI post-visit summary generation, email to patient/doctor, and creates medication reminders.

| Property | Value |
|---|---|
| **Method** | POST |
| **Authentication** | Required |
| **Role** | doctor |

**URL Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | ObjectId | Yes | Appointment `_id` |

**Request Body:**
```json
{
  "postVisitNotes": "Patient presented with acute chest pain. ECG normal. Prescribed nitrates.",
  "prescription": "Isosorbide Mononitrate 10mg — once daily",
  "medications": [
    { "medicineName": "Isosorbide Mononitrate", "frequency": "once" },
    { "medicineName": "Aspirin 75mg", "frequency": "once" }
  ]
}
```

**Accepted frequency values:** `"once"` | `"twice"` | `"thrice"`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Notes added successfully",
  "appointment": {
    "_id": "64c2d4e5f6789abcdef01234",
    "status": "COMPLETED",
    "postVisitNotes": "Patient presented with acute chest pain...",
    "prescription": "Isosorbide Mononitrate 10mg...",
    "aiPostVisitSummary": {
      "summary": "You visited Dr. Priya for chest pain. Your ECG was normal...",
      "medicationSchedule": "Take Isosorbide Mononitrate once daily in the morning.",
      "followUpSteps": "Return in 2 weeks for a follow-up ECG."
    }
  }
}
```

**Error Responses:**
| Status | Message |
|---|---|
| 404 | `"Appointment not found"` |
| 401 | `"Unauthorized"` |
| 403 | `"Login as Patient"` (role mismatch) |

---

## 4. Admin APIs

Base path: `/api/v1/admin`  
**Authentication required. Role: `admin` only.**

---

### POST `/api/v1/admin/doctors`

Create a new doctor profile (creates User + Doctor documents).

| Property | Value |
|---|---|
| **Method** | POST |
| **Authentication** | Required |
| **Role** | admin |

**Request Body:**
```json
{
  "name": "Dr. Priya Sharma",
  "email": "dr.priya@mediflow.com",
  "password": "Doctor@123",
  "specialization": "Cardiology",
  "qualification": "MBBS, MD (Cardiology)",
  "experience": 12,
  "consultationFee": 1500,
  "slotDuration": 30,
  "workingHours": {
    "start": "09:00",
    "end": "17:00"
  }
}
```

**Required Fields:** `name`, `email`, `password`, `specialization`, `qualification`, `experience`, `consultationFee`, `slotDuration`, `workingHours.start`, `workingHours.end`

**Success Response (201):**
```json
{
  "success": true,
  "doctor": {
    "_id": "64b1c3d4e5f6789abcdef012",
    "user": "64a1b2c3d4e5f6789abc1234",
    "specialization": "Cardiology",
    "qualification": "MBBS, MD (Cardiology)",
    "experience": 12,
    "consultationFee": 1500,
    "slotDuration": 30,
    "workingHours": { "start": "09:00", "end": "17:00" },
    "leaveDays": []
  }
}
```

**Error Responses:**
| Status | Message |
|---|---|
| 400 | `"Missing required fields: name, email, ..."` |
| 400 | `"Working hours (start and end) are required"` |
| 400 | `"Doctor already exists"` |

---

### GET `/api/v1/admin/doctors`

Get all doctors in the system.

| Property | Value |
|---|---|
| **Method** | GET |
| **Authentication** | Required |
| **Role** | admin |

**Success Response (200):**
```json
{
  "success": true,
  "doctors": [
    {
      "_id": "64b1c3d4e5f6789abcdef012",
      "user": { "_id": "...", "name": "Dr. Priya Sharma", "email": "dr.priya@mediflow.com" },
      "specialization": "Cardiology",
      "experience": 12,
      "consultationFee": 1500
    }
  ]
}
```

---

### GET `/api/v1/admin/doctors/:id`

Get a single doctor's full profile.

| Property | Value |
|---|---|
| **Method** | GET |
| **Authentication** | Required |
| **Role** | admin |

**URL Parameters:** `id` — Doctor's MongoDB `_id`

**Success Response (200):**
```json
{
  "success": true,
  "doctor": { /* full doctor document with populated user */ }
}
```

**Error Responses:**
| Status | Message |
|---|---|
| 404 | `"Doctor not found"` |

---

### PUT `/api/v1/admin/doctors/:id`

Update a doctor's profile. Can update both `User` fields (name, email) and `Doctor` fields.

| Property | Value |
|---|---|
| **Method** | PUT |
| **Authentication** | Required |
| **Role** | admin |

**Request Body (all fields optional):**
```json
{
  "name": "Dr. Priya S. Sharma",
  "email": "dr.priya.sharma@mediflow.com",
  "specialization": "Interventional Cardiology",
  "consultationFee": 2000,
  "experience": 13,
  "workingHours": { "start": "10:00", "end": "18:00" }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "doctor": { /* updated doctor document */ }
}
```

---

### DELETE `/api/v1/admin/doctors/:id`

Delete a doctor (removes both Doctor and User documents). Sends notification emails.

| Property | Value |
|---|---|
| **Method** | DELETE |
| **Authentication** | Required |
| **Role** | admin |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Doctor deleted"
}
```

**Error Responses:**
| Status | Message |
|---|---|
| 404 | `"Doctor not found"` |

---

### PUT `/api/v1/admin/doctors/:id/leave`

Mark a leave day for a doctor. Automatically cancels all booked appointments on that date and sends cancellation emails to affected patients.

| Property | Value |
|---|---|
| **Method** | PUT |
| **Authentication** | Required |
| **Role** | admin |

**Request Body:**
```json
{
  "date": "2024-01-25"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Leave added and 3 appointments cancelled.",
  "doctor": { /* updated doctor with new leaveDays array */ }
}
```

**Error Responses:**
| Status | Message |
|---|---|
| 404 | `"Doctor not found"` |
| 400 | `"Doctor is already on leave on this date"` |

---

### GET `/api/v1/admin/appointments`

Get all appointments across the entire system.

| Property | Value |
|---|---|
| **Method** | GET |
| **Authentication** | Required |
| **Role** | admin |

**Success Response (200):**
```json
{
  "success": true,
  "count": 45,
  "appointments": [
    {
      "_id": "...",
      "patient": { "name": "Ankur Bajpai", "email": "ankur@example.com" },
      "doctor": {
        "specialization": "Cardiology",
        "user": { "name": "Dr. Priya Sharma", "email": "dr.priya@mediflow.com" }
      },
      "appointmentDate": "2024-01-20T00:00:00.000Z",
      "startTime": "10:00",
      "endTime": "10:30",
      "status": "BOOKED"
    }
  ]
}
```

---

## 5. Appointment APIs

Base path: `/api/v1/appointments`  
**Authentication required. Role: `patient` only.**

---

### POST `/api/v1/appointments`

Book a new appointment. Triggers AI pre-visit summary, email notifications, and Google Calendar event creation.

| Property | Value |
|---|---|
| **Method** | POST |
| **Authentication** | Required |
| **Role** | patient |

**Request Body:**
```json
{
  "doctorId": "64b1c3d4e5f6789abcdef012",
  "appointmentDate": "2024-01-20",
  "startTime": "10:00",
  "endTime": "10:30",
  "symptoms": "Persistent chest pain radiating to the left arm, occasional shortness of breath"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "appointment": {
    "_id": "64c2d4e5f6789abcdef01234",
    "patient": "64a1b2c3d4e5f6789abc1234",
    "doctor": "64b1c3d4e5f6789abcdef012",
    "appointmentDate": "2024-01-20T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "10:30",
    "status": "BOOKED",
    "symptoms": "Persistent chest pain...",
    "aiPreVisitSummary": {
      "urgencyLevel": "High",
      "chiefComplaint": "Chest pain with radiation to left arm",
      "suggestedQuestions": [
        "How long have you had this pain?",
        "Does the pain worsen with activity?"
      ]
    },
    "googleEventId": "abc123xyz_googleevent_id"
  }
}
```

**Error Responses:**
| Status | Message |
|---|---|
| 400 | `"Cannot book a slot that has already passed"` |
| 400 | `"Slot already booked"` |
| 400 | `"You already have an appointment booked at this time slot"` |
| 404 | `"Doctor not found"` |
| 401 | `"Unauthorized"` |

---

### GET `/api/v1/appointments/my`

Get all appointments for the currently logged-in patient (sorted newest first).

| Property | Value |
|---|---|
| **Method** | GET |
| **Authentication** | Required |
| **Role** | patient |

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "appointments": [
    {
      "_id": "64c2d4e5f6789abcdef01234",
      "doctor": {
        "_id": "64b1c3d4",
        "specialization": "Cardiology",
        "consultationFee": 1500,
        "user": { "name": "Dr. Priya Sharma", "email": "dr.priya@mediflow.com" }
      },
      "appointmentDate": "2024-01-20T00:00:00.000Z",
      "startTime": "10:00",
      "endTime": "10:30",
      "status": "BOOKED",
      "symptoms": "Chest pain",
      "aiPreVisitSummary": { "urgencyLevel": "High", "chiefComplaint": "..." }
    }
  ]
}
```

---

### DELETE `/api/v1/appointments/:id`

Cancel an appointment. Only the booking patient can cancel. Deletes Google Calendar event and sends cancellation emails.

| Property | Value |
|---|---|
| **Method** | DELETE |
| **Authentication** | Required |
| **Role** | patient |

**URL Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | ObjectId | Yes | Appointment `_id` |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

**Error Responses:**
| Status | Message |
|---|---|
| 404 | `"Appointment not found"` |
| 403 | `"Unauthorized"` (patient doesn't own appointment) |
| 400 | `"Appointment already cancelled"` |
| 400 | `"Cannot cancel a past appointment"` |
| 500 | `"Internal server error"` |

---

## 📊 API Summary

| Group | Endpoint | Method | Auth | Role |
|---|---|---|---|---|
| Auth | `/auth/register` | POST | ❌ | Public |
| Auth | `/auth/login` | POST | ❌ | Public |
| Auth | `/auth/logout` | POST | ❌ | Public |
| Auth | `/auth/me` | GET | ✅ | Any |
| Patient | `/patient/doctors` | GET | ✅ | patient |
| Patient | `/patient/doctors/:id/slots` | GET | ✅ | patient |
| Doctor | `/doctor/appointments` | GET | ✅ | doctor |
| Doctor | `/doctor/appointments/:id` | GET | ✅ | doctor |
| Doctor | `/doctor/appointments/:id/notes` | POST | ✅ | doctor |
| Admin | `/admin/doctors` | POST | ✅ | admin |
| Admin | `/admin/doctors` | GET | ✅ | admin |
| Admin | `/admin/doctors/:id` | GET | ✅ | admin |
| Admin | `/admin/doctors/:id` | PUT | ✅ | admin |
| Admin | `/admin/doctors/:id` | DELETE | ✅ | admin |
| Admin | `/admin/doctors/:id/leave` | PUT | ✅ | admin |
| Admin | `/admin/appointments` | GET | ✅ | admin |
| Appointment | `/appointments` | POST | ✅ | patient |
| Appointment | `/appointments/my` | GET | ✅ | patient |
| Appointment | `/appointments/:id` | DELETE | ✅ | patient |

**Total APIs: 19**
