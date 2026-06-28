import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { FinancialReport } from "@/types/financial";

interface Props {
  report: FinancialReport;
}

export function FinancialAccordion({ report }: Props) {
  const sections = [
    { title: "Business Quality", data: report.businessQuality },
    { title: "Market Position", data: report.marketPosition },
    { title: "Competitive Advantage", data: report.competitiveAdvantage },
    { title: "Growth Potential", data: report.growthPotential },
    { title: "Innovation", data: report.innovation },
    { title: "Operational Strength", data: report.operationalStrength },
    { title: "Financial Health", data: report.financialHealth },
  ];

  return (
    <Accordion className="w-full bg-card border rounded-lg mb-4 px-4">
      <AccordionItem value="financial" className="border-b-0">
        <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
          <div className="flex items-center gap-3">
            Financial Report
            <Badge variant="outline" className="font-normal text-xs">
              Score: {report.overallScore}/100
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-6 space-y-6 text-base text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-1">Executive Summary</h4>
            <p className="leading-relaxed">{report.executiveSummary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((sec) => (
              <div key={sec.title} className="p-4 bg-muted/30 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-foreground">{sec.title}</h4>
                  <Badge variant="secondary">{sec.data.score}/100</Badge>
                </div>
                <p className="text-sm mb-2">{sec.data.summary}</p>
                <p className="text-xs text-muted-foreground italic">Reasoning: {sec.data.reasoning}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <h4 className="font-medium text-emerald-600 dark:text-emerald-500 mb-2">Strengths</h4>
              <div className="space-y-3 text-sm">
                {report.strengths.map((s, i) => (
                  <div key={i} className="bg-muted/20 p-3 rounded border">
                    <span className="font-medium text-foreground block mb-1">{s.title} (Impact: {s.impact})</span>
                    <span className="text-muted-foreground">{s.description}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-rose-600 dark:text-rose-500 mb-2">Weaknesses</h4>
              <div className="space-y-3 text-sm">
                {report.weaknesses.map((w, i) => (
                  <div key={i} className="bg-muted/20 p-3 rounded border">
                    <span className="font-medium text-foreground block mb-1">{w.title} (Severity: {w.severity})</span>
                    <span className="text-muted-foreground">{w.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
