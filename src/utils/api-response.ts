interface Api_Response {
  statusCode: number
  data: any
  message: string
}

class ApiResponse implements Api_Response {
  constructor(
    public statusCode: number,
    public data: any = null,
    public message: string = "success"
  ) {}
}

export { ApiResponse }
