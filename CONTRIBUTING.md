# Contributing to Femhold SMS Gateway

Thanks for your interest in contributing! This project aims to provide a reliable, scalable SMS gateway built on Cloudflare Workers.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/sms-gateway-zed.git`
   Or clone the main repo: `gh repo clone E-Chisulo/sms-gateway-zed`
3. Install dependencies: `npm install`
4. Set up your development environment (see README.md)

## Development Setup

1. **Create Cloudflare KV namespaces:**
   ```bash
   wrangler kv:namespace create "API_KEYS"
   wrangler kv:namespace create "API_KEYS" --preview
   ```

2. **Update `wrangler.toml` with your KV IDs**

3. **Add test API key:**
   ```bash
   wrangler kv:key put --binding=API_KEYS "test-key" "active"
   ```

4. **Run locally:**
   ```bash
   npm run dev
   ```

## How to Contribute

### Bug Reports
- Use GitHub Issues
- Include steps to reproduce
- Provide error messages and logs

### Feature Requests
- Check existing issues first
- Describe the use case
- Explain why it would be valuable

### Code Contributions
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test locally
4. Commit with clear messages
5. Push and create a Pull Request

## Areas We Need Help With

- **SMS Providers:** Integrations with Twilio, AWS SNS, etc.
- **Rate Limiting:** Advanced throttling features
- **Monitoring:** Health checks and metrics
- **Documentation:** API examples and guides
- **Testing:** Unit and integration tests

## Code Style

- Use consistent formatting
- Add comments for complex logic
- Keep functions small and focused
- Follow existing patterns

## Questions?

Open an issue or start a discussion. We're here to help!
