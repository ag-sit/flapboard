/**
 * Transform GTFS-RT alerts to our Alert format
 */

import { Alert, LineColor, LineType, Severity } from "@/types/alert";
import {
  GTFSRTFeedMessage,
  GTFSRTEntity,
  extractText,
  determineLineType,
  mapRouteToLine,
  mapEffectToSeverity,
  MTA_ALERT_ENDPOINTS,
} from "./mta-api";

/**
 * Transform a single GTFS-RT entity to our Alert format
 */
export function transformGTFSRTAlert(
  entity: GTFSRTEntity,
  endpointType?: keyof typeof MTA_ALERT_ENDPOINTS
): Alert | null {
  if (!entity.alert || entity.is_deleted) {
    return null;
  }

  const alert = entity.alert;
  
  // Extract text content
  const headerText = extractText(alert.header_text);
  const descriptionText = extractText(alert.description_text);
  
  // Skip if no meaningful content
  if (!headerText && !descriptionText) {
    return null;
  }

  // Get route information
  const informedEntity = alert.informed_entity?.[0];
  const routeId = informedEntity?.route_id;
  
  // Map route to line (pass endpoint type for rail lines)
  const { line, lineColor } = mapRouteToLine(routeId, endpointType);
  
  // Determine line type
  const lineType = determineLineType(routeId, informedEntity?.agency_id, endpointType);
  
  // Map severity
  let severity: Severity = mapEffectToSeverity(alert.effect);
  
  // Check for planned work keywords in description
  const descriptionLower = descriptionText.toLowerCase();
  if (
    descriptionLower.includes("planned") ||
    descriptionLower.includes("scheduled") ||
    descriptionLower.includes("maintenance") ||
    descriptionLower.includes("weekend") ||
    descriptionLower.includes("track work")
  ) {
    severity = "planned";
  }
  
  // Check for major disruption keywords
  if (
    descriptionLower.includes("no service") ||
    descriptionLower.includes("suspended") ||
    descriptionLower.includes("closed")
  ) {
    severity = "major";
  }
  
  // Check for delay keywords
  if (
    descriptionLower.includes("delay") ||
    descriptionLower.includes("running behind")
  ) {
    if (severity === "minor") {
      severity = "moderate";
    }
  }

  // Extract affected stations (if available in description)
  const affectedStations: string[] = [];
  // This is a simplified extraction - you might want to enhance this
  // by parsing stop_id from informed_entity or using a station database
  
  // Extract expected resolution from active_period
  let expectedResolution: string | undefined;
  if (alert.active_period && alert.active_period.length > 0) {
    const period = alert.active_period[0];
    if (period.end) {
      const endDate = new Date(period.end * 1000);
      expectedResolution = `Until ${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    }
  }

  // Use header as title, description as description
  const title = headerText || "Service Alert";
  const description = descriptionText || headerText || "No description available";

  return {
    id: entity.id,
    line,
    lineColor: lineColor as LineColor,
    lineType: lineType as LineType,
    title,
    description,
    affectedStations,
    severity,
    expectedResolution,
    lastUpdated: new Date(),
  };
}

/**
 * Transform all GTFS-RT feeds to our Alert format
 */
export function transformMTAAlerts(
  feeds: GTFSRTFeedMessage[],
  endpointTypes: (keyof typeof MTA_ALERT_ENDPOINTS)[]
): Alert[] {
  const alerts: Alert[] = [];

  feeds.forEach((feed, index) => {
    const endpointType = endpointTypes[index];
    
    if (!feed.entity) {
      return;
    }

    feed.entity.forEach((entity) => {
      const alert = transformGTFSRTAlert(entity, endpointType);
      if (alert) {
        alerts.push(alert);
      }
    });
  });

  // Remove duplicates based on ID
  const uniqueAlerts = new Map<string, Alert>();
  alerts.forEach(alert => {
    // Also check for similar alerts (same line and similar description)
    const key = `${alert.line}-${alert.title}`;
    if (!uniqueAlerts.has(key)) {
      uniqueAlerts.set(key, alert);
    }
  });

  return Array.from(uniqueAlerts.values());
}

