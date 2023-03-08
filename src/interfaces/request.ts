export class ApiError extends Error {
  statusCode: number
  message: string
    
  constructor(code: number, msg: string) {
    super()
    this.statusCode = code
    this.message = msg
  }
}

export type SessionUser = {
  isLoggedIn: boolean
  id: string
}

export type UrlEntryData = {
  hashKey: string
  targetUrl: string
  userId?: string
}