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

**Current Phase:** Phase 1 (Completed)

**What was completed in Phase 1:**
- Scaffolded a blank Next.js 15 project with TypeScript, Tailwind CSS, and ESLint.
- Enforced strict architectural constraints (Node.js v24, npm only, `src` structure).
- Installed core dependencies for LangChain, Gemini, and Tavily.
- Set up environment variable templates and `.gitignore` configurations.
- Stripped unnecessary boilerplate to provide a minimal landing page confirming project startup.

## Current Folder Structure
```
ai-investment-research-agent/
│
├── public/                 # Static public assets
├── src/                    # Application source code
│   └── app/                # Next.js App Router root
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

## Remaining Phases
- Phase 2: Enterprise Folder Structure
- Phase 3: Gemini + Tavily Integration
- Phase 4: Research Agent
- Phase 5: Financial Agent
- Phase 6: Risk Agent
- Phase 7: Decision Agent
- Phase 8: LangGraph Workflow
- Phase 9: Frontend
- Phase 10: Testing
- Phase 11: Deployment

## Next Phase
**Phase 2: Enterprise Folder Structure**
The upcoming phase will focus on designing the enterprise-grade folder structure to support multiple AI agents, shared services, LangGraph workflows, prompts, tools, reusable utilities, and future scalability.
