import { container } from "tsyringe"

import { UserRepository } from "../repositories/user-repository.js"
import { UserService } from "../services/user-service.js"
import { UserController } from "../controllers/user-controller.js"
import { UserRouter } from "../routes/user-route.js"

container.registerSingleton(UserRepository)
container.registerSingleton(UserService)
container.registerSingleton(UserController)
container.registerSingleton(UserRouter)
