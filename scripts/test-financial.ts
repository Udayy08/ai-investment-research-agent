import { runFinancialAgent } from "../src/agents/financial/agent";
import type { ResearchReport } from "../src/types/research";

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
  console.log(" FINANCIAL AGENT – INTEGRATION TESTS (Phase 5)");
  console.log("================================================\n");

  // Mock ResearchReport data to feed into the Financial Agent
  const mockResearchReport: ResearchReport = {
    metadata: {
      company: "TestCorp",
      generatedAt: new Date().toISOString(),
      researchVersion: "2.0",
      overallConfidence: 90,
      totalSources: 5,
      status: "completed",
    },
    companyOverview: {
      summary: "TestCorp is a leading enterprise software provider with strong recurring revenue.",
      confidence: 90,
      sourceCount: 1,
      status: "completed",
      sources: [{ title: "TestCorp Profile", url: "http://example.com/profile", snippet: "TestCorp makes software." }],
    },
    industry: {
      summary: "The enterprise software industry is growing rapidly.",
      confidence: 95,
      sourceCount: 1,
      status: "completed",
      sources: [{ title: "Industry Report", url: "http://example.com/industry", snippet: "Software is growing." }],
    },
    businessModel: {
      summary: "TestCorp uses a SaaS business model with high gross margins.",
      confidence: 85,
      sourceCount: 1,
      status: "completed",
      sources: [{ title: "10-K", url: "http://example.com/10k", snippet: "High margins." }],
    },
    leadership: {
      summary: "Led by Jane Doe, a seasoned tech executive.",
      confidence: 99,
      sourceCount: 1,
      status: "completed",
      sources: [{ title: "Bio", url: "http://example.com/bio", snippet: "Jane Doe." }],
    },
    marketSentiment: {
      summary: "Investors view TestCorp favorably.",
      confidence: 80,
      sourceCount: 1,
      status: "completed",
      sources: [{ title: "Stock News", url: "http://example.com/stock", snippet: "Favorable view." }],
    },
    competitors: {
      competitors: [
        { name: "RivalCorp", reason: "Direct competitor in SaaS.", sources: [] }
      ],
      confidence: 85,
      sourceCount: 1,
      status: "completed",
      sources: [],
    },
    recentNews: {
      news: [
        { headline: "TestCorp acquires smaller firm", summary: "Acquisition", date: "2026", sentiment: "positive", impact: "High", sources: [] }
      ],
      confidence: 90,
      sourceCount: 1,
      status: "completed",
      sources: [],
    },
    keyStrengths: {
      strengths: [
        { title: "Recurring Revenue", description: "High retention rate.", importance: "High", sources: [] }
      ],
      confidence: 90,
      sourceCount: 1,
      status: "completed",
      sources: [],
    },
    keyChallenges: {
      challenges: [
        { title: "Competition", description: "Fierce market.", severity: "Medium", sources: [] }
      ],
      confidence: 90,
      sourceCount: 1,
      status: "completed",
      sources: [],
    }
  };

  try {
    console.log("Test 1: Valid Research Report analysis");
    
    let result;
    let isQuotaError = false;
    
    try {
      result = await runFinancialAgent(mockResearchReport);
    } catch (e: unknown) {
      if (e instanceof Error && e.message && e.message.includes("429")) {
        isQuotaError = true;
        console.log("  ⚠ Skipping schema checks — Gemini API Quota exceeded.");
      } else {
        throw e;
      }
    }

    if (!isQuotaError && result) {
      assert("Result has status 'completed'", result.status === "completed");
      assert("Result has no error", !result.error);
      assert("FinancialReport is present", result.financialReport !== null);

      const report = result.financialReport!;
      assert("Metadata contains company name", report.metadata.company === "TestCorp");
      assert("Metadata contains researchVersion", report.metadata.researchVersion === "2.0");
      assert("Metadata contains financialVersion", report.metadata.financialVersion === "1.0");

      assert("businessQuality evaluation exists", !!report.businessQuality);
      assert("businessQuality has score", typeof report.businessQuality.score === "number");
      assert("businessQuality has reasoning", typeof report.businessQuality.reasoning === "string");
      assert("businessQuality has structured evidence", Array.isArray(report.businessQuality.evidence));
      
      if (report.businessQuality.evidence.length > 0) {
        assert("businessQuality evidence has sourceSection", typeof report.businessQuality.evidence[0].sourceSection === "string");
      }

      assert("overallScore exists", typeof report.overallScore === "number");
      assert("Strengths exists as array", Array.isArray(report.strengths));
      assert("Weaknesses exists as array", Array.isArray(report.weaknesses));
      
      console.log(`\n  Generated Overall Score: ${report.overallScore}`);
      console.log(`  Generated Confidence: ${report.confidence}`);
    }

    console.log("\nTest 2: Invalid Research Report (Missing company)");
    const invalidReport = { ...mockResearchReport, metadata: { ...mockResearchReport.metadata, company: "" } };
    const invalidResult = await runFinancialAgent(invalidReport);
    assert("status is 'failed'", invalidResult.status === "failed");
    assert("financialReport is null", invalidResult.financialReport === null);
    assert("error mentions valid company", invalidResult.error!.includes("valid company"));

  } catch (error) {
    console.error("\nTEST FAILED:", error);
    process.exit(1);
  }

  console.log("\n================================================");
  console.log(" ALL TESTS PASSED");
  console.log("================================================\n");
}

main();
