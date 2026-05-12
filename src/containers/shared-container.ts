import { container } from "tsyringe"

import { TokenService } from "../services/token-service.js"
import { AuthMiddleware } from "../middlewares/auth_middleware.js"
import { CryptoService } from "../services/crypto-service.js"

container.registerSingleton(CryptoService)
container.registerSingleton(TokenService)
container.registerSingleton(AuthMiddleware)
