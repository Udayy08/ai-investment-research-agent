import type { GraphState, ExecutionLogEntry } from "../graph-state";
import { runRiskAgent } from "../../agents/risk/agent";
import type { ResearchReport } from "../../types/research";
import type { FinancialReport } from "../../types/financial";

/**
 * Risk Node — executes the Risk Agent.
 *
 * Reads: researchResult, financialResult
 * Updates: riskResult, currentStep, executionLog, (errorMessage, workflowStatus on failure)
 */
export async function riskNode(state: GraphState): Promise<Partial<GraphState>> {
  const startTime = new Date().toISOString();
  const logEntry: ExecutionLogEntry = {
    nodeName: "Risk Agent",
    status: "running",
    startTime,
    endTime: null,
    durationMs: null,
  };

  try {
    if (!state.researchResult?.researchReport) {
      throw new Error("Risk Node requires a completed ResearchReport in the graph state.");
    }
    if (!state.financialResult?.financialReport) {
      throw new Error("Risk Node requires a completed FinancialReport in the graph state.");
    }

    const researchReport = state.researchResult.researchReport as ResearchReport;
    const financialReport = state.financialResult.financialReport as FinancialReport;

    const result = await runRiskAgent(researchReport, financialReport);
    const endTime = new Date().toISOString();

    const completedEntry: ExecutionLogEntry = {
      ...logEntry,
      status: result.status === "completed" ? "completed" : "failed",
      endTime,
      durationMs: new Date(endTime).getTime() - new Date(startTime).getTime(),
    };

    if (result.status === "failed") {
      return {
        riskResult: result,
        currentStep: "risk",
        workflowStatus: "failed",
        errorMessage: result.error ?? "Risk Agent failed with an unknown error.",
        executionLog: [...state.executionLog, completedEntry],
      };
    }

    return {
      riskResult: result,
      currentStep: "risk",
      executionLog: [...state.executionLog, completedEntry],
    };
  } catch (error: unknown) {
    const endTime = new Date().toISOString();
    const failedEntry: ExecutionLogEntry = {
      ...logEntry,
      status: "failed",
      endTime,
      durationMs: new Date(endTime).getTime() - new Date(startTime).getTime(),
    };
    const message = `Risk Node threw an unexpected error: ${error instanceof Error ? error.message : String(error)}`;
    return {
      currentStep: "risk",
      workflowStatus: "failed",
      errorMessage: message,
      executionLog: [...state.executionLog, failedEntry],
    };
  }
}
