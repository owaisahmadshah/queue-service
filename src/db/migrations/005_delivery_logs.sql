CREATE TABLE IF NOT EXISTS delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES notification_jobs(id),
  attempt INTEGER DEFAULT 0,
  status TEXT NOT NULL,
  error TEXT,
  duration_ms INTEGER,
  attempted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
