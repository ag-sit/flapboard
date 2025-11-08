import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Train, AlertCircle, Wrench, CheckCircle } from "lucide-react";
import { Severity, LineType } from "@/types/alert";

interface FilterBarProps {
  selectedLineType: LineType | "all";
  selectedSeverity: Severity | "all";
  onLineTypeChange: (type: LineType | "all") => void;
  onSeverityChange: (severity: Severity | "all") => void;
  alertCounts: {
    subway: number;
    rail: number;
    minor: number;
    moderate: number;
    major: number;
    planned: number;
  };
}

export const FilterBar = ({
  selectedLineType,
  selectedSeverity,
  onLineTypeChange,
  onSeverityChange,
  alertCounts,
}: FilterBarProps) => {
  return (
    <div className="space-y-4">
      {/* Line Type Filters */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Transit Type</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedLineType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onLineTypeChange("all")}
            className="gap-2"
          >
            <Train className="h-4 w-4" />
            All
            <Badge variant="secondary" className="ml-1">
              {alertCounts.subway + alertCounts.rail}
            </Badge>
          </Button>
          <Button
            variant={selectedLineType === "subway" ? "default" : "outline"}
            size="sm"
            onClick={() => onLineTypeChange("subway")}
            className="gap-2"
          >
            Subway
            <Badge variant="secondary" className="ml-1">
              {alertCounts.subway}
            </Badge>
          </Button>
          <Button
            variant={selectedLineType === "rail" ? "default" : "outline"}
            size="sm"
            onClick={() => onLineTypeChange("rail")}
            className="gap-2"
          >
            Rail
            <Badge variant="secondary" className="ml-1">
              {alertCounts.rail}
            </Badge>
          </Button>
        </div>
      </div>

      {/* Severity Filters */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Status</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedSeverity === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onSeverityChange("all")}
            className="gap-2"
          >
            All Status
            <Badge variant="secondary" className="ml-1">
              {alertCounts.minor + alertCounts.moderate + alertCounts.major + alertCounts.planned}
            </Badge>
          </Button>
          <Button
            variant={selectedSeverity === "major" ? "default" : "outline"}
            size="sm"
            onClick={() => onSeverityChange("major")}
            className={cn(
              "gap-2",
              selectedSeverity === "major" && "bg-severity-major hover:bg-severity-major/90"
            )}
          >
            <AlertCircle className="h-4 w-4" />
            Major
            <Badge variant="secondary" className="ml-1">
              {alertCounts.major}
            </Badge>
          </Button>
          <Button
            variant={selectedSeverity === "moderate" ? "default" : "outline"}
            size="sm"
            onClick={() => onSeverityChange("moderate")}
            className={cn(
              "gap-2",
              selectedSeverity === "moderate" && "bg-severity-moderate hover:bg-severity-moderate/90"
            )}
          >
            <AlertCircle className="h-4 w-4" />
            Moderate
            <Badge variant="secondary" className="ml-1">
              {alertCounts.moderate}
            </Badge>
          </Button>
          <Button
            variant={selectedSeverity === "planned" ? "default" : "outline"}
            size="sm"
            onClick={() => onSeverityChange("planned")}
            className={cn(
              "gap-2",
              selectedSeverity === "planned" && "bg-severity-planned hover:bg-severity-planned/90"
            )}
          >
            <Wrench className="h-4 w-4" />
            Planned Work
            <Badge variant="secondary" className="ml-1">
              {alertCounts.planned}
            </Badge>
          </Button>
          <Button
            variant={selectedSeverity === "minor" ? "default" : "outline"}
            size="sm"
            onClick={() => onSeverityChange("minor")}
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Good Service
            <Badge variant="secondary" className="ml-1">
              {alertCounts.minor}
            </Badge>
          </Button>
        </div>
      </div>
    </div>
  );
};
