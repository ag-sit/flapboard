"use client";

import { useState, useMemo, useEffect } from "react";
import { AlertCard } from "@/components/alert-card";
import { FilterBar } from "@/components/filter-bar";
import { Alert, LineType, Severity } from "@/types/alert";
import { Train, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthButtonClient } from "@/components/auth-button-client";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function MTAAlertsPage() {
  const [selectedLineType, setSelectedLineType] = useState<LineType | "all">("all");
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | "all">("all");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch alerts from API
  const fetchAlerts = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      const response = await fetch("/api/alerts");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch alerts: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert lastUpdated strings back to Date objects
      const alertsWithDates = data.alerts.map((alert: any) => ({
        ...alert,
        lastUpdated: new Date(alert.lastUpdated),
      }));
      
      setAlerts(alertsWithDates);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError(err instanceof Error ? err.message : "Failed to load alerts");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch alerts on mount
  useEffect(() => {
    fetchAlerts();
  }, []);

  // Filter alerts based on selections
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesLineType = selectedLineType === "all" || alert.lineType === selectedLineType;
      const matchesSeverity = selectedSeverity === "all" || alert.severity === selectedSeverity;
      return matchesLineType && matchesSeverity;
    });
  }, [alerts, selectedLineType, selectedSeverity]);

  // Calculate alert counts
  const alertCounts = useMemo(() => {
    return {
      subway: alerts.filter((a) => a.lineType === "subway").length,
      rail: alerts.filter((a) => a.lineType === "rail").length,
      minor: alerts.filter((a) => a.severity === "minor").length,
      moderate: alerts.filter((a) => a.severity === "moderate").length,
      major: alerts.filter((a) => a.severity === "major").length,
      planned: alerts.filter((a) => a.severity === "planned").length,
    };
  }, [alerts]);

  const handleRefresh = () => {
    fetchAlerts();
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
                  Flapboard
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Real-time transit status and disruptions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
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
              <div className="flex items-center gap-2 border-l pl-3 ml-3">
                <AuthButtonClient />
                <ThemeSwitcher />
              </div>
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

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Error loading alerts</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Loading alerts...
            </h3>
            <p className="text-muted-foreground">
              Fetching real-time service alerts from MTA
            </p>
          </div>
        )}

        {/* Alert Cards Grid */}
        {!isLoading && (
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
                  {alerts.length === 0
                    ? "No active service alerts at this time"
                    : "Try adjusting your filters to see more results"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Summary Footer */}
        {!isLoading && (
          <div className="mt-12 p-6 bg-card rounded-lg border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
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
        )}
      </main>
    </div>
  );
}

