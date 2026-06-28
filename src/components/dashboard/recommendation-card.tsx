import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { DecisionAgentResult } from "@/types/decision";
import type { FinancialAgentResult } from "@/types/financial";
import type { RiskAgentResult } from "@/types/risk";

interface RecommendationCardProps {
  decision: DecisionAgentResult;
  financial: FinancialAgentResult;
  risk: RiskAgentResult;
}

function getRecommendationColor(rec: string) {
  switch (rec) {
    case "Strong Invest": return "bg-emerald-500 hover:bg-emerald-600";
    case "Invest": return "bg-green-500 hover:bg-green-600";
    case "Hold": return "bg-amber-500 hover:bg-amber-600";
    case "Pass": return "bg-orange-500 hover:bg-orange-600";
    case "Strong Pass": return "bg-red-500 hover:bg-red-600";
    default: return "bg-primary";
  }
}

export function RecommendationCard({ decision, financial, risk }: RecommendationCardProps) {
  const report = decision.decisionReport;
  if (!report) return null;

  return (
    <Card className="mb-8 border-2 shadow-sm">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-3xl font-bold">Final Verdict</CardTitle>
            <p className="text-muted-foreground mt-1">Holistic synthesis of all agent findings</p>
          </div>
          <Badge className={`text-lg px-4 py-1.5 text-white ${getRecommendationColor(report.recommendation)}`}>
            {report.recommendation}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">Decision Score</span>
            <span className="text-3xl font-bold">{report.decisionScore}<span className="text-xl text-muted-foreground">/100</span></span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">Overall Confidence</span>
            <span className="text-3xl font-bold">{report.confidence}%</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">Financial Score</span>
            <span className="text-3xl font-bold">{financial.financialReport?.overallScore || "N/A"}<span className="text-xl text-muted-foreground">/100</span></span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">Risk Level</span>
            <span className="text-2xl font-bold mt-1">{risk.riskReport?.overallRiskLevel || "N/A"}</span>
          </div>
        </div>

        <Separator className="mb-6" />

        <h3 className="text-lg font-semibold mb-4">Report Contributions</h3>
        <div className="space-y-4 max-w-2xl">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Research Factors</span>
              <span>{report.researchContribution}%</span>
            </div>
            <Progress value={report.researchContribution} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Financial Fundamentals</span>
              <span>{report.financialContribution}%</span>
            </div>
            <Progress value={report.financialContribution} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Risk Analysis</span>
              <span>{report.riskContribution}%</span>
            </div>
            <Progress value={report.riskContribution} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
