# architecture-diagram.md — MediFlow System Architecture Diagrams

> All diagrams use **Mermaid** syntax.

---

## 1. System Architecture Diagram

```mermaid
graph TB
    subgraph Internet
        U1[🧑‍⚕️ Patient Browser]
        U2[👨‍⚕️ Doctor Browser]
        U3[🔧 Admin Browser]
    end

    subgraph Frontend["Frontend — React + Vite (Vercel)"]
        FE[React SPA<br/>React Router v7<br/>TanStack Query<br/>Tailwind CSS]
    end

    subgraph Backend["Backend — Express.js (Render)"]
        AM[Auth Middleware<br/>JWT Cookie Verify]
        RM[Role Middleware<br/>RBAC]
        subgraph Controllers
            AC[Auth Controller]
            PC[Patient Controller]
            DC[Doctor Controller]
            APC[Appointment Controller]
            ADC[Admin Controller]
        end
        subgraph Services
            AIS[AI Service<br/>Gemini 2.5 Flash]
            CS[Calendar Service<br/>Google Calendar v3]
            ES[Email Service<br/>Resend]
            SS[Slot Service]
        end
        CJ[Cron Job<br/>node-cron<br/>Every 2h]
    end

    subgraph DB["Data Layer — MongoDB Atlas"]
        Users[(users)]
        Doctors[(doctors)]
        Appointments[(appointments)]
        MedReminders[(medicationreminders)]
    end

    subgraph External["External APIs"]
        GEMINI[Google Gemini<br/>2.5 Flash]
        GCAL[Google Calendar<br/>API v3]
        RESEND[Resend<br/>Email API]
    end

    U1 & U2 & U3 -->|HTTPS| FE
    FE -->|Axios + Cookie| AM
    AM --> RM --> Controllers
    Controllers --> Services
    Controllers --> DB
    AIS --> GEMINI
    CS --> GCAL
    ES --> RESEND
    CJ --> MedReminders
    CJ --> RESEND
```

---

## 2. Sequence Diagram — Appointment Booking Flow

```mermaid
sequenceDiagram
    actor P as Patient
    participant FE as React Frontend
    participant API as Express Backend
    participant DB as MongoDB
    participant AI as Gemini AI
    participant CAL as Google Calendar
    participant EMAIL as Resend

    P->>FE: Select doctor, date, slot, enter symptoms
    FE->>API: POST /api/v1/appointments {doctorId, date, startTime, endTime, symptoms}
    API->>API: Auth Middleware (verify JWT cookie)
    API->>API: Role Middleware (patient only)

    API->>DB: Check doctor exists (Doctor.findById)
    DB-->>API: Doctor document

    API->>DB: Check slot not already booked
    DB-->>API: null (slot free)

    API->>DB: Check patient has no conflict at same time
    DB-->>API: null (no conflict)

    API->>AI: generatePreVisitSummary(symptoms)
    AI-->>API: {urgencyLevel, chiefComplaint, suggestedQuestions}

    API->>DB: Appointment.create({patient, doctor, date, time, aiSummary})
    DB-->>API: Appointment document

    par Email Notifications
        API->>EMAIL: Booking confirmation to patient
        API->>EMAIL: Booking notification to doctor
        API->>EMAIL: Booking notification to admins
    end

    API->>CAL: createCalendarEvent(appointment, names, emails)
    CAL-->>API: googleEventId

    API->>DB: appointment.googleEventId = eventId; save()

    API-->>FE: 201 Created {appointment}
    FE-->>P: Success toast + appointment details with AI summary
```

---

## 3. Authentication Flow Diagram

```mermaid
sequenceDiagram
    actor U as User (Patient/Doctor/Admin)
    participant FE as React Frontend
    participant API as Express Backend
    participant DB as MongoDB
    participant MW as Auth Middleware

    Note over U,DB: Registration Flow
    U->>FE: Fill registration form (name, email, password)
    FE->>API: POST /api/v1/auth/register
    API->>API: Validate email format
    API->>DB: User.findOne({email}) — check existing
    DB-->>API: null (user free)
    API->>DB: User.create({name, email, password, role: "patient"})
    Note over DB: Pre-save hook: bcrypt.hash(password, 10)
    DB-->>API: User document (no password)
    API->>API: jwt.sign({_id, role}, JWT_SECRET, {expiresIn: "7d"})
    API-->>FE: 201 + Set-Cookie: accessToken=<JWT>; HttpOnly; SameSite=Lax
    FE-->>U: Redirect to /dashboard

    Note over U,DB: Login Flow
    U->>FE: Enter email + password
    FE->>API: POST /api/v1/auth/login
    API->>DB: User.findOne({email}).select("+password")
    DB-->>API: User with hashed password
    API->>API: bcrypt.compare(enteredPassword, hash)
    API->>API: jwt.sign({_id, role}, JWT_SECRET, "7d")
    API-->>FE: 200 + Set-Cookie: accessToken=<JWT>; HttpOnly
    FE-->>U: Redirect to role-based dashboard

    Note over U,MW: Protected Request Flow
    U->>FE: Navigate to protected page
    FE->>API: GET /api/v1/auth/me [Cookie: accessToken]
    API->>MW: protect middleware
    MW->>MW: jwt.verify(token, JWT_SECRET)
    MW->>DB: User.findById(decoded._id).select("-password")
    DB-->>MW: User document
    MW-->>API: req.user = user
    API-->>FE: 200 {user}
    FE-->>U: Render dashboard

    Note over U,FE: Logout Flow
    U->>FE: Click logout
    FE->>API: POST /api/v1/auth/logout
    API-->>FE: 200 + clearCookie(accessToken)
    FE-->>U: Redirect to /login
```

