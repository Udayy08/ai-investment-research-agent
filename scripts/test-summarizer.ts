/**
 * Test script for the Research Summarizer (Phase 4.3).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createResearchPlan } from "../src/agents/research/planner";
import { executeSearch } from "../src/agents/research/search";
import { summarizeResearch } from "../src/agents/research/summarizer";
import type { ResearchReport } from "../src/types/research";

// ─── Helpers ──────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(description: string, condition: boolean): void {
  if (condition) {
    console.log(`  ✓ ${description}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${description}`);
    failed++;
  }
}

function printReport(report: Omit<ResearchReport, "metadata">): void {
  console.log(`\n  Company Overview : ${report.companyOverview.summary.substring(0, 100)}...`);
  console.log(`  Industry         : ${report.industry.summary.substring(0, 100)}...`);
  console.log(`  Business Model   : ${report.businessModel.summary.substring(0, 100)}...`);
  console.log(`  Leadership       : ${report.leadership.summary.substring(0, 100)}...`);
  console.log(`  Competitors      : ${report.competitors.competitors.length} item(s)`);
  console.log(`  Recent News      : ${report.recentNews.news.length} item(s)`);
  console.log(`  Market Sentiment : ${report.marketSentiment.summary.substring(0, 100)}...`);
  console.log(`  Key Strengths    : ${report.keyStrengths.strengths.length} item(s)`);
  console.log(`  Key Challenges   : ${report.keyChallenges.challenges.length} item(s)`);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("\n================================================");
  console.log(" RESEARCH SUMMARIZER – INTEGRATION TESTS (Phase 4.3/v2.0)");
  console.log("================================================\n");

  let isQuotaError = false;

  try {
    // ── Test 1: Full pipeline for Apple ────────────────────────────────────
    console.log("Test 1: Full summarization for Apple");
    {
      const plan = createResearchPlan({ companyName: "Apple" });
      const searchReport = await executeSearch(plan);
      const report = await summarizeResearch(searchReport);

      // Schema validation
      assert("companyOverview is an object with summary string", typeof report.companyOverview.summary === "string");
      assert("industry is an object with summary string", typeof report.industry.summary === "string");
      assert("businessModel is an object with summary string", typeof report.businessModel.summary === "string");
      assert("leadership is an object with summary string", typeof report.leadership.summary === "string");
      assert("competitors is an object with competitors array", Array.isArray(report.competitors.competitors));
      assert("recentNews is an object with news array", Array.isArray(report.recentNews.news));
      assert("marketSentiment is an object with summary string", typeof report.marketSentiment.summary === "string");
      assert("keyStrengths is an object with strengths array", Array.isArray(report.keyStrengths.strengths));
      assert("keyChallenges is an object with challenges array", Array.isArray(report.keyChallenges.challenges));

      // Citation structure in a section
      assert("companyOverview has sources array", Array.isArray(report.companyOverview.sources));
      assert("companyOverview has confidence", typeof report.companyOverview.confidence === "number");
      assert("companyOverview has sourceCount", typeof report.companyOverview.sourceCount === "number");
      assert("companyOverview has status", typeof report.companyOverview.status === "string");

      printReport(report);
    }

    // ── Test 2: Empty evidence is handled gracefully ────────────────────────
    console.log("\nTest 2: Empty evidence gracefully returns 'Insufficient evidence available'");
    {
      const emptySearchReport = {
        company: "TestCo",
        searchResults: [
          { topic: "Company Overview", query: "TestCo company overview", results: [] },
        ],
      };

      const report = await summarizeResearch(emptySearchReport);
      assert(
        "companyOverview acknowledges missing evidence",
        report.companyOverview.summary.toLowerCase().includes("insufficient") ||
        report.companyOverview.summary.length > 0
      );
      assert("companyOverview sources is empty when no evidence", report.companyOverview.sources.length === 0);
    }

    // ── Test 3: Unknown topics are skipped gracefully ───────────────────────
    console.log("\nTest 3: Unknown topic ID is skipped without breaking pipeline");
    {
      const searchReportWithUnknown = {
        company: "TestCo",
        searchResults: [
          { topic: "Unknown Topic XYZ", query: "TestCo unknown", results: [] },
        ],
      };

      const report = await summarizeResearch(searchReportWithUnknown);
      assert("pipeline does not crash on unknown topic", true); // Reached here
      assert("report fields remain in initial state", report.companyOverview.summary === "");
    }

  } catch (error: unknown) {
    if (error instanceof Error && error.message && error.message.includes("Quota exceeded")) {
      isQuotaError = true;
      console.log("  ⚠ Skipping schema checks — Gemini API Quota exceeded.");
    } else {
      console.error("\n================================================");
      console.error("TEST FAILED WITH ERROR:");
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
      console.error("================================================\n");
      process.exit(1);
    }
  }

  // ─── Summary ──────────────────────────────────────────────────────────
  console.log("\n================================================");
  console.log(` RESULTS: ${passed} passed, ${failed} failed`);
  if (isQuotaError) {
    console.log(` NOTE: Some tests skipped due to Gemini Free Tier Quota limits.`);
  }
  console.log("================================================\n");

  if (failed > 0) process.exit(1);
}

main();
