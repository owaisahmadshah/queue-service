import { injectable } from "tsyringe"

import type {
  TDBNotificationJob,
  TNotificationJobResponse,
  TNotificationJobStatus,
} from "../types/notification_job-type.js"

import { pool } from "../db/pool.js"
import { DEF_MAX_ATTEMPTS } from "../config/constants.js"

@injectable()
export class NotificationJobRepository {
  async create(data: TDBNotificationJob): Promise<TNotificationJobResponse> {
    const query = `
      INSERT INTO notification_jobs (
        channel, user_id, payload, priority, status, 
        idempotency_key, request_hash, scheduled_at, max_attempts
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `
    const values = [
      data.channel,
      data.user_id,
      data.payload,
      data.priority,
      data.status,
      data.idempotency_key,
      data.request_hash,
      data.scheduled_at,
      data.max_attempts ?? DEF_MAX_ATTEMPTS,
    ]

    const { rows } = await pool.query(query, values)
    return rows[0]
  }

  // Look up an existing job by the user and their key
  async find_by_idempotency(
    user_id: string,
    key: string
  ): Promise<TNotificationJobResponse | null> {
    const query = `
      SELECT * FROM notification_jobs 
      WHERE user_id = $1 AND idempotency_key = $2
      LIMIT 1
    `
    const { rows } = await pool.query(query, [user_id, key])
    return rows[0] || null
  }

  async update_status(
    id: string,
    status: TNotificationJobStatus
  ): Promise<TNotificationJobResponse | null> {
    const query = `
      UPDATE notification_jobs
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING * 
    `
    const { rows } = await pool.query(query, [status, id])
    return rows[0] || null
  }

  async increment_attempts(
    id: string
  ): Promise<TNotificationJobResponse | null> {
    const query = `
      UPDATE notification_jobs
      SET attempts = attempts + 1, 
          last_attempted_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `

    const { rows } = await pool.query(query, [id])

    return rows[0] || null
  }

  async get_by_idempotency(
    key: string
  ): Promise<TNotificationJobResponse | null> {
    const query = `
      SELECT * FROM notification_jobs
      WHERE idempotency_key = $1
      LIMIT 1
    `
    const { rows } = await pool.query(query, [key])
    return rows[0] || null
  }

  async get_by_id(id: string): Promise<TNotificationJobResponse | null> {
    const query = `
      SELECT * FROM notification_jobs
      WHERE id = $1
    `
    const { rows } = await pool.query(query, [id])
    return rows[0] || null
  }
}
