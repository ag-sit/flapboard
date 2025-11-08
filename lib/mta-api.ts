/**
 * MTA GTFS-RT Service Alerts API Integration
 * 
 * The MTA API uses GTFS-RT (General Transit Feed Specification - Real-time) format
 * for service alerts. This module handles fetching and parsing alerts from MTA endpoints.
 */

// MTA API endpoints for service alerts
export const MTA_ALERT_ENDPOINTS = {
  subway: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json",
  bus: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fbus-alerts.json",
  lirr: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Flirr-alerts.json",
  mnr: "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fmnr-alerts.json",
} as const;

// GTFS-RT Types
interface GTFSRTTranslation {
  text: string;
  language?: string;
}

interface GTFSRTText {
  translation: GTFSRTTranslation[];
}

interface GTFSRTTimeRange {
  start?: number;
  end?: number;
}

interface GTFSRTInformedEntity {
  route_id?: string;
  stop_id?: string;
  agency_id?: string;
}

interface GTFSRTAlert {
  header_text?: GTFSRTText;
  description_text?: GTFSRTText;
  url?: GTFSRTText;
  informed_entity?: GTFSRTInformedEntity[];
  effect?: string;
  cause?: string;
  active_period?: GTFSRTTimeRange[];
}

export interface GTFSRTEntity {
  id: string;
  alert?: GTFSRTAlert;
  is_deleted?: boolean;
}

export interface GTFSRTFeedMessage {
  header?: {
    timestamp?: number;
    gtfs_realtime_version?: string;
  };
  entity?: GTFSRTEntity[];
}

/**
 * Fetch alerts from a single MTA endpoint
 */
export async function fetchMTAAlerts(
  endpoint: string,
  apiKey?: string
): Promise<GTFSRTFeedMessage> {
  const headers: HeadersInit = {
    "Accept": "application/json",
  };

  // MTA API requires an API key in the x-api-key header
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  const response = await fetch(endpoint, {
    headers,
    // Cache for 30 seconds
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch MTA alerts: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch alerts from all MTA endpoints
 */
export async function fetchAllMTAAlerts(apiKey?: string): Promise<GTFSRTFeedMessage[]> {
  const endpoints = Object.values(MTA_ALERT_ENDPOINTS);
  
  // Fetch all endpoints in parallel
  const promises = endpoints.map(endpoint => 
    fetchMTAAlerts(endpoint, apiKey).catch(error => {
      console.error(`Error fetching from ${endpoint}:`, error);
      // Return empty feed on error to allow other feeds to succeed
      return { entity: [] } as GTFSRTFeedMessage;
    })
  );

  return Promise.all(promises);
}

/**
 * Extract text from GTFS-RT text object (handles translations)
 */
export function extractText(textObj?: GTFSRTText): string {
  if (!textObj?.translation || textObj.translation.length === 0) {
    return "";
  }
  
  // Prefer English, fallback to first available
  const english = textObj.translation.find(t => !t.language || t.language === "en");
  return english?.text || textObj.translation[0]?.text || "";
}

/**
 * Determine line type from route ID or agency
 */
export function determineLineType(
  routeId?: string,
  agencyId?: string,
  endpointType?: keyof typeof MTA_ALERT_ENDPOINTS
): "subway" | "rail" {
  if (endpointType === "lirr" || endpointType === "mnr") {
    return "rail";
  }
  if (endpointType === "subway" || endpointType === "bus") {
    return "subway";
  }
  
  // Fallback: check route ID patterns
  if (routeId) {
    const upperRouteId = routeId.toUpperCase();
    if (upperRouteId.includes("LIRR") || upperRouteId.includes("MNR") || upperRouteId.includes("METRO")) {
      return "rail";
    }
  }
  
  return "subway";
}

/**
 * Map route ID to line name and color
 * Uses endpoint type for rail lines (LIRR/Metro-North) to ensure correct assignment
 */
export function mapRouteToLine(
  routeId?: string,
  endpointType?: keyof typeof MTA_ALERT_ENDPOINTS
): { line: string; lineColor: string } {
  // For rail endpoints, use the endpoint type to determine the line
  if (endpointType === "lirr") {
    return { line: "LIRR", lineColor: "lirr" };
  }
  if (endpointType === "mnr") {
    return { line: "Metro-North", lineColor: "metro-north" };
  }

  // For subway/bus endpoints, map based on route ID
  if (!routeId) {
    return { line: "Unknown", lineColor: "gray" };
  }

  const upperRouteId = routeId.toUpperCase();
  
  // Subway lines
  if (upperRouteId.includes("1") || upperRouteId.includes("2") || upperRouteId.includes("3")) {
    return { line: "1/2/3", lineColor: "red" };
  }
  if (upperRouteId.includes("4") || upperRouteId.includes("5") || upperRouteId.includes("6")) {
    return { line: "4/5/6", lineColor: "green" };
  }
  if (upperRouteId.includes("A") || upperRouteId.includes("C") || upperRouteId.includes("E")) {
    return { line: "A/C/E", lineColor: "blue" };
  }
  if (upperRouteId.includes("B") || upperRouteId.includes("D") || upperRouteId.includes("F") || upperRouteId.includes("M")) {
    return { line: "B/D/F/M", lineColor: "orange" };
  }
  if (upperRouteId.includes("G")) {
    return { line: "G", lineColor: "light-green" };
  }
  if (upperRouteId.includes("J") || upperRouteId.includes("Z")) {
    return { line: "J/Z", lineColor: "brown" };
  }
  if (upperRouteId.includes("L")) {
    return { line: "L", lineColor: "gray" };
  }
  if (upperRouteId.includes("N") || upperRouteId.includes("Q") || upperRouteId.includes("R") || upperRouteId.includes("W")) {
    return { line: "N/Q/R/W", lineColor: "yellow" };
  }
  if (upperRouteId.includes("7")) {
    return { line: "7", lineColor: "purple" };
  }
  if (upperRouteId.includes("S")) {
    return { line: "S", lineColor: "dark-gray" };
  }
  
  // Fallback: check route ID for rail patterns (shouldn't be needed with endpoint type)
  if (upperRouteId.includes("LIRR")) {
    return { line: "LIRR", lineColor: "lirr" };
  }
  if (upperRouteId.includes("MNR") || upperRouteId.includes("METRO")) {
    return { line: "Metro-North", lineColor: "metro-north" };
  }
  
  return { line: routeId, lineColor: "gray" };
}

/**
 * Map GTFS-RT effect to our severity
 */
export function mapEffectToSeverity(effect?: string): "minor" | "moderate" | "major" | "planned" {
  if (!effect) {
    return "minor";
  }

  const upperEffect = effect.toUpperCase();
  
  if (upperEffect.includes("NO_SERVICE") || upperEffect.includes("SIGNIFICANT_DELAYS")) {
    return "major";
  }
  if (upperEffect.includes("REDUCED_SERVICE") || upperEffect.includes("MODERATE_DELAYS")) {
    return "moderate";
  }
  if (upperEffect.includes("DETOUR") || upperEffect.includes("ADDITIONAL_SERVICE")) {
    return "moderate";
  }
  if (upperEffect.includes("OTHER_EFFECT") || upperEffect.includes("UNKNOWN_EFFECT")) {
    return "minor";
  }
  
  // Check description for planned work keywords
  return "minor";
}

