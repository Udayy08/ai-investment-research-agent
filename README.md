# AI Investment Research Agent

## Project Overview
The AI Investment Research Agent is an advanced AI application that allows users to input the name of a company and automatically executes a comprehensive investment research workflow. The system relies on multiple specialized AI agents (Research, Financial, Risk, Decision) to generate a Final Investment Report. 

## Technology Stack
- **Next.js 15 (App Router)**: Provides a robust full-stack React framework for high-performance applications with built-in API routing and SSR.
- **TypeScript**: Used in strict mode to ensure type safety, better developer experience, and fewer runtime errors.
- **Tailwind CSS (v4)**: Enables rapid, utility-first UI styling that guarantees a clean and modular design system.
- **LangChain.js / LangGraph.js**: Acts as the orchestration layer for the multi-agent workflows, managing memory, tool access, and graph-based execution.
- **Gemini 2.5 Flash**: The core LLM powering the agentic reasoning due to its low latency and high reasoning capability.
- **Tavily Search**: Optimized AI search engine used strictly by the Research Agent to gather up-to-date company data.
- **Node.js LTS (v24.18.0)**: The designated runtime environment, ensuring long-term stability and framework compatibility.
- **npm**: The exclusive package manager chosen for consistent dependency resolution across the team.

## Architectural Decisions
- **`src` Directory Structure**: All application code must be housed in `src/` to separate it from configuration files, paving the way for scalable agents, workflows, and shared services.
- **Package Manager**: npm is locked in as the exclusive package manager. No `pnpm` or `yarn` lockfiles are permitted.
- **Phase Boundaries**: The project is being developed incrementally. Code and architecture must strictly adhere to the current phase specifications with no assumptions or placeholder implementations for future phases.
- **Environment Management**: `.env.example` serves as the committed template, while `.env.local` is strictly ignored via `.gitignore` for local development.

## Current Project Progress
**Completed Phases:**
- Phase 1: Project Initialization
- Phase 2: Enterprise Project Structure
- Phase 3: Shared AI Services
- Phase 4.1: Research Planner
- Phase 4.2: Search Executor
- Phase 4.3: Research Summarizer
- Phase 4.4: Research Agent Orchestrator
- **Phase 4: Research Agent (Fully Complete)**
- **Phase 5: Financial Agent (Fully Complete)**
- **Phase 6: Risk Agent (Fully Complete)**

**Current Phase:** Phase 7 (Pending)

**What was completed in Phase 1:**
- Scaffolded a blank Next.js 15 project with TypeScript, Tailwind CSS, and ESLint.
- Enforced strict architectural constraints (Node.js v24, npm only, `src` structure).
- Installed core dependencies for LangChain, Gemini, and Tavily.
- Set up environment variable templates and `.gitignore` configurations.
- Stripped unnecessary boilerplate to provide a minimal landing page confirming project startup.

**What was completed in Phase 2:**
- Established an enterprise-grade folder structure inside the `src/` directory to support scalable development of multiple AI agents, shared services, and tools.
- Set up directories for agents (research, financial, risk, decision), workflow graph, shared services, tools, types, constants, and utilities.
- Placed `.gitkeep` files in empty directories to ensure they are tracked in Git.
- Documented the architecture and updated the living engineering document (`README.md`).

**What was completed in Phase 3:**
- Implemented `env.ts` with strict schema validation using Zod to parse and validate `GOOGLE_API_KEY` and `TAVILY_API_KEY`, displaying user-friendly error messages if keys are missing.
- Built a reusable Gemini service in `gemini.ts` using the official `@google/generative-ai` SDK, exporting `generateText()` for easy prompting with model parameters (like temperature, max tokens, system instructions).
- Built a reusable Tavily service in `tavily.ts` using the `tavily` SDK, exporting `performSearch()` which returns clean, normalized search results containing only the title, URL, and snippet.
- Created `scripts/test-services.ts` to test env validation, Gemini generation, and Tavily search.

**What was completed in Phase 4:**
- **Phase 4.1**: Built the Research Planner to deterministically define a list of `ResearchTopic`s.
- **Phase 4.2**: Built the Search Executor to independently query the web for raw evidence mapped to topics.
- **Phase 4.3**: Built the Research Summarizer to synthesize search evidence into structured facts using Gemini LLM.
- **Phase 4.4**: Built the Orchestrator to tie the pipeline together, resolve metadata, and produce the flattened `ResearchReport Contract v2.0`.

