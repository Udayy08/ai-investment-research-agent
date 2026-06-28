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
    queryTemplate: "{company} company overview",
    reportField: "companyOverview",
    resultType: "summary",
  },
  {
    id: "industry",
    title: "Industry",
    priority: 2,
    queryTemplate: "{company} industry and sector",
    reportField: "industry",
    resultType: "summary",
  },
  {
    id: "business_model",
    title: "Business Model",
    priority: 3,
    queryTemplate: "{company} business model revenue streams",
    reportField: "businessModel",
    resultType: "summary",
  },
  {
    id: "leadership",
    title: "Leadership",
    priority: 4,
    queryTemplate: "{company} leadership CEO executive team",
    reportField: "leadership",
    resultType: "summary",
  },
  {
    id: "competitors",
    title: "Competitors",
    priority: 5,
    queryTemplate: "{company} competitors and rival companies",
    reportField: "competitors",
    resultType: "competitors",
  },
  {
    id: "recent_news",
    title: "Recent News",
    priority: 6,
    queryTemplate: "{company} latest news",
    reportField: "recentNews",
    resultType: "news",
  },
  {
    id: "market_sentiment",
    title: "Market Sentiment",
    priority: 7,
    queryTemplate: "{company} investor market sentiment",
    reportField: "marketSentiment",
    resultType: "summary",
  },
  {
    id: "key_strengths",
    title: "Key Strengths",
    priority: 8,
    queryTemplate: "{company} competitive advantages key strengths",
    reportField: "keyStrengths",
    resultType: "strengths",
  },
  {
    id: "key_challenges",
    title: "Key Challenges",
    priority: 9,
    queryTemplate: "{company} business challenges risks",
    reportField: "keyChallenges",
    resultType: "challenges",
  },
];
