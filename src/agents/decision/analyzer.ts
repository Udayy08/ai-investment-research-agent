import { getStructuredModel } from "../../services/ai-provider";
import { DecisionReportDataSchema, type DecisionReportData } from "../../types/decision";
import type { ResearchReport } from "../../types/research";
import type { FinancialReport } from "../../types/financial";
import type { RiskReport } from "../../types/risk";

const SYSTEM_INSTRUCTION = `You are an expert Chief Investment Officer (CIO) AI.
Your sole responsibility is to evaluate an investment opportunity and issue a final recommendation based EXCLUSIVELY on the provided Research, Financial, and Risk Reports.

CRITICAL RULES:
1. NEVER introduce information, facts, or data that are not present in the supplied reports.
2. Do not average scores mechanically.
3. Perform holistic reasoning across all three reports.
4. A stronger Financial Report does not automatically outweigh severe risks.
5. Likewise, moderate risks do not automatically prevent an investment recommendation.
6. Generate balanced analytical reasoning based on all available evidence.
7. Resolve conflicting findings where appropriate by explaining the trade-off.
8. If evidence is insufficient, explicitly state that instead of making assumptions.
9. The researchContribution, financialContribution, and riskContribution percentages MUST sum to exactly 100.
10. Ensure originReport matches exactly 'Research Report', 'Financial Report', or 'Risk Report'.
11. Ensure the final recommendation matches exactly 'Strong Invest', 'Invest', 'Hold', 'Pass', or 'Strong Pass'.

Analyze all inputs and return the final structured Decision Report payload.
`;

export async function analyzeDecision(
  researchReport: ResearchReport,
  financialReport: FinancialReport,
  riskReport: RiskReport
): Promise<DecisionReportData> {
  const structuredModel = getStructuredModel(DecisionReportDataSchema);

  const userPrompt = `Please generate a structured Decision Report based on the following reports for ${researchReport.metadata.company}:

--- RESEARCH REPORT ---
${JSON.stringify(researchReport, null, 2)}
-----------------------

--- FINANCIAL REPORT ---
${JSON.stringify(financialReport, null, 2)}
------------------------

--- RISK REPORT ---
${JSON.stringify(riskReport, null, 2)}
-------------------

Synthesize all data, populate all fields according to the schema, and issue the final recommendation.
`;

  const response = await structuredModel.invoke([
    { role: "system", content: SYSTEM_INSTRUCTION },
    { role: "user", content: userPrompt }
  ]);

  return response;
}
