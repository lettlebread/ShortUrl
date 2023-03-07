import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "@/libs/dbService"
import { isString } from '@/libs/stringUtil'
import { ApiError } from '@/interfaces/request'
import { compareWithHash } from '@/libs/bycryptUtil'
import { SessionUser } from "@/interfaces/request"
import { createSessionWrapper } from '@/middleware/withSession';
import { errorWrapper } from '@/middleware/errorWrapper'

const postHandler = async(req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, password } = req.body

    if (!isString(email) ||
      !isString(password)
      ) {
      throw new ApiError(400, "invalid argument")
    }

    const user = await prisma?.user.findUnique({
      where: {
        email,
      },
    })

    if (!user || !compareWithHash(password, user.password)) {
      throw new ApiError(401, "invalid email or password")
    }

    const sessionUser = { isLoggedIn: true, id: user.id } as SessionUser
    req.session.user = sessionUser
    await req.session.save()

    res.status(200).json({});
  } catch(e: any) {
    if (typeof e?.code === "string" && e?.code.startsWith("P")) {
      throw new ApiError(404, "fail to create user")
    } else {
      throw e
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const withSession = createSessionWrapper(req, res)

    if (req.method === "POST") {
      await withSession(postHandler);
    } else {
      res.status(404).json({});
    }
  } catch (e) {
    throw e;
  }
};

export default errorWrapper(handler);