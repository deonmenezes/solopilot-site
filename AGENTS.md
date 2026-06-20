# solopilot-site

A Lovable-branded freelancer workflow tool: scrape cafe/business leads via Apify, auto-generate websites, trigger builds on Lovable, and send personalized outreach email — all from one dashboard.

## Tech Stack

- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework)
- **Backend**: Serverless API routes (Node.js, Vercel Functions style — files in `api/`)
- **Integrations**: Apify (web scraping), GitHub API (repo creation), Lovable (build trigger), email bridge (GWS)

## Setup

No package manager is required for the frontend. For serverless API routes, deploy to Vercel or a compatible serverless platform.

Copy `.env.example` to `.env.local` and fill in:

```bash
APIFY_API_TOKEN=...          # or APIFY_TOKEN
APIFY_USER_ID=...
APIFY_GOOGLE_MAPS_ACTOR_ID=... # optional, defaults to apify/google-maps-scraper
GITHUB_TOKEN=...
LOVABLE_TRIGGER_URL=...
GWS_BRIDGE_URL=...
GWS_BRIDGE_TOKEN=...         # optional
```

## Build / Run / Test

The frontend is a static site — open `index.html` directly in a browser for UI development:

```bash
open index.html
```

API routes run as serverless functions. Deploy to Vercel:

```bash
vercel dev    # local serverless dev server
vercel        # deploy to Vercel
```

## Project Structure

```
index.html          Main landing page (single-page HTML)
styles.css          All CSS styles
script.js           Frontend JS (nav toggle, counter animations)
api/
  integrations.js   GET /api/integrations — health-check all configured services
  apify/
    scrape.js       POST /api/apify/scrape — run Apify Google Maps scraper
  github/
    create-repo.js  POST /api/github/create-repo — create GitHub repo
  lovable/
    trigger.js      POST /api/lovable/trigger — trigger Lovable website build
  email/
    send.js         POST /api/email/send — send outreach email via GWS bridge
  _lib/
    fetch-json.js   Shared HTTP fetch helper
    http.js         Shared response helpers (sendJson, methodNotAllowed)
```

## Architecture & Key Files

- The frontend (`index.html` + `script.js` + `styles.css`) is entirely static — no build step needed.
- API routes are individual serverless functions (CommonJS `module.exports = async (req, res) => ...`).
- `api/_lib/` contains shared utilities used across all API route files.
- All external credentials flow through environment variables — never hardcoded.
- `api/integrations.js` acts as a health-check endpoint, pinging each configured third-party service.

## Conventions & Notes for Agents

- API route files use **CommonJS** (`require`/`module.exports`), not ESM — keep this consistent.
- Every API route must guard against wrong HTTP methods using `methodNotAllowed()` from `api/_lib/http.js`.
- All env vars are optional (gracefully degrade if not set); check `Boolean(process.env.VAR)` before using.
- Do not add a `package.json` or build system unless explicitly required — the frontend intentionally has no build step.
- If adding new API routes, place them under `api/<service>/<action>.js` matching the existing pattern.
- The branch name is `codex/solopilot-site` — this is the default branch; target it for PRs.
