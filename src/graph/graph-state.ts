import type { AgentResult as ResearchAgentResult } from "../types/research";
import type { FinancialAgentResult } from "../types/financial";
import type { RiskAgentResult } from "../types/risk";
import type { DecisionAgentResult } from "../types/decision";

// ── Execution Log ─────────────────────────────────────────────────────────────

export interface ExecutionLogEntry {
  nodeName: string;
  status: "pending" | "running" | "completed" | "failed";
  startTime: string;
  endTime: string | null;
  durationMs: number | null;
}

// ── Workflow Status ───────────────────────────────────────────────────────────

export type WorkflowStatus = "pending" | "running" | "completed" | "failed";

export type ExecutionStep =
  | "idle"
  | "research"
  | "financial"
  | "risk"
  | "decision"
  | "done";

// ── Graph State ───────────────────────────────────────────────────────────────

/**
 * The shared state object passed between every node in the LangGraph workflow.
 *
 * Each node reads from this object and returns a partial update.
 * The LangGraph runtime merges the update back into the state automatically.
 */
export interface GraphState {
  /** The company being analyzed. Set at workflow start. */
  companyName: string;

  /** The current node being executed. */
  currentStep: ExecutionStep;

  /** The overall workflow status. */
  workflowStatus: WorkflowStatus;

  /** The error message if any node fails. */
  errorMessage: string | null;

  /** ISO timestamp when the workflow started. */
  workflowStartTime: string | null;

  /** ISO timestamp when the workflow completed (success or failure). */
  workflowCompletionTime: string | null;

  /** Ordered log of all node executions. */
  executionLog: ExecutionLogEntry[];

  /** Output of the Research Agent node. */
  researchResult: ResearchAgentResult | null;

  /** Output of the Financial Agent node. */
  financialResult: FinancialAgentResult | null;

  /** Output of the Risk Agent node. */
  riskResult: RiskAgentResult | null;

  /** Output of the Decision Agent node. */
  decisionResult: DecisionAgentResult | null;
}

/**
 * Returns a fresh, default GraphState for a given company name.
 */
export function createInitialState(companyName: string): GraphState {
  return {
    companyName,
    currentStep: "idle",
    workflowStatus: "pending",
    errorMessage: null,
    workflowStartTime: null,
    workflowCompletionTime: null,
    executionLog: [],
    researchResult: null,
    financialResult: null,
    riskResult: null,
    decisionResult: null,
  };
}
