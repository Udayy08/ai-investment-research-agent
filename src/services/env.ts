import { z } from "zod";

const envSchema = z.object({
  GOOGLE_API_KEY: z.string().min(1, "GOOGLE_API_KEY is required but was empty."),
  TAVILY_API_KEY: z.string().min(1, "TAVILY_API_KEY is required but was empty."),
  GROQ_API_KEY: z.string().optional().default(""),
  DEFAULT_PROVIDER: z.enum(["gemini", "groq"]).default("gemini"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

let parsedEnv: z.infer<typeof envSchema>;

try {
  parsedEnv = envSchema.parse({
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    DEFAULT_PROVIDER: process.env.DEFAULT_PROVIDER,
    NODE_ENV: process.env.NODE_ENV,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    const errorDetails = error.issues
      .map((issue) => {
        const field = issue.path.join(".");
        return `  - ${field}: ${issue.message}`;
      })
      .join("\n");

    const userFriendlyMessage = [
      "=================================================================",
      " ENVIRONMENT CONFIGURATION ERROR",
      "=================================================================",
      "Missing or invalid environment variables detected:",
      errorDetails,
      "",
      "How to resolve:",
      "1. Create a '.env.local' file in the root of the project if it doesn't exist.",
      "2. Define the missing key(s) as shown below:",
      "   GOOGLE_API_KEY=your_google_gemini_api_key",
      "   TAVILY_API_KEY=your_tavily_search_api_key",
      "   GROQ_API_KEY=your_groq_api_key (optional)",
      "   DEFAULT_PROVIDER=gemini",
      "3. Restart the development server or rerun the script.",
      "=================================================================",
    ].join("\n");

    throw new Error(userFriendlyMessage);
  }
  throw error;
}

export const env = parsedEnv;
