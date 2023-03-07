import { withIronSessionApiRoute } from 'iron-session/next'
import type { SessionUser } from "@/interfaces/request"
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

export const withSession = (handler: NextApiHandler): (req: NextApiRequest, res: NextApiResponse) => Promise<void> => {
  const sessionOption = {
    cookieName: "short-url",
    password: process.env.COOKIE_PASSWORD as string,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }

  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    await withIronSessionApiRoute(handler, sessionOption)(req, res)
  }
}

export const createSessionValidator = (req: NextApiRequest, res: NextApiResponse): (handler: NextApiHandler) => Promise<void> => {
  return async (handler: NextApiHandler): Promise<void> => {
    const user = req.session?.user

    if (user && user.isLoggedIn) {
      await handler(req, res)
    } else {
      res.status(401).json({ error: "please login"})
    }
  }
}

declare module 'iron-session' {
  interface IronSessionData {
    user?: SessionUser
  }
}