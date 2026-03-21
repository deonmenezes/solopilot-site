"use strict";

const parseJsonBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
};

const sendJson = (res, code, payload) => {
  res.statusCode = code;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

const methodNotAllowed = (res, allowed) =>
  sendJson(res, 405, { error: `Method not allowed. Use ${allowed}.` });

module.exports = {
  methodNotAllowed,
  parseJsonBody,
  sendJson,
};
