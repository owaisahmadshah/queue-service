import { container } from "tsyringe"

import { NotificationJobRepository } from "../repositories/notification_job-repository.js"
import { NotificationJobService } from "../services/notification_job-service.js"
import { NotificationJobController } from "../controllers/notification_job-controller.js"
import { NotificationJobRouter } from "../routes/notification_job-route.js"

container.registerSingleton(NotificationJobRepository)
container.registerSingleton(NotificationJobService)
container.registerSingleton(NotificationJobController)
container.registerSingleton(NotificationJobRouter)
