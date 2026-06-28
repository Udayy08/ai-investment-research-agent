import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { ResearchReport } from "@/types/research";

interface Props {
  report: ResearchReport;
}

export function ResearchAccordion({ report }: Props) {
  const sections = [
    { id: "overview", title: "Company Overview", data: report.companyOverview },
    { id: "industry", title: "Industry", data: report.industry },
    { id: "business", title: "Business Model", data: report.businessModel },
    { id: "leadership", title: "Leadership", data: report.leadership },
    { id: "sentiment", title: "Market Sentiment", data: report.marketSentiment },
  ];

  return (
    <Accordion className="w-full bg-card border rounded-lg mb-4 px-4">
      <AccordionItem value="research" className="border-b-0">
        <AccordionTrigger className="hover:no-underline font-semibold text-lg py-4">
          <div className="flex items-center gap-3">
            Research Report
            <Badge variant="outline" className="font-normal text-xs">
              Confidence: {report.metadata.overallConfidence}%
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 pb-6 space-y-6 text-base text-muted-foreground">
          {sections.map((sec) => (
            <div key={sec.id}>
              <h4 className="font-medium text-foreground mb-1">{sec.title}</h4>
              <p className="leading-relaxed">{sec.data.summary}</p>
            </div>
          ))}

          <div>
            <h4 className="font-medium text-foreground mb-3">Key Strengths</h4>
            <div className="space-y-3">
              {report.keyStrengths.strengths.map((s, i) => (
                <div key={i} className="text-sm bg-muted/20 p-3 rounded border">
                  <span className="font-medium text-foreground block mb-1">{s.title}</span>
                  <span className="block mb-1">{s.description}</span>
                  <span className="text-xs text-muted-foreground italic">Importance: {s.importance}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-3">Key Challenges</h4>
            <div className="space-y-3">
              {report.keyChallenges.challenges.map((c, i) => (
                <div key={i} className="text-sm bg-muted/20 p-3 rounded border">
                  <span className="font-medium text-foreground block mb-1">{c.title}</span>
                  <span className="block mb-1">{c.description}</span>
                  <span className="text-xs text-muted-foreground italic">Severity: {c.severity}</span>
                </div>
              ))}
            </div>
          </div>

          {report.competitors.competitors.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground mb-3">Competitors</h4>
              <div className="space-y-3">
                {report.competitors.competitors.map((c, i) => (
                  <div key={i} className="text-sm bg-muted/20 p-3 rounded border">
                    <span className="font-medium text-foreground block mb-1">{c.name}</span>
                    <span className="text-muted-foreground">{c.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.recentNews.news.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground mb-3">Recent News</h4>
              <div className="space-y-3">
                {report.recentNews.news.map((n, i) => (
                  <div key={i} className="text-sm bg-muted/20 p-3 rounded border">
                    <span className="font-medium text-foreground block mb-1">{n.headline}</span>
                    <span className="block mb-2 text-muted-foreground">{n.summary}</span>
                    <div className="flex gap-2 text-[10px]">
                      <Badge variant="secondary">{n.sentiment}</Badge>
                      <Badge variant="outline">{n.impact}</Badge>
                      <span className="text-muted-foreground self-center ml-1">{n.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
