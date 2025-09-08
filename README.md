# Femhold SMS Gateway

A reliable, scalable SMS gateway built on Cloudflare Workers. Send SMS messages through a simple REST API with built-in authentication and rate limiting.

## Features

- 🚀 **Serverless**: Built on Cloudflare Workers for global edge deployment
- 🔐 **Secure**: API key authentication with Cloudflare KV storage
- 📱 **Multi-provider**: Support for multiple SMS providers (extensible)
- ⚡ **Fast**: Low latency with edge computing
- 💰 **Cost-effective**: Pay only for what you use

> **🚨 IMPORTANT:** Check `working.md` before starting any work - it contains current status, blockers, and next steps.

## Quick Start

**New to the project?** See [SETUP.md](SETUP.md) for complete setup instructions including SMS provider configuration.

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

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Areas
- SMS provider integrations (Twilio, AWS SNS, etc.)
- Rate limiting improvements
- Documentation and examples
- Testing and monitoring

## License

MIT License - see [LICENSE](LICENSE) file for details.
