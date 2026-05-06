CREATE TABLE IF NOT EXISTS dead_letter_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_job_id UUID REFERENCES notification_jobs(id),
  channel channel NOT NULL,
  payload JSONB NOT NULL,
  failure_reason TEXT NOT NULL,
  final_error TEXT NOT NULL,
  died_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
