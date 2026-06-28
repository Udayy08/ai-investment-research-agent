import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RiskReportDataSchema, type RiskReportData } from "../../types/risk";
import type { ResearchReport } from "../../types/research";
import type { FinancialReport } from "../../types/financial";

const SYSTEM_INSTRUCTION = `You are an expert Risk Analyst AI.
Your sole responsibility is to evaluate a company's risk profile based EXCLUSIVELY on the provided Research Report and Financial Report.

CRITICAL RULES:
1. NEVER introduce information, facts, or data that are not present in the supplied Research Report or Financial Report.
2. Every identified risk must be supported by evidence contained within the input reports.
3. If evidence is insufficient for any section, state that explicitly (e.g., "Insufficient evidence available.") instead of making assumptions, and set the status to "not_available".
4. Do NOT generate investment recommendations (buy/sell/hold).
5. Extract explicit evidence items mapped to the specific section of the origin report they came from.

ADDITIONAL CONSTRAINTS:
- Do not duplicate the same underlying risk across multiple categories.
- If a risk affects multiple categories, reference it appropriately without generating duplicate Risk Items.
- Maintain an objective and balanced analytical perspective.
- Do not exaggerate or minimize risks.
- For originReport, you MUST output exactly 'Research Report' or 'Financial Report'.
- For probability, impact, and severity, you MUST output exactly 'High', 'Medium', or 'Low'.
- For mitigationFeasibility, you MUST output exactly 'Easy', 'Moderate', or 'Difficult'.
- For status, you MUST output exactly 'completed', 'failed', or 'not_available'.
- For overallRiskLevel, you MUST output exactly 'Very Low', 'Low', 'Medium', 'High', or 'Very High'.

Perform a structured evaluation covering:
- Executive Summary (Overall Risk Level, Highest Priority Risks, Positive/Negative Factors, Overall Assessment)
- Competitive Risks
- Market Risks
- Operational Risks
- Technology Risks
- Regulatory Risks
- Leadership Risks
- Reputation Risks
- Financial Risks
- Overall Risk Score (0-100)
- Overall Risk Level (Very Low, Low, Medium, High, Very High)
- Confidence Score (0-100)
`;

export async function analyzeRisks(researchReport: ResearchReport, financialReport: FinancialReport): Promise<RiskReportData> {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.1,
    maxOutputTokens: 8192,
  });

  const structuredModel = model.withStructuredOutput(RiskReportDataSchema);

  const userPrompt = `Please generate a structured Risk Report based on the following reports for ${researchReport.metadata.company}:

--- RESEARCH REPORT ---
${JSON.stringify(researchReport, null, 2)}
-----------------------

--- FINANCIAL REPORT ---
${JSON.stringify(financialReport, null, 2)}
------------------------

Analyze the data from both reports and populate all fields according to the schema. 
Ensure all categorical values match the predefined enums exactly (e.g., "High", "Medium", "Low").
Never invent risks without supporting evidence from the provided reports.
`;

  const response = await structuredModel.invoke([
    { role: "system", content: SYSTEM_INSTRUCTION },
    { role: "user", content: userPrompt }
  ]);

  return response;
}
