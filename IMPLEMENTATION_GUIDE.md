# MTA Service Alerts Implementation Guide

This document explains how the real-time MTA service alerts integration works.

## Architecture Overview

The implementation consists of three main layers:

1. **API Layer** (`lib/mta-api.ts`): Fetches raw GTFS-RT data from MTA endpoints
2. **Transformer Layer** (`lib/mta-transformer.ts`): Converts GTFS-RT format to our Alert type
3. **API Route** (`app/api/alerts/route.ts`): Server-side endpoint that aggregates and serves alerts
4. **Frontend** (`components/mta-alerts-page.tsx`): Displays alerts with filtering and refresh

## Data Flow

```
MTA API Endpoints
    ↓
lib/mta-api.ts (fetchMTAAlerts)
    ↓
app/api/alerts/route.ts (GET handler)
    ↓
lib/mta-transformer.ts (transformMTAAlerts)
    ↓
Frontend (mta-alerts-page.tsx)
    ↓
User Interface
```

## Key Components

### 1. MTA API Client (`lib/mta-api.ts`)

**Functions:**
- `fetchMTAAlerts()`: Fetches from a single endpoint
- `fetchAllMTAAlerts()`: Fetches from all endpoints in parallel
- `extractText()`: Extracts text from GTFS-RT translation objects
- `mapRouteToLine()`: Maps route IDs to line names and colors
- `mapEffectToSeverity()`: Maps GTFS-RT effects to our severity levels
- `determineLineType()`: Determines if a route is subway or rail

**Endpoints:**
- Subway alerts
- Bus alerts
- LIRR alerts
- Metro-North alerts

### 2. Data Transformer (`lib/mta-transformer.ts`)

**Functions:**
- `transformGTFSRTAlert()`: Converts a single GTFS-RT entity to our Alert format
- `transformMTAAlerts()`: Processes all feeds and removes duplicates

**Transformation Logic:**
- Extracts header and description text (handles multi-language)
- Maps route IDs to line names (e.g., "1" → "1/2/3", "red")
- Determines severity from effect codes and description keywords
- Extracts affected stations (if available)
- Calculates expected resolution from active_period

### 3. API Route (`app/api/alerts/route.ts`)

**Endpoint:** `GET /api/alerts`

**Query Parameters:**
- `apiKey` (optional): MTA API key (falls back to `MTA_API_KEY` env var)

**Response:**
```json
{
  "alerts": [...],
  "count": 42,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Features:**
- Fetches from all endpoints in parallel
- Handles errors gracefully (continues if one endpoint fails)
- Caches responses for 30 seconds
- Returns transformed alerts in our format

### 4. Frontend Component (`components/mta-alerts-page.tsx`)

**Features:**
- Fetches alerts on mount
- Manual refresh button
- Loading states
- Error handling
- Filtering by line type and severity
- Real-time alert counts

**State Management:**
- `alerts`: Array of Alert objects
- `isLoading`: Initial load state
- `isRefreshing`: Refresh button state
- `error`: Error message if fetch fails
- `selectedLineType`: Current filter
- `selectedSeverity`: Current filter

## Route ID Mapping

The system maps MTA route IDs to our line names:

| Route Pattern | Line Name | Color |
|--------------|-----------|-------|
| 1, 2, 3 | 1/2/3 | red |
| 4, 5, 6 | 4/5/6 | green |
| A, C, E | A/C/E | blue |
| B, D, F, M | B/D/F/M | orange |
| G | G | light-green |
| J, Z | J/Z | brown |
| L | L | gray |
| N, Q, R, W | N/Q/R/W | yellow |
| 7 | 7 | purple |
| S | S | dark-gray |
| LIRR | LIRR | lirr |
| MNR, Metro | Metro-North | metro-north |

## Severity Mapping

Severity is determined by:

1. **GTFS-RT Effect Code:**
   - `NO_SERVICE`, `SIGNIFICANT_DELAYS` → `major`
   - `REDUCED_SERVICE`, `MODERATE_DELAYS` → `moderate`
   - Others → `minor`

2. **Description Keywords:**
   - "planned", "scheduled", "maintenance" → `planned`
   - "no service", "suspended", "closed" → `major`
   - "delay", "running behind" → `moderate`

## Error Handling

The system handles errors at multiple levels:

1. **API Fetch Errors:**
   - Individual endpoint failures don't stop the entire fetch
   - Empty feed is returned for failed endpoints
   - Errors are logged to console

2. **Transformation Errors:**
   - Invalid entities are skipped (return null)
   - Missing data uses fallback values
   - Duplicates are removed

3. **Frontend Errors:**
   - Error state is displayed to user
   - Loading state prevents interaction during fetch
   - Refresh button allows retry

## Caching Strategy

- **API Route**: Uses Next.js `revalidate: 30` (30 second cache)
- **Frontend**: No caching - always fetches fresh data on refresh
- **Parallel Fetching**: All endpoints fetched simultaneously for speed

## Testing

### Test the API Route

```bash
# Without API key (may fail)
curl http://localhost:3000/api/alerts

# With API key
curl "http://localhost:3000/api/alerts?apiKey=YOUR_KEY"
```

### Test Individual Endpoints

```bash
# Test MTA endpoint directly
curl -H "x-api-key: YOUR_KEY" \
  https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json
```

## Future Enhancements

Potential improvements:

1. **Station Mapping**: Parse `stop_id` from `informed_entity` to show affected stations
2. **Caching**: Add Redis or database caching for alerts
3. **Webhooks**: Subscribe to MTA webhooks for real-time updates
4. **Historical Data**: Store alerts in database for historical analysis
5. **Notifications**: Alert users about new major disruptions
6. **Route Details**: Fetch detailed route information from GTFS static data
7. **Geographic Data**: Map alerts to stations on a map

## Troubleshooting

### No Alerts Showing

1. Check if MTA has active alerts (may be none)
2. Verify API key is set correctly
3. Check browser console for errors
4. Test API route directly: `/api/alerts`

### Alerts Not Updating

1. Check cache (30 second revalidation)
2. Click refresh button
3. Check network tab for API calls
4. Verify MTA API is responding

### Wrong Line Names

1. Check route ID mapping in `mapRouteToLine()`
2. Add new route patterns if needed
3. Verify MTA route ID format hasn't changed

## Configuration

### Environment Variables

```env
# Required for production
MTA_API_KEY=your_mta_api_key_here

# Optional: Override cache time (in seconds)
MTA_CACHE_TIME=30
```

### API Route Configuration

The API route can be configured via:
- Environment variables
- Query parameters
- Next.js config (for revalidation)

## Performance Considerations

- **Parallel Fetching**: All 4 endpoints fetched simultaneously
- **Caching**: 30 second cache reduces API calls
- **Error Handling**: Failed endpoints don't block others
- **Deduplication**: Removes duplicate alerts automatically

## Security

- API key stored in environment variables (never in code)
- API route is server-side only (key never exposed to client)
- Rate limiting handled by MTA API
- Input validation on query parameters

