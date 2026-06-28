import { z } from "zod";

export interface RiskMetadata {
  company: string;
  generatedAt: string;
  riskVersion: string;
  researchVersion: string;
  financialVersion: string;
  overallConfidence: number;
  status: "completed" | "failed";
}

export const RiskEvidenceSchema = z.object({
  originReport: z.string(),
  sourceSection: z.string(),
  summary: z.string(),
});
export type RiskEvidence = z.infer<typeof RiskEvidenceSchema>;

export const RiskItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  probability: z.string(),
  impact: z.string(),
  severity: z.string(),
  mitigationFeasibility: z.string(),
  evidence: z.array(RiskEvidenceSchema),
  possibleMitigation: z.string(),
});
export type RiskItem = z.infer<typeof RiskItemSchema>;

export const RiskCategoryEvaluationSchema = z.object({
  summary: z.string(),
  reasoning: z.string(),
  score: z.number(),
  confidence: z.number(),
  status: z.string(),
  riskCount: z.number(),
  risks: z.array(RiskItemSchema),
});
export type RiskCategoryEvaluation = z.infer<typeof RiskCategoryEvaluationSchema>;

export const RiskExecutiveSummarySchema = z.object({
  overallRiskLevel: z.string(),
  highestPriorityRisks: z.string(),
  positiveRiskFactors: z.string(),
  negativeRiskFactors: z.string(),
  overallAssessment: z.string(),
});
export type RiskExecutiveSummary = z.infer<typeof RiskExecutiveSummarySchema>;

export const RiskReportDataSchema = z.object({
  executiveSummary: RiskExecutiveSummarySchema,
  competitiveRisks: RiskCategoryEvaluationSchema,
  marketRisks: RiskCategoryEvaluationSchema,
  operationalRisks: RiskCategoryEvaluationSchema,
  technologyRisks: RiskCategoryEvaluationSchema,
  regulatoryRisks: RiskCategoryEvaluationSchema,
  leadershipRisks: RiskCategoryEvaluationSchema,
  reputationRisks: RiskCategoryEvaluationSchema,
  financialRisks: RiskCategoryEvaluationSchema,
  overallRiskScore: z.number(),
  overallRiskLevel: z.string(),
  confidence: z.number(),
});
export type RiskReportData = z.infer<typeof RiskReportDataSchema>;

export interface RiskReport extends RiskReportData {
  metadata: RiskMetadata;
}

export interface RiskAgentResult {
  status: "completed" | "failed";
  riskReport: RiskReport | null;
  error?: string;
}
