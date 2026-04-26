# Docker + EC2 + Lambda Webhook Guide (Step-by-Step)

This guide deploys your app now on a single EC2 with Docker, and uses AWS Lambda for Stripe webhook handling to showcase serverless skills.

Final result:

- Frontend: `http://<EC2_PUBLIC_IP>:3000`
- Backend API: `http://<EC2_PUBLIC_IP>:5000`
- Stripe webhook: Stripe -> API Gateway -> Lambda -> Backend secure internal callback

---

## 0) Architecture (what you are deploying)

1. EC2 runs Docker Compose:
   - `frontend` container (nginx static)
   - `backend` container (Express API)
2. Stripe webhook does **not** hit EC2 directly.
3. Stripe webhook hits API Gateway endpoint.
4. API Gateway invokes Lambda.
5. Lambda verifies Stripe signature and calls backend:
   - `POST /api/payments/lambda/confirm`
   - Auth via `x-lambda-webhook-secret`

---

## 1) Launch EC2

### 1.1 Create instance

- AMI: Ubuntu 22.04 LTS
- Instance type: `t3.small` (or `t3.medium` if needed)
- Storage: at least 30 GB gp3
- Key pair: create/select your SSH key

### 1.2 Security Group inbound rules

- `22` (SSH) from your IP only
- `3000` (frontend) from `0.0.0.0/0`
- `5000` (backend API) from `0.0.0.0/0`

### 1.3 Connect to EC2

```bash
ssh -i <your-key.pem> ubuntu@<EC2_PUBLIC_IP>
```

---

## 2) Install Docker and Docker Compose plugin

Run on EC2:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin git
sudo usermod -aG docker $USER
newgrp docker
docker --version
docker compose version
```

---

## 3) Clone project

```bash
git clone <your-repo-url> ecommerce
cd ecommerce
```

---

## 4) Configure `.env` on EC2

Your project uses root `.env` for backend runtime and docker compose build args.

```bash
nano .env
```

Minimum critical values:

```env
NODE_ENV=production
PORT=5000

# Frontend/API URLs for EC2
FRONTEND_URL=http://<EC2_PUBLIC_IP>:3000
VITE_API_URL=http://<EC2_PUBLIC_IP>:5000

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...   # will be replaced after Stripe listen to API Gateway/Lambda

# Lambda secure callback secret (set this now)
LAMBDA_WEBHOOK_INTERNAL_SECRET=<random-long-secret>

# DB and other app variables...
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
```

Generate secure callback secret quickly:

```bash
openssl rand -hex 32
```

---

## 5) Build and run Docker app on EC2

```bash
docker compose up -d --build
docker compose ps
```

Check logs:

```bash
docker compose logs -f backend
docker compose logs -f frontend
```

Health check:

```bash
curl http://localhost:5000/api/health
```

---

## 6) Verify app from browser

- Open `http://<EC2_PUBLIC_IP>:3000`
- Test auth/cart/checkout flow

At this stage Stripe checkout works, but webhook is still local/server route based until Lambda is configured in next steps.

---

## 7) Prepare Lambda webhook code package

Lambda source in this repo:

- `aws/lambda/stripe-webhook/index.mjs`
- `aws/lambda/stripe-webhook/package.json`

On your machine (or EC2), zip it:

```bash
cd aws/lambda/stripe-webhook
npm install
zip -r stripe-webhook-lambda.zip index.mjs package.json node_modules
```

---

## 8) Create Lambda function

1. AWS Console -> Lambda -> Create function
2. Name: `ecommerce-stripe-webhook`
3. Runtime: Node.js 20.x
4. Architecture: x86_64
5. Upload `stripe-webhook-lambda.zip`
6. Set handler:
   - `index.handler`

### 8.1 Lambda environment variables

Add these:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `BACKEND_INTERNAL_URL` = `http://<EC2_PUBLIC_IP>:5000`
- `LAMBDA_WEBHOOK_INTERNAL_SECRET` = same value from EC2 `.env`

### 8.2 Lambda timeout

Set timeout to at least 10 seconds.

---

## 9) Create API Gateway for Stripe webhook

1. API Gateway -> Create API -> HTTP API
2. Add integration: Lambda `ecommerce-stripe-webhook`
3. Route:
   - `POST /stripe/webhook`
4. Deploy stage:
   - e.g. `prod`
5. Copy invoke URL:
   - `https://<api-id>.execute-api.<region>.amazonaws.com/prod/stripe/webhook`

Important for Stripe signature verification:

- Ensure API Gateway passes request body unchanged.
- Keep binary/base64 support enabled (default in HTTP API is usually fine; Lambda already handles `isBase64Encoded`).

---

## 10) Point Stripe webhook to API Gateway

In Stripe dashboard:

1. Developers -> Webhooks -> Add endpoint
2. Endpoint URL:
   - `https://<api-id>.execute-api.<region>.amazonaws.com/prod/stripe/webhook`
3. Events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
4. Save endpoint and copy signing secret (`whsec_...`)

Update:

- Lambda env `STRIPE_WEBHOOK_SECRET`

If backend still uses direct Stripe webhook route, keep it unchanged for fallback, but Stripe dashboard should point to API Gateway endpoint for your showcase.

---

## 11) Verify Lambda -> Backend callback

Backend endpoint used by Lambda:

- `POST /api/payments/lambda/confirm`

Security:

- Header `x-lambda-webhook-secret` must match backend `.env` value `LAMBDA_WEBHOOK_INTERNAL_SECRET`.

Test by creating a Stripe test payment and then checking:

```bash
docker compose logs -f backend
```

You should see payment status/invoice updates without Stripe calling backend webhook directly.

---

## 12) Deployment update workflow

When code changes:

```bash
cd ~/ecommerce
git pull
docker compose up -d --build
```

If Lambda code changes:

```bash
cd aws/lambda/stripe-webhook
npm install
zip -r stripe-webhook-lambda.zip index.mjs package.json node_modules
```

Upload new zip in Lambda console and deploy.

---

## 13) Troubleshooting checklist

### Frontend not loading API

- Confirm `.env` has correct `VITE_API_URL`
- Rebuild containers: `docker compose up -d --build`

### Lambda returns 401 from backend callback

- Verify `LAMBDA_WEBHOOK_INTERNAL_SECRET` matches exactly:
  - backend `.env`
  - lambda env var

### Stripe webhook signature error

- Verify `STRIPE_WEBHOOK_SECRET` in Lambda equals endpoint signing secret in Stripe dashboard
- Confirm webhook URL points to API Gateway, not EC2 backend route

### Backend unreachable from Lambda

- Check EC2 security group allows inbound on `5000` from public internet
- Confirm `BACKEND_INTERNAL_URL` uses public EC2 IP and correct port

---

## 14) Recommended next hardening steps (after launch)

1. Add domain + HTTPS (ALB or reverse proxy + certbot)
2. Move DB to RDS if not already
3. Restrict backend `5000` port to trusted sources only (after reverse proxy setup)
4. Move secrets to AWS Systems Manager Parameter Store / Secrets Manager
