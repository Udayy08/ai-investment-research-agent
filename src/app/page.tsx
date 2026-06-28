"use client";

import { useState } from "react";
import type { GraphState } from "@/graph/graph-state";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SearchBar } from "@/components/dashboard/search-bar";
import { EmptyState } from "@/components/dashboard/empty-state";
import { WorkflowProgress } from "@/components/dashboard/workflow-progress";
import { RecommendationCard } from "@/components/dashboard/recommendation-card";
import { ResearchAccordion } from "@/components/dashboard/research-accordion";
import { FinancialAccordion } from "@/components/dashboard/financial-accordion";
import { RiskAccordion } from "@/components/dashboard/risk-accordion";
import { DecisionAccordion } from "@/components/dashboard/decision-accordion";
import { SourcesAccordion } from "@/components/dashboard/sources-accordion";
import { ErrorBanner } from "@/components/dashboard/error-banner";

export default function Home() {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<GraphState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setLoading(true);
    setState(null);
    setError(null);

    // Provide initial state for loading indicator
    setState({
      companyName: companyName.trim(),
      currentStep: "research",
      workflowStatus: "running",
      errorMessage: null,
      workflowStartTime: new Date().toISOString(),
      workflowCompletionTime: null,
      executionLog: [],
      researchResult: null,
      financialResult: null,
      riskResult: null,
      decisionResult: null,
    });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName: companyName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unexpected error occurred.");
      }

      setState(data);
      if (data.workflowStatus === "failed") {
        setError(data.errorMessage || "Workflow failed during execution.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setState(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setCompanyName("");
    setState(null);
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <DashboardHeader />

        <SearchBar 
          companyName={companyName} 
          setCompanyName={setCompanyName} 
          onAnalyze={handleAnalyze} 
          loading={loading} 
        />

        <ErrorBanner error={error || ""} onRetry={handleRetry} />

        {!state && !error && !loading && (
          <EmptyState />
        )}

        {state && (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <WorkflowProgress executionLog={state.executionLog} currentStep={state.currentStep} />
            
            {state.decisionResult?.decisionReport && state.financialResult?.financialReport && state.riskResult?.riskReport && (
              <RecommendationCard 
                decision={state.decisionResult} 
                financial={state.financialResult} 
                risk={state.riskResult} 
              />
            )}

            {state.researchResult?.researchReport && (
              <ResearchAccordion report={state.researchResult.researchReport} />
            )}

            {state.financialResult?.financialReport && (
              <FinancialAccordion report={state.financialResult.financialReport} />
            )}

            {state.riskResult?.riskReport && (
              <RiskAccordion report={state.riskResult.riskReport} />
            )}

            {state.decisionResult?.decisionReport && (
              <DecisionAccordion report={state.decisionResult.decisionReport} />
            )}

            {(state.researchResult || state.financialResult) && (
              <SourcesAccordion state={state} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
