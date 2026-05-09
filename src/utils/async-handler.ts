import type { Request, Response, NextFunction, RequestHandler } from "express"

/**
 * Async handler to catch errors and pass them to Express error handler.
 * This utility function wraps async route handlers to automatically catch errors
 * and pass them to Express's error handling middleware.
 *
 * @template T - The type of the response that the handler will return
 * @param {Function} requestHandler - The async route handler function
 * @returns {RequestHandler} A wrapped Express request handler that catches errors
 *
 * @example
 * // Usage in a route handler
 * router.get('/example', async_handler(async (req, res) => {
 *   const data = await someAsyncOperation();
 *   res.json(data);
 * }));
 */
const async_handler =
  <T = any>(
    requestHandler: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<T>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next)
  }

export { async_handler }
