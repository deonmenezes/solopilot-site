# Solopilot Site

Premium Solopilot site with secure server-side API routes for:

- Apify scraping
- GitHub repo creation
- Vercel deploy hook triggering
- Email bridge dispatch

## Run locally

```bash
cd C:\Users\Deon\solopilot-site
vercel dev
```

Then open `http://localhost:3000`.

## Environment Variables

Set these in Vercel (`Project -> Settings -> Environment Variables`) or with CLI:

- `APIFY_API_TOKEN` (or `APIFY_TOKEN`)
- `APIFY_USER_ID`
- `APIFY_GOOGLE_MAPS_ACTOR_ID` (optional, default `apify/google-maps-scraper`)
- `GITHUB_TOKEN`
- `VERCEL_DEPLOY_HOOK_URL`
- `GWS_BRIDGE_URL`
- `GWS_BRIDGE_TOKEN` (optional)

Copy `.env.example` to `.env.local` for local testing.

## API Routes

- `GET /api/integrations`
- `POST /api/apify/scrape`
- `POST /api/github/create-repo`
- `POST /api/vercel/deploy`
- `POST /api/email/send`

## Deploy

```bash
vercel --prod
```
