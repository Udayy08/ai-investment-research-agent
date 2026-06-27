/**
 * Shared TypeScript interfaces for the Research Agent pipeline.
 */

/**
 * A single research topic that the planner includes in a research plan.
 */
export interface ResearchTopic {
  /** A unique machine-readable identifier for the topic. */
  id: string;
  /** A human-readable title for the topic. */
  title: string;
  /** Determines the order in which topics are researched. Lower means higher priority. */
  priority: number;
}

/**
 * The structured output produced by the Research Planner.
 * Describes what information must be collected for a specific company.
 */
export interface ResearchPlan {
  /** The validated and trimmed company name. */
  company: string;
  /** Ordered list of topics to be researched. */
  researchTopics: ResearchTopic[];
}

/**
 * The input accepted by the Research Planner.
 */
export interface PlannerInput {
  /** The name of the company to research. */
  companyName: string;
}

// ─── Phase 4.2 – Search Executor ─────────────────────────────────────────────

/**
 * A single piece of evidence returned by a web search.
 * The snippet field maps to the content/snippet returned by Tavily.
 */
export interface SearchEvidence {
  title: string;
  url: string;
  snippet: string;
}

/**
 * The search results collected for one research topic.
 */
export interface TopicSearchResult {
  /** The topic title (e.g. "Leadership"). */
  topic: string;
  /** The deterministic query that was executed. */
  query: string;
  /** Evidence collected from the web search. */
  results: SearchEvidence[];
}

/**
 * The structured output produced by the Search Executor.
 * Consumed by the Research Summarizer in Phase 4.3.
 */
export interface SearchReport {
  /** The validated company name (passed through from the ResearchPlan). */
  company: string;
  /** One entry per research topic in the original ResearchPlan. */
  searchResults: TopicSearchResult[];
}

// ─── Phase 4.3 – Research Summarizer ─────────────────────────────────────────

/**
 * A single citation preserved from the original web evidence.
 * Every summarized section must link back to at least one source.
 */
export interface ReportSource {
  /** The research section this source supports (e.g. "Leadership"). */
  section: string;
  title: string;
  url: string;
  snippet: string;
}

/**
 * The fully structured Research Report produced by the Summarizer.
 * This is the shared data contract consumed by every downstream agent
 * (Financial, Risk, Decision) in the pipeline.
 */
export interface ResearchReport {
  company: string;
  companyOverview: string;
  industry: string;
  businessModel: string;
  leadership: string;
  competitors: string[];
  recentNews: string[];
  marketSentiment: string;
  keyStrengths: string[];
  keyChallenges: string[];
  /** All citations collected across every summarized section. */
  sources: ReportSource[];
}
