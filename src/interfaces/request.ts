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

export type NewUrlEntryMeta = {
  hashKey: string
  targetUrl: string
  userId?: string
  name?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  viewTimes: number
}

export type NewUrlEntryArg = {
  name?: string
  targetUrl: string
  description?: string
}

export type UpdateUrlEntryArg = {
  name?: string
  targetUrl: string
  description?: string
}

export type UrlEntryApiData = {
  hashKey: string
  targetUrl: string
  name: string
  createdAt: Date
  updatedAt: Date
  description: string
}