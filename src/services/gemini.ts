import { GoogleGenerativeAI, type ResponseSchema } from "@google/generative-ai";
import { env } from "./env";

// Initialize the Google Generative AI client internally
const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);

export interface GenerateTextOptions {
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
  responseSchema?: ResponseSchema;
}

/**
 * Reusable function to generate text response from Gemini using gemini-2.5-flash.
 */
export async function generateText(
  prompt: string,
  options?: GenerateTextOptions
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: options?.systemInstruction,
    generationConfig: {
      temperature: options?.temperature ?? 0.1,
      maxOutputTokens: options?.maxOutputTokens,
      responseMimeType: options?.responseMimeType,
      responseSchema: options?.responseSchema,
    },
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text;
}
