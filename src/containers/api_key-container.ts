import { container } from "tsyringe"

import { ApiKeyRepository } from "../repositories/api_key-repository.js"
import { ApiKeyService } from "../services/api_key-service.js"
import { ApiKeyController } from "../controllers/api_key-controller.js"
import { ApiKeyRouter } from "../routes/api_key-route.js"

container.registerSingleton(ApiKeyRepository)
container.registerSingleton(ApiKeyService)
container.registerSingleton(ApiKeyController)
container.registerSingleton(ApiKeyRouter)
