import { NextResponse } from "next/server";
import { fetchAllMTAAlerts } from "@/lib/mta-api";
import { transformMTAAlerts } from "@/lib/mta-transformer";
import { MTA_ALERT_ENDPOINTS } from "@/lib/mta-api";

/**
 * GET /api/alerts
 * Fetches real-time MTA service alerts from all endpoints
 * 
 * Query parameters:
 * - apiKey: Optional MTA API key (can also be set via MTA_API_KEY env var)
 */
export async function GET(request: Request) {
  try {
    // Get API key from query params or environment variable
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("apiKey") || process.env.MTA_API_KEY;

    // Fetch alerts from all MTA endpoints
    const feeds = await fetchAllMTAAlerts(apiKey || undefined);
    
    // Transform to our Alert format
    // Ensure endpoint types match the order of feeds (subway, bus, lirr, mnr)
    const endpointTypes: (keyof typeof MTA_ALERT_ENDPOINTS)[] = ["subway", "bus", "lirr", "mnr"];
    const alerts = transformMTAAlerts(feeds, endpointTypes);

    return NextResponse.json({
      alerts,
      count: alerts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching MTA alerts:", error);
    
    return NextResponse.json(
      {
        error: "Failed to fetch MTA alerts",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

