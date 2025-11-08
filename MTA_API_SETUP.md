# MTA API Setup Instructions

This guide explains how to set up and use the MTA API to fetch real-time service alerts.

## Overview

The application fetches service alerts from the MTA's GTFS-RT (General Transit Feed Specification - Real-time) API endpoints. The MTA provides separate endpoints for:
- Subway alerts
- Bus alerts  
- LIRR (Long Island Rail Road) alerts
- Metro-North alerts

## MTA API Key

The MTA API requires an API key for authentication. You can obtain one by:

1. **Visit the MTA Developer Portal**: https://api.mta.info/
2. **Sign up for an account** (if you don't have one)
3. **Request an API key** through their developer portal
4. **Add the API key to your environment variables**

### Environment Variable Setup

Add your MTA API key to your `.env.local` file:

```env
MTA_API_KEY=your_mta_api_key_here
```

The API route will automatically use this key when fetching alerts. Alternatively, you can pass the API key as a query parameter:

```
GET /api/alerts?apiKey=your_api_key
```

**Note**: For production, always use environment variables rather than passing the key in the URL.

## API Endpoints

The application fetches from these MTA endpoints:

- **Subway**: `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json`
- **Bus**: `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fbus-alerts.json`
- **LIRR**: `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Flirr-alerts.json`
- **Metro-North**: `https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fmnr-alerts.json`

## How It Works

1. **API Route** (`/api/alerts`): 
   - Fetches alerts from all MTA endpoints in parallel
   - Transforms GTFS-RT format to our Alert format
   - Returns aggregated alerts

2. **Data Transformation**:
   - Converts GTFS-RT JSON structure to our simplified Alert type
   - Maps route IDs to line names and colors
   - Determines severity based on alert effect and description
   - Extracts text from multi-language translations

3. **Frontend**:
   - Fetches alerts on page load
   - Refreshes when user clicks the refresh button
   - Displays alerts with filtering and search capabilities

## Testing Without API Key

If you don't have an API key yet, the application will attempt to fetch alerts without authentication. However, the MTA API may:
- Rate limit your requests
- Return errors
- Block requests entirely

**For best results, always use an API key.**

## Rate Limiting

The MTA API has rate limits. The application:
- Caches responses for 30 seconds (using Next.js `revalidate`)
- Fetches all endpoints in parallel for efficiency
- Handles errors gracefully (continues with other endpoints if one fails)

## Troubleshooting

### "Failed to fetch MTA alerts" Error

1. **Check your API key**: Verify it's set correctly in `.env.local`
2. **Verify API key is valid**: Test it directly with curl:
   ```bash
   curl -H "x-api-key: YOUR_API_KEY" \
     https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json
   ```
3. **Check network connectivity**: Ensure your server can reach the MTA API
4. **Check rate limits**: You may have exceeded the API rate limit

### No Alerts Showing

1. **Check if there are actually alerts**: The MTA may not have active alerts
2. **Check the API response**: Look at browser console or server logs
3. **Verify endpoint URLs**: Ensure the MTA hasn't changed their endpoint structure

### Alerts Not Updating

1. **Check cache settings**: The API route caches for 30 seconds
2. **Click refresh button**: Manually trigger a refresh
3. **Check browser console**: Look for any errors

## Development vs Production

### Development
- Use `.env.local` for your API key
- API responses are cached for 30 seconds
- Errors are logged to console

### Production (Vercel)
1. Add `MTA_API_KEY` to your Vercel environment variables:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `MTA_API_KEY` with your key value
2. Redeploy your application

## API Response Format

The MTA API returns GTFS-RT format JSON:

```json
{
  "header": {
    "timestamp": 1234567890,
    "gtfs_realtime_version": "2.0"
  },
  "entity": [
    {
      "id": "alert_id",
      "alert": {
        "header_text": {
          "translation": [{"text": "Service Alert"}]
        },
        "description_text": {
          "translation": [{"text": "Description..."}]
        },
        "informed_entity": [{"route_id": "1"}],
        "effect": "SIGNIFICANT_DELAYS",
        "active_period": [{"start": 1234567890, "end": 1234567900}]
      }
    }
  ]
}
```

Our transformer converts this to our simplified Alert format for easier display.

## Next Steps

1. **Get your MTA API key** from https://api.mta.info/
2. **Add it to `.env.local`**:
   ```env
   MTA_API_KEY=your_key_here
   ```
3. **Restart your dev server**: `npm run dev`
4. **Test the application**: Navigate to the homepage and check if alerts load

## Additional Resources

- [MTA Developer Portal](https://api.mta.info/)
- [GTFS-RT Specification](https://gtfs.org/reference/static/)
- [MTA API Documentation](https://api.mta.info/#/landing)

