import { tavily } from "tavily";
import { env } from "./env";

const client = tavily({ apiKey: env.TAVILY_API_KEY });

export interface SearchResult {
  title: string;
  url: string;
  content: string;
}

export interface SearchOptions {
  searchDepth?: "basic" | "advanced";
  maxResults?: number;
  topic?: "general" | "news" | "finance";
  days?: number;
}

/**
 * Reusable search function that queries the Tavily API and returns a normalized
 * list of search results.
 */
export async function performSearch(
  query: string,
  options?: SearchOptions
): Promise<SearchResult[]> {
  const rawResponse = await client.search(query, {
    searchDepth: options?.searchDepth ?? "basic",
    maxResults: options?.maxResults ?? 5,
    topic: options?.topic ?? "general",
    days: options?.days,
  });

  if (!rawResponse || !rawResponse.results) {
    return [];
  }

  // Normalize results to return only title, url, and content
  return rawResponse.results.map((result) => ({
    title: result.title || "",
    url: result.url || "",
    content: result.content || "",
  }));
}
