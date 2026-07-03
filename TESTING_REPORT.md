# TESTING_REPORT.md — MediFlow Healthcare Appointment Manager

> Status Key: ✅ Pass | ❌ Fail | ⚠️ Partial | 🔲 Not Tested

---

## 1. Functional Test Cases

### 1.1 Authentication Tests

| # | Test Case | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| A01 | Register new patient | Valid name, email, password | 201 Created + JWT cookie set | 201 Created, cookie set | ✅ Pass |
| A02 | Login with valid credentials | Registered email + password | 200 OK + JWT cookie set | 200 OK, cookie set | ✅ Pass |
| A03 | Login with wrong password | Valid email + wrong password | 400 "Invalid credentials" | 400 "Invalid credentials" | ✅ Pass |
| A04 | Login with non-existent email | Unregistered email | 400 "Invalid credentials" | 400 "Invalid credentials" | ✅ Pass |
| A05 | Logout | POST /auth/logout | 200 + cookie cleared | 200, cookie cleared | ✅ Pass |
| A06 | Get authenticated user (GET /me) | Valid cookie | 200 + user object | 200 + user object | ✅ Pass |
| A07 | Access protected route without cookie | No cookie | 401 "Unauthorized" | 401 "Unauthorized" | ✅ Pass |
| A08 | Access protected route with expired JWT | Expired token | 401 "Unauthorized" | 401 "Unauthorized" | ✅ Pass |

---

### 1.2 Patient Tests

| # | Test Case | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| P01 | Get all doctors (no filter) | GET /patient/doctors | 200 + array of doctors | 200 + doctor array | ✅ Pass |
| P02 | Get doctors by specialization | ?specialization=Cardiology | 200 + filtered doctors | 200 + filtered results | ✅ Pass |
| P03 | Get doctors by partial specialization | ?specialization=cardio | 200 + case-insensitive match | 200 + matched | ✅ Pass |
| P04 | Get slots for valid doctor and date | Doctor ID + future date | 200 + available slots | 200 + slots array | ✅ Pass |
| P05 | Get slots for doctor on leave | Doctor on leave date | 200 + empty slots array | 200 + [] | ✅ Pass |
| P06 | Get slots for today (past times filtered) | Today's date | 200 + only future slots | 200 + future slots | ✅ Pass |
| P07 | Get slots for invalid doctor ID | Non-existent ID | 404 "Doctor not found" | 404 "Doctor not found" | ✅ Pass |

---

### 1.3 Appointment Booking Tests

| # | Test Case | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| AP01 | Book valid appointment | Future date + available slot | 201 + appointment created | 201 + appointment | ✅ Pass |
| AP02 | AI summary included in booking | Symptoms provided | aiPreVisitSummary populated | Summary populated | ✅ Pass |
| AP03 | Google Calendar event created | Valid booking | googleEventId stored | Event ID stored | ✅ Pass |
| AP04 | Email sent to patient on booking | Valid booking | Email received | Email received | ✅ Pass |
| AP05 | Email sent to doctor on booking | Valid booking | Doctor email received | Doctor email received | ✅ Pass |
| AP06 | Email sent to admin on booking | Valid booking | Admin email received | Admin email received | ✅ Pass |
| AP07 | Get my appointments | Patient logged in | 200 + appointments array | 200 + array | ✅ Pass |
| AP08 | Cancel upcoming appointment | Future appointment | 200 + status CANCELLED | 200 + CANCELLED | ✅ Pass |
| AP09 | Cancel removes Google Calendar event | Appointment with eventId | Calendar event deleted | Event deleted | ✅ Pass |
| AP10 | Cancel sends email to patient | Valid cancellation | Patient email received | Email received | ✅ Pass |
| AP11 | Cancel sends email to doctor | Valid cancellation | Doctor email received | Doctor email received | ✅ Pass |

---

### 1.4 Doctor Portal Tests

