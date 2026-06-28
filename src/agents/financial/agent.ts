import { analyzeFinancials } from "./analyzer";
import type { ResearchReport } from "../../types/research";
import type { FinancialAgentResult, FinancialReport } from "../../types/financial";

/**
 * Runs the Financial Agent pipeline for the given Research Report.
 *
 * It consumes the completed ResearchReport, delegates the analysis to the LangChain analyzer,
 * and assembles the final FinancialReport v1.0 with metadata.
 *
 * If the process fails, it returns a descriptive error in the FinancialAgentResult envelope.
 */
export async function runFinancialAgent(researchReport: ResearchReport): Promise<FinancialAgentResult> {
  try {
    if (!researchReport || !researchReport.metadata || !researchReport.metadata.company) {
      throw new Error("Invalid input: ResearchReport must contain valid company metadata.");
    }

    if (researchReport.metadata.status !== "completed") {
      throw new Error("Invalid input: ResearchReport status must be 'completed' before financial analysis.");
    }

    // ── Step 1: Analyze ─────────────────────────────────────────────────────────
    const analysisData = await analyzeFinancials(researchReport);

    // ── Step 2: Assemble Report ────────────────────────────────────────────────
    const financialReport: FinancialReport = {
      ...analysisData,
      metadata: {
        company: researchReport.metadata.company,
        generatedAt: new Date().toISOString(),
        financialVersion: "1.0",
        researchVersion: researchReport.metadata.researchVersion,
        overallConfidence: analysisData.confidence,
        status: "completed",
      },
    };

    return {
      status: "completed",
      financialReport,
    };
  } catch (error: unknown) {
    return {
      status: "failed",
      financialReport: null,
      error: `Financial Agent failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
