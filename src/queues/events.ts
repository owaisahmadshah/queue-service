import { Job, QueueEvents as QE } from "bullmq"
import { inject, injectable } from "tsyringe"

import { redis_connection } from "../config/redis.js"
import { NotificationJobService } from "../services/notification_job-service.js"
import { QUEUE_NAMES } from "./queue-names.js"

@injectable()
export class QueueEvents {
  public email_queue_events: QE

  constructor(
    @inject(NotificationJobService)
    private notification_service: NotificationJobService
  ) {
    this.email_queue_events = new QE(QUEUE_NAMES.EMAIL, {
      connection: redis_connection,
    })

    this.intialize_events()
  }

  private intialize_events() {
    this.email_queue_events.on("failed", async ({ jobId, failedReason }) => {
      const job = await Job.fromId(this.email_queue_events, jobId)

      if (job && job.attemptsMade >= (job.opts.attempts ?? 3)) {
        // Move records to dead_letter_jobs and update status to 'dead'
        // await.move_to_dead_letter(jobId, failedReason);
      } else {
        await this.notification_service.update_status(jobId, "failed")
      }
    })
  }
}
