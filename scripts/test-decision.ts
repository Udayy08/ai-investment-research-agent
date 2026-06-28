import { runDecisionAgent } from "../src/agents/decision/agent";
import type { ResearchReport } from "../src/types/research";
import type { FinancialReport } from "../src/types/financial";
import type { RiskReport } from "../src/types/risk";

function assert(description: string, condition: boolean) {
  if (condition) {
    console.log(`  ✓ ${description}`);
  } else {
    console.error(`  ✗ ${description}`);
    throw new Error(`Assertion failed: ${description}`);
  }
}

async function main() {
  console.log("================================================");
  console.log(" DECISION AGENT – INTEGRATION TESTS (Phase 7)");
  console.log("================================================\n");

  const mockResearchReport: ResearchReport = {
    metadata: { company: "TestCorp", generatedAt: new Date().toISOString(), researchVersion: "2.0", overallConfidence: 90, totalSources: 1, status: "completed" },
    companyOverview: { summary: "TestCorp overview.", confidence: 90, sourceCount: 1, status: "completed", sources: [] },
    industry: { summary: "Software.", confidence: 90, sourceCount: 1, status: "completed", sources: [] },
    businessModel: { summary: "SaaS.", confidence: 90, sourceCount: 1, status: "completed", sources: [] },
    leadership: { summary: "Good leadership.", confidence: 90, sourceCount: 1, status: "completed", sources: [] },
    marketSentiment: { summary: "Positive.", confidence: 90, sourceCount: 1, status: "completed", sources: [] },
    competitors: { competitors: [], confidence: 90, sourceCount: 1, status: "completed", sources: [] },
    recentNews: { news: [], confidence: 90, sourceCount: 1, status: "completed", sources: [] },
    keyStrengths: { strengths: [], confidence: 90, sourceCount: 1, status: "completed", sources: [] },
    keyChallenges: { challenges: [], confidence: 90, sourceCount: 1, status: "completed", sources: [] }
  };

  const mockFinancialReport: FinancialReport = {
    metadata: { company: "TestCorp", generatedAt: new Date().toISOString(), financialVersion: "1.0", researchVersion: "2.0", overallConfidence: 85, status: "completed" },
    executiveSummary: "Financial summary.",
    businessQuality: { summary: "High quality.", reasoning: "Reason", score: 90, confidence: 90, status: "completed", evidence: [] },
    marketPosition: { summary: "Leader.", reasoning: "Reason", score: 90, confidence: 90, status: "completed", evidence: [] },
    competitiveAdvantage: { summary: "Moat.", reasoning: "Reason", score: 90, confidence: 90, status: "completed", evidence: [] },
    growthPotential: { summary: "High.", reasoning: "Reason", score: 90, confidence: 90, status: "completed", evidence: [] },
    innovation: { summary: "Good.", reasoning: "Reason", score: 90, confidence: 90, status: "completed", evidence: [] },
    operationalStrength: { summary: "Strong.", reasoning: "Reason", score: 90, confidence: 90, status: "completed", evidence: [] },
    financialHealth: { summary: "Healthy.", reasoning: "Reason", score: 90, confidence: 90, status: "completed", evidence: [] },
    strengths: [],
    weaknesses: [],
    overallScore: 90,
    confidence: 85,
  };

  const mockRiskReport: RiskReport = {
    metadata: { company: "TestCorp", generatedAt: new Date().toISOString(), riskVersion: "1.0", researchVersion: "2.0", financialVersion: "1.0", overallConfidence: 80, status: "completed" },
    executiveSummary: { overallRiskLevel: "Low", highestPriorityRisks: "None", positiveRiskFactors: "Many", negativeRiskFactors: "Few", overallAssessment: "Good" },
    competitiveRisks: { summary: "Low.", reasoning: "R", score: 10, confidence: 90, status: "completed", riskCount: 0, risks: [] },
    marketRisks: { summary: "Low.", reasoning: "R", score: 10, confidence: 90, status: "completed", riskCount: 0, risks: [] },
    operationalRisks: { summary: "Low.", reasoning: "R", score: 10, confidence: 90, status: "completed", riskCount: 0, risks: [] },
    technologyRisks: { summary: "Low.", reasoning: "R", score: 10, confidence: 90, status: "completed", riskCount: 0, risks: [] },
    regulatoryRisks: { summary: "Low.", reasoning: "R", score: 10, confidence: 90, status: "completed", riskCount: 0, risks: [] },
    leadershipRisks: { summary: "Low.", reasoning: "R", score: 10, confidence: 90, status: "completed", riskCount: 0, risks: [] },
    reputationRisks: { summary: "Low.", reasoning: "R", score: 10, confidence: 90, status: "completed", riskCount: 0, risks: [] },
    financialRisks: { summary: "Low.", reasoning: "R", score: 10, confidence: 90, status: "completed", riskCount: 0, risks: [] },
    overallRiskScore: 10,
    overallRiskLevel: "Low",
    confidence: 80,
  };

  try {
    console.log("Test 1: Valid Report cross-analysis");
    let result;
    let isQuotaError = false;
    try {
      result = await runDecisionAgent(mockResearchReport, mockFinancialReport, mockRiskReport);
    } catch (e: unknown) {
      if (e instanceof Error && e.message && e.message.includes("429")) {
        isQuotaError = true;
        console.log("  ⚠ Skipping schema checks — Gemini API Quota exceeded.");
      } else {
        throw e;
      }
    }

    if (!isQuotaError && result) {
      if (result.status !== "completed") {
        console.error("Agent failed with error:", result.error);
      }
      assert("Result has status 'completed'", result.status === "completed");
      assert("DecisionReport is present", result.decisionReport !== null);

      const report = result.decisionReport!;
      assert("Metadata contains company name", report.metadata.company === "TestCorp");
      
      const allowedRecommendations = ["Strong Invest", "Invest", "Hold", "Pass", "Strong Pass"];
      assert("Recommendation is strictly typed", allowedRecommendations.includes(report.recommendation));
      assert("Decision Reasoning exists", typeof report.decisionReasoning === "string");
      
      const sum = report.researchContribution + report.financialContribution + report.riskContribution;
      assert(`Contributions sum exactly to 100 (Sum = ${sum})`, sum === 100);

      assert("TradeOffAnalysis has overallBalance", typeof report.tradeOffAnalysis.overallBalance === "string");
      
      console.log(`\n  Generated Recommendation: ${report.recommendation}`);
      console.log(`  Generated Decision Score: ${report.decisionScore}`);
      console.log(`  Contributions: R=${report.researchContribution}% F=${report.financialContribution}% K=${report.riskContribution}%`);
    }

    console.log("\nTest 2: Validation Error (Mismatched Companies)");
    const otherCompanyRisk = { ...mockRiskReport, metadata: { ...mockRiskReport.metadata, company: "OtherCorp" } };
    const invalidResult = await runDecisionAgent(mockResearchReport, mockFinancialReport, otherCompanyRisk);
    assert("status is 'failed'", invalidResult.status === "failed");
    assert("decisionReport is null", invalidResult.decisionReport === null);
    assert("error mentions Validation Error", invalidResult.error!.includes("different companies"));

  } catch (error) {
    console.error("\nTEST FAILED:", error);
    process.exit(1);
  }

  console.log("\n================================================");
  console.log(" ALL TESTS PASSED");
  console.log("================================================\n");
}

main();
