import { runRiskAgent } from "../src/agents/risk/agent";
import type { ResearchReport } from "../src/types/research";
import type { FinancialReport } from "../src/types/financial";

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
  console.log(" RISK AGENT – INTEGRATION TESTS (Phase 6)");
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

  try {
    console.log("Test 1: Valid Report cross-analysis");
    let result;
    let isQuotaError = false;
    try {
      result = await runRiskAgent(mockResearchReport, mockFinancialReport);
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
      assert("RiskReport is present", result.riskReport !== null);

      const report = result.riskReport!;
      assert("Metadata contains company name", report.metadata.company === "TestCorp");
      assert("ExecutiveSummary has overallRiskLevel", typeof report.executiveSummary.overallRiskLevel === "string");
      assert("ExecutiveSummary has highestPriorityRisks", typeof report.executiveSummary.highestPriorityRisks === "string");
      assert("FinancialRisks has riskCount", typeof report.financialRisks.riskCount === "number");
      
      console.log(`\n  Generated Overall Risk Score: ${report.overallRiskScore}`);
      console.log(`  Generated Overall Risk Level: ${report.overallRiskLevel}`);
    }

    console.log("\nTest 2: Validation Error (Mismatched Companies)");
    const otherCompanyFinancial = { ...mockFinancialReport, metadata: { ...mockFinancialReport.metadata, company: "OtherCorp" } };
    const invalidResult = await runRiskAgent(mockResearchReport, otherCompanyFinancial);
    assert("status is 'failed'", invalidResult.status === "failed");
    assert("riskReport is null", invalidResult.riskReport === null);
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
