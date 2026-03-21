# Solopilot Site

Premium Solopilot site with secure server-side API routes for:

- Apify scraping
- GitHub repo creation
- Lovable build triggering
- Email bridge dispatch

## Run locally

```bash
cd C:\Users\Deon\solopilot-site
```

Open the frontend directly with [index.html](./index.html) for UI work.

## Environment Variables

Set these in your deployment platform or local env:

- `APIFY_API_TOKEN` (or `APIFY_TOKEN`)
- `APIFY_USER_ID`
- `APIFY_GOOGLE_MAPS_ACTOR_ID` (optional, default `apify/google-maps-scraper`)
- `GITHUB_TOKEN`
- `LOVABLE_TRIGGER_URL`
- `GWS_BRIDGE_URL`
- `GWS_BRIDGE_TOKEN` (optional)

Copy `.env.example` to `.env.local` for local testing.

## API Routes

- `GET /api/integrations`
- `POST /api/apify/scrape`
- `POST /api/github/create-repo`
- `POST /api/lovable/trigger`
- `POST /api/email/send`
