import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ErrorBannerProps {
  error: string;
  onRetry: () => void;
}

export function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-8 border-2 shadow-sm">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-semibold">Workflow Execution Failed</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col items-start gap-4">
        <p className="text-sm font-medium">
          The AI provider is temporarily unavailable or has reached its usage limit. Please try again shortly.
        </p>
        
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleTrigger className="flex items-center text-xs font-medium text-destructive/80 hover:text-destructive hover:underline p-0 m-0">
            {isOpen ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
            View Technical Details
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="bg-destructive/10 p-3 rounded-md overflow-auto max-h-40 text-xs font-mono break-all text-destructive-foreground/90">
              {error}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Button variant="outline" size="sm" onClick={onRetry} className="bg-background text-foreground hover:bg-muted mt-2">
          Dismiss & Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}
