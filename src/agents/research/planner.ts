import { RESEARCH_TOPICS } from "../../constants/research-topics";
import type { PlannerInput, ResearchPlan } from "../../types/research";

/**
 * Validates and normalises the company name from the planner input.
 * Throws a descriptive error if the name is empty or whitespace-only.
 */
function validateCompanyName(companyName: string): string {
  const trimmed = companyName.trim();

  if (trimmed.length === 0) {
    throw new Error(
      "Invalid input: company name must not be empty or contain only whitespace."
    );
  }

  return trimmed;
}

/**
 * Creates a structured research plan for the given company.
 *
 * The planner determines *what* information must be collected.
 * It does not generate search queries, call any external services,
 * or perform any AI reasoning.
 */
export function createResearchPlan(input: PlannerInput): ResearchPlan {
  const company = validateCompanyName(input.companyName);

  return {
    company,
    researchTopics: RESEARCH_TOPICS,
  };
}
