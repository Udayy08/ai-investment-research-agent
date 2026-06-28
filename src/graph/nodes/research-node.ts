import type { GraphState, ExecutionLogEntry } from "../graph-state";
import { runResearchAgent } from "../../agents/research/agent";

/**
 * Research Node — executes the Research Agent.
 *
 * Reads: companyName
 * Updates: researchResult, currentStep, executionLog, (errorMessage, workflowStatus on failure)
 */
export async function researchNode(state: GraphState): Promise<Partial<GraphState>> {
  const startTime = new Date().toISOString();
  const logEntry: ExecutionLogEntry = {
    nodeName: "Research Agent",
    status: "running",
    startTime,
    endTime: null,
    durationMs: null,
  };

  try {
    const result = await runResearchAgent(state.companyName);
    const endTime = new Date().toISOString();

    const completedEntry: ExecutionLogEntry = {
      ...logEntry,
      status: result.status === "completed" ? "completed" : "failed",
      endTime,
      durationMs: new Date(endTime).getTime() - new Date(startTime).getTime(),
    };

    if (result.status === "failed") {
      return {
        researchResult: result,
        currentStep: "research",
        workflowStatus: "failed",
        errorMessage: result.error ?? "Research Agent failed with an unknown error.",
        executionLog: [...state.executionLog, completedEntry],
      };
    }

    return {
      researchResult: result,
      currentStep: "research",
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
    const message = `Research Node threw an unexpected error: ${error instanceof Error ? error.message : String(error)}`;
    return {
      currentStep: "research",
      workflowStatus: "failed",
      errorMessage: message,
      executionLog: [...state.executionLog, failedEntry],
    };
  }
}
