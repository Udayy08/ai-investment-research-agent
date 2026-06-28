import { performSearch } from "../../services/tavily";
import type {
  ResearchPlan,
  ResearchTopic,
  SearchEvidence,
  SearchReport,
  TopicSearchResult,
} from "../../types/research";

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Builds a deterministic search query for a given topic and company.
 */
function buildQuery(company: string, topic: ResearchTopic): string {
  return topic.queryTemplate.replace("{company}", company);
}

/**
 * Executes a Tavily search for a single topic and returns a TopicSearchResult.
 * Returns an empty results array if the search yields nothing.
 */
async function searchTopic(
  company: string,
  topic: ResearchTopic
): Promise<TopicSearchResult> {
  const query = buildQuery(company, topic);

  const raw = await performSearch(query, { maxResults: 5 });

  // Map the Tavily-normalised SearchResult → SearchEvidence (rename content→snippet)
  const results: SearchEvidence[] = raw.map((r) => ({
    title: r.title,
    url: r.url,
    snippet: r.content,
  }));

  return { topic: topic.title, query, results };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Executes web searches for every topic in the given ResearchPlan.
 *
 * For each topic the executor:
 *  1. Builds a deterministic search query.
 *  2. Calls the shared Tavily service.
 *  3. Normalises the results into SearchEvidence records.
 *
 * Topics are searched sequentially to avoid rate-limiting issues.
 * No summarisation or analysis is performed.
 */
export async function executeSearch(plan: ResearchPlan): Promise<SearchReport> {
  const searchResults: TopicSearchResult[] = [];

  for (const topic of plan.researchTopics) {
    const result = await searchTopic(plan.company, topic);
    searchResults.push(result);
  }

  return {
    company: plan.company,
    searchResults,
  };
}
