import { StateGraph, END, START } from "@langchain/langgraph";
import { type GraphState, createInitialState } from "./graph-state";
import { researchNode } from "./nodes/research-node";
import { financialNode } from "./nodes/financial-node";
import { riskNode } from "./nodes/risk-node";
import { decisionNode } from "./nodes/decision-node";

// ── State Annotation ─────────────────────────────────────────────────────────
// LangGraph requires an annotation that tells it how to merge partial updates.
// We use a simple "last-write-wins" reducer for every key by defining the
// annotation inline.

import { Annotation } from "@langchain/langgraph";
import type { AgentResult as ResearchAgentResult } from "../types/research";
import type { FinancialAgentResult } from "../types/financial";
import type { RiskAgentResult } from "../types/risk";
import type { DecisionAgentResult } from "../types/decision";
import type { ExecutionLogEntry, ExecutionStep, WorkflowStatus } from "./graph-state";

const GraphAnnotation = Annotation.Root({
  companyName: Annotation<string>(),
  currentStep: Annotation<ExecutionStep>(),
  workflowStatus: Annotation<WorkflowStatus>(),
  errorMessage: Annotation<string | null>(),
  workflowStartTime: Annotation<string | null>(),
  workflowCompletionTime: Annotation<string | null>(),
  executionLog: Annotation<ExecutionLogEntry[]>(),
  researchResult: Annotation<ResearchAgentResult | null>(),
  financialResult: Annotation<FinancialAgentResult | null>(),
  riskResult: Annotation<RiskAgentResult | null>(),
  decisionResult: Annotation<DecisionAgentResult | null>(),
});

// ── Conditional Edge: Stop if Any Node Fails ─────────────────────────────────

function shouldContinue(state: typeof GraphAnnotation.State): string {
  if (state.workflowStatus === "failed") {
    return END;
  }
  return "continue";
}

// ── Graph Definition ─────────────────────────────────────────────────────────

const graph = new StateGraph(GraphAnnotation)
  .addNode("research", researchNode)
  .addNode("financial", financialNode)
  .addNode("risk", riskNode)
  .addNode("decision", decisionNode)

  .addEdge(START, "research")

  .addConditionalEdges("research", shouldContinue, {
    continue: "financial",
    [END]: END,
  })
  .addConditionalEdges("financial", shouldContinue, {
    continue: "risk",
    [END]: END,
  })
  .addConditionalEdges("risk", shouldContinue, {
    continue: "decision",
    [END]: END,
  })
  .addEdge("decision", END)

  .compile();

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Executes the complete AI Investment Research workflow.
 *
 * The workflow runs all four agents in sequence:
 *   Research → Financial → Risk → Decision
 *
 * If any node fails, execution stops immediately and the workflow status is
 * set to "failed". The error is recorded in the graph state.
 *
 * @param companyName - The company to analyze.
 * @returns The final GraphState after workflow completion.
 */
export async function runWorkflow(companyName: string): Promise<GraphState> {
  const startTime = new Date().toISOString();
  const initialState: GraphState = {
    ...createInitialState(companyName),
    workflowStatus: "running",
    workflowStartTime: startTime,
    currentStep: "research",
  };

  const finalState = await graph.invoke(initialState);
  return finalState as GraphState;
}
