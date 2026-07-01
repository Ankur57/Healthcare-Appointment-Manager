export const generatePostVisitSummary =
async (notes) => {
  try {

    const prompt = `
Convert these notes into a patient-friendly summary.

Return ONLY JSON:

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

    return JSON.parse(response);

  } catch (error) {

    return {
      summary:
        "Summary unavailable",
      medicationSchedule: "",
      followUpSteps: ""
    };
  }
};