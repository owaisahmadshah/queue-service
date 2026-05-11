import { Router } from "express"
import { inject, injectable } from "tsyringe"
import { ApiKeyController } from "../controllers/api_key-controller.js"
import { AuthMiddleware } from "../middlewares/auth_middleware.js"
import { validate_request } from "../middlewares/validate-request.js"
import {
  create_api_key_req_schema,
  revoke_api_key_req_schema,
} from "../types/api_key-type.js"

@injectable()
export class ApiKeyRouter {
  public router: Router

  constructor(
    @inject(ApiKeyController) private api_key_controller: ApiKeyController,
    @inject(AuthMiddleware) private auth_middleware: AuthMiddleware
  ) {
    this.router = Router()
    this.initialize_routes()
  }

  private initialize_routes() {
    this.router.post(
      "/create",
      this.auth_middleware.handle,
      validate_request(create_api_key_req_schema),
      this.api_key_controller.create
    )

    this.router.patch(
      "/revoke",
      this.auth_middleware.handle,
      validate_request(revoke_api_key_req_schema),
      this.api_key_controller.revoke_key
    )

    this.router.get(
      "/keys",
      this.auth_middleware.handle,
      this.api_key_controller.get_user_keys
    )
  }
}
