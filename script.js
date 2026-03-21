const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const counters = document.querySelectorAll("[data-target]");

const animateCounter = (el) => {
  const target = Number(el.getAttribute("data-target"));
  const duration = 1200;
  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.round(progress * target);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.4 }
);

counters.forEach((counter) => observer.observe(counter));

const logEl = document.querySelector("#api-log");
const statusEls = {
  apify: document.querySelector("#status-apify"),
  github: document.querySelector("#status-github"),
  vercel: document.querySelector("#status-vercel"),
  email: document.querySelector("#status-email"),
};

const statusLabel = (check) => {
  if (!check?.configured) return "Not configured";
  if (check.ok) return "Connected";
  return check.error || "Configured (connection not verified)";
};

const appendLog = (title, payload) => {
  if (!logEl) return;
  const time = new Date().toLocaleTimeString();
  const next = `[${time}] ${title}\n${typeof payload === "string" ? payload : JSON.stringify(payload, null, 2)}\n\n`;
  logEl.textContent = `${next}${logEl.textContent}`.slice(0, 7000);
};

const callApi = async (path, body) => {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Request failed");
  return json;
};

const refreshStatuses = async () => {
  try {
    const res = await fetch("/api/integrations");
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to load integration status");
    statusEls.apify.textContent = statusLabel(json.integrations.apify);
    statusEls.github.textContent = statusLabel(json.integrations.github);
    statusEls.vercel.textContent = statusLabel(json.integrations.vercel);
    statusEls.email.textContent = statusLabel(json.integrations.email);
    appendLog("Integration check complete", json.integrations);
  } catch (err) {
    appendLog("Integration check failed", String(err.message || err));
  }
};

const scrapeForm = document.querySelector("#scrape-form");
if (scrapeForm) {
  scrapeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(scrapeForm);
    try {
      const result = await callApi("/api/apify/scrape", {
        search: formData.get("search"),
        maxCafes: Number(formData.get("maxCafes")),
      });
      appendLog("Apify scrape success", result);
    } catch (err) {
      appendLog("Apify scrape failed", String(err.message || err));
    }
  });
}

const repoForm = document.querySelector("#repo-form");
if (repoForm) {
  repoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(repoForm);
    try {
      const result = await callApi("/api/github/create-repo", {
        repoName: formData.get("repoName"),
        description: formData.get("description"),
        private: false,
      });
      appendLog("GitHub repo created", result);
    } catch (err) {
      appendLog("GitHub repo failed", String(err.message || err));
    }
  });
}

const deployForm = document.querySelector("#deploy-form");
if (deployForm) {
  deployForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(deployForm);
    try {
      const result = await callApi("/api/vercel/deploy", {
        branch: formData.get("branch"),
      });
      appendLog("Vercel deploy triggered", result);
    } catch (err) {
      appendLog("Vercel deploy failed", String(err.message || err));
    }
  });
}

const emailForm = document.querySelector("#email-form");
if (emailForm) {
  emailForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(emailForm);
    try {
      const result = await callApi("/api/email/send", {
        to: formData.get("to"),
        subject: formData.get("subject"),
        body: formData.get("body"),
      });
      appendLog("Email send request accepted", result);
    } catch (err) {
      appendLog("Email send failed", String(err.message || err));
    }
  });
}

refreshStatuses();
