"use strict";

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();
  return {
    ok: response.ok,
    status: response.status,
    body,
  };
};

module.exports = {
  fetchJson,
};
