import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { RiskReport } from "@/types/risk";

interface Props {
  report: RiskReport;
}

function getRiskLevelColor(level: string) {
  switch (level) {
    case "Very Low": return "text-emerald-500 bg-emerald-500/10";
    case "Low": return "text-green-500 bg-green-500/10";
    case "Medium": return "text-amber-500 bg-amber-500/10";
    case "High": return "text-orange-500 bg-orange-500/10";
    case "Very High": return "text-red-500 bg-red-500/10";
    default: return "bg-secondary";
  }
}

export function RiskAccordion({ report }: Props) {
  const sections = [
    { title: "Competitive Risks", data: report.competitiveRisks },
    { title: "Market Risks", data: report.marketRisks },
    { title: "Operational Risks", data: report.operationalRisks },
    { title: "Technology Risks", data: report.technologyRisks },
    { title: "Regulatory Risks", data: report.regulatoryRisks },
    { title: "Leadership Risks", data: report.leadershipRisks },
    { title: "Reputation Risks", data: report.reputationRisks },
    { title: "Financial Risks", data: report.financialRisks },
  ];

  return (
    <Accordion className="w-full bg-card border rounded-lg mb-4 px-4">
      <AccordionItem value="risk" className="border-b-0">
        <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
          <div className="flex items-center gap-3">
            Risk Report
            <Badge className={`font-normal text-xs ${getRiskLevelColor(report.overallRiskLevel)}`} variant="outline">
              Level: {report.overallRiskLevel}
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-6 space-y-6 text-base text-muted-foreground">
          <div>
            <h4 className="font-medium text-foreground mb-1">Executive Summary</h4>
            <div className="space-y-3">
              <p><strong>Overall Risk Level:</strong> {report.executiveSummary.overallRiskLevel}</p>
              <p><strong>Highest Priority Risks:</strong> {report.executiveSummary.highestPriorityRisks}</p>
              <p><strong>Positive Factors:</strong> {report.executiveSummary.positiveRiskFactors}</p>
              <p><strong>Conclusion:</strong> {report.executiveSummary.overallAssessment}</p>
            </div>
          </div>

          <div className="space-y-6">
            {sections.map((sec) => (
              <div key={sec.title} className="p-4 bg-muted/20 border rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-foreground">{sec.title}</h4>
                  <Badge variant="secondary">Count: {sec.data.riskCount}</Badge>
                </div>
                
                {sec.data.risks.length === 0 ? (
                  <p className="text-sm italic">No significant risks identified in this category.</p>
                ) : (
                  <div className="space-y-4">
                    {sec.data.risks.map((risk, i) => (
                      <div key={i} className="text-sm space-y-1 bg-background p-3 rounded border shadow-sm">
                        <p className="font-medium text-foreground mb-1">{risk.title}</p>
                        <p className="text-muted-foreground mb-2">{risk.description}</p>
                        <div className="flex flex-wrap gap-2 text-[10px] pt-1">
                          <Badge variant="outline">Prob: {risk.probability}</Badge>
                          <Badge variant="outline">Impact: {risk.impact}</Badge>
                          <Badge variant="outline">Severity: {risk.severity}</Badge>
                          <Badge variant="outline">Mitigation: {risk.mitigationFeasibility}</Badge>
                        </div>
                        {risk.possibleMitigation && (
                          <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                            <strong>Mitigation:</strong> {risk.possibleMitigation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
