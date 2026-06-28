import { generateText } from "../../services/ai-provider";
import { Schema, SchemaType } from "@google/generative-ai";
import { RESEARCH_TOPICS } from "../../constants/research-topics";
import type {
  ReportSource,
  ResearchReport,
  SearchEvidence,
  SearchReport,
  TextSection,
  CompetitorsSection,
  NewsSection,
  StrengthsSection,
  ChallengesSection,
} from "../../types/research";

// ─── Deterministic Confidence ────────────────────────────────────────────────

function calculateConfidence(sourceCount: number, evidenceCount: number): number {
  if (evidenceCount === 0 || sourceCount === 0) return 0;
  const coverage = sourceCount / evidenceCount;
  const baseScore = Math.min(75, sourceCount * 25);
  const coverageBonus = coverage * 25;
  return Math.round(baseScore + coverageBonus);
}

// ─── JSON Schemas ─────────────────────────────────────────────────────────────

const SUMMARY_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: { type: SchemaType.STRING, description: "A concise 2-4 sentence summary of the facts." },
    sourceIds: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.INTEGER },
      description: "Array of integer IDs (1-based index) of the evidence sources used to generate this summary.",
    },
  },
  required: ["summary", "sourceIds"],
};

const COMPETITORS_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    items: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          reason: { type: SchemaType.STRING },
          sourceIds: { type: SchemaType.ARRAY, items: { type: SchemaType.INTEGER } },
        },
        required: ["name", "reason", "sourceIds"],
      },
    },
  },
  required: ["items"],
};

const NEWS_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    items: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          headline: { type: SchemaType.STRING },
          summary: { type: SchemaType.STRING },
          date: { type: SchemaType.STRING, description: "YYYY-MM-DD or 'Recent'" },
          sentiment: { type: SchemaType.STRING, description: "Positive, Negative, or Neutral" },
          impact: { type: SchemaType.STRING },
          sourceIds: { type: SchemaType.ARRAY, items: { type: SchemaType.INTEGER } },
        },
        required: ["headline", "summary", "date", "sentiment", "impact", "sourceIds"],
      },
    },
  },
  required: ["items"],
};

const STRENGTHS_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    items: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          importance: { type: SchemaType.STRING, description: "High, Medium, or Low" },
          sourceIds: { type: SchemaType.ARRAY, items: { type: SchemaType.INTEGER } },
        },
        required: ["title", "description", "importance", "sourceIds"],
      },
    },
  },
  required: ["items"],
};

const CHALLENGES_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    items: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING },
          severity: { type: SchemaType.STRING, description: "High, Medium, or Low" },
          sourceIds: { type: SchemaType.ARRAY, items: { type: SchemaType.INTEGER } },
        },
        required: ["title", "description", "severity", "sourceIds"],
      },
    },
  },
  required: ["items"],
};

function getSchemaForType(outputType: string): Schema {
  switch (outputType) {
    case "competitors":
      return COMPETITORS_SCHEMA;
    case "news":
      return NEWS_SCHEMA;
    case "strengths":
      return STRENGTHS_SCHEMA;
    case "challenges":
      return CHALLENGES_SCHEMA;
    case "summary":
    default:
      return SUMMARY_SCHEMA;
  }
}

// ─── Prompts ──────────────────────────────────────────────────────────────────

const SYSTEM_INSTRUCTION = `You are a professional investment research analyst assistant.
Your job is to summarize web research evidence into structured JSON.

Rules:
- Use ONLY the evidence provided. Do not add external knowledge or invented facts.
- Stay strictly factual and professional.
- Do not make investment recommendations.
- When referencing sources, use the exact integer ID provided in brackets (e.g. [1]).
- You must follow the JSON schema perfectly.`;

