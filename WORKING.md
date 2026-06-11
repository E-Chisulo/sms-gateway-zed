# Femhold SMS Gateway - Working Progress

> **⚠️ IMPORTANT:** Always check this file before starting any work to understand current status and next steps.

## Project Status: 🟡 In Development

### Current Phase: MTN API Authentication Debug

---

## ✅ Completed Tasks

### 1. Project Structure (2025-09-07)
- [x] Created package.json with business description
- [x] Built core application files:
  - `src/index.js` - Main worker with CORS, routing, rate limiting, and logging
  - `src/sms.js` - MTN API integration and SMS handling
  - `src/auth.js` - API key validation
  - `src/rateLimit.js` - Sliding window rate limiter via KV
  - `src/logger.js` - D1 logging for all SMS attempts
- [x] Created `wrangler.toml` with real KV and D1 binding IDs
- [x] Added `schema.sql` for D1 sms_logs table
- [x] Added comprehensive README.md
- [x] Initialized git repository with proper .gitignore

### 2. Cloudflare Infrastructure (2026-06-11)
- [x] Cloudflare account created (femhold@gmail.com)
- [x] API token configured with correct permissions
- [x] KV namespace created: `API_KEYS` (id: 6547025b7b4040ab9f47c570bb385535)
- [x] KV preview namespace created (id: 5a8c717840504798bb9cd7e2ba54a327)
- [x] D1 database created: `sms-logs` (id: 5c82be32-33ec-4975-ba49-379b4ceb723f)
- [x] Schema applied to remote and local D1
- [x] MTN secrets uploaded (MTN_CONSUMER_KEY, MTN_CONSUMER_SECRET)
- [x] Test API key added to KV: `test-key-123`
- [x] Wrangler upgraded to v4.99.0
- [x] **Deployed to production:** https://femhold.femhold.workers.dev

### 3. Security & Reliability (2026-06-11)
- [x] MTN credentials moved out of wrangler.toml into Cloudflare secrets
- [x] Rate limiting implemented (100 req/60s per API key)
- [x] D1 logging with hashed API keys (no raw keys or message content stored)
- [x] Logging failures are silent — never breaks SMS delivery

---

## 🔄 Current Blockers

### 1. MTN API 401 Unauthorized
**Status:** Deployed and running but MTN rejecting requests
**Error:** `MTN API error 401: Unauthorised.`
**Likely causes:**
  - `MTN_SERVICE_CODE` is still set to placeholder `"your-short-code"` in wrangler.toml
  - MTN consumer key/secret may need to be tied to a specific product/subscription on the MTN developer portal
  - MTN API may require the account to be activated for the Zambia opco

**Next Action:** 
  1. Log into https://developer.mtn.com and verify the app subscription is active
  2. Confirm the correct service code for the Zambia opco
  3. Update `MTN_SERVICE_CODE` in wrangler.toml and redeploy

---

## 📋 Next Steps (In Order)

### Immediate (Fix MTN 401)
1. Check MTN developer portal — confirm app is subscribed to the SMS API product
2. Get the correct service code from MTN and update wrangler.toml
3. Redeploy and retest

### After MTN Auth Fixed
4. Test end-to-end SMS delivery to a real Zambian number
5. Verify D1 logs are being written correctly
6. Test rate limiting behaviour

### Future Enhancements (Per projectOverview.md)
- [ ] Add webhook endpoint for MTN delivery receipts
- [ ] Implement message templates
- [ ] Add usage dashboard
- [ ] Support multiple SMS providers (Twilio, AWS SNS)
- [ ] Add `workers_dev = true` to wrangler.toml to silence deploy warnings

---

## 🎯 Infrastructure Summary

| Resource         | Name/ID                                          |
|------------------|--------------------------------------------------|
| Worker URL       | https://femhold.femhold.workers.dev              |
| KV Namespace     | 6547025b7b4040ab9f47c570bb385535                 |
| KV Preview       | 5a8c717840504798bb9cd7e2ba54a327                 |
| D1 Database      | 5c82be32-33ec-4975-ba49-379b4ceb723f             |
| Wrangler Version | 4.99.0                                           |
| Account          | femhold@gmail.com                                |

---

## 📝 Development Log

**2026-06-11 01:13:** Successfully deployed to https://femhold.femhold.workers.dev
**2026-06-11 01:10:** Fixed deploy script (wrangler publish → wrangler deploy) for v4
**2026-06-11 01:08:** KV, D1, secrets all configured on Cloudflare
**2026-06-11 00:49:** Upgraded Wrangler to v4.99.0
**2026-06-11 00:44:** Fixed MTN API request format per API spec
**2026-06-11 00:44:** Added rate limiting and D1 logging
**2026-06-11 00:44:** Moved MTN credentials to Cloudflare secrets
**2025-09-07 01:13:** Created working.md as living document
**2025-09-07 00:52:** Git repository initialized with complete codebase

---

**Last Updated:** 2026-06-11 01:15 UTC
**Next Review:** After MTN 401 is resolved