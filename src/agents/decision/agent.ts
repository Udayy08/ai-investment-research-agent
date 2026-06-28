import { analyzeDecision } from "./analyzer";
import type { ResearchReport } from "../../types/research";
import type { FinancialReport } from "../../types/financial";
import type { RiskReport } from "../../types/risk";
import type { DecisionAgentResult, DecisionReport } from "../../types/decision";

/**
 * Runs the Decision Agent pipeline.
 *
 * It consumes the completed ResearchReport, FinancialReport, and RiskReport,
 * validates they all belong to the same company, delegates the reasoning to the 
 * LangChain analyzer, normalizes the contribution math, and assembles the final 
 * DecisionReport v1.0 with metadata.
 *
 * If the process fails or validation fails, it returns a descriptive error.
 */
export async function runDecisionAgent(
  researchReport: ResearchReport,
  financialReport: FinancialReport,
  riskReport: RiskReport
): Promise<DecisionAgentResult> {
  try {
    const company = researchReport?.metadata?.company;
    if (!company || !financialReport?.metadata?.company || !riskReport?.metadata?.company) {
      throw new Error("Invalid input: All reports must contain valid company metadata.");
    }

    if (
      financialReport.metadata.company !== company ||
      riskReport.metadata.company !== company
    ) {
      throw new Error("Validation Error: The supplied reports belong to different companies.");
    }

    if (
      researchReport.metadata.status !== "completed" ||
      financialReport.metadata.status !== "completed" ||
      riskReport.metadata.status !== "completed"
    ) {
      throw new Error("Invalid input: All reports must have a 'completed' status before decision analysis.");
    }

    // ── Step 1: Analyze ─────────────────────────────────────────────────────────
    const analysisData = await analyzeDecision(researchReport, financialReport, riskReport);

    // ── Step 2: Normalize Contributions to exactly 100 ─────────────────────────
    let r = Math.max(0, analysisData.researchContribution);
    let f = Math.max(0, analysisData.financialContribution);
    let k = Math.max(0, analysisData.riskContribution);
    const sum = r + f + k;

    if (sum === 0) {
      // Fallback if LLM generated 0 for all
      r = 34; f = 33; k = 33;
    } else {
      r = Math.round((r / sum) * 100);
      f = Math.round((f / sum) * 100);
      k = 100 - r - f;
    }

    analysisData.researchContribution = r;
    analysisData.financialContribution = f;
    analysisData.riskContribution = k;

    // ── Step 3: Assemble Report ────────────────────────────────────────────────
    const decisionReport: DecisionReport = {
      ...analysisData,
      metadata: {
        company: company,
        generatedAt: new Date().toISOString(),
        decisionVersion: "1.0",
        researchVersion: researchReport.metadata.researchVersion,
        financialVersion: financialReport.metadata.financialVersion,
        riskVersion: riskReport.metadata.riskVersion,
        overallConfidence: analysisData.confidence,
        status: "completed",
      },
    };

    return {
      status: "completed",
      decisionReport,
    };
  } catch (error: unknown) {
    return {
      status: "failed",
      decisionReport: null,
      error: `Decision Agent failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
