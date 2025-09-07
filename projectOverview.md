# Femhold SMS Gateway MVP

## ✅ Overview

**Femhold** is a serverless, globally distributed **SMS Gateway API** built on **Cloudflare Workers** that forwards SMS requests to the **MTN SMS API**.
It is designed to be **reliable, clean, and easy-to-use**, providing a solid backbone for messaging services.

* **Brand Name:** Femhold (strong, reliable, easy to remember)
* **Free tier capacity:** \~100,000 SMS/day
* **Scalable:** Can handle millions of SMS/day with minimal cost
* **Target Use Case:** Internal MVP, programmatic notifications, or reselling SMS services

---

## ✅ Features

* API to send SMS via MTN SMS API
* API Key-based authentication
* Cloudflare KV for storing keys and configurations
* Optional Cloudflare D1 database for logging
* Rate limiting and abuse protection
* Zero-dollar hosting on the free tier

---

## ✅ Tech Stack

* **API Hosting:** [Cloudflare Workers](https://workers.cloudflare.com)
* **Key Storage:** [Cloudflare KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)
* **Logging (Optional):** [Cloudflare D1](https://developers.cloudflare.com/d1/)
* **SMS Provider:** [MTN SMS API](https://developer.mtn.com/)
* **Monitoring:** Cloudflare Analytics (built-in)

---

## ✅ Free Tier Limits

| Service         | Free Limit                          |
| --------------- | ----------------------------------- |
| Workers         | 100,000 requests/day                |
| KV Reads/Writes | 100,000 reads/day, 1,000 writes/day |
| D1 Writes       | 100,000 rows/day                    |

**Effective max on free tier:** \~100,000 SMS/day

---

## ✅ Architecture

```
Client → Femhold API (Cloudflare Worker) → MTN SMS API
                      │
                      ├── Cloudflare KV (API keys, configs)
                      └── Cloudflare D1 (optional logs)
```

---

## ✅ API Endpoints

### **1. Send SMS**

```
POST /send-sms
Content-Type: application/json
Authorization: Bearer <your-api-key>

{
  "to": "+2609XXXXXXXX",
  "message": "Hello, this is a test!"
}
```

**Response:**

```json
{
  "status": "success",
  "message_id": "1234567890"
}
```

---

## ✅ File Structure

```
/femhold-mvp
│
├── wrangler.toml        # Cloudflare config
├── package.json         # Dependencies
├── src
│   ├── index.js         # Main worker
│   ├── utils.js         # Helpers (auth, validation)
│   ├── mtn.js           # MTN API integration
└── README.md
```

---

## ✅ Setup & Deployment

### **1. Prerequisites**

* Node.js installed
* [Cloudflare account](https://dash.cloudflare.com)
* MTN SMS API account + API key

### **2. Install Wrangler**

```bash
npm install -g wrangler
```

### **3. Configure KV and D1**

```bash
wrangler kv:namespace create "API_KEYS"
wrangler d1 create sms-logs
```

### **4. Environment Variables**

Add to `wrangler.toml`:

```toml
name = "femhold"
main = "src/index.js"
compatibility_date = "2025-09-07"

[vars]
MTN_API_KEY = "your-mtn-api-key"
MTN_BASE_URL = "https://api.mtn.com/sms"

[[kv_namespaces]]
binding = "API_KEYS"
id = "<your-kv-id>"

[[d1_databases]]
binding = "DB"
database_name = "sms-logs"
database_id = "<your-d1-id>"
```

### **5. Development & Deployment**

Run locally:

```bash
wrangler dev
```

Deploy to Cloudflare Workers:

```bash
wrangler publish
```

---

## ✅ Scaling Beyond Free Tier

* Upgrade **Cloudflare Workers**: \$0.30 per 1M requests
* Upgrade KV & D1 as needed
* Batch logging to reduce database writes

**Example for 10M SMS/day:**

* Workers: \~\$89/month
* KV: \~\$149/month
* D1: \~\$300/month
  **Total infra cost:** \~\$540/month (excluding SMS costs)

---

## ✅ Roadmap

* Add webhook for delivery reports
* Implement message templates
* Add dashboard for usage stats
* Support multiple SMS providers

---

## ✅ License

MIT License

