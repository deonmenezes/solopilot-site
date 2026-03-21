"use strict";

const { fetchJson } = require("../_lib/fetch-json");
const { methodNotAllowed, parseJsonBody, sendJson } = require("../_lib/http");

module.exports = async (req, res) => {
  if (req.method !== "POST") return methodNotAllowed(res, "POST");

  const triggerUrl = process.env.LOVABLE_TRIGGER_URL;
  if (!triggerUrl) return sendJson(res, 500, { error: "LOVABLE_TRIGGER_URL is not configured." });

  const body = parseJsonBody(req);
  const branch = String(body.branch || "main");

  const trigger = await fetchJson(triggerUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ branch }),
  });

  if (!trigger.ok) {
    return sendJson(res, trigger.status, {
      error: "Lovable trigger failed.",
      details: trigger.body,
    });
  }

  return sendJson(res, 200, {
    ok: true,
    message: "Lovable trigger sent.",
    response: trigger.body,
  });
};
