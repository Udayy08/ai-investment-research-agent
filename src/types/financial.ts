import { z } from "zod";

export interface FinancialMetadata {
  company: string;
  generatedAt: string;
  financialVersion: string;
  researchVersion: string;
  overallConfidence: number;
  status: "completed" | "failed";
}

export const FinancialEvidenceSchema = z.object({
  sourceSection: z.string().describe("The section of the Research Report where this evidence was found (e.g., 'companyOverview', 'recentNews')."),
  summary: z.string().describe("The supporting summary or finding from the research report."),
});

export type FinancialEvidence = z.infer<typeof FinancialEvidenceSchema>;

export const FinancialEvaluationSchema = z.object({
  summary: z.string().describe("A concise 2-4 sentence summary of the financial evaluation."),
  reasoning: z.string().describe("Detailed reasoning explaining why the assigned score was chosen based on the evidence."),
  score: z.number().min(0).max(100).describe("Evaluation score from 0 to 100."),
  confidence: z.number().min(0).max(100).describe("Confidence score from 0 to 100 based on the amount and quality of available evidence."),
  status: z.enum(["completed", "failed", "not_available"]).describe("Status of this evaluation."),
  evidence: z.array(FinancialEvidenceSchema).describe("Specific evidence items from the research report supporting this evaluation."),
});

export type FinancialEvaluation = z.infer<typeof FinancialEvaluationSchema>;

export const FinancialStrengthSchema = z.object({
  title: z.string(),
  description: z.string(),
  impact: z.enum(["High", "Medium", "Low"]),
  evidence: z.array(FinancialEvidenceSchema),
});

export type FinancialStrength = z.infer<typeof FinancialStrengthSchema>;

export const FinancialWeaknessSchema = z.object({
  title: z.string(),
  description: z.string(),
  severity: z.enum(["High", "Medium", "Low"]),
  evidence: z.array(FinancialEvidenceSchema),
});

export type FinancialWeakness = z.infer<typeof FinancialWeaknessSchema>;

export const FinancialReportDataSchema = z.object({
  executiveSummary: z.string().describe("An executive summary of the company's financial standing and future outlook."),
  businessQuality: FinancialEvaluationSchema,
  marketPosition: FinancialEvaluationSchema,
  competitiveAdvantage: FinancialEvaluationSchema,
  growthPotential: FinancialEvaluationSchema,
  innovation: FinancialEvaluationSchema,
  operationalStrength: FinancialEvaluationSchema,
  financialHealth: FinancialEvaluationSchema,
  strengths: z.array(FinancialStrengthSchema),
  weaknesses: z.array(FinancialWeaknessSchema),
  overallScore: z.number().min(0).max(100).describe("The overall financial score out of 100."),
  confidence: z.number().min(0).max(100).describe("The overall confidence out of 100."),
});

export type FinancialReportData = z.infer<typeof FinancialReportDataSchema>;

export interface FinancialReport extends FinancialReportData {
  metadata: FinancialMetadata;
}

export interface FinancialAgentResult {
  status: "completed" | "failed";
  financialReport: FinancialReport | null;
  error?: string;
}
