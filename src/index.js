import { handleSendSMS } from './sms.js';
import { validateApiKey } from './auth.js';
import { checkRateLimit } from './rateLimit.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === '/send-sms' && request.method === 'POST') {
      try {
        // 1. Validate API key
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
          return new Response(JSON.stringify({ error: 'Missing or invalid API key' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const apiKey = authHeader.substring(7);
        const isValid = await validateApiKey(apiKey, env.API_KEYS);

        if (!isValid) {
          return new Response(JSON.stringify({ error: 'Invalid API key' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // 2. Check rate limit
        const { allowed, remaining, resetAt } = await checkRateLimit(apiKey, env.API_KEYS);

        const rateLimitHeaders = {
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(resetAt),
        };

        if (!allowed) {
          return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again shortly.' }), {
            status: 429,
            headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
          });
        }

        // 3. Send SMS
        const body = await request.json();
        const result = await handleSendSMS(body, env);

        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, ...rateLimitHeaders, 'Content-Type': 'application/json' },
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  },
};
