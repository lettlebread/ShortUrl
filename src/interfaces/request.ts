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
  email: string
}

export type NewUrlEntryData = {
  hashKey: string
  targetUrl: string
  userId?: string
}

export type UrlEntryClientData = {
  hashKey: string
  targetUrl: string
  name: string
  createdAt: Date
  updatedAt: Date
  description: string
}