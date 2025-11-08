import { Alert } from "@/types/alert";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, AlertCircle, Wrench, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  alert: Alert;
}

const getSeverityIcon = (severity: Alert["severity"]) => {
  switch (severity) {
    case "major":
      return <AlertCircle className="h-4 w-4" />;
    case "moderate":
      return <AlertCircle className="h-4 w-4" />;
    case "planned":
      return <Wrench className="h-4 w-4" />;
    default:
      return <CheckCircle className="h-4 w-4" />;
  }
};

const getSeverityLabel = (severity: Alert["severity"]) => {
  switch (severity) {
    case "major":
      return "Major Disruption";
    case "moderate":
      return "Moderate Delay";
    case "planned":
      return "Planned Work";
    default:
      return "Good Service";
  }
};

const getSeverityColor = (severity: Alert["severity"]) => {
  switch (severity) {
    case "major":
      return "bg-severity-major text-white";
    case "moderate":
      return "bg-severity-moderate text-white";
    case "planned":
      return "bg-severity-planned text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getLineColorClass = (color: Alert["lineColor"]) => {
  return `bg-mta-${color}`;
};

export const AlertCard = ({ alert }: AlertCardProps) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="overflow-hidden border-l-4 transition-all hover:shadow-lg" 
          style={{ borderLeftColor: `hsl(var(--mta-${alert.lineColor}))` }}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Badge 
              className={cn(
                "text-white font-bold px-3 py-1 text-sm",
                getLineColorClass(alert.lineColor)
              )}
            >
              {alert.line}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {alert.lineType === "subway" ? "Subway" : "Rail"}
            </Badge>
          </div>
          <Badge className={cn("gap-1.5", getSeverityColor(alert.severity))}>
            {getSeverityIcon(alert.severity)}
            <span className="text-xs font-medium">{getSeverityLabel(alert.severity)}</span>
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2">
          {alert.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {alert.description}
        </p>

        {alert.affectedStations.length > 0 && (
          <div className="mb-4">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-foreground">Affected Stations:</span>
                <span className="text-muted-foreground ml-1">
                  {alert.affectedStations.join(", ")}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated {formatTime(alert.lastUpdated)}</span>
          </div>
          {alert.expectedResolution && (
            <span className="font-medium text-foreground">
              {alert.expectedResolution}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
