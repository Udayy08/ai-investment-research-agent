import { generateText } from "../../services/gemini";
import type {
  ReportSource,
  ResearchReport,
  SearchEvidence,
  SearchReport,
  TopicSearchResult,
} from "../../types/research";

// ─── Prompt ───────────────────────────────────────────────────────────────────

const SYSTEM_INSTRUCTION = `You are a professional investment research analyst assistant.
Your job is to summarize web research evidence into concise, factual summaries.

Rules:
- Use ONLY the evidence provided. Do not add external knowledge or invented facts.
- Stay strictly factual and professional.
- Do not make investment recommendations.
- Do not perform financial analysis or valuation.
- If the evidence is insufficient, respond with exactly: "Insufficient evidence available."
- Keep your response concise (2–4 sentences maximum).`;

/**
 * Builds the summarization prompt for a single research topic.
 */
function buildPrompt(company: string, topic: string, evidence: SearchEvidence[]): string {
  if (evidence.length === 0) {
    return `No evidence was collected for the "${topic}" topic for ${company}.
Please respond with exactly: "Insufficient evidence available."`;
  }

  const evidenceText = evidence
    .map((e, i) => `[${i + 1}] ${e.title}\n${e.snippet}`)
    .join("\n\n");

  return `Summarize the following evidence about "${topic}" for ${company}.

Evidence:
${evidenceText}

Write a concise, factual 2–4 sentence summary based only on the evidence above.`;
}

// ─── Citation collection ──────────────────────────────────────────────────────

/**
 * Converts the raw SearchEvidence for a topic into ReportSource citations.
 */
function collectSources(section: string, evidence: SearchEvidence[]): ReportSource[] {
  return evidence.map((e) => ({
    section,
    title: e.title,
    url: e.url,
    snippet: e.snippet,
  }));
}

// ─── Topic → field mapping ────────────────────────────────────────────────────

/**
 * Maps a topic title to the matching ResearchReport field key.
 * Returns null for unrecognized topics so they can be skipped gracefully.
 */
function topicToField(topic: string): keyof Omit<ResearchReport, "company" | "sources"> | null {
  const map: Record<string, keyof Omit<ResearchReport, "company" | "sources">> = {
    "Company Overview": "companyOverview",
    "Industry": "industry",
    "Business Model": "businessModel",
    "Leadership": "leadership",
    "Competitors": "competitors",
    "Recent News": "recentNews",
    "Market Sentiment": "marketSentiment",
    "Key Strengths": "keyStrengths",
    "Key Challenges": "keyChallenges",
  };
  return map[topic] ?? null;
}

// ─── Array-valued field handling ──────────────────────────────────────────────

/** Fields that expect string arrays in the ResearchReport. */
const ARRAY_FIELDS = new Set<string>([
  "competitors",
  "recentNews",
  "keyStrengths",
  "keyChallenges",
]);

/**
 * For array-valued fields, splits the summary text into individual items.
 * Each non-empty line is treated as one list item.
 */
function parseArraySummary(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^[-•*\d.)\s]+/, "").trim())
    .filter((line) => line.length > 0);
}

// ─── Single-topic summarization ───────────────────────────────────────────────

/**
 * Summarizes one research topic and returns the summary text.
 * Uses the shared Gemini service with the reusable prompt template.
 */
async function summarizeTopic(
  company: string,
  topicResult: TopicSearchResult
): Promise<string> {
  const prompt = buildPrompt(company, topicResult.topic, topicResult.results);

  return generateText(prompt, {
    systemInstruction: SYSTEM_INSTRUCTION,
    temperature: 0.1,
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** Milliseconds to wait between Gemini calls to respect the free-tier rate limit. */
const GEMINI_DELAY_MS = 13_000;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Transforms a SearchReport into a structured ResearchReport.
 *
 * For each topic in the SearchReport the summarizer:
 *  1. Builds a focused prompt using only that topic's evidence.
 *  2. Calls the shared Gemini service.
 *  3. Maps the response to the correct ResearchReport field.
 *  4. Preserves all evidence as citations in `sources`.
 *
 * Topics are processed sequentially with a short delay between calls
 * to respect the Gemini free-tier rate limit (5 requests / minute).
 * No investment analysis or financial reasoning is performed.
 */
export async function summarizeResearch(searchReport: SearchReport): Promise<ResearchReport> {
  const report: ResearchReport = {
    company: searchReport.company,
    companyOverview: "",
    industry: "",
    businessModel: "",
    leadership: "",
    competitors: [],
    recentNews: [],
    marketSentiment: "",
    keyStrengths: [],
    keyChallenges: [],
    sources: [],
  };

  for (let i = 0; i < searchReport.searchResults.length; i++) {
    const topicResult = searchReport.searchResults[i];
    const field = topicToField(topicResult.topic);

    if (!field) {
      // Unknown topic — skip gracefully without breaking the pipeline
      continue;
    }

    // Pause before every call after the first to stay under 5 req/min
    if (i > 0) {
      await sleep(GEMINI_DELAY_MS);
    }

    const summary = await summarizeTopic(searchReport.company, topicResult);

    // Populate the correct field, handling array vs string types
    if (ARRAY_FIELDS.has(field)) {
      (report[field] as string[]) = parseArraySummary(summary);
    } else {
      (report[field] as string) = summary.trim();
    }

    // Preserve citations for every piece of evidence in this topic
    const sources = collectSources(topicResult.topic, topicResult.results);
    report.sources.push(...sources);
  }

  return report;
}
