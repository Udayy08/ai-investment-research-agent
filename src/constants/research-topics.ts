import type { ResearchTopic } from "../types/research";

/**
 * Predefined list of research topics collected for every company.
 *
 * These topics are intentionally fixed. Their order reflects research priority.
 * The Search Executor (Phase 4.2) will consume this list to generate search queries.
 */
export const RESEARCH_TOPICS: ResearchTopic[] = [
  {
    id: "company_overview",
    title: "Company Overview",
    priority: 1,
  },
  {
    id: "industry",
    title: "Industry",
    priority: 2,
  },
  {
    id: "business_model",
    title: "Business Model",
    priority: 3,
  },
  {
    id: "leadership",
    title: "Leadership",
    priority: 4,
  },
  {
    id: "competitors",
    title: "Competitors",
    priority: 5,
  },
  {
    id: "recent_news",
    title: "Recent News",
    priority: 6,
  },
  {
    id: "market_sentiment",
    title: "Market Sentiment",
    priority: 7,
  },
  {
    id: "key_strengths",
    title: "Key Strengths",
    priority: 8,
  },
  {
    id: "key_challenges",
    title: "Key Challenges",
    priority: 9,
  },
];
