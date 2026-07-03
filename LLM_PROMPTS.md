# LLM_PROMPTS.md — MediFlow AI Prompt Documentation

> This document details all AI prompts used in MediFlow, powered by **Google Gemini 2.5 Flash** via the `@google/generative-ai` SDK.

---

## Overview

| Prompt | Function | Trigger |
|---|---|---|
| Pre-Visit Summary | `generatePreVisitSummary()` | Patient books appointment |
| Post-Visit Summary | `generatePostVisitSummary()` | Doctor adds notes/prescription |
| Medication Reminder | Inline in `reminder.job.js` | Cron job (every 2 hours) |

---

## 1. AI Pre-Visit Summary

### Purpose

When a patient books an appointment and describes their symptoms, this prompt sends those symptoms to Gemini AI and returns a structured clinical assessment. The output helps doctors prepare for the visit in advance by understanding the urgency, chief complaint, and useful questions to ask.

### Inputs

| Input | Source | Type |
|---|---|---|
| `symptoms` | Patient's `req.body.symptoms` | String (free text) |

### Prompt Template

```
Analyse these symptoms and return ONLY valid JSON.

{
  "urgencyLevel": "",
  "chiefComplaint": "",
  "suggestedQuestions": []
}

Symptoms:
${symptoms}
```

### Expected Output Format

```json
{
  "urgencyLevel": "High",
  "chiefComplaint": "Chest pain radiating to the left arm with shortness of breath",
  "suggestedQuestions": [
    "When did the chest pain start?",
    "Is the pain constant or intermittent?",
    "Does the pain worsen with physical activity?",
    "Do you have a history of heart disease?"
  ]
}
```

### Field Descriptions

| Field | Description | Example Values |
|---|---|---|
| `urgencyLevel` | Clinical urgency of the symptoms | `"Low"`, `"Medium"`, `"High"`, `"Emergency"` |
| `chiefComplaint` | Concise medical summary of the primary issue | `"Acute chest pain with dyspnea"` |
| `suggestedQuestions` | Array of doctor-facing questions to ask the patient | `["When did it start?", "Any prior history?"]` |

### Storage

Stored as an embedded sub-document in the `Appointment` collection:
```javascript
appointment.aiPreVisitSummary = {
  urgencyLevel: "High",
  chiefComplaint: "...",
  suggestedQuestions: [...]
}
```

### Failure Handling

If the Gemini API call fails (network error, rate limit, invalid JSON response), the function catches the error and returns a **graceful fallback object**:

```json
{
  "urgencyLevel": "Unknown",
  "chiefComplaint": "AI Summary unavailable",
  "suggestedQuestions": []
}
```

This ensures the appointment booking flow is **never blocked** by an AI failure. The appointment is still created with the fallback summary stored.

### Post-Processing

The raw Gemini response is cleaned before parsing:
```javascript
const cleanedResponse = response
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();
return JSON.parse(cleanedResponse);
```

This removes any markdown code fence wrappers that the model may include.

---

## 2. AI Post-Visit Summary

### Purpose

After a doctor completes a consultation and adds clinical notes and prescription details, this prompt transforms the raw clinical text into a **patient-friendly summary**. The output is stored in the appointment record and emailed to the patient — helping them understand their diagnosis, medication schedule, and next steps in plain language.

### Inputs

| Input | Source | Type |
|---|---|---|
| `postVisitNotes` | Doctor's `req.body.postVisitNotes` or `req.body.notes` | String (clinical text) |
| `prescription` | Doctor's `req.body.prescription` | String |

Both are concatenated before being sent to the model:
```javascript
const combinedInput = `
${visitNotes}

Prescription:
${prescription}
`;
```

### Prompt Template

```
Convert these clinical notes into a patient-friendly summary.

Return ONLY valid JSON.

{
  "summary":"",
  "medicationSchedule":"",
  "followUpSteps":""
}

Notes:
${notes}
```

Where `notes` = combined `postVisitNotes + prescription` string.

### Expected Output Format

