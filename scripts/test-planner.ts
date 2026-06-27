/**
 * Test script for the Research Planner (Phase 4.1).
 *
 * Verifies:
 *   - Valid company names produce a correctly structured ResearchPlan.
 *   - Empty strings are rejected with a clear error.
 *   - Whitespace-only strings are rejected with a clear error.
 *   - Leading/trailing whitespace is trimmed from the company name.
 */

import { createResearchPlan } from "../src/agents/research/planner";
import { RESEARCH_TOPICS } from "../src/constants/research-topics";

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

function assertThrows(description: string, fn: () => void): void {
  try {
    fn();
    console.error(`  ✗ FAIL: ${description} (expected error but none was thrown)`);
    failed++;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  ✓ ${description} → "${message}"`);
    passed++;
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

console.log("\n================================================");
console.log(" RESEARCH PLANNER – UNIT TESTS (Phase 4.1)");
console.log("================================================\n");

// --- Test 1: Tesla -------------------------------------------------------
console.log("Test 1: Valid company – Tesla");
{
  const plan = createResearchPlan({ companyName: "Tesla" });
  assert("company is 'Tesla'", plan.company === "Tesla");
  assert("researchTopics is an array", Array.isArray(plan.researchTopics));
  assert(
    "researchTopics length matches RESEARCH_TOPICS",
    plan.researchTopics.length === RESEARCH_TOPICS.length
  );
  assert("first topic id is 'company_overview'", plan.researchTopics[0].id === "company_overview");
  assert("topics are sorted by priority", plan.researchTopics[0].priority === 1);
}

// --- Test 2: Microsoft ---------------------------------------------------
console.log("\nTest 2: Valid company – Microsoft");
{
  const plan = createResearchPlan({ companyName: "Microsoft" });
  assert("company is 'Microsoft'", plan.company === "Microsoft");
  assert("plan has 9 research topics", plan.researchTopics.length === 9);
}

// --- Test 3: Apple -------------------------------------------------------
console.log("\nTest 3: Valid company – Apple");
{
  const plan = createResearchPlan({ companyName: "Apple" });
  assert("company is 'Apple'", plan.company === "Apple");
  assert("every topic has an id", plan.researchTopics.every((t) => typeof t.id === "string" && t.id.length > 0));
  assert("every topic has a title", plan.researchTopics.every((t) => typeof t.title === "string" && t.title.length > 0));
  assert("every topic has a priority", plan.researchTopics.every((t) => typeof t.priority === "number"));
}

// --- Test 4: Empty string -------------------------------------------------
console.log("\nTest 4: Invalid input – empty string");
assertThrows(
  "throws on empty string",
  () => createResearchPlan({ companyName: "" })
);

// --- Test 5: Whitespace-only string ---------------------------------------
console.log("\nTest 5: Invalid input – whitespace-only string");
assertThrows(
  "throws on whitespace-only string",
  () => createResearchPlan({ companyName: "   " })
);

// --- Test 6: Input trimming -----------------------------------------------
console.log("\nTest 6: Input trimming");
{
  const plan = createResearchPlan({ companyName: "  NVIDIA  " });
  assert("trimmed company name is 'NVIDIA'", plan.company === "NVIDIA");
}

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log("\n================================================");
console.log(` RESULTS: ${passed} passed, ${failed} failed`);
console.log("================================================\n");

if (failed > 0) {
  process.exit(1);
}