**What was completed in Phase 5:**
- **Financial Agent Pipeline**: Built an independent LangChain-based pipeline using `ChatGoogleGenerativeAI` with structured output (`zod`).
- **Financial Report Contract**: Established the `FinancialReport` schema ensuring traceability by coupling evidence directly to corresponding Research Report sections.
- **Evaluation Logic**: Engineered the agent to grade Business Quality, Market Position, Financial Health, etc. generating an `overallScore` and assigning explicitly defined `reasoning` without inventing external data.

**What was completed in Phase 6:**
- **Risk Agent Pipeline**: Built an independent LangChain-based pipeline that fuses data from both `ResearchReport` and `FinancialReport`.
- **Risk Report Contract**: Established the `RiskReport` schema defining strict categories (Competitive, Market, Operational, Technology, Regulatory, Leadership, Reputation, Financial).
- **Risk Item Structuring**: Identified individual risks with precise mapping to `Probability`, `Impact`, `Severity`, and `MitigationFeasibility` levels.
- **DFA Compilation Optimizations**: Engineered Zod schemas strategically using string constraints in the system prompt rather than deeply nested `z.enum` types to successfully bypass LLM structured output DFA state explosion limits.

## Current Folder Structure
```
ai-investment-research-agent/
│
├── public/                 # Static public assets
├── scripts/                # Utility scripts (e.g. test scripts)
│   ├── test-services.ts    # Service integration test CLI script
│   ├── test-planner.ts     # Research Planner unit test CLI script
│   ├── test-search.ts      # Search Executor integration test CLI script
│   ├── test-summarizer.ts  # Research Summarizer integration test CLI script
│   └── test-agent.ts       # Research Agent Orchestrator integration test CLI script
├── src/                    # Application source code
│   ├── app/                # Next.js App Router root
│   ├── agents/             # Modular agent logic folder
│   │   ├── research/       # Research agent modules and tasks
│   │   │   ├── agent.ts        # Research Agent Orchestrator: wires pipeline, returns AgentResult
│   │   │   ├── planner.ts      # Research Planner: validates input, builds ResearchPlan
│   │   │   ├── search.ts       # Search Executor: queries Tavily per topic, returns SearchReport
│   │   │   └── summarizer.ts   # Research Summarizer: calls Gemini per topic, returns ResearchReport
│   │   ├── financial/      # Financial analysis agent modules and tasks
│   │   ├── risk/           # Risk assessment agent modules and tasks
│   │   └── decision/       # Decision-making and report synthesizer agent
│   ├── graph/              # LangGraph workflow orchestration layer
│   ├── services/           # Shared service clients (Gemini, Tavily API wrappers)
│   │   ├── env.ts          # Environment variables validation & export
│   │   ├── gemini.ts       # Shared Gemini LLM API client wrapper
│   │   └── tavily.ts       # Shared Tavily Search API client wrapper
│   ├── tools/              # Reusable agent tools (e.g., search tools, calculators)
│   ├── types/              # Centralized TypeScript declarations and schemas
│   │   └── research.ts     # All research pipeline interfaces: ResearchTopic → ResearchReport
│   ├── constants/          # Application-wide configuration and threshold constants
│   │   └── research-topics.ts  # Predefined ordered list of investment research topics
│   └── utils/              # Shared helper and utility functions
│
├── package.json            # npm dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── next.config.ts          # Next.js configuration
├── README.md               # Living engineering document
├── .gitignore              # Git ignore rules
├── .env.example            # Environment variable template
├── .nvmrc                  # Node.js version constraint
├── eslint.config.mjs       # ESLint configuration
└── postcss.config.mjs      # PostCSS configuration for Tailwind
```

### Folder Structure Explanation
To keep the architecture simple, clean, and easily understandable for any developer, each directory serves a distinct purpose:
- **`src/agents/`**: Houses the logical implementation, prompts, and system instructions for each independent AI agent (Research, Financial, Risk, Decision). Storing them in dedicated subfolders keeps agent-specific concerns isolated.
- **`src/graph/`**: Contains the LangGraph workflows, state definitions, node handlers, and edge conditions that orchestrate the interaction between the agents.
- **`src/services/`**: Holds API integration services (e.g., Tavily API client, Gemini SDK initializers) that are shared across agents and other parts of the application.
- **`src/tools/`**: Contains custom tools used by the AI agents (e.g., web search tools, calculation utilities) defined using Zod schemas.
- **`src/types/`**: Houses all shared TypeScript interfaces, type definitions, and Zod validator schemas to enforce consistent data shapes across workflows and API calls.
- **`src/constants/`**: Holds application-wide static constants such as model parameter settings, limit constraints, decision thresholds, and styling configs.
- **`src/utils/`**: Reserved for simple, pure utility functions (e.g., string formatting, logging, general helpers) utilized across different directories.

