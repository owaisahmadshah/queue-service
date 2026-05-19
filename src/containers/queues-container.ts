import { container } from "tsyringe"

import { NotificationQueue } from "../queues/notification-queue.js"
import { QueueEvents } from "../queues/events.js"
import { EmailWorker } from "../workers/email-worker.js"

container.registerSingleton(NotificationQueue)
container.registerSingleton(EmailWorker)
container.registerSingleton(QueueEvents)
