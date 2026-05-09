import { inject, injectable } from "tsyringe"
import type { Request, Response } from "express"

import { UserService } from "../services/user-service.js"
import { async_handler } from "../utils/async-handler.js"
import { ApiResponse } from "../utils/api-response.js"

import {
  access_token_cookie_options,
  refresh_token_cookie_options,
} from "../config/cookie-config.js"

@injectable()
export class UserController {
  constructor(
    @inject(UserService)
    private user_service: UserService
  ) {}

  create = async_handler(async (req: Request, res: Response) => {
    const created_user = await this.user_service.create_user(req.body)

    return res.status(201).json(new ApiResponse(200, created_user))
  })

  sign_in = async_handler(async (req: Request, res: Response) => {
    const { user, access_token, refresh_token } =
      await this.user_service.sign_in(req.body)

    return res
      .status(200)
      .cookie("access_token", access_token, access_token_cookie_options)
      .cookie("refresh_token", refresh_token, refresh_token_cookie_options)
      .json(new ApiResponse(200, user))
  })

  update_password = async_handler(async (req: Request, res: Response) => {
    const updated_user = await this.user_service.update_password({
      ...req.body,
      id: req.user?.id as string,
    })

    return res.status(200).json(new ApiResponse(200, updated_user))
  })

  get_user = async_handler(async (req: Request, res: Response) => {
    const user = await this.user_service.get_user(req.user?.id as string)

    return res.status(200).json(new ApiResponse(200, user))
  })
}