function buildPrompt(company: string, topic: string, evidence: SearchEvidence[]): string {
  if (evidence.length === 0) {
    return `No evidence was collected for the "${topic}" topic for ${company}. Provide an empty/null response matching the schema.`;
  }

  const evidenceText = evidence
    .map((e, i) => `Source ID [${i + 1}]\nTitle: ${e.title}\nSnippet: ${e.snippet}`)
    .join("\n\n");

  return `Extract structured information about "${topic}" for ${company}.

Evidence:
${evidenceText}

Based ONLY on the evidence above, generate the requested JSON structure.`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapSourceIds(ids: number[], evidence: SearchEvidence[]): ReportSource[] {
  const uniqueIds = Array.from(new Set(ids || []));
  return uniqueIds
    .filter((id) => id > 0 && id <= evidence.length)
    .map((id) => {
      const e = evidence[id - 1];
      return {
        title: e.title,
        url: e.url,
        snippet: e.snippet,
      };
    });
}

function buildEmptyTextSection(): TextSection {
  return { summary: "", confidence: 0, sourceCount: 0, status: "not_available", sources: [] };
}
function buildEmptyCompetitorsSection(): CompetitorsSection {
  return { competitors: [], confidence: 0, sourceCount: 0, status: "not_available", sources: [] };
}
function buildEmptyNewsSection(): NewsSection {
  return { news: [], confidence: 0, sourceCount: 0, status: "not_available", sources: [] };
}
function buildEmptyStrengthsSection(): StrengthsSection {
  return { strengths: [], confidence: 0, sourceCount: 0, status: "not_available", sources: [] };
}
function buildEmptyChallengesSection(): ChallengesSection {
  return { challenges: [], confidence: 0, sourceCount: 0, status: "not_available", sources: [] };
}

// ─── Main Logic ───────────────────────────────────────────────────────────────

const GEMINI_DELAY_MS = 13_000;
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function summarizeResearch(searchReport: SearchReport): Promise<Omit<ResearchReport, "metadata">> {
  const report: Omit<ResearchReport, "metadata"> = {
    companyOverview: buildEmptyTextSection(),
    industry: buildEmptyTextSection(),
    businessModel: buildEmptyTextSection(),
    leadership: buildEmptyTextSection(),
    marketSentiment: buildEmptyTextSection(),
    competitors: buildEmptyCompetitorsSection(),
    recentNews: buildEmptyNewsSection(),
    keyStrengths: buildEmptyStrengthsSection(),
    keyChallenges: buildEmptyChallengesSection(),
  };

  for (let i = 0; i < searchReport.searchResults.length; i++) {
    const topicResult = searchReport.searchResults[i];
    
    const topicDef = RESEARCH_TOPICS.find((t) => t.title === topicResult.topic);
    if (!topicDef) continue;

    if (i > 0) {
      await sleep(GEMINI_DELAY_MS);
    }

    const prompt = buildPrompt(searchReport.company, topicResult.topic, topicResult.results);
    const schema = getSchemaForType(topicDef.resultType);

    try {
      const jsonResponse = await generateText(prompt, {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1,
        responseMimeType: "application/json",
        responseSchema: schema,
      });

      const parsed = JSON.parse(jsonResponse);
      const allTopicSources: ReportSource[] = topicResult.results.map((r) => ({
        title: r.title,
        url: r.url,
        snippet: r.snippet,
      }));

      let allReferencedSourceIds: number[] = [];

      if (topicDef.resultType === "summary") {
        const data = parsed.summary || "Insufficient evidence available.";
        allReferencedSourceIds = parsed.sourceIds || [];
        const sourceCount = new Set(allReferencedSourceIds).size;
        
        (report[topicDef.reportField] as TextSection) = {
          summary: data,
          sources: allTopicSources,
          confidence: calculateConfidence(sourceCount, topicResult.results.length),
          sourceCount,
          status: topicResult.results.length === 0 ? "not_available" : "completed",
        };
      } else {
        const items = parsed.items || [];
        // Map item-level sources and collect all referenced source IDs
        const richItems = items.map((item: Record<string, unknown>) => {
          const itemSourceIds = (item.sourceIds as number[]) || [];
          allReferencedSourceIds.push(...itemSourceIds);
          
          // Remove sourceIds from the final object, replace with full sources array
          delete item.sourceIds;
          return {
            ...item,
            sources: mapSourceIds(itemSourceIds, topicResult.results),
          };
        });

        const uniqueReferencedCount = new Set(allReferencedSourceIds).size;
        const confidence = calculateConfidence(uniqueReferencedCount, topicResult.results.length);
        const status = topicResult.results.length === 0 ? "not_available" : "completed";

        if (topicDef.resultType === "competitors") {
          (report[topicDef.reportField] as CompetitorsSection) = { competitors: richItems, sources: allTopicSources, confidence, sourceCount: uniqueReferencedCount, status };
        } else if (topicDef.resultType === "news") {
          (report[topicDef.reportField] as NewsSection) = { news: richItems, sources: allTopicSources, confidence, sourceCount: uniqueReferencedCount, status };
        } else if (topicDef.resultType === "strengths") {
          (report[topicDef.reportField] as StrengthsSection) = { strengths: richItems, sources: allTopicSources, confidence, sourceCount: uniqueReferencedCount, status };
        } else if (topicDef.resultType === "challenges") {
          (report[topicDef.reportField] as ChallengesSection) = { challenges: richItems, sources: allTopicSources, confidence, sourceCount: uniqueReferencedCount, status };
        }
      }
    } catch (error) {
      console.error(`Failed to summarize topic ${topicResult.topic}:`, error);
      throw new Error(`Failed to summarize ${topicResult.topic}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return report;
}
