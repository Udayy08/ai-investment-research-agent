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

**Current Phase:** Phase 3 (Completed)

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

## Current Folder Structure
```
ai-investment-research-agent/
│
├── public/                 # Static public assets
├── scripts/                # Utility scripts (e.g. test scripts)
│   └── test-services.ts    # Service integration test CLI script
├── src/                    # Application source code
│   ├── app/                # Next.js App Router root
│   ├── agents/             # Modular agent logic folder
│   │   ├── research/       # Research agent modules and tasks
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
│   ├── constants/          # Application-wide configuration and threshold constants
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

## Remaining Phases
- Phase 4: Research Agent
- Phase 5: Financial Agent
- Phase 6: Risk Agent
- Phase 7: Decision Agent
- Phase 8: LangGraph Workflow
- Phase 9: Frontend
- Phase 10: Testing
- Phase 11: Deployment

## Next Phase
**Phase 4: Research Agent**
The upcoming phase will focus on implementing the Planning Module for the Research Agent. This module determines what details are needed for a company's investment analysis and schedules the search queries before execution.