### Shared AI Services Architecture
To prevent duplication and keep agent implementation clean, Phase 3 centralizes all external service communication:
- **`src/services/env.ts`**: Validates the presence of `GOOGLE_API_KEY` and `TAVILY_API_KEY` on startup using `zod`. If either is missing, it interrupts execution with a descriptive instruction on how to populate `.env.local`.
- **`src/services/gemini.ts`**: Connects to the official `@google/generative-ai` SDK and utilizes `gemini-2.5-flash`. It encapsulates LLM calls inside `generateText(prompt, options)`.
- **`src/services/tavily.ts`**: Wrapper for the `tavily` API client that exposes a `performSearch(query, options)` function. It normalizes all search responses into a simple, consistent array of `SearchResult` objects:
  ```typescript
  export interface SearchResult {
    title: string;
    url: string;
    content: string;
  }
  ```

## Research Agent Architecture

The complete Research pipeline executes sequentially to build a comprehensive, factual research report from the ground up:

`Company Name`
↓
**Research Planner**: Determines *what* needs to be researched by generating a deterministic, prioritized list of research topics.
↓
**Search Executor**: Determines *how* to find the data by generating targeted web search queries and collecting raw evidence from Tavily.
↓
**Research Summarizer**: Synthesizes the raw evidence into concise, citation-backed sections using Gemini LLM.
↓
**Research Agent Orchestrator**: Coordinates the above three modules, handles errors gracefully, and assembles the final metadata.
↓
`Research Report Contract v2.0`

### Research Report Contract v2.0
The Research Report Contract v2.0 is a strictly defined, flattened TypeScript domain model (`ResearchReport`) that serves as the shared contract for all downstream modules. 
- **Consistency**: It standardizes how information is structured (e.g. `summary`, `confidence`, `sources`, `status`) irrespective of which LLM provider was used.
- **Traceability**: It retains both section-level and item-level sources ensuring every fact can be traced back to its origin.
- **Foundation**: It serves as the single source of truth for the upcoming Financial Agent, Risk Agent, and Decision Agent, decoupling them from raw data collection.

## Remaining Phases
- Phase 7: Decision Agent
- Phase 8: LangGraph Workflow
- Phase 9: Frontend
- Phase 10: Testing
- Phase 11: Deployment

## Next Phase
**Phase 7: Decision Agent**
The Decision Agent will consume the `ResearchReport`, `FinancialReport`, and `RiskReport` to generate a final investment recommendation.

---

## Phase 6 – Risk Agent

### Purpose
The Risk Agent is the third AI agent in the system. It consumes the completed `ResearchReport` from Phase 4 and `FinancialReport` from Phase 5 to produce a structured `RiskReport`. 
It identifies, evaluates, prioritizes, and explains investment risks without generating investment recommendations.

### Responsibilities
- Receive both `ResearchReport` and `FinancialReport`.
- Evaluate Competitive, Market, Operational, Technology, Regulatory, Leadership, Reputation, and Financial Risks.
- Generate an overall risk score and an overall qualitative risk level (Very Low to Very High).
- Ensure all risks are mapped explicitly to the exact originating report and section without hallucinating evidence.

### Input
`ResearchReport` (Contract v2.0)
`FinancialReport` (Contract v1.0)

### Output
`RiskReport` (Contract v1.0)
```typescript
{
  metadata: RiskMetadata;
  executiveSummary: RiskExecutiveSummary;
  competitiveRisks: RiskCategoryEvaluation;
  marketRisks: RiskCategoryEvaluation;
  operationalRisks: RiskCategoryEvaluation;
  technologyRisks: RiskCategoryEvaluation;
  regulatoryRisks: RiskCategoryEvaluation;
  leadershipRisks: RiskCategoryEvaluation;
  reputationRisks: RiskCategoryEvaluation;
  financialRisks: RiskCategoryEvaluation;
  overallRiskScore: number;
  overallRiskLevel: string;
  confidence: number;
}
```

### Key Files
| File | Responsibility |
|---|---|
| `src/agents/risk/agent.ts` | Orchestrator — validates company match across reports, calls analyzer, and injects metadata |
| `src/agents/risk/analyzer.ts` | Evaluates the reports using LangChain structured output with strict bounds |
| `src/types/risk.ts` | TypeScript interfaces and Zod schemas for the Risk Report |
| `scripts/test-risk.ts` | Integration test runner with cross-company validation checks |

---

## Phase 5 – Financial Agent

### Purpose
The Financial Agent is the second AI agent in the system. It consumes the completed `ResearchReport` from Phase 4 and produces a structured `FinancialReport`. 
It relies exclusively on the provided research without performing external web searches or fetching stock prices.

