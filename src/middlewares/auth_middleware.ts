import type { Request, Response, NextFunction } from "express"
import { inject, injectable } from "tsyringe"
import jwt from "jsonwebtoken"

import { UserRepository } from "../repositories/user-repository.js"
import { ApiError } from "../utils/api-error.js"
import { env } from "../config/env.js"

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(UserRepository) private user_repository: UserRepository
  ) {}

  handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies.access_token ||
        req.headers["authorization"]?.replace(/^Bearer\s+/i, "")

      if (!token) {
        return next(new ApiError(401, "Unauthorized: No token provided"))
      }

      const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as {
        id: string
        email: string
      }

      const user = await this.user_repository.find_by_id(decoded.id)

      if (!user) {
        return next(new ApiError(401, "Unauthorized: User no longer exists"))
      }

      req.user = {
        id: user.id,
        email: user.email,
      }

      next()
    } catch (error) {
      next(new ApiError(401, "Invalid or expired token"))
    }
  }
}
