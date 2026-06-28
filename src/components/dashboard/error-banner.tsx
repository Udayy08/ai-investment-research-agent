import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorBannerProps {
  error: string;
  onRetry: () => void;
}

export function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-8 border-2 shadow-sm">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-semibold">Workflow Execution Failed</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col items-start gap-4">
        <p className="text-sm">
          {error}
        </p>
        <Button variant="outline" size="sm" onClick={onRetry} className="bg-background text-foreground hover:bg-muted">
          Dismiss & Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}
