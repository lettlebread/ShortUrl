export class ApiError extends Error {
  statusCode: number
  message: string
    
  constructor(code: number, msg: string) {
    super()
    this.statusCode = code
    this.message = msg
  }
}