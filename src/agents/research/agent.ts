import { createResearchPlan } from "./planner";
import { executeSearch } from "./search";
import { summarizeResearch } from "./summarizer";
import type { AgentResult, ResearchReport, ReportSource } from "../../types/research";

/**
 * Runs the complete research pipeline for the given company name.
 *
 * Execution order:
 *  1. Research Planner   → ResearchPlan
 *  2. Search Executor    → SearchReport
 *  3. Research Summarizer → Omit<ResearchReport, "metadata">
 *  4. Orchestrator       → Assembles final ResearchReport (v2.0) with metadata
 *
 * Each step is guarded independently. If any step fails, the orchestrator
 * stops immediately and returns a descriptive error in the AgentResult envelope.
 * No financial analysis or investment recommendations are performed here.
 */
export async function runResearchAgent(companyName: string): Promise<AgentResult> {
  // ── Step 1: Plan ──────────────────────────────────────────────────────────
  let plan;
  try {
    plan = createResearchPlan({ companyName });
  } catch (error: unknown) {
    return {
      company: companyName,
      status: "failed",
      researchReport: null,
      error: `Planning failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  // ── Step 2: Search ────────────────────────────────────────────────────────
  let searchReport;
  try {
    searchReport = await executeSearch(plan);
  } catch (error: unknown) {
    return {
      company: plan.company,
      status: "failed",
      researchReport: null,
      error: `Search failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  // ── Step 3: Summarize ─────────────────────────────────────────────────────
  let partialReport;
  try {
    partialReport = await summarizeResearch(searchReport);
  } catch (error: unknown) {
    return {
      company: plan.company,
      status: "failed",
      researchReport: null,
      error: `Summarization failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  // ── Step 4: Metadata Assembly ─────────────────────────────────────────────
  const sections = Object.values(partialReport) as { confidence: number; sources: ReportSource[] }[];
  const totalConfidence = sections.reduce((sum, sec) => sum + (sec.confidence || 0), 0);
  const averageConfidence = sections.length > 0 ? Math.round(totalConfidence / sections.length) : 0;
  
  const allSources = new Set<string>();
  for (const sec of sections) {
    if (sec.sources) {
      sec.sources.forEach(s => allSources.add(s.url));
    }
  }

  const researchReport: ResearchReport = {
    ...partialReport,
    metadata: {
      company: plan.company,
      generatedAt: new Date().toISOString(),
      researchVersion: "2.0",
      overallConfidence: averageConfidence,
      totalSources: allSources.size,
      status: "completed",
    },
  };

  return {
    company: plan.company,
    status: "completed",
    researchReport,
  };
}
