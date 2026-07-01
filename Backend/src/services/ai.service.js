import dotenv from "dotenv";
dotenv.config();

import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

const model =
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

export const generatePreVisitSummary = async (symptoms) => {
  try {
    const prompt = `
Analyse these symptoms and return ONLY valid JSON.

{
  "urgencyLevel": "",
  "chiefComplaint": "",
  "suggestedQuestions": []
}

Symptoms:
${symptoms}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const cleanedResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.log(error);

    return {
      urgencyLevel: "Unknown",
      chiefComplaint: "AI Summary unavailable",
      suggestedQuestions: [],
    };
  }
};

export const generatePostVisitSummary =
  async (notes) => {
    try {
      const prompt = `
Convert these clinical notes into a patient-friendly summary.

Return ONLY valid JSON.

{
  "summary":"",
  "medicationSchedule":"",
  "followUpSteps":""
}

Notes:
${notes}
`;

      const result =
        await model.generateContent(
          prompt
        );

      const response =
        result.response.text();

      const cleaned =
        response
          .replace(
            /```json/g,
            ""
          )
          .replace(
            /```/g,
            ""
          )
          .trim();

      return JSON.parse(cleaned);
    } catch (error) {
      console.log(error);

      return {
        summary:
          "Summary unavailable",
        medicationSchedule: "",
        followUpSteps: "",
      };
    }
  };