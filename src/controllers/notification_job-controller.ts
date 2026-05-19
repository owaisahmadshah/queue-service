import type { Response, Request } from "express"
import { inject, injectable } from "tsyringe"

import { NotificationJobService } from "../services/notification_job-service.js"
import { async_handler } from "../utils/async-handler.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"

@injectable()
export class NotificationJobController {
  constructor(
    @inject(NotificationJobService)
    private notification_job_service: NotificationJobService
  ) {}

  create = async_handler(async (req: Request, res: Response) => {
    const notification_job = await this.notification_job_service.create(
      req.body
    )
    return res.status(201).json(new ApiResponse(201, notification_job))
  })

  get_job_by_id = async_handler(async (req: Request, res: Response) => {
    if (!req.params.id) {
      throw new ApiError(400, "Job ID is required")
    }

    const job = await this.notification_job_service.get_by_id(
      String(req.params.id)
    )

    return res.status(200).json(new ApiResponse(200, job))
  })

  get_all_jobs = async_handler(async (req: Request, res: Response) => {
    // This method is not implemented in the service/repository, but you can easily add it if needed
    return res.status(200).json(new ApiResponse(200, []))
  })
}
