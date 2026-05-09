import { Router } from "express"
import { inject, injectable } from "tsyringe"

import { validate_request } from "../middlewares/validate-request.js"
import { UserController } from "../controllers/user-controller.js"
import { AuthMiddleware } from "../middlewares/auth_middleware.js"

import {
  create_user_request_schema,
  sign_in_user_request_schema,
  update_password_request_schema,
} from "../types/user-type.js"

@injectable()
export class UserRouter {
  public router: Router

  constructor(
    @inject(UserController) private user_controller: UserController,
    @inject(AuthMiddleware) private auth_middleware: AuthMiddleware
  ) {
    this.router = Router()
    this.initialize_routes()
  }

  private initialize_routes() {
    this.router.post(
      "/sign-up",
      validate_request(create_user_request_schema),
      this.user_controller.create
    )

    this.router.post(
      "/sign-in",
      validate_request(sign_in_user_request_schema),
      this.user_controller.sign_in
    )

    this.router.patch(
      "/update-password",
      validate_request(update_password_request_schema),
      this.user_controller.update_password
    )

    this.router.get(
      "/",
      this.auth_middleware.handle,
      this.user_controller.get_user
    )
  }
}
