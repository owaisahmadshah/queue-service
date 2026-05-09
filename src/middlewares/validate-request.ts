import type { Request, Response, NextFunction } from "express"
import { ZodError, type ZodObject } from "zod"

import { ApiError } from "../utils/api-error.js"

export const validate_request = (schema: ZodObject) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      return next()
    } catch (error) {
      if (error instanceof ZodError) {
        const validation_errors = error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }))

        throw new ApiError(400, "Validation failed.", validation_errors)
      }

      next(error)
      return
    }
  }
}
