/**
 * Logs SMS send attempts to Cloudflare D1.
 *
 * Notes:
 * - API keys are hashed before storage — raw keys never touch the DB.
 * - Message content is never logged, only its length.
 * - Logging failures are silent — a DB issue should never break SMS delivery.
 */

async function hashApiKey(apiKey) {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function logSMS(db, { apiKey, recipient, message, status, deliveryStatus, messageId, error }) {
  // D1 binding may not be configured — fail silently
  if (!db) return;

  try {
    const hashedKey = await hashApiKey(apiKey);

    await db.prepare(`
      INSERT INTO sms_logs (api_key, recipient, message_length, status, delivery_status, message_id, error)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      hashedKey,
      recipient,
      message?.length ?? 0,
      status,
      deliveryStatus ?? null,
      messageId ?? null,
      error ?? null,
    ).run();

  } catch (_) {
    // Logging must never break the main flow
  }
}