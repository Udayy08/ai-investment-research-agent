import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { GraphState } from "@/graph/graph-state";

interface Props {
  state: GraphState;
}

export function SourcesAccordion({ state }: Props) {
  // Aggregate sources from all reports safely
  const researchSources = React.useMemo(() => {
    const report = state.researchResult?.researchReport;
    if (!report) return [];
    const all = [];
    if (report.companyOverview?.sources) all.push(...report.companyOverview.sources.map(s => ({ section: "Company Overview", ...s })));
    if (report.industry?.sources) all.push(...report.industry.sources.map(s => ({ section: "Industry", ...s })));
    if (report.businessModel?.sources) all.push(...report.businessModel.sources.map(s => ({ section: "Business Model", ...s })));
    if (report.leadership?.sources) all.push(...report.leadership.sources.map(s => ({ section: "Leadership", ...s })));
    if (report.marketSentiment?.sources) all.push(...report.marketSentiment.sources.map(s => ({ section: "Market Sentiment", ...s })));
    if (report.competitors?.sources) all.push(...report.competitors.sources.map(s => ({ section: "Competitors", ...s })));
    if (report.recentNews?.sources) all.push(...report.recentNews.sources.map(s => ({ section: "Recent News", ...s })));
    if (report.keyStrengths?.sources) all.push(...report.keyStrengths.sources.map(s => ({ section: "Key Strengths", ...s })));
    if (report.keyChallenges?.sources) all.push(...report.keyChallenges.sources.map(s => ({ section: "Key Challenges", ...s })));
    return all;
  }, [state.researchResult]);

  const financialSources = React.useMemo(() => {
    const report = state.financialResult?.financialReport;
    if (!report) return [];
    const all = [];
    if (report.businessQuality?.evidence) all.push(...report.businessQuality.evidence.map(e => ({ section: "Business Quality", ...e })));
    if (report.marketPosition?.evidence) all.push(...report.marketPosition.evidence.map(e => ({ section: "Market Position", ...e })));
    if (report.competitiveAdvantage?.evidence) all.push(...report.competitiveAdvantage.evidence.map(e => ({ section: "Competitive Advantage", ...e })));
    if (report.growthPotential?.evidence) all.push(...report.growthPotential.evidence.map(e => ({ section: "Growth Potential", ...e })));
    if (report.innovation?.evidence) all.push(...report.innovation.evidence.map(e => ({ section: "Innovation", ...e })));
    if (report.operationalStrength?.evidence) all.push(...report.operationalStrength.evidence.map(e => ({ section: "Operational Strength", ...e })));
    if (report.financialHealth?.evidence) all.push(...report.financialHealth.evidence.map(e => ({ section: "Financial Health", ...e })));
    return all;
  }, [state.financialResult]);

  const riskSources = React.useMemo(() => {
    const report = state.riskResult?.riskReport;
    if (!report) return [];
    // Risk items don't have individual source URLs in contract v1.0, but we display them if present.
    // Wait, risk report evidence maps to sections from Research/Financial reports. We can display them if needed.
    // The requirement says group by report (Research, Financial, Risk).
    return [];
  }, [state.riskResult]);

  const totalSources = researchSources.length + financialSources.length + riskSources.length;

  if (totalSources === 0) return null;

  return (
    <Accordion className="w-full bg-card border rounded-lg mb-8 px-4">
      <AccordionItem value="sources" className="border-b-0">
        <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
          <div className="flex items-center gap-3">
            Evidence & Sources
            <Badge variant="outline" className="font-normal text-xs">
              Count: {totalSources}
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-6">
          
          <ScrollArea className="h-[400px] pr-4">
            
            {researchSources.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3 sticky top-0 bg-card py-1">Research Sources</h4>
                <div className="space-y-4">
                  {researchSources.map((s, i) => (
                    <div key={i} className="text-sm bg-muted/20 p-3 rounded border">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{s.title}</span>
                        <Badge variant="secondary" className="text-[10px]">{s.section}</Badge>
                      </div>
                      <a href={s.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs block mb-2 break-all">
                        {s.url}
                      </a>
                      <p className="text-muted-foreground text-xs leading-relaxed">{s.snippet}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {financialSources.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3 sticky top-0 bg-card py-1">Financial Evidence Traces</h4>
                <div className="space-y-4">
                  {financialSources.map((e, i) => (
                    <div key={i} className="text-sm bg-muted/20 p-3 rounded border">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">Derived from: {e.sourceSection}</span>
                        <Badge variant="secondary" className="text-[10px]">{e.section}</Badge>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed mt-1">{e.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
