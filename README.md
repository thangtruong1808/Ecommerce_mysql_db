# Badminton Stores

Full-stack shop for badminton gear. The API is Express and MySQL. The shop is React, Vite, and Tailwind. Product photos and videos are stored in Amazon S3 when that option is turned on, or on the API server's disk when it is not.

## What you need

- Node.js 18 or newer
- npm
- MySQL
- An S3 bucket only if you want cloud media. Local disk storage works without it.

## Install

From the repository root:

```bash
npm run install:all
```

That installs the root tools, the frontend, and the backend.

## Environment

The apps do not read a `.env` file at the repository root.

```bash
cp backend/.env.sample backend/.env
cp frontend/.env.sample frontend/.env
```

Fill in `backend/.env` on the machine that runs the API. The sample lists database, JWT, cookies, email, S3, Stripe, and Australia Post. Leave secrets empty until you have them.

For local Vite, leave `VITE_API_URL` empty. The dev server proxies `/api` to `http://localhost:5000`. Set `VITE_STRIPE_PUBLISHABLE_KEY` if checkout should use a publishable key from the frontend. The API can also return one from `GET /api/payments/config`.

Local HTTP cookies: use `NODE_ENV=development`, `COOKIE_SECURE=false`, and `COOKIE_SAMESITE=Lax`. Production defaults mark cookies Secure.

Create the tables with `backend/database/schema.sql`.

## Run locally

```bash
npm run dev
```

- Shop: http://localhost:3000
- API: http://localhost:5000
- Health: http://localhost:5000/api/health

## Check and build

```bash
npm run typecheck
npm run build
```

`npm run build` compiles the API to `backend/dist` and builds the shop to `frontend/dist`. Start the compiled API with `npm start` from the root, which runs `node dist/server.js` inside `backend`.

Frontend lint checks the remaining JavaScript files:

```bash
cd frontend && npm run lint
```

TypeScript is checked by `npm run typecheck`, not by that lint command.

## Docker

`docker compose up -d --build` builds both images from the repository root. The shop container publishes `127.0.0.1:3010` only. The API listens on port 5000 inside the Docker network and is not published on the host. Nginx inside the shop image serves the site and proxies `/api/` to the API. Compose reads `backend/.env`. The frontend image reads `frontend/.env` at build time, so `VITE_` values are baked into that build.

```bash
docker compose up -d --build
docker compose ps
docker compose logs --tail 100
docker compose stop
```

`docker compose stop` stops this shop. Run these commands in this repository's directory.

## Branches and the VPS

`dev` and `main` are where code is written. `prod` is the branch the Contabo VPS runs.

Publish by merging both branches into `prod`, then pushing `prod`:

```bash
git checkout prod
git merge main
git merge dev
git push origin prod
```

That push starts the "Deploy production" GitHub Action. The action copies this repository to `/opt/projects/ecommerce_mysql_db` and runs `docker compose up -d --build` there. It does not change other projects on the VPS.

`backend/.env` and `frontend/.env` stay on the server. They are not in git, and a deploy does not replace them. Leave `VITE_API_URL` empty so the browser calls `/api` on the same host. Set `VITE_SHOWCASE_HOURS_ENABLED=false` for a normal production build.

The public shop is https://badmintonecommerce.store. `https://www.badmintonecommerce.store` is allowed by CORS. Host Nginx on the VPS proxies that domain to `127.0.0.1:3010`.

The action reads `VPS_HOST`, `VPS_USER`, and `VPS_SSH_KEY` from the repository's GitHub Actions secrets. Those values are not stored in this file.

## S3 media

Set `USE_AWS_S3=true` and provide `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_S3_BUCKET_NAME`. `AWS_S3_BUCKET_URL` is optional. When it is empty, the API builds the object URL from the bucket and region.

Uploads go through the API. The browser does not upload straight to the bucket. Product photos are shown with normal image tags, and list images load lazily. The bucket must allow public `GetObject` for those URLs, or the shop will show the placeholder image.

If a new site origin reads objects with JavaScript, add that origin to the bucket CORS policy for `GET` and `HEAD`. Image tags themselves do not need CORS. Point the API's `FRONTEND_URL` at the new shop origin so the browser can call the API with cookies.

S3 stays the media store. This repository does not include steps for EC2, Lambda, or Vercel.

## Routes worth knowing

- `/` shop home
- `/products` and `/products/:id` catalog and product
- `/cart` and `/checkout`
- `/maintenance` offline notice. It is not shown automatically.
- `/admin/dashboard` after an admin signs in
- Unknown addresses use the 404 page. An unexpected render error uses the error boundary.

The showcase-hours gate stays off in local development unless `VITE_SHOWCASE_HOURS_ENABLED=true`. A production build keeps the gate on unless that value is `false`.

## API groups

`/api/auth`, `/api/products`, `/api/cart`, `/api/orders`, `/api/shipping`, `/api/payments`, `/api/invoices`, `/api/product-views`, reviews, comments, likes, vouchers, and `/api/admin`.

## License

ISC.