### Responsibilities
- Receive the `ResearchReport`.
- Evaluate Business Quality, Market Position, Competitive Advantage, Growth Potential, Innovation, Operational Strength, and Financial Health.
- Generate an overall financial score and confidence metric.
- Extract strengths and weaknesses backed by structured evidence tracing back to the Research Report.

### Input
`ResearchReport` (Contract v2.0)

### Output
`FinancialReport` (Contract v1.0)
```typescript
{
  metadata: FinancialMetadata;
  executiveSummary: string;
  businessQuality: FinancialEvaluation;
  marketPosition: FinancialEvaluation;
  competitiveAdvantage: FinancialEvaluation;
  growthPotential: FinancialEvaluation;
  innovation: FinancialEvaluation;
  operationalStrength: FinancialEvaluation;
  financialHealth: FinancialEvaluation;
  strengths: FinancialStrength[];
  weaknesses: FinancialWeakness[];
  overallScore: number;
  confidence: number;
}
```

### Key Files
| File | Responsibility |
|---|---|
| `src/agents/financial/agent.ts` | Orchestrator — calls analyzer and injects metadata |
| `src/agents/financial/analyzer.ts` | Evaluates the report using LangChain structured output |
| `src/types/financial.ts` | TypeScript interfaces and Zod schemas for the Financial Report |
| `scripts/test-financial.ts` | Integration test runner |

---

## Phase 4.1 – Research Planner

### Purpose
The Research Planner is the first module in the Research Agent pipeline.
It determines **what information must be collected** about a company before any web searches begin.
It is intentionally simple, deterministic, and free of any AI or network calls.

### Responsibilities
- Accept a company name as input.
- Validate the name (reject empty strings and whitespace-only input).
- Trim unnecessary whitespace from the name.
- Return a structured `ResearchPlan` containing the company name and a fixed ordered list of research topics.

### Input
```typescript
{ companyName: string }
```

### Output
```typescript
{
  company: string;
  researchTopics: [
    { id: "company_overview", title: "Company Overview",   priority: 1 },
    { id: "industry",         title: "Industry",           priority: 2 },
    { id: "business_model",   title: "Business Model",     priority: 3 },
    { id: "leadership",       title: "Leadership",         priority: 4 },
    { id: "competitors",      title: "Competitors",        priority: 5 },
    { id: "recent_news",      title: "Recent News",        priority: 6 },
    { id: "market_sentiment", title: "Market Sentiment",   priority: 7 },
    { id: "key_strengths",    title: "Key Strengths",      priority: 8 },
    { id: "key_challenges",   title: "Key Challenges",     priority: 9 }
  ]
}
```

### Key Files
| File | Responsibility |
|---|---|
| `src/agents/research/planner.ts` | Validates input and produces a `ResearchPlan` |
| `src/constants/research-topics.ts` | Stores the predefined list of `ResearchTopic` objects |
| `src/types/research.ts` | TypeScript interfaces: `ResearchTopic`, `ResearchPlan`, `PlannerInput` |
| `scripts/test-planner.ts` | Unit test runner for the planner |

### How Phase 4.2 Consumes This Output
The Search Executor (Phase 4.2) receives the `ResearchPlan` from this planner.
For each `ResearchTopic` in `researchTopics`, it generates a focused search query and calls the Tavily service to retrieve raw search results.

---

## Phase 4.2 – Search Executor

### Purpose
The Search Executor is the second module in the Research Agent pipeline.
It determines **how** information is retrieved by converting a `ResearchPlan` into structured web search results.
It makes no AI calls and performs no summarization or analysis.

### Responsibilities
- Receive a `ResearchPlan` produced by the Research Planner.
- Build a deterministic search query for each research topic.
- Call the shared Tavily service for each query.
- Normalize the raw results into `SearchEvidence` records (title, url, snippet).
- Return a `SearchReport` containing all collected evidence.

### Input
```typescript
{
  company: string;
  researchTopics: ResearchTopic[];
}
```

### Output
```typescript
{
  company: string;
  searchResults: [
    {
      topic: string;    // e.g. "Leadership"
      query: string;    // e.g. "Tesla leadership CEO executive team"
      results: [
        { title: string; url: string; snippet: string; }
      ];
    }
  ];
}
```

### Query Generation
Queries are built deterministically using fixed templates — no AI is involved:

| Topic | Query Pattern |
|---|---|
| Company Overview | `{company} company overview` |
| Industry | `{company} industry and sector` |
| Business Model | `{company} business model revenue streams` |
| Leadership | `{company} leadership CEO executive team` |
| Competitors | `{company} competitors and rival companies` |
| Recent News | `{company} latest news` |
| Market Sentiment | `{company} investor market sentiment` |
| Key Strengths | `{company} competitive advantages key strengths` |
| Key Challenges | `{company} business challenges risks` |