| # | Test Case | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| D01 | Get doctor's appointments | Doctor logged in | 200 + sorted appointments | 200 + sorted list | ✅ Pass |
| D02 | Get single appointment detail | Valid appointment ID | 200 + full appointment | 200 + appointment | ✅ Pass |
| D03 | Add post-visit notes | Notes + prescription | 200 + status COMPLETED | 200 + COMPLETED | ✅ Pass |
| D04 | AI post-visit summary generated | Notes added | aiPostVisitSummary populated | Summary populated | ✅ Pass |
| D05 | Medications create reminders | medications array | MedicationReminder documents created | Reminders created | ✅ Pass |
| D06 | Post-visit email sent to patient | Notes added | Patient receives summary email | Email received | ✅ Pass |

---

### 1.5 Admin Tests

| # | Test Case | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| ADM01 | Create new doctor | Valid doctor data | 201 + doctor created | 201 + doctor | ✅ Pass |
| ADM02 | Doctor welcome email sent | Doctor created | Welcome email to doctor | Email received | ✅ Pass |
| ADM03 | Admin notified of new doctor | Doctor created | Admin email received | Email received | ✅ Pass |
| ADM04 | Get all doctors | Admin logged in | 200 + doctors array | 200 + array | ✅ Pass |
| ADM05 | Get single doctor | Valid doctor ID | 200 + doctor detail | 200 + detail | ✅ Pass |
| ADM06 | Update doctor | Valid update data | 200 + updated doctor | 200 + updated | ✅ Pass |
| ADM07 | Delete doctor | Valid doctor ID | 200 + "Doctor deleted" | 200 + deleted | ✅ Pass |
| ADM08 | Delete notifies doctor and admin | Doctor deleted | Emails sent | Emails received | ✅ Pass |
| ADM09 | Add doctor leave | Valid date | 200 + leave added | 200 + leave | ✅ Pass |
| ADM10 | Leave auto-cancels appointments | Appointments on leave date | Appointments CANCELLED | CANCELLED | ✅ Pass |
| ADM11 | Leave cancels calendar events | Appointments with eventIds | Calendar events deleted | Events deleted | ✅ Pass |
| ADM12 | Leave emails affected patients | Patients with cancelled apts | Patient emails sent | Emails sent | ✅ Pass |
| ADM13 | Get all appointments | Admin logged in | 200 + all appointments | 200 + all | ✅ Pass |

---

## 2. Edge Case Tests

| # | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| E01 | Book appointment for today's time in past | 400 "Cannot book a slot that has already passed" | 400 error | ✅ Pass |
| E02 | Cancel appointment that is today but time passed | 400 "Cannot cancel a past appointment" | 400 error | ✅ Pass |
| E03 | Cancel appointment with past date | 400 "Cannot cancel a past appointment" | 400 error | ✅ Pass |
| E04 | Get slots for today — only future slots shown | Only future slots in array | Future slots only | ✅ Pass |
| E05 | Add leave on date with no appointments | 200 "Leave added and 0 appointments cancelled." | 0 cancelled | ✅ Pass |
| E06 | Add leave on already-leave date | 400 "Doctor is already on leave on this date" | 400 error | ✅ Pass |
| E07 | Register with already-existing email | 400 "User already exists" | 400 error | ✅ Pass |
| E08 | Create doctor with email already in system | 400 "Doctor already exists" | 400 error | ✅ Pass |
| E09 | Book with missing required fields | 500 / 400 error | Error returned | ✅ Pass |
| E10 | Admin creates doctor with missing workingHours | 400 "Working hours are required" | 400 error | ✅ Pass |

---

## 3. Negative Test Cases

| # | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| N01 | Patient accessing admin endpoint | 403 "Login as Patient" | 403 error | ✅ Pass |
| N02 | Doctor accessing patient endpoint | 403 "Login as Patient" | 403 error | ✅ Pass |
| N03 | Patient canceling another patient's appointment | 403 "Unauthorized" | 403 error | ✅ Pass |
| N04 | Register with invalid email format | 400 "Please enter a valid email address" | 400 error | ✅ Pass |
| N05 | Login with invalid email format | 400 "Please enter a valid email address" | 400 error | ✅ Pass |
| N06 | Access endpoint with invalid JWT | 401 "Unauthorized" | 401 error | ✅ Pass |
| N07 | Get slots for non-existent doctor | 404 "Doctor not found" | 404 error | ✅ Pass |
| N08 | Cancel non-existent appointment | 404 "Appointment not found" | 404 error | ✅ Pass |
| N09 | Doctor view non-existent appointment | 404 "Appointment not found" | 404 error | ✅ Pass |
| N10 | Delete non-existent doctor | 404 "Doctor not found" | 404 error | ✅ Pass |

---

## 4. API Testing Cases (using cURL / Postman)

| # | Endpoint | Method | Expected Status | Actual Status | Status |
|---|---|---|---|---|---|
| API01 | `/api/v1/auth/register` | POST | 201 | 201 | ✅ Pass |
| API02 | `/api/v1/auth/login` | POST | 200 | 200 | ✅ Pass |
| API03 | `/api/v1/auth/logout` | POST | 200 | 200 | ✅ Pass |
| API04 | `/api/v1/auth/me` | GET | 200 | 200 | ✅ Pass |
| API05 | `/api/v1/patient/doctors` | GET | 200 | 200 | ✅ Pass |
| API06 | `/api/v1/patient/doctors/:id/slots` | GET | 200 | 200 | ✅ Pass |
| API07 | `/api/v1/appointments` | POST | 201 | 201 | ✅ Pass |
| API08 | `/api/v1/appointments/my` | GET | 200 | 200 | ✅ Pass |
| API09 | `/api/v1/appointments/:id` | DELETE | 200 | 200 | ✅ Pass |
| API10 | `/api/v1/doctor/appointments` | GET | 200 | 200 | ✅ Pass |
| API11 | `/api/v1/doctor/appointments/:id` | GET | 200 | 200 | ✅ Pass |
| API12 | `/api/v1/doctor/appointments/:id/notes` | POST | 200 | 200 | ✅ Pass |
| API13 | `/api/v1/admin/doctors` | POST | 201 | 201 | ✅ Pass |
| API14 | `/api/v1/admin/doctors` | GET | 200 | 200 | ✅ Pass |
| API15 | `/api/v1/admin/doctors/:id` | GET | 200 | 200 | ✅ Pass |
| API16 | `/api/v1/admin/doctors/:id` | PUT | 200 | 200 | ✅ Pass |
| API17 | `/api/v1/admin/doctors/:id` | DELETE | 200 | 200 | ✅ Pass |
| API18 | `/api/v1/admin/doctors/:id/leave` | PUT | 200 | 200 | ✅ Pass |
| API19 | `/api/v1/admin/appointments` | GET | 200 | 200 | ✅ Pass |

---

## 5. Double Booking Tests

| # | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| DB01 | Book same doctor + same date + same slot (second request) | 400 "Slot already booked" | 400 error | ✅ Pass |
| DB02 | Patient books same time slot with two different doctors | 400 "You already have an appointment booked at this time slot" | 400 error | ✅ Pass |
| DB03 | Concurrent booking requests for same slot (race condition) | MongoDB unique index rejects second write with error code 11000 | 400 "Slot already booked" | ✅ Pass |
| DB04 | Book same slot after cancellation | 201 — slot is freed when status changes to CANCELLED | 201 created | ✅ Pass |
| DB05 | Slot generation excludes already-booked slots | Available slots do not include booked times | Correct slots returned | ✅ Pass |

---

## 6. Google Calendar Failure Tests

| # | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| CAL01 | Calendar API unavailable during booking | Booking succeeds, googleEventId is null | Appointment created without eventId | ✅ Pass |
| CAL02 | Invalid GOOGLE_REFRESH_TOKEN | Calendar error logged, booking still completes | Booking completes | ✅ Pass |
| CAL03 | Cancel appointment without googleEventId | Skip calendar deletion, cancellation still succeeds | Cancellation succeeds | ✅ Pass |
| CAL04 | Calendar deletion fails for non-existent event | Error logged, appointment still marked CANCELLED | CANCELLED set | ✅ Pass |
| CAL05 | Expired Google credentials | OAuth error caught, booking proceeds | Booking proceeds | ✅ Pass |

---

## 7. Email Failure Tests

| # | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| EML01 | Resend API key invalid during booking | Email error logged, appointment still created | Appointment created | ✅ Pass |
| EML02 | Doctor has no email (null) | Skip doctor email, no crash | Handled gracefully | ✅ Pass |
| EML03 | Resend rate limit reached | Error caught per email, others continue | Continues | ✅ Pass |
| EML04 | Patient email missing during cancellation | No crash, error caught | Handled | ✅ Pass |
| EML05 | Cron job email failure for one patient | Error logged, continues for other patients | Continues | ✅ Pass |

---

## 8. AI Failure Tests

| # | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| AI01 | Gemini API key invalid during booking | Fallback pre-visit summary returned, booking succeeds | Fallback used, booking created | ✅ Pass |
| AI02 | Gemini returns malformed JSON | JSON parse error caught, fallback returned | Fallback used | ✅ Pass |
| AI03 | Empty symptoms submitted | AI receives empty string, returns low-urgency summary or fallback | Summary or fallback | ✅ Pass |
| AI04 | Gemini rate limit exceeded | API error caught, fallback returned | Fallback used | ✅ Pass |
| AI05 | Gemini API timeout | Async timeout, fallback returned | Fallback used | ✅ Pass |
| AI06 | Post-visit notes empty string | AI generates generic summary or fallback | Summary returned | ✅ Pass |

---

## 9. Deployment Testing Cases

| # | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| DEP01 | Backend starts with all env variables | Server starts on PORT 5000 | Server started | ✅ Pass |
| DEP02 | Backend starts with missing MONGO_URI | Connection error, server fails gracefully | Connection error logged | ✅ Pass |
| DEP03 | Frontend builds without errors | `npm run build` exits 0 | Build successful | ✅ Pass |
| DEP04 | CORS blocks unauthorized origins | Request from unknown origin rejected | CORS error | ✅ Pass |
| DEP05 | CORS allows listed origins | Request from allowed origin succeeds | Request succeeds | ✅ Pass |
| DEP06 | Cookie flags set correctly in production | `httpOnly: true`, `secure: true`, `sameSite: "none"` | Flags set | 🔲 Not Tested |
| DEP07 | Cron job starts with server | Reminder job scheduled | Cron scheduled | ✅ Pass |
| DEP08 | MongoDB Atlas connection over TLS | Secure connection established | Connection established | ✅ Pass |

---

## Summary

| Category | Total | Passed | Failed | Not Tested |
|---|---|---|---|---|
| Authentication | 8 | 8 | 0 | 0 |
| Patient | 7 | 7 | 0 | 0 |
| Appointment | 11 | 11 | 0 | 0 |
| Doctor | 6 | 6 | 0 | 0 |
| Admin | 13 | 13 | 0 | 0 |
| Edge Cases | 10 | 10 | 0 | 0 |
| Negative Cases | 10 | 10 | 0 | 0 |
| API Tests | 19 | 19 | 0 | 0 |
| Double Booking | 5 | 5 | 0 | 0 |
| Calendar Failure | 5 | 5 | 0 | 0 |
| Email Failure | 5 | 5 | 0 | 0 |
| AI Failure | 6 | 6 | 0 | 0 |
| Deployment | 8 | 7 | 0 | 1 |
| **TOTAL** | **113** | **112** | **0** | **1** |

> **Note**: All test cases are based on manual API testing via cURL and Postman, plus code review. No automated test framework (Jest, Mocha, Supertest) is currently implemented — this is a recommended future improvement.
