import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export function EmptyState() {
  return (
    <Card className="border-dashed border-2 bg-muted/20">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Search className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-medium mb-2 text-foreground">No Analysis Found</h3>
        <p className="max-w-md">
          Enter a company name in the search bar above to begin a comprehensive, multi-agent AI investment research analysis.
        </p>
      </CardContent>
    </Card>
  );
}