### Key Files
| File | Responsibility |
|---|---|
| `src/agents/research/search.ts` | Search Executor — builds queries, calls Tavily, returns `SearchReport` |
| `src/types/research.ts` | Adds `SearchEvidence`, `TopicSearchResult`, `SearchReport` interfaces |
| `scripts/test-search.ts` | Integration test runner (requires real API credentials) |

### How Phase 4.3 Consumes This Output
The Research Summarizer (Phase 4.3) receives the `SearchReport` from this executor.
For each `TopicSearchResult`, it uses the Gemini service to synthesize the raw evidence snippets into a concise, citation-preserving research summary.

---

## Phase 4.3 – Research Summarizer

### Purpose
The Research Summarizer is the third module in the Research Agent pipeline.
It transforms raw web evidence from the Search Executor into a fully structured, citation-backed **Research Report** ready for downstream agents.
It uses Gemini to produce factual, professional summaries — one topic at a time.

### Responsibilities
- Receive a `SearchReport` produced by the Search Executor.
- For each research topic, build a focused prompt using only that topic's evidence.
- Call the shared Gemini service (`generateText`) with a fixed system instruction.
- Map each Gemini response to the correct `ResearchReport` field.
- Collect all original evidence as `ReportSource` citations in `sources`.
- Return a complete `ResearchReport`.

### Summarization Rules
- Use only the supplied evidence — no external knowledge, no invented facts.
- If evidence is insufficient, the model responds with `"Insufficient evidence available."`.
- No investment recommendations or financial analysis.
- Concise 2–4 sentence summaries per topic.
- Rate-limited to 5 Gemini calls per minute (13-second delay between calls) for free-tier compatibility.

### Input
```typescript
{
  company: string;
  searchResults: TopicSearchResult[];  // from Search Executor
}
```

### Output – Research Report Schema
```typescript
{
  company: string;
  companyOverview: string;
  industry: string;
  businessModel: string;
  leadership: string;
  competitors: string[];
  recentNews: string[];
  marketSentiment: string;
  keyStrengths: string[];
  keyChallenges: string[];
  sources: [
    {
      section: string;  // e.g. "Leadership"
      title: string;
      url: string;
      snippet: string;
    }
  ];
}
```

### Key Files
| File | Responsibility |
|---|---|
| `src/agents/research/summarizer.ts` | Research Summarizer — calls Gemini per topic, returns `ResearchReport` |
| `src/types/research.ts` | Adds `ReportSource` and `ResearchReport` interfaces |
| `scripts/test-summarizer.ts` | Integration test runner (requires real API credentials) |

### How Phase 4.4 Consumes This Output
The Research Agent Orchestrator (Phase 4.4) wires the Planner → Search Executor → Summarizer into a single callable function.
It accepts a company name as input and returns the complete `ResearchReport` as its only output.

---

## Phase 4.4 – Research Agent Orchestrator

### Purpose
The Research Agent Orchestrator is the final module of the Research Agent pipeline. 
It does not contain research logic itself; instead, it orchestrates the modules that have already been implemented to provide a clean, single entry point for generating a research report.

### Responsibilities
- Accept the company name as input.
- Execute the Research Planner (`createResearchPlan`).
- Execute the Search Executor (`executeSearch`).
- Execute the Research Summarizer (`summarizeResearch`).
- Return the final structured `ResearchReport` wrapped in an `AgentResult` envelope.
- Handle failures gracefully at each step, returning meaningful errors without crashing.

### Pipeline
`Company Name` → `Planner` → `Search Executor` → `Summarizer` → `AgentResult (containing ResearchReport)`

### Input
```typescript
companyName: string  // e.g. "Microsoft"
```

### Output – AgentResult Schema
```typescript
{
  company: string;
  status: "completed" | "failed";
  researchReport: ResearchReport | null;
  error?: string; // Populated only when status is "failed"
}
```

### Key Files
| File | Responsibility |
|---|---|
| `src/agents/research/agent.ts` | Research Agent Orchestrator — coordinates the pipeline and handles errors |
| `src/types/research.ts` | Adds the `AgentResult` envelope interface |
| `scripts/test-agent.ts` | Integration test runner for the orchestrator |

### How Phase 5 Consumes This Output
The Financial Agent (Phase 5) will consume the structured `ResearchReport` from the Research Agent (via the `AgentResult`) and use it to evaluate the company's financial strength.

