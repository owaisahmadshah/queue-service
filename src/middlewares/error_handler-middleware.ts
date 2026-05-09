import type { ErrorRequestHandler } from "express"
import type { Request, Response, NextFunction } from "express"
import { ApiError } from "../utils/api-error.js"

const error_handler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err

  if (!(error instanceof ApiError)) {
    // TODO: Check if the error is thrown by psql if use send 400 else 500
    const statusCode = error.statusCode ? 400 : 500
    const message = error.message || "Something went wrong"

    error = new ApiError(
      statusCode,
      message,
      error?.errors?.errors || [],
      err.stack
    )
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  }

  res.status(error.statusCode).json(response)
}

export { error_handler }
