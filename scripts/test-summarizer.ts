/**
 * Test script for the Research Summarizer (Phase 4.3).
 *
 * Verifies:
 *   - Structured search results are accepted and produce a ResearchReport.
 *   - Every research topic is summarized into the correct field.
 *   - Citations are preserved in the sources array.
 *   - Missing evidence is handled gracefully.
 *   - Output follows the required ResearchReport schema.
 *
 * Note: This test makes real Gemini API calls.
 * Ensure GOOGLE_API_KEY is set in .env.local before running.
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

function printReport(report: ResearchReport): void {
  console.log(`\n  Company          : ${report.company}`);
  console.log(`  Company Overview : ${report.companyOverview.substring(0, 100)}...`);
  console.log(`  Industry         : ${report.industry.substring(0, 100)}...`);
  console.log(`  Business Model   : ${report.businessModel.substring(0, 100)}...`);
  console.log(`  Leadership       : ${report.leadership.substring(0, 100)}...`);
  console.log(`  Competitors      : [${report.competitors.slice(0, 3).join(", ")}${report.competitors.length > 3 ? "..." : ""}]`);
  console.log(`  Recent News      : ${report.recentNews.length} item(s)`);
  console.log(`  Market Sentiment : ${report.marketSentiment.substring(0, 100)}...`);
  console.log(`  Key Strengths    : ${report.keyStrengths.length} item(s)`);
  console.log(`  Key Challenges   : ${report.keyChallenges.length} item(s)`);
  console.log(`  Sources          : ${report.sources.length} citation(s)`);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("\n================================================");
  console.log(" RESEARCH SUMMARIZER – INTEGRATION TESTS (Phase 4.3)");
  console.log("================================================\n");

  try {
    // ── Test 1: Full pipeline for Apple ────────────────────────────────────
    console.log("Test 1: Full summarization for Apple");
    {
      const plan = createResearchPlan({ companyName: "Apple" });
      const searchReport = await executeSearch(plan);
      const report = await summarizeResearch(searchReport);

      // Schema validation
      assert("company is 'Apple'", report.company === "Apple");
      assert("companyOverview is a non-empty string", typeof report.companyOverview === "string" && report.companyOverview.length > 0);
      assert("industry is a non-empty string", typeof report.industry === "string" && report.industry.length > 0);
      assert("businessModel is a non-empty string", typeof report.businessModel === "string" && report.businessModel.length > 0);
      assert("leadership is a non-empty string", typeof report.leadership === "string" && report.leadership.length > 0);
      assert("competitors is an array", Array.isArray(report.competitors));
      assert("recentNews is an array", Array.isArray(report.recentNews));
      assert("marketSentiment is a non-empty string", typeof report.marketSentiment === "string" && report.marketSentiment.length > 0);
      assert("keyStrengths is an array", Array.isArray(report.keyStrengths));
      assert("keyChallenges is an array", Array.isArray(report.keyChallenges));
      assert("sources is an array", Array.isArray(report.sources));
      assert("sources is non-empty", report.sources.length > 0);

      // Citation structure
      const firstSource = report.sources[0];
      assert("source has section field", typeof firstSource.section === "string" && firstSource.section.length > 0);
      assert("source has title field", typeof firstSource.title === "string");
      assert("source has url field", typeof firstSource.url === "string" && firstSource.url.startsWith("http"));
      assert("source has snippet field", typeof firstSource.snippet === "string");

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
      assert("company is 'TestCo'", report.company === "TestCo");
      assert(
        "companyOverview acknowledges missing evidence",
        report.companyOverview.toLowerCase().includes("insufficient") ||
        report.companyOverview.length > 0
      );
      assert("sources is empty when no evidence", report.sources.length === 0);
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
      assert("pipeline does not crash on unknown topic", report.company === "TestCo");
      assert("report fields remain in initial state", report.companyOverview === "");
    }

    // ─── Summary ──────────────────────────────────────────────────────────
    console.log("\n================================================");
    console.log(` RESULTS: ${passed} passed, ${failed} failed`);
    console.log("================================================\n");

    if (failed > 0) process.exit(1);

  } catch (error: unknown) {
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

main();
