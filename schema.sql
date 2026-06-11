-- Run this once to set up your D1 database:
--   wrangler d1 execute sms-logs --file=schema.sql

CREATE TABLE IF NOT EXISTS sms_logs (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  api_key         TEXT    NOT NULL,               -- hashed, never store raw keys
  recipient       TEXT    NOT NULL,               -- E.164 phone number
  message_length  INTEGER NOT NULL,               -- character count, not the message itself
  status          TEXT    NOT NULL,               -- 'success' | 'error'
  delivery_status TEXT,                           -- MTN status: PENDING, DELIVERED, etc.
  message_id      TEXT,                           -- MTN transactionId
  error           TEXT,                           -- error message if status = 'error'
  created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sms_logs_api_key    ON sms_logs(api_key);
CREATE INDEX IF NOT EXISTS idx_sms_logs_created_at ON sms_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_sms_logs_status     ON sms_logs(status);