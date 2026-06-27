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
