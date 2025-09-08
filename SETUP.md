# Setup Guide

Complete setup instructions for getting Femhold SMS Gateway running.

## Prerequisites

1. **Node.js** (v16 or later)
2. **Cloudflare account** (free tier works)
3. **SMS provider account** (see options below)

## Step 1: Cloudflare Setup

1. **Sign up at [Cloudflare](https://cloudflare.com)**
2. **Install Wrangler CLI:**
   ```bash
   npm install -g wrangler
   ```
3. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

## Step 2: SMS Provider Setup

Choose one SMS provider to start:

### Option A: MTN Zambia (Current Implementation)
- Contact MTN Business for SMS API access
- Get API credentials and endpoint URLs
- Update `src/providers/mtn.js` with your credentials

### Option B: Twilio (Recommended for Global)
1. Sign up at [Twilio](https://twilio.com)
2. Get Account SID and Auth Token from console
3. Buy a phone number
4. Add Twilio provider integration (see CONTRIBUTING.md)

### Option C: AWS SNS
1. Create AWS account
2. Set up SNS service
3. Get access keys
4. Add AWS SNS provider (see CONTRIBUTING.md)

## Step 3: Project Setup

1. **Clone and install:**
   ```bash
   gh repo clone E-Chisulo/sms-gateway-zed
   cd sms-gateway-zed
   npm install
   ```

2. **Create KV namespaces:**
   ```bash
   wrangler kv:namespace create "API_KEYS"
   wrangler kv:namespace create "API_KEYS" --preview
   ```

3. **Update `wrangler.toml`:**
   Replace the KV namespace IDs with yours from step 2

4. **Add your API keys:**
   ```bash
   wrangler kv:key put --binding=API_KEYS "your-secret-key" "active"
   ```

## Step 4: Configure Environment

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your SMS provider credentials**

## Step 5: Test & Deploy

1. **Test locally:**
   ```bash
   npm run dev
   ```

2. **Test the API:**
   ```bash
   curl -X POST http://localhost:8787/send-sms \
     -H "Authorization: Bearer your-secret-key" \
     -H "Content-Type: application/json" \
     -d '{"to": "+260XXXXXXXXX", "message": "Test message"}'
   ```

3. **Deploy to production:**
   ```bash
   npm run deploy
   ```

## Next Steps

- Add more SMS providers
- Set up monitoring and alerts
- Configure rate limiting
- Add webhook support for delivery receipts

## Need Help?

- Check [CONTRIBUTING.md](CONTRIBUTING.md) for development setup
- Open an issue for questions
- Join discussions for feature requests
