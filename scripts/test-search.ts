/**
 * Test script for the Search Executor (Phase 4.2).
 *
 * Verifies:
 *   - A planner output is accepted and produces a SearchReport.
 *   - Queries are generated correctly for every topic.
 *   - Each TopicSearchResult has the correct shape (topic, query, results[]).
 *   - Results arrays contain SearchEvidence objects (title, url, snippet).
 *   - A plan with zero topics produces an empty searchResults array.
 *
 * Note: This test makes real Tavily API calls.
 * Ensure TAVILY_API_KEY is set in .env.local before running.
 */

// dotenv must be configured BEFORE any service module is imported,
// because env.ts validates environment variables at module-load time.
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createResearchPlan } from "../src/agents/research/planner";
import { executeSearch } from "../src/agents/research/search";
import type { SearchReport } from "../src/types/research";

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

function printReport(report: SearchReport): void {
  console.log(`\n  Company: ${report.company}`);
  console.log(`  Topics searched: ${report.searchResults.length}`);
  report.searchResults.forEach((r) => {
    console.log(`\n    [${r.topic}]`);
    console.log(`    Query  : "${r.query}"`);
    console.log(`    Results: ${r.results.length}`);
    if (r.results.length > 0) {
      const first = r.results[0];
      console.log(`    First  : "${first.title.substring(0, 60)}..."`);
      console.log(`    URL    : ${first.url}`);
    }
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("\n================================================");
  console.log(" SEARCH EXECUTOR – INTEGRATION TESTS (Phase 4.2)");
  console.log("================================================\n");

  try {
    // ── Test 1: Full search for Tesla ──────────────────────────────────────
    console.log("Test 1: Execute search for Tesla");
    {
      const plan = createResearchPlan({ companyName: "Tesla" });
      const report = await executeSearch(plan);

      assert("company is 'Tesla'", report.company === "Tesla");
      assert("searchResults is an array", Array.isArray(report.searchResults));
      assert(
        "searchResults has one entry per topic",
        report.searchResults.length === plan.researchTopics.length
      );

      const first = report.searchResults[0];
      assert("first entry has topic field", typeof first.topic === "string" && first.topic.length > 0);
      assert("first entry has query field", typeof first.query === "string" && first.query.length > 0);
      assert("first query contains company name", first.query.toLowerCase().includes("tesla"));
      assert("first entry has results array", Array.isArray(first.results));

      if (first.results.length > 0) {
        const evidence = first.results[0];
        assert("evidence has title", typeof evidence.title === "string");
        assert("evidence has url", typeof evidence.url === "string" && evidence.url.startsWith("http"));
        assert("evidence has snippet", typeof evidence.snippet === "string");
      }

      printReport(report);
    }

    // ── Test 2: Query generation correctness ──────────────────────────────
    console.log("\nTest 2: Query generation – verify queries contain company name");
    {
      const plan = createResearchPlan({ companyName: "Apple" });
      const report = await executeSearch(plan);

      const allQueriesContainCompany = report.searchResults.every((r) =>
        r.query.toLowerCase().includes("apple")
      );
      assert("all queries contain 'Apple'", allQueriesContainCompany);

      const allHaveTopics = report.searchResults.every(
        (r) => typeof r.topic === "string" && r.topic.length > 0
      );
      assert("all entries have a non-empty topic", allHaveTopics);
    }

    // ── Test 3: Empty topics plan produces empty searchResults ─────────────
    console.log("\nTest 3: Plan with zero topics returns empty searchResults");
    {
      const emptyPlan = { company: "TestCo", researchTopics: [] };
      const report = await executeSearch(emptyPlan);

      assert("company is preserved", report.company === "TestCo");
      assert("searchResults is empty", report.searchResults.length === 0);
    }

    // ─── Summary ──────────────────────────────────────────────────────────
    console.log("\n================================================");
    console.log(` RESULTS: ${passed} passed, ${failed} failed`);
    console.log("================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
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
