CREATE TABLE IF NOT EXISTS notification_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel channel NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  priority INTEGER NOT NULL,
  status status NOT NULL DEFAULT 'pending',
  idempotency_key TEXT NOT NULL,
  
  -- The request_hash stores a deterministic checksum (e.g., SHA-256) of the 
  -- request payload to ensure the user isn't reusing a key for different data.
  request_hash TEXT NOT NULL,

  scheduled_at TIMESTAMPTZ,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  last_attempted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  -- Scopes the idempotency key to the specific user to prevent global collisions 
  -- and enforces the 'one-request-one-key' rule.
  CONSTRAINT unique_user_idempotency UNIQUE (user_id, idempotency_key)
);
