import { inject, injectable } from "tsyringe"
import type { Request, Response } from "express"

import { ApiKeyService } from "../services/api_key-service.js"
import { async_handler } from "../utils/async-handler.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"

@injectable()
export class ApiKeyController {
  constructor(@inject(ApiKeyService) private api_key_service: ApiKeyService) {}

  create = async_handler(async (req: Request, res: Response) => {
    const user_id = req.user?.id
    if (!user_id) throw new ApiError(401, "Unauthorized")

    const api_key = await this.api_key_service.create({
      user_id,
      name: req.body.name,
    })

    return res
      .status(201)
      .json(new ApiResponse(201, api_key, "API key created successfully"))
  })

  revoke_key = async_handler(async (req: Request, res: Response) => {
    const user_id = req.user?.id
    if (!user_id) throw new ApiError(401, "Unauthorized")

    const revoked_key = await this.api_key_service.revoke_key({
      key_id: req.body.key_id,
      user_id: user_id,
    })

    return res
      .status(200)
      .json(new ApiResponse(200, revoked_key, "API key revoked successfully"))
  })

  get_user_keys = async_handler(async (req: Request, res: Response) => {
    const user_id = req.user?.id
    if (!user_id) throw new ApiError(401, "Unauthorized")

    const user_keys = await this.api_key_service.get_user_keys(user_id)

    return res.status(200).json(new ApiResponse(200, user_keys))
  })
}
