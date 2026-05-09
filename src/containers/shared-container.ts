import { container } from "tsyringe"
import { TokenService } from "../services/token-service.js"
import { AuthMiddleware } from "../middlewares/auth_middleware.js"

container.registerSingleton(TokenService)
container.registerSingleton(AuthMiddleware)
