import { performSearch } from "../../services/tavily";
import type {
  ResearchPlan,
  ResearchTopic,
  SearchEvidence,
  SearchReport,
  TopicSearchResult,
} from "../../types/research";

// ─── Query Templates ──────────────────────────────────────────────────────────
//
// Maps each topic id to a suffix that is appended to the company name to form
// a deterministic search query.  Adding a new topic only requires a new entry
// here — no other code changes are needed.

const QUERY_TEMPLATES: Record<string, string> = {
  company_overview: "company overview",
  industry: "industry and sector",
  business_model: "business model revenue streams",
  leadership: "leadership CEO executive team",
  competitors: "competitors and rival companies",
  recent_news: "latest news",
  market_sentiment: "investor market sentiment",
  key_strengths: "competitive advantages key strengths",
  key_challenges: "business challenges risks",
};

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Builds a deterministic search query for a given topic and company.
 * Falls back to a generic pattern if the topic id is not in the template map.
 */
function buildQuery(company: string, topic: ResearchTopic): string {
  const suffix = QUERY_TEMPLATES[topic.id] ?? topic.title.toLowerCase();
  return `${company} ${suffix}`;
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
