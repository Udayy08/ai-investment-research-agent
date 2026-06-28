import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { env } from "./env";
import { generateText as generateTextGemini, type GenerateTextOptions } from "./gemini";
import { generateTextGroq } from "./groq";
import type { Runnable } from "@langchain/core/runnables";

export interface ProviderMetadata {
  providerUsed: string;
  modelUsed: string;
}

/**
 * Common entry point for all LLM text generation (used by Research Agent).
 * Automatically falls back to the secondary provider if the primary fails.
 */
export async function generateText(
  prompt: string,
  options?: GenerateTextOptions
): Promise<string> {
  const primaryProvider = env.DEFAULT_PROVIDER === "groq" ? "groq" : "gemini";
  const secondaryProvider = primaryProvider === "gemini" ? "groq" : "gemini";

  const tryProvider = async (provider: string): Promise<string> => {
    if (provider === "gemini") {
      return await generateTextGemini(prompt, options);
    } else {
      return await generateTextGroq(prompt, options);
    }
  };

  try {
    console.log(`[AI-Provider] Request started using primary provider: ${primaryProvider}`);
    return await tryProvider(primaryProvider);
  } catch (error) {
    console.log(`[AI-Provider] Primary provider (${primaryProvider}) failed: ${error instanceof Error ? error.message : String(error)}`);
    console.log(`[AI-Provider] Switching to secondary provider: ${secondaryProvider}`);
    
    try {
      return await tryProvider(secondaryProvider);
    } catch (fallbackError) {
      console.log(`[AI-Provider] Secondary provider (${secondaryProvider}) also failed: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`);
      throw new Error("The AI provider is temporarily unavailable or has reached its usage limit.");
    }
  }
}

import { z } from "zod";

/**
 * Returns a LangChain Chat Model configured with automatic provider fallbacks
 * and structured output. Used by Financial, Risk, and Decision Agents.
 */
export function getStructuredModel<T>(schema: z.ZodType<T>): Runnable<unknown, T> {
  const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0.1,
    maxOutputTokens: 8192,
  }).withStructuredOutput(schema);

  let groqModel;
  if (env.GROQ_API_KEY) {
    groqModel = new ChatGroq({
      apiKey: env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      maxTokens: 8192,
    }).withStructuredOutput(schema);
  }

  if (env.DEFAULT_PROVIDER === "groq" && groqModel) {
    return groqModel.withFallbacks([geminiModel]) as unknown as Runnable<unknown, T>;
  } else if (groqModel) {
    return geminiModel.withFallbacks([groqModel]) as unknown as Runnable<unknown, T>;
  }

  return geminiModel as unknown as Runnable<unknown, T>;
}
