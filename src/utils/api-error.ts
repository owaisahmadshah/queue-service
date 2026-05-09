class ApiError extends Error {
  statusCode: number
  data: any
  success: boolean
  errors: any[]

  /**
   * @desc    Creates a new API error instance
   * @params  {number} statausCode - HTTP status code for the error
   * @params  {string} message     - Error message describing what went wrong
   * @params  {any[]}  [error[]]   - Array of specific errors details
   * @params  {string} [stack=""]  - Error stack trace
   */
  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = [],
    stack = ""
  ) {
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message = message
    this.success = false
    this.errors = errors

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export { ApiError }