```json
{
  "summary": "You visited Dr. Priya for chest pain. Your ECG was normal. The doctor believes your symptoms are due to stress and mild acid reflux. You have been prescribed medication to manage this.",
  "medicationSchedule": "Take Isosorbide Mononitrate 10mg once daily in the morning. Take Pantoprazole 40mg before breakfast.",
  "followUpSteps": "Return for a follow-up in 2 weeks. If chest pain recurs or worsens, visit the emergency department immediately. Avoid caffeine and spicy foods."
}
```

### Field Descriptions

| Field | Description |
|---|---|
| `summary` | A friendly, jargon-free explanation of the diagnosis and visit outcome |
| `medicationSchedule` | Clear instructions on when and how to take each prescribed medication |
| `followUpSteps` | What the patient should do next — follow-up visits, lifestyle changes, emergency signs |

### Storage

Stored as an embedded sub-document in the `Appointment` collection:
```javascript
appointment.aiPostVisitSummary = {
  summary: "...",
  medicationSchedule: "...",
  followUpSteps: "..."
}
```

The appointment `status` is simultaneously updated to `"COMPLETED"`.

### Failure Handling

On any failure (API error, JSON parse error), the function returns a graceful fallback:

```json
{
  "summary": "Summary unavailable",
  "medicationSchedule": "",
  "followUpSteps": ""
}
```

The appointment is still marked `COMPLETED` and notes/prescription are still saved. Only the AI-generated portion falls back.

---

## 3. Medication Reminder (Email)

### Purpose

This is not a Gemini AI prompt — it is a **dynamically generated HTML email** constructed inline in the cron job (`reminder.job.js`). It runs every 2 hours via `node-cron` and sends personalized medication reminder emails to patients with pending reminders.

### Inputs

| Input | Source | Type |
|---|---|---|
| `patientName` | Populated `MedicationReminder.patient.name` | String |
| `medications` | Array of `{medicineName, frequency}` per patient | Array |

### Email Template (Inline HTML)

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
  <div style="background-color: #0284c7; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h2 style="margin: 0;">Medication Reminder</h2>
  </div>
  <div style="padding: 20px;">
    <p>Hello ${patientName},</p>
    <p>It's time to take your medication:</p>
    <ul>
      <li><strong>${medicineName}</strong> - Take ${frequency} a day</li>
      <!-- one item per medication -->
    </ul>
    <p style="margin-top:20px; color: #4b5563;">Stay healthy,<br/>MediFlow Care Team</p>
  </div>
</div>
```

### Expected Output (Email)

Subject: `Your Medication Reminder 💊`

Body: Personalized HTML listing all due medications for that patient, grouped by email address.

### Reminder Scheduling Logic

| Frequency | Next Reminder After Trigger |
|---|---|
| `once` | Next day at 8:00 AM IST (02:30 UTC) |
| `twice` | If AM: same day 8:00 PM IST (14:30 UTC); if PM: next day 8:00 AM IST |
| `thrice` | Cycles through 8 AM → 2 PM → 8 PM IST, then next day |

### Failure Handling

The cron job wraps all operations in a try/catch:
```javascript
} catch (error) {
  console.error("Cron Job Error:", error);
}
```

If email sending fails for one patient, the error is logged and the job continues for remaining patients. `nextReminderTime` is updated before email is sent (safe pattern — avoids re-sending on retry).

---

## Model Configuration

All AI prompts use the same Gemini model instance:

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
```

**Model**: `gemini-2.5-flash` — optimized for fast, structured JSON responses.

---

## Prompt Engineering Notes

1. **JSON-only instruction**: Both prompts explicitly say `"Return ONLY valid JSON"` to prevent model responses that include explanatory text alongside JSON.
2. **Schema in prompt**: The JSON structure is embedded directly in the prompt to guide the model's output format precisely.
3. **Code fence stripping**: Post-processing removes ` ```json ` and ` ``` ` wrappers that Gemini sometimes adds even when instructed not to.
4. **No system prompt used**: Both prompts are single-turn user prompts — no system message is configured. Adding a system prompt with role context (`"You are a clinical assistant..."`) could improve output quality in future iterations.
5. **Temperature**: Default model temperature is used (not explicitly set). Setting `temperature: 0` would produce more deterministic, reproducible JSON output.
