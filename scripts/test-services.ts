import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { generateText } from "../src/services/gemini";
import { performSearch } from "../src/services/tavily";

async function main() {
  console.log("=================================================");
  console.log("SHARED AI SERVICES INTEGRATION TEST");
  console.log("=================================================\n");

  try {
    console.log("1. Testing env.ts configuration validation...");
    // Just referencing environment variables to verify env.ts is imported and parsed successfully.
    // If keys are missing, env.ts will throw an error automatically.
    const { env } = await import("../src/services/env");
    console.log(`✓ Environment configuration is valid (NODE_ENV: ${env.NODE_ENV}).\n`);

    console.log("2. Testing Gemini Service (gemini-2.5-flash)...");
    const geminiStart = Date.now();
    const prompt = "Please respond with exactly: 'Gemini integration success!'";
    const geminiResponse = await generateText(prompt, {
      systemInstruction: "You are a testing assistant. Keep answers brief.",
      temperature: 0.1,
    });
    console.log(`[Response]: "${geminiResponse.trim()}"`);
    console.log(`[Time Taken]: ${Date.now() - geminiStart}ms`);
    console.log("✓ Gemini service is working successfully.\n");

    console.log("3. Testing Tavily Service...");
    const tavilyStart = Date.now();
    const searchResults = await performSearch("Google Nest", {
      maxResults: 2,
    });
    console.log(`[Number of Results]: ${searchResults.length}`);
    searchResults.forEach((res, index) => {
      console.log(`  Result ${index + 1}:`);
      console.log(`    Title: "${res.title}"`);
      console.log(`    URL:   ${res.url}`);
      console.log(`    Snippet: ${res.content.substring(0, 100)}...`);
    });

    if (searchResults.length === 0) {
      throw new Error("Tavily returned 0 search results.");
    }
    console.log(`[Time Taken]: ${Date.now() - tavilyStart}ms`);
    console.log("✓ Tavily service is working successfully.\n");

    console.log("=================================================");
    console.log("ALL INTEGRATION TESTS PASSED SUCCESSFULLY");
    console.log("=================================================");
  } catch (error: unknown) {
    console.error("\n=================================================");
    console.error("TEST FAILED WITH ERROR:");
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    console.error("=================================================");
    process.exit(1);
  }
}

main();
