import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

interface SearchBarProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  onAnalyze: (e: React.FormEvent) => void;
  loading: boolean;
}

export function SearchBar({ companyName, setCompanyName, onAnalyze, loading }: SearchBarProps) {
  return (
    <form onSubmit={onAnalyze} className="flex flex-col sm:flex-row gap-3 mb-8 w-full max-w-2xl mx-auto">
      <Input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Enter company name (e.g. Apple)"
        disabled={loading}
        className="flex-1 bg-background"
      />
      <Button
        type="submit"
        disabled={loading || !companyName.trim()}
        className="sm:w-32"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Analyze
          </>
        )}
      </Button>
    </form>
  );
}
