"use strict";

const { fetchJson } = require("../_lib/fetch-json");
const { methodNotAllowed, parseJsonBody, sendJson } = require("../_lib/http");

module.exports = async (req, res) => {
  if (req.method !== "POST") return methodNotAllowed(res, "POST");

  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) return sendJson(res, 500, { error: "VERCEL_DEPLOY_HOOK_URL is not configured." });

  const body = parseJsonBody(req);
  const branch = String(body.branch || "main");

  const trigger = await fetchJson(hookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ branch }),
  });

  if (!trigger.ok) {
    return sendJson(res, trigger.status, {
      error: "Vercel deploy trigger failed.",
      details: trigger.body,
    });
  }

  return sendJson(res, 200, {
    ok: true,
    message: "Deploy hook triggered.",
    response: trigger.body,
  });
};
