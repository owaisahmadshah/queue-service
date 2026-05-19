import { inject, injectable } from "tsyringe"

import type {
  TCreateNotificationJob,
  TNotificationJobResponse,
  TNotificationJobStatus,
} from "../types/notification_job-type.js"

import { NotificationJobRepository } from "../repositories/notification_job-repository.js"
import { CryptoService } from "./crypto-service.js"
import { ApiError } from "../utils/api-error.js"
import { NotificationQueue } from "../queues/notification-queue.js"
import type { JobsOptions } from "bullmq"

@injectable()
export class NotificationJobService {
  constructor(
    @inject(NotificationJobRepository)
    private notification_job_repository: NotificationJobRepository,
    @inject(CryptoService)
    private crypto_service: CryptoService,
    @inject(NotificationQueue)
    private notification_queue: NotificationQueue
  ) {}

  async create(
    data: TCreateNotificationJob
  ): Promise<TNotificationJobResponse> {
    // If someone intentionally want to add two exact same jobs it will return the existing job
    // Fix it
    const current_request_hash =
      this.crypto_service.gen_idempotency_key_fingerprint({
        channel: data.channel,
        payload: data.payload,
        priority: data.priority,
        user_id: data.user_id!,
      })

    const existing_job =
      await this.notification_job_repository.find_by_idempotency(
        data.user_id!,
        data.idempotency_key
      )

    if (existing_job) {
      if (existing_job.request_hash === current_request_hash) {
        return existing_job
      } else {
        throw new ApiError(
          409,
          "Idempotency key collision: This key is already assigned to a different request payload."
        )
      }
    }

    const created_job = await this.notification_job_repository.create({
      ...data,
      user_id: data.user_id!,
      request_hash: current_request_hash,
      status: "pending",
    })

    const payload: Partial<TNotificationJobResponse> = {
      id: created_job.id,
      channel: created_job.channel,
      payload: created_job.payload,
      priority: created_job.priority,
    }

    const job_options: JobsOptions = {
      attempts: created_job.max_attempts,
      backoff: {
        type: "exponential",
        delay: 60000, // 1 minute
      },
      jobId: created_job.id,
    }

    if (created_job.channel === "email") {
      this.notification_queue.add_email_job(payload, job_options)
    }

    return created_job
  }

  async update_status(id: string, status: TNotificationJobStatus) {
    const updated_notification_job =
      await this.notification_job_repository.update_status(id, status)

    if (!updated_notification_job) {
      throw new ApiError(404, "Notification Job not found")
    }

    return updated_notification_job
  }

  async increment_attempts(id: string) {
    const incremented_job =
      await this.notification_job_repository.increment_attempts(id)

    if (!incremented_job) {
      throw new ApiError(404, "Notification Job not found")
    }

    return incremented_job
  }

  async get_by_id(id: string): Promise<TNotificationJobResponse | null> {
    const job = await this.notification_job_repository.get_by_id(id)
    return job
  }

  async get_by_idempotency(
    key: string
  ): Promise<TNotificationJobResponse | null> {
    const job = await this.notification_job_repository.get_by_idempotency(key)

    return job
  }
}
