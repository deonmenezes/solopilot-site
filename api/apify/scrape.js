"use strict";

const { fetchJson } = require("../_lib/fetch-json");
const { methodNotAllowed, parseJsonBody, sendJson } = require("../_lib/http");

module.exports = async (req, res) => {
  if (req.method !== "POST") return methodNotAllowed(res, "POST");

  const token = process.env.APIFY_API_TOKEN || process.env.APIFY_TOKEN;
  if (!token) return sendJson(res, 500, { error: "APIFY_API_TOKEN is not configured." });

  const body = parseJsonBody(req);
  const search = String(body.search || "").trim();
  if (!search) return sendJson(res, 400, { error: "search is required." });

  const maxCafes = Math.max(1, Math.min(50, Number(body.maxCafes || 10)));
  const actorId = process.env.APIFY_GOOGLE_MAPS_ACTOR_ID || "nwua9Gu5YrADL7ZDj";

  const actorInput = {
    searchStringsArray: [search],
    maxCrawledPlacesPerSearch: maxCafes,
    language: "en",
    includeWebResults: false,
  };

  const run = await fetchJson(
    `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items?format=json&clean=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(actorInput),
    }
  );

  if (!run.ok) {
    return sendJson(res, run.status, {
      error: "Apify scrape failed.",
      details: run.body,
    });
  }

  const items = Array.isArray(run.body) ? run.body : [];
  const leads = items.slice(0, maxCafes).map((item, index) => ({
    id: item.placeId || item.id || `lead_${index + 1}`,
    name: item.title || item.name || "Unknown Cafe",
    address: item.address || item.street || null,
    phone: item.phone || item.phoneNumber || null,
    website: item.website || item.websiteUrl || null,
    email: item.email || null,
    rating: item.totalScore || item.rating || null,
    source: "apify",
  }));

  return sendJson(res, 200, {
    ok: true,
    actorId,
    total: leads.length,
    leads,
  });
};
