import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { DecisionReport } from "@/types/decision";

interface Props {
  report: DecisionReport;
}

export function DecisionAccordion({ report }: Props) {
  return (
    <Accordion className="w-full bg-card border rounded-lg mb-4 px-4">
      <AccordionItem value="decision" className="border-b-0">
        <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
          <div className="flex items-center gap-3">
            Decision Report
            <Badge variant="outline" className="font-normal text-xs">
              Recommendation: {report.recommendation}
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-6 space-y-6 text-base text-muted-foreground">
          
          <div className="bg-primary/5 p-4 rounded-md border border-primary/20">
            <h4 className="font-semibold text-foreground mb-2">Final Verdict</h4>
            <p className="text-foreground leading-relaxed">{report.finalVerdict}</p>
            <p className="mt-3 text-sm italic">{report.decisionReasoning}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-emerald-600 dark:text-emerald-500 mb-3">Investment Opportunities</h4>
              <div className="space-y-4">
                {report.investmentOpportunities.map((opp, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium text-foreground block mb-1">{opp.title}</span>
                    <span>{opp.description}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-rose-600 dark:text-rose-500 mb-3">Investment Concerns</h4>
              <div className="space-y-4">
                {report.investmentConcerns.map((con, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium text-foreground block mb-1">{con.title}</span>
                    <span>{con.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">Trade-Off Analysis</h4>
            <div className="text-sm space-y-3 bg-muted/20 p-4 rounded-md border">
              <p><strong>Opportunities:</strong> {report.tradeOffAnalysis.investmentOpportunities}</p>
              <p><strong>Concerns:</strong> {report.tradeOffAnalysis.investmentConcerns}</p>
              <p><strong>Overall Balance:</strong> {report.tradeOffAnalysis.overallBalance}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">Contribution Reasoning</h4>
            <div className="text-sm space-y-2">
              <p><strong>Research ({report.researchContribution}%):</strong> {report.researchContributionExplanation}</p>
              <p><strong>Financial ({report.financialContribution}%):</strong> {report.financialContributionExplanation}</p>
              <p><strong>Risk ({report.riskContribution}%):</strong> {report.riskContributionExplanation}</p>
            </div>
          </div>

        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
