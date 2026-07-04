/**
 * Cloudflare Worker: showcase-gate
 *
 * Sits in front of the origin (EC2). While the demo server is running, requests
 * are proxied through untouched. When the server is stopped (to save hosting
 * costs) or returns a 5xx error, visitors see a friendly, professional page
 * inviting them to request live demo access by email.
 */

const CONTACT_EMAIL = "thangtruong1808@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/thang-truong-00b245200/";
const GITHUB_URL = "https://github.com/thangtruong1808/Ecommerce_mysql_db";
/** Fail fast when origin is stopped so visitors see the contact page quickly. */
const ORIGIN_TIMEOUT_MS = 8000;

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Live Demo Available by Request | Badminton Stores</title>
  <meta name="description" content="Portfolio e-commerce showcase — contact to request live demo access." />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      min-height: 100dvh;
      background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
      color: #111827;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: max(2.5rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) max(2.5rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
      -webkit-text-size-adjust: 100%;
    }
    .card {
      width: 100%;
      max-width: 32rem;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 1rem;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      padding: 2rem 1.5rem;
      text-align: center;
    }
    @media (min-width: 640px) { .card { padding: 2.5rem; } }
    .icon {
      width: 4rem; height: 4rem; margin: 0 auto 1.5rem;
      border-radius: 9999px; background: #eff6ff; color: #2563eb;
      display: flex; align-items: center; justify-content: center; font-size: 1.6rem;
    }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; line-height: 1.3; }
    @media (min-width: 640px) { h1 { font-size: 1.875rem; } }
    .lead { color: #4b5563; font-size: 0.9375rem; line-height: 1.65; margin-bottom: 1.5rem; }
    .contact-box {
      text-align: left; background: #f9fafb; border: 1px solid #f3f4f6;
      border-radius: 0.75rem; padding: 1rem 1.25rem; margin-bottom: 1.5rem;
    }
    .contact-label {
      font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em;
      text-transform: uppercase; color: #6b7280; margin-bottom: 0.5rem;
    }
    .contact-text { font-size: 0.9375rem; color: #374151; line-height: 1.6; }
    .email-link { color: #2563eb; font-weight: 600; text-decoration: none; word-break: break-word; }
    .email-link:hover { text-decoration: underline; }
    .note { font-size: 0.8125rem; color: #6b7280; line-height: 1.6; margin-bottom: 1.5rem; }
    .actions { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
    @media (min-width: 480px) { .actions { flex-direction: row; justify-content: center; flex-wrap: wrap; } }
    .btn {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 0.625rem 1.25rem; border-radius: 0.5rem;
      font-size: 0.875rem; font-weight: 500; text-decoration: none;
      transition: background 0.15s ease;
    }
    .btn-primary { background: #2563eb; color: #fff; border: none; cursor: pointer; }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-primary:focus-visible, .btn-secondary:focus-visible, .email-link:focus-visible {
      outline: 2px solid #2563eb;
      outline-offset: 2px;
    }
    .btn-secondary { background: #fff; color: #374151; border: 1px solid #d1d5db; }
    .btn-secondary:hover { background: #f9fafb; }
    @media (prefers-reduced-motion: reduce) {
      .btn { transition: none; }
    }
    .footer { font-size: 0.75rem; color: #9ca3af; }
  </style>
</head>
<body>
  <main class="card" role="main">
    <div class="icon" aria-hidden="true">&#9993;</div>
    <h1>Live Demo Available by Request</h1>
    <p class="lead">
      This project is a portfolio showcase built to demonstrate my full-stack
      development skills to potential employers and hiring teams.
    </p>
    <div class="contact-box">
      <p class="contact-label">Request demo access</p>
      <p class="contact-text">
        The live environment is activated on request. If you would like to explore the application,
        please email me at
        <a class="email-link" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
        and I will gladly enable access so you can try it out.
      </p>
    </div>
    <p class="note">
      Thank you for your interest. In the meantime, you are welcome to review the source code
      on GitHub or connect with me on LinkedIn.
    </p>
    <div class="actions">
      <a class="btn btn-primary" href="mailto:${CONTACT_EMAIL}?subject=Demo%20access%20request%20-%20Badminton%20Stores%20portfolio">Email Me</a>
      <a class="btn btn-secondary" href="${LINKEDIN_URL}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a class="btn btn-secondary" href="${GITHUB_URL}" target="_blank" rel="noopener noreferrer">GitHub</a>
    </div>
    <p class="footer">Badminton Stores — Full-Stack E-commerce Portfolio Showcase</p>
  </main>
</body>
</html>`;

function offlineResponse() {
  return new Response(OFFLINE_HTML, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Retry-After": "600",
    },
  });
}

/**
 * @param {Request} request
 */
async function fetchFromOrigin(request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ORIGIN_TIMEOUT_MS);

  try {
    return await fetch(request, {
      signal: controller.signal,
      cf: { cacheTtl: 0 },
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export default {
  async fetch(request) {
    try {
      const response = await fetchFromOrigin(request);

      // Origin is up but erroring (e.g. still booting) -> show contact page.
      if (response.status >= 500) {
        return offlineResponse();
      }

      return response;
    } catch {
      // Origin unreachable or timed out (EC2 stopped) -> show contact page.
      return offlineResponse();
    }
  },
};
