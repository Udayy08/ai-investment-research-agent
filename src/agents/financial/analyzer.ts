import { getStructuredModel } from "../../services/ai-provider";
import { FinancialReportDataSchema, type FinancialReportData } from "../../types/financial";
import type { ResearchReport } from "../../types/research";

const SYSTEM_INSTRUCTION = `You are an expert Financial Analyst AI.
Your sole responsibility is to evaluate a company's financial standing and future outlook based EXCLUSIVELY on the provided Research Report.

CRITICAL RULES:
1. NEVER introduce information, facts, or data that are not present in the supplied Research Report.
2. Every conclusion must be supported by findings contained within the Research Report.
3. If evidence is insufficient for any section, state that explicitly (e.g., "Insufficient evidence available.") instead of making assumptions, and set the status to "not_available".
4. Do NOT generate investment recommendations (buy/sell/hold).
5. Extract explicit evidence items mapped to the specific section of the Research Report they came from.

Perform a structured evaluation covering:
- Executive Summary
- Business Quality
- Market Position
- Competitive Advantage
- Growth Potential
- Innovation
- Operational Strength
- Financial Health
- Key Strengths
- Key Weaknesses
- Overall Financial Score (0-100)
- Confidence Score (0-100)
`;

export async function analyzeFinancials(researchReport: ResearchReport): Promise<FinancialReportData> {
  // Create the structured output model
  const structuredModel = getStructuredModel(FinancialReportDataSchema);

  // Build the user prompt with the serialized Research Report
  const userPrompt = `Please generate a structured Financial Report based on the following Research Report for ${researchReport.metadata.company}:

--- RESEARCH REPORT ---
${JSON.stringify(researchReport, null, 2)}
-----------------------

Analyze the data and populate all fields according to the schema. Ensure all categorical values match the predefined enums exactly (e.g., "High", "Medium", "Low").
`;

  // Execute the analysis
  const response = await structuredModel.invoke([
    { role: "system", content: SYSTEM_INSTRUCTION },
    { role: "user", content: userPrompt }
  ]);

  return response;
}
