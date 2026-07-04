# showcase-gate — Cloudflare Worker

Shows a friendly "Live Demo Available by Request" page when the demo origin
(EC2) is stopped or returns a 5xx error. While the server is running, all
traffic is proxied through untouched.

## Why a Worker (not the dashboard wizard)

The Cloudflare dashboard "Create application" flow only offers full-stack app
templates (React, Next, etc.) and often leaves the **Deploy** button disabled
for new accounts. Deploying with Wrangler CLI avoids all of that.

## Deploy (from this folder)

```bash
cd cloudflare/showcase-gate

# 1. Log in (opens a browser once; also registers your workers.dev subdomain)
npx wrangler login

# 2. Deploy the Worker
npx wrangler deploy
```

Test the standalone Worker URL it prints, e.g.
`https://showcase-gate.<your-subdomain>.workers.dev`.

## Attach routes (domain Active)

Routes are configured in `wrangler.toml` for:

- `badmintonecommerce.store/*`
- `www.badmintonecommerce.store/*`
- `api.badmintonecommerce.store/*`

Deploy to apply:

```bash
npx wrangler deploy
```

## Editing the message

All copy lives in `src/index.js` (`OFFLINE_HTML`, `CONTACT_EMAIL`,
`LINKEDIN_URL`, `GITHUB_URL`). Edit, then `npx wrangler deploy` again.

## Behavior

| Origin state            | What visitors see              |
| ----------------------- | ------------------------------ |
| EC2 running (2xx/3xx/4xx)| The real application           |
| EC2 returns 5xx          | Contact / request-demo page    |
| EC2 stopped/unreachable  | Contact / request-demo page    |

No fixed business hours are shown — access is granted on request by email.
