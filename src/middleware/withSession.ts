import { withIronSessionApiRoute } from 'iron-session/next'
import type { SessionUser } from "@/interfaces/request"
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export const createSessionWrapper = (req: NextApiRequest, res: NextApiResponse): (handler: NextApiHandler) => Promise<void> => {
  const sessionOption = {
    cookieName: "short-url",
    password: process.env.COOKIE_PASSWORD as string,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }

  return async (handler: NextApiHandler): Promise<void> => {
    await withIronSessionApiRoute(handler, sessionOption)(req, res)
  }
}

declare module 'iron-session' {
  interface IronSessionData {
    user?: SessionUser
  }
}