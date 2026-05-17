import z from "zod"

export const channel_schema = z.enum(["email", "webhook", "in_app"])
export const notification_job_status_schema = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
  "dead",
])

const jsonb_schema = z.record(z.string(), z.any())

export const create_notification_job_schema = z.object({
  channel: channel_schema,
  user_id: z.string().uuid().optional(),
  payload: jsonb_schema,
  priority: z.number().int().default(0),
  status: notification_job_status_schema.default("pending"),
  idempotency_key: z.string().min(1),
  scheduled_at: z.date().optional().nullable(),
  max_attempts: z.number().int().optional(),
})

export type TNotificationJobChannel = z.infer<typeof channel_schema>
export type TNotificationJobStatus = z.infer<
  typeof notification_job_status_schema
>

// This is what the API receives
export type TCreateNotificationJob = z.infer<
  typeof create_notification_job_schema
>

// This is what goes into your Repository methods
export type TDBNotificationJob = Omit<TCreateNotificationJob, "user_id"> & {
  request_hash: string
  user_id: string // Required in DB
}

export type TNotificationJobResponse = TDBNotificationJob & {
  id: string
  attempts: number
  last_attempted_at: Date | null
  created_at: Date
  updated_at: Date
}

// For Api
export const create_notification_job_request_schema = z.object({
  body: create_notification_job_schema,
})
