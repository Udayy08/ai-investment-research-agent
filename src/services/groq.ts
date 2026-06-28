import { ChatGroq } from "@langchain/groq";
import { env } from "./env";
import type { GenerateTextOptions } from "./gemini";

export async function generateTextGroq(
  prompt: string,
  options?: GenerateTextOptions
): Promise<string> {
  if (!env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }

  const model = new ChatGroq({
    apiKey: env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: options?.temperature ?? 0.1,
    maxTokens: options?.maxOutputTokens,
  });

  let systemMessage = options?.systemInstruction || "";
  
  if (options?.responseSchema) {
    systemMessage += `\n\nYou MUST return your response as a valid JSON object matching this exact schema:\n${JSON.stringify(options.responseSchema, null, 2)}`;
  }

  const modelWithFormat = options?.responseMimeType === "application/json" || options?.responseSchema
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (model as any).bind({ response_format: { type: "json_object" } })
    : model;

  const messages = [];
  if (systemMessage) {
    messages.push(["system", systemMessage]);
  }
  messages.push(["user", prompt]);

  const response = await modelWithFormat.invoke(messages);

  if (typeof response.content !== "string") {
    throw new Error("Groq returned non-string content");
  }

  return response.content;
}
