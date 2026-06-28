import type { GraphState, ExecutionLogEntry } from "../graph-state";
import { runDecisionAgent } from "../../agents/decision/agent";
import type { ResearchReport } from "../../types/research";
import type { FinancialReport } from "../../types/financial";
import type { RiskReport } from "../../types/risk";

/**
 * Decision Node — executes the Decision Agent.
 *
 * Reads: researchResult, financialResult, riskResult
 * Updates: decisionResult, currentStep, workflowStatus, executionLog, workflowCompletionTime
 */
export async function decisionNode(state: GraphState): Promise<Partial<GraphState>> {
  const startTime = new Date().toISOString();
  const logEntry: ExecutionLogEntry = {
    nodeName: "Decision Agent",
    status: "running",
    startTime,
    endTime: null,
    durationMs: null,
  };

  try {
    if (!state.researchResult?.researchReport) {
      throw new Error("Decision Node requires a completed ResearchReport in the graph state.");
    }
    if (!state.financialResult?.financialReport) {
      throw new Error("Decision Node requires a completed FinancialReport in the graph state.");
    }
    if (!state.riskResult?.riskReport) {
      throw new Error("Decision Node requires a completed RiskReport in the graph state.");
    }

    const researchReport = state.researchResult.researchReport as ResearchReport;
    const financialReport = state.financialResult.financialReport as FinancialReport;
    const riskReport = state.riskResult.riskReport as RiskReport;

    const result = await runDecisionAgent(researchReport, financialReport, riskReport);
    const endTime = new Date().toISOString();

    const completedEntry: ExecutionLogEntry = {
      ...logEntry,
      status: result.status === "completed" ? "completed" : "failed",
      endTime,
      durationMs: new Date(endTime).getTime() - new Date(startTime).getTime(),
    };

    if (result.status === "failed") {
      return {
        decisionResult: result,
        currentStep: "decision",
        workflowStatus: "failed",
        errorMessage: result.error ?? "Decision Agent failed with an unknown error.",
        workflowCompletionTime: endTime,
        executionLog: [...state.executionLog, completedEntry],
      };
    }

    return {
      decisionResult: result,
      currentStep: "done",
      workflowStatus: "completed",
      workflowCompletionTime: endTime,
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
    const message = `Decision Node threw an unexpected error: ${error instanceof Error ? error.message : String(error)}`;
    return {
      currentStep: "decision",
      workflowStatus: "failed",
      errorMessage: message,
      workflowCompletionTime: endTime,
      executionLog: [...state.executionLog, failedEntry],
    };
  }
}
