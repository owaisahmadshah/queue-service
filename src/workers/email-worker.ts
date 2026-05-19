import { Job, Worker } from "bullmq"
import { inject, injectable } from "tsyringe"

import { NotificationJobService } from "../services/notification_job-service.js"
import { redis_connection } from "../config/redis.js"
import { QUEUE_NAMES } from "../queues/queue-names.js"

@injectable()
export class EmailWorker {
  public worker: Worker

  constructor(
    @inject(NotificationJobService)
    private notification_job_service: NotificationJobService
  ) {
    this.worker = new Worker(
      QUEUE_NAMES.EMAIL,
      async (job: Job) => {
        const job_id = job.data.id

        const current_job =
          await this.notification_job_service.get_by_id(job_id)

        if (
          !current_job ||
          ["completed", "dead"].includes(current_job.status)
        ) {
          return
        }

        await this.notification_job_service.update_status(job_id, "processing")
        await this.notification_job_service.increment_attempts(job_id)

        try {
          // TODO handle email sending logic here, e.g., using nodemailer or any email service provider SDK
          this.notification_job_service.update_status(job_id, "completed")
          // TODO log it
        } catch (error) {
          this.notification_job_service.update_status(job_id, "failed")
          // TODO log it
          throw error
        }
      },
      {
        connection: redis_connection,
      }
    )
  }
}
