"use strict";

const { fetchJson } = require("./_lib/fetch-json");
const { methodNotAllowed, sendJson } = require("./_lib/http");

module.exports = async (req, res) => {
  if (req.method !== "GET") return methodNotAllowed(res, "GET");

  const apifyToken = process.env.APIFY_API_TOKEN || process.env.APIFY_TOKEN;
  const githubToken = process.env.GITHUB_TOKEN;
  const lovableTriggerUrl = process.env.LOVABLE_TRIGGER_URL;
  const emailBridgeUrl = process.env.GWS_BRIDGE_URL;

  const integrations = {
    apify: { configured: Boolean(apifyToken), ok: false },
    github: { configured: Boolean(githubToken), ok: false },
    lovable: { configured: Boolean(lovableTriggerUrl), ok: false },
    email: { configured: Boolean(emailBridgeUrl), ok: false },
  };

  if (integrations.apify.configured) {
    const check = await fetchJson("https://api.apify.com/v2/users/me", {
      headers: { Authorization: `Bearer ${apifyToken}` },
    });
    integrations.apify.ok = check.ok;
    if (!check.ok) integrations.apify.error = `HTTP ${check.status}`;
    if (check.ok && check.body?.data?.username) integrations.apify.account = check.body.data.username;
  }

  if (integrations.github.configured) {
    const check = await fetchJson("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "solopilot-site",
      },
    });
    integrations.github.ok = check.ok;
    if (!check.ok) integrations.github.error = `HTTP ${check.status}`;
    if (check.ok && check.body?.login) integrations.github.account = check.body.login;
  }

  integrations.lovable.ok = integrations.lovable.configured;
  if (!integrations.lovable.ok) integrations.lovable.error = "Missing LOVABLE_TRIGGER_URL";

  if (integrations.email.configured) {
    integrations.email.ok = true;
  } else {
    integrations.email.error = "Missing GWS_BRIDGE_URL";
  }

  return sendJson(res, 200, {
    ok: true,
    integrations,
    timestamp: new Date().toISOString(),
  });
};
