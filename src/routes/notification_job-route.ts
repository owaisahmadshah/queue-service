import { Router } from "express"
import { inject, injectable } from "tsyringe"

import { NotificationJobController } from "../controllers/notification_job-controller.js"
import { validate_request } from "../middlewares/validate-request.js"
import { create_notification_job_request_schema } from "../types/notification_job-type.js"
import { AuthMiddleware } from "../middlewares/auth_middleware.js"

@injectable()
export class NotificationJobRoute {
  public router: Router

  constructor(
    @inject(NotificationJobController)
    private notification_job_controller: NotificationJobController,
    @inject(AuthMiddleware)
    private auth_middleware: AuthMiddleware
  ) {
    this.router = Router()
    this.initialize()
  }

  private initialize() {
    this.router.post(
      "/notify",
      validate_request(create_notification_job_request_schema),
      this.notification_job_controller.create
    )

    this.router.get(
      "/:id",
      this.auth_middleware.handle,
      this.notification_job_controller.get_job_by_id
    )

    this.router.get(
      "/",
      this.auth_middleware.handle,
      this.notification_job_controller.get_all_jobs
    )
  }
}
