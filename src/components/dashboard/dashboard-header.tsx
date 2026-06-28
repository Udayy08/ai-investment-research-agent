import { ThemeToggle } from "../theme-toggle";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between py-6 mb-8 border-b">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Investment Research Agent</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Multi-Agent Investment Analysis using LangGraph and Gemini
        </p>
      </div>
      <ThemeToggle />
    </header>
  );
}