---

## 4. Appointment Cancellation Flow

```mermaid
flowchart TD
    A[Patient clicks Cancel Appointment] --> B[DELETE /api/v1/appointments/:id]
    B --> C{JWT Cookie valid?}
    C -->|No| D[401 Unauthorized]
    C -->|Yes| E{Role = patient?}
    E -->|No| F[403 Forbidden]
    E -->|Yes| G[Find appointment by ID]
    G --> H{Appointment exists?}
    H -->|No| I[404 Not Found]
    H -->|Yes| J{Patient owns appointment?}
    J -->|No| K[403 Unauthorized]
    J -->|Yes| L{Status = CANCELLED?}
    L -->|Yes| M[400 Already cancelled]
    L -->|No| N{Is appointment date in past?}
    N -->|Yes| O[400 Cannot cancel past appointment]
    N -->|No| P{Is today but time already passed?}
    P -->|Yes| O
    P -->|No| Q[Set status = CANCELLED]
    Q --> R{googleEventId exists?}
    R -->|Yes| S[Delete Google Calendar Event]
    R -->|No| T[Skip]
    S --> U[Send cancellation email to patient]
    T --> U
    U --> V[Send cancellation email to doctor]
    V --> W[200 Appointment cancelled successfully]
```

---

## 5. Email Notification Flow

```mermaid
flowchart LR
    subgraph Triggers
        T1[Appointment Booked]
        T2[Appointment Cancelled]
        T3[Doctor Created]
        T4[Doctor Deleted]
        T5[Doctor Leave Added]
        T6[Post-Visit Notes Added]
        T7[Cron Job Fires]
    end

    subgraph EmailService["email.service.js (Resend)"]
        ES[sendEmail function<br/>from: MediFlow Healthcare]
    end

    subgraph Templates["emailTemplates.js"]
        E1[bookingConfirmationPatientEmail]
        E2[bookingConfirmationDoctorEmail]
        E3[bookingAdminEmail]
        E4[cancellationPatientEmail]
        E5[cancellationDoctorEmail]
        E6[doctorWelcomeEmail]
        E7[doctorAddedAdminEmail]
        E8[doctorRemovedDoctorEmail]
        E9[doctorRemovedAdminEmail]
        E10[leaveApprovedDoctorEmail]
        E11[leaveApprovedAdminEmail]
        E12[leaveAppointmentCancelledEmail]
        E13[postVisitPatientEmail]
        E14[postVisitDoctorEmail]
        E15[Inline Medication Reminder HTML]
    end

    T1 --> E1 & E2 & E3
    T2 --> E4 & E5
    T3 --> E6 & E7
    T4 --> E8 & E9
    T5 --> E10 & E11 & E12
    T6 --> E13 & E14
    T7 --> E15

    E1 & E2 & E3 & E4 & E5 & E6 & E7 & E8 & E9 & E10 & E11 & E12 & E13 & E14 & E15 --> ES
    ES --> RESEND[Resend API]
    RESEND --> INBOX[Patient / Doctor / Admin Inbox]
```

---

## 6. Google Calendar Integration Flow

```mermaid
sequenceDiagram
    participant API as Express Backend
    participant OA2 as OAuth2 Client
    participant GCAL as Google Calendar API

    Note over API,GCAL: Appointment Created
    API->>OA2: Initialize with GOOGLE_REFRESH_TOKEN
    OA2->>GCAL: Auto-refresh access token
    GCAL-->>OA2: Fresh access token

    API->>GCAL: calendar.events.insert({
        calendarId: "primary",
        summary: "MediFlow: Patient & Dr. Doctor",
        start: {dateTime, timeZone: "Asia/Kolkata"},
        end: {dateTime, timeZone: "Asia/Kolkata"},
        attendees: [{email: patient}, {email: doctor}],
        sendUpdates: "all"
    })
    GCAL-->>API: {id: "google_event_id"}
    API->>MongoDB: appointment.googleEventId = "google_event_id"

    Note over API,GCAL: Appointment Cancelled / Doctor on Leave
    API->>GCAL: calendar.events.delete({
        calendarId: "primary",
        eventId: appointment.googleEventId,
        sendUpdates: "all"
    })
    GCAL-->>API: 204 No Content
    Note over GCAL: Calendar invite cancelled, attendees notified by Google
```

---

## 7. Medication Reminder Cron Flow

```mermaid
flowchart TD
    CRON[node-cron<br/>0 */2 * * *<br/>Every 2 hours] --> QUERY

    QUERY[Query MedicationReminder<br/>where nextReminderTime &lt;= now] --> CHECK

    CHECK{Any reminders due?} -->|No| END[Exit quietly]
    CHECK -->|Yes| GROUP

    GROUP[Group by patient email] --> LOOP

    LOOP[For each patient email] --> CALC

    CALC[Calculate nextReminderTime<br/>based on frequency] --> SAVE

    SAVE[Save updated nextReminderTime] --> EMAIL

    EMAIL[Send medication reminder email<br/>via Resend<br/>Subject: Your Medication Reminder 💊] --> NEXT

    NEXT{More patients?} -->|Yes| LOOP
    NEXT -->|No| END
```
