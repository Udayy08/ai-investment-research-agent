import { z } from "zod";

export interface DecisionMetadata {
  company: string;
  generatedAt: string;
  decisionVersion: string;
  researchVersion: string;
  financialVersion: string;
  riskVersion: string;
  overallConfidence: number;
  status: "completed" | "failed";
}

export const DecisionEvidenceSchema = z.object({
  originReport: z.string().describe("The report where this evidence originated (Must be 'Research Report', 'Financial Report', or 'Risk Report')."),
  sourceSection: z.string().describe("The section of the origin report where this evidence was found."),
  summary: z.string().describe("The supporting summary or finding from the origin report."),
});
export type DecisionEvidence = z.infer<typeof DecisionEvidenceSchema>;

export const InvestmentFactorSchema = z.object({
  title: z.string(),
  description: z.string(),
  evidence: z.array(DecisionEvidenceSchema),
});
export type InvestmentFactor = z.infer<typeof InvestmentFactorSchema>;

export const DecisionExecutiveSummarySchema = z.object({
  finalRecommendation: z.enum(["Strong Invest", "Invest", "Hold", "Pass", "Strong Pass"]),
  decisionScore: z.number().describe("Score from 0 to 100."),
  highestStrengths: z.string(),
  highestRisks: z.string(),
  overallConclusion: z.string(),
});
export type DecisionExecutiveSummary = z.infer<typeof DecisionExecutiveSummarySchema>;

export const TradeOffAnalysisSchema = z.object({
  investmentOpportunities: z.string().describe("Summary of the key investment opportunities."),
  investmentConcerns: z.string().describe("Summary of the key investment concerns."),
  overallBalance: z.string().describe("The overall balance comparing opportunities versus concerns."),
});
export type TradeOffAnalysis = z.infer<typeof TradeOffAnalysisSchema>;

export const DecisionReportDataSchema = z.object({
  executiveSummary: DecisionExecutiveSummarySchema,
  recommendation: z.enum(["Strong Invest", "Invest", "Hold", "Pass", "Strong Pass"]).describe("The final investment recommendation."),
  decisionScore: z.number().describe("Decision score from 0 to 100."),
  decisionReasoning: z.string().describe("Concise explanation describing why the final recommendation was selected."),
  confidence: z.number().describe("Overall confidence score from 0 to 100."),
  
  researchContribution: z.number().describe("Percentage contribution of the Research Report to the final decision (0-100)."),
  researchContributionExplanation: z.string().describe("Explanation describing how the Research Report influenced the recommendation."),
  
  financialContribution: z.number().describe("Percentage contribution of the Financial Report to the final decision (0-100)."),
  financialContributionExplanation: z.string().describe("Explanation describing how the Financial Report influenced the recommendation."),
  
  riskContribution: z.number().describe("Percentage contribution of the Risk Report to the final decision (0-100)."),
  riskContributionExplanation: z.string().describe("Explanation describing how the Risk Report influenced the recommendation."),
  
  investmentOpportunities: z.array(InvestmentFactorSchema).describe("Key investment opportunities derived from the reports."),
  investmentConcerns: z.array(InvestmentFactorSchema).describe("Key investment concerns derived from the reports."),
  
  tradeOffAnalysis: TradeOffAnalysisSchema,
  finalVerdict: z.string().describe("The final conclusive verdict explaining the recommendation."),
});
export type DecisionReportData = z.infer<typeof DecisionReportDataSchema>;

export interface DecisionReport extends DecisionReportData {
  metadata: DecisionMetadata;
}

export interface DecisionAgentResult {
  status: "completed" | "failed";
  decisionReport: DecisionReport | null;
  error?: string;
}
