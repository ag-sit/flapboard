import { useState, useEffect, useMemo } from "react";
import { AlertCard } from "@/components/AlertCard";
import { FilterBar } from "@/components/FilterBar";
import { mockAlerts } from "@/data/mockAlerts";
import { LineType, Severity } from "@/types/alert";
import { Train, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedLineType, setSelectedLineType] = useState<LineType | "all">("all");
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | "all">("all");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter alerts based on selections
  const filteredAlerts = useMemo(() => {
    return mockAlerts.filter((alert) => {
      const matchesLineType = selectedLineType === "all" || alert.lineType === selectedLineType;
      const matchesSeverity = selectedSeverity === "all" || alert.severity === selectedSeverity;
      return matchesLineType && matchesSeverity;
    });
  }, [selectedLineType, selectedSeverity]);

  // Calculate alert counts
  const alertCounts = useMemo(() => {
    return {
      subway: mockAlerts.filter((a) => a.lineType === "subway").length,
      rail: mockAlerts.filter((a) => a.lineType === "rail").length,
      minor: mockAlerts.filter((a) => a.severity === "minor").length,
      moderate: mockAlerts.filter((a) => a.severity === "moderate").length,
      major: mockAlerts.filter((a) => a.severity === "major").length,
      planned: mockAlerts.filter((a) => a.severity === "planned").length,
    };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Train className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  MTA Service Alerts
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Real-time transit status and disruptions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium text-foreground">
                  {formatLastUpdated(lastUpdated)}
                </p>
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-10 w-10"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <FilterBar
            selectedLineType={selectedLineType}
            selectedSeverity={selectedSeverity}
            onLineTypeChange={setSelectedLineType}
            onSeverityChange={setSelectedSeverity}
            alertCounts={alertCounts}
          />
        </div>

        {/* Alert Cards Grid */}
        <div className="space-y-4">
          {filteredAlerts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Train className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No alerts found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}
        </div>

        {/* Summary Footer */}
        <div className="mt-12 p-6 bg-card rounded-lg border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">{mockAlerts.length}</p>
              <p className="text-sm text-muted-foreground">Total Lines</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-severity-major">{alertCounts.major}</p>
              <p className="text-sm text-muted-foreground">Major Issues</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-severity-moderate">{alertCounts.moderate}</p>
              <p className="text-sm text-muted-foreground">Delays</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-muted-foreground">{alertCounts.minor}</p>
              <p className="text-sm text-muted-foreground">Normal Service</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
