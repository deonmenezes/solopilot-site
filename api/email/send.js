"use strict";

const { fetchJson } = require("../_lib/fetch-json");
const { methodNotAllowed, parseJsonBody, sendJson } = require("../_lib/http");

module.exports = async (req, res) => {
  if (req.method !== "POST") return methodNotAllowed(res, "POST");

  const bridgeUrl = process.env.GWS_BRIDGE_URL;
  const bridgeToken = process.env.GWS_BRIDGE_TOKEN;
  if (!bridgeUrl) return sendJson(res, 500, { error: "GWS_BRIDGE_URL is not configured." });

  const body = parseJsonBody(req);
  const to = String(body.to || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.body || "").trim();

  if (!to || !subject || !message) {
    return sendJson(res, 400, { error: "to, subject, and body are required." });
  }

  const send = await fetchJson(bridgeUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(bridgeToken ? { Authorization: `Bearer ${bridgeToken}` } : {}),
    },
    body: JSON.stringify({
      to,
      subject,
      body: message,
      source: "solopilot",
    }),
  });

  if (!send.ok) {
    return sendJson(res, send.status, {
      error: "Email bridge request failed.",
      details: send.body,
    });
  }

  return sendJson(res, 200, {
    ok: true,
    message: "Email request accepted by bridge.",
    response: send.body,
  });
};
