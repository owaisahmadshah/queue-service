import { Queue, type JobsOptions, type QueueOptions } from "bullmq"
import { injectable } from "tsyringe"

import { redis_connection } from "../config/redis.js"
import { QUEUE_NAMES } from "./queue-names.js"
import type { TNotificationJobResponse } from "../types/notification_job-type.js"

@injectable()
export class NotificationQueue {
  public email_queue: Queue

  constructor() {
    this.email_queue = new Queue(QUEUE_NAMES.EMAIL, {
      connection: redis_connection,
    })
  }

  async add_email_job(
    data: Partial<TNotificationJobResponse>,
    opts: JobsOptions = {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 60000, // 1 minute
      },
    }
  ) {
    return await this.email_queue.add(QUEUE_NAMES.EMAIL, data, opts)
  }
}
