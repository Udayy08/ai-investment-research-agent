import { analyzeRisks } from "./analyzer";
import type { ResearchReport } from "../../types/research";
import type { FinancialReport } from "../../types/financial";
import type { RiskAgentResult, RiskReport } from "../../types/risk";

/**
 * Runs the Risk Agent pipeline.
 *
 * It consumes the completed ResearchReport and FinancialReport, validates they belong to the same company,
 * delegates the analysis to the LangChain analyzer, and assembles the final RiskReport v1.0 with metadata.
 *
 * If the process fails or validation fails, it returns a descriptive error in the RiskAgentResult envelope.
 */
export async function runRiskAgent(researchReport: ResearchReport, financialReport: FinancialReport): Promise<RiskAgentResult> {
  try {
    if (!researchReport?.metadata?.company || !financialReport?.metadata?.company) {
      throw new Error("Invalid input: Both ResearchReport and FinancialReport must contain valid company metadata.");
    }

    if (researchReport.metadata.company !== financialReport.metadata.company) {
      throw new Error("Validation Error: The supplied Research Report and Financial Report belong to different companies.");
    }

    if (researchReport.metadata.status !== "completed" || financialReport.metadata.status !== "completed") {
      throw new Error("Invalid input: Both reports must have a 'completed' status before risk analysis.");
    }

    // ── Step 1: Analyze ─────────────────────────────────────────────────────────
    const analysisData = await analyzeRisks(researchReport, financialReport);

    // ── Step 2: Assemble Report ────────────────────────────────────────────────
    const riskReport: RiskReport = {
      ...analysisData,
      metadata: {
        company: researchReport.metadata.company,
        generatedAt: new Date().toISOString(),
        riskVersion: "1.0",
        researchVersion: researchReport.metadata.researchVersion,
        financialVersion: financialReport.metadata.financialVersion,
        overallConfidence: analysisData.confidence,
        status: "completed",
      },
    };

    return {
      status: "completed",
      riskReport,
    };
  } catch (error: unknown) {
    return {
      status: "failed",
      riskReport: null,
      error: `Risk Agent failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
