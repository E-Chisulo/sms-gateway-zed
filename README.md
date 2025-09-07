# Femhold SMS Gateway

Reliable SMS delivery that scales with your business.

> **🚨 IMPORTANT:** Check `working.md` before starting any work - it contains current status, blockers, and next steps.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup Cloudflare KV:**
   ```bash
   wrangler kv:namespace create "API_KEYS"
   wrangler kv:namespace create "API_KEYS" --preview
   ```
   Update the KV IDs in `wrangler.toml`

3. **Add API keys to KV:**
   ```bash
   wrangler kv:key put --binding=API_KEYS "your-api-key" "active"
   ```

4. **Run locally:**
   ```bash
   npm run dev
   ```

5. **Deploy:**
   ```bash
   npm run deploy
   ```

## API Usage

```bash
curl -X POST https://femhold.your-subdomain.workers.dev/send-sms \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+2609XXXXXXXX",
    "message": "Hello from Femhold!"
  }'
```

## Response

```json
{
  "status": "success",
  "message_id": "1234567890"
}
```
