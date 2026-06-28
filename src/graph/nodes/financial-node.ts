import type { GraphState, ExecutionLogEntry } from "../graph-state";
import { runFinancialAgent } from "../../agents/financial/agent";
import type { ResearchReport } from "../../types/research";

/**
 * Financial Node — executes the Financial Agent.
 *
 * Reads: researchResult
 * Updates: financialResult, currentStep, executionLog, (errorMessage, workflowStatus on failure)
 */
export async function financialNode(state: GraphState): Promise<Partial<GraphState>> {
  const startTime = new Date().toISOString();
  const logEntry: ExecutionLogEntry = {
    nodeName: "Financial Agent",
    status: "running",
    startTime,
    endTime: null,
    durationMs: null,
  };

  try {
    if (!state.researchResult?.researchReport) {
      throw new Error("Financial Node requires a completed ResearchReport in the graph state.");
    }

    const researchReport = state.researchResult.researchReport as ResearchReport;
    const result = await runFinancialAgent(researchReport);
    const endTime = new Date().toISOString();

    const completedEntry: ExecutionLogEntry = {
      ...logEntry,
      status: result.status === "completed" ? "completed" : "failed",
      endTime,
      durationMs: new Date(endTime).getTime() - new Date(startTime).getTime(),
    };

    if (result.status === "failed") {
      return {
        financialResult: result,
        currentStep: "financial",
        workflowStatus: "failed",
        errorMessage: result.error ?? "Financial Agent failed with an unknown error.",
        executionLog: [...state.executionLog, completedEntry],
      };
    }

    return {
      financialResult: result,
      currentStep: "financial",
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
    const message = `Financial Node threw an unexpected error: ${error instanceof Error ? error.message : String(error)}`;
    return {
      currentStep: "financial",
      workflowStatus: "failed",
      errorMessage: message,
      executionLog: [...state.executionLog, failedEntry],
    };
  }
}
