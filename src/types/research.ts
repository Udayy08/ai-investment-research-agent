/**
 * Shared TypeScript interfaces for the Research Agent pipeline.
 */

// ─── Phase 4.1 – Research Planner ─────────────────────────────────────────────

export interface ResearchTopic {
  /** A unique machine-readable identifier for the topic. */
  id: string;
  /** A human-readable title for the topic. */
  title: string;
  /** Determines the order in which topics are researched. Lower means higher priority. */
  priority: number;
  /** The template used by the Search Executor to generate the query (e.g., "{company} competitors"). */
  queryTemplate: string;
  /** The field name in the ResearchReport this topic maps to. */
  reportField: keyof Omit<ResearchReport, "metadata">;
  /** The expected structured output type for this topic. */
  resultType: "summary" | "competitors" | "news" | "strengths" | "challenges";
}

export interface ResearchPlan {
  company: string;
  researchTopics: ResearchTopic[];
}

export interface PlannerInput {
  companyName: string;
}

// ─── Phase 4.2 – Search Executor ─────────────────────────────────────────────

export interface SearchEvidence {
  title: string;
  url: string;
  snippet: string;
}

export interface TopicSearchResult {
  topic: string;
  query: string;
  results: SearchEvidence[];
}

export interface SearchReport {
  company: string;
  searchResults: TopicSearchResult[];
}

// ─── Phase 4.3 & 4.4 – Research Report Contract v2.0 ─────────────────────────

export interface ReportSource {
  title: string;
  url: string;
  snippet: string;
}

export interface ReportMetadata {
  company: string;
  generatedAt: string;
  researchVersion: string;
  overallConfidence: number;
  totalSources: number;
  status: "completed" | "failed";
}

export type SectionStatus = "completed" | "failed" | "not_available";

export interface TextSection {
  summary: string;
  confidence: number;
  sourceCount: number;
  status: SectionStatus;
  sources: ReportSource[];
}

// Rich Structures

export interface Competitor {
  name: string;
  reason: string;
  sources: ReportSource[];
}

export interface CompetitorsSection {
  competitors: Competitor[];
  confidence: number;
  sourceCount: number;
  status: SectionStatus;
  sources: ReportSource[];
}

export interface RecentNews {
  headline: string;
  summary: string;
  date: string;
  sentiment: string;
  impact: string;
  sources: ReportSource[];
}

export interface NewsSection {
  news: RecentNews[];
  confidence: number;
  sourceCount: number;
  status: SectionStatus;
  sources: ReportSource[];
}

export interface KeyStrength {
  title: string;
  description: string;
  importance: string;
  sources: ReportSource[];
}

export interface StrengthsSection {
  strengths: KeyStrength[];
  confidence: number;
  sourceCount: number;
  status: SectionStatus;
  sources: ReportSource[];
}

export interface KeyChallenge {
  title: string;
  description: string;
  severity: string;
  sources: ReportSource[];
}

export interface ChallengesSection {
  challenges: KeyChallenge[];
  confidence: number;
  sourceCount: number;
  status: SectionStatus;
  sources: ReportSource[];
}

export interface ResearchReport {
  metadata: ReportMetadata;
  companyOverview: TextSection;
  industry: TextSection;
  businessModel: TextSection;
  leadership: TextSection;
  marketSentiment: TextSection;
  competitors: CompetitorsSection;
  recentNews: NewsSection;
  keyStrengths: StrengthsSection;
  keyChallenges: ChallengesSection;
}

export interface AgentResult {
  company: string;
  status: "completed" | "failed";
  researchReport: ResearchReport | null;
  error?: string;
}


