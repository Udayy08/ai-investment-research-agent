import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExecutionLogEntry, ExecutionStep } from "@/graph/graph-state";
import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";

interface WorkflowProgressProps {
  executionLog: ExecutionLogEntry[];
  currentStep: ExecutionStep;
}

const AGENTS = ["Research Agent", "Financial Agent", "Risk Agent", "Decision Agent"];

export function WorkflowProgress({ executionLog }: WorkflowProgressProps) {
  if (executionLog.length === 0) return null;

  return (
    <Card className="mb-8">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Workflow Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {AGENTS.map((agentName, index) => {
            const entry = executionLog.find((log) => log.nodeName === agentName);
            const status = entry ? entry.status : "pending";

            let Icon = Circle;
            let iconClass = "text-muted-foreground";

            if (status === "completed") {
              Icon = CheckCircle2;
              iconClass = "text-primary";
            } else if (status === "running") {
              Icon = Loader2;
              iconClass = "text-blue-500 animate-spin";
            } else if (status === "failed") {
              Icon = XCircle;
              iconClass = "text-destructive";
            }

            return (
              <div key={agentName} className="flex items-center gap-3 sm:flex-col sm:text-center flex-1">
                <div className="relative flex items-center justify-center">
                  <Icon className={`h-8 w-8 ${iconClass} bg-background relative z-10`} />
                  {index < AGENTS.length - 1 && (
                    <div className="hidden sm:block absolute top-1/2 left-8 right-[-100%] h-[2px] bg-border -z-0" />
                  )}
                </div>
                <div className="flex flex-col sm:items-center">
                  <span className="font-medium text-sm">{agentName}</span>
                  <Badge variant={status === "completed" ? "default" : status === "running" ? "secondary" : status === "failed" ? "destructive" : "outline"} className="mt-1 uppercase text-[10px]">
                    {status}
                  </Badge>
                  {entry?.durationMs && (
                    <span className="text-xs text-muted-foreground mt-1">
                      {(entry.durationMs / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
