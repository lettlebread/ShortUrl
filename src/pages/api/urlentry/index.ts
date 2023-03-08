import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "@/libs/dbService"
import { isString } from '@/libs/stringUtil'
import { createHashString } from '@/libs/hashUtil'
import { ApiError } from '@/interfaces/request'
import { errorWrapper } from '@/middleware/errorWrapper'
import { withSession, createSessionValidator } from '@/middleware/withSession';

const postHandler = async(req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const url = req.body.url

    if (!isString(url)) {
      throw new ApiError(400, "invalid url")
    }

    let entry = createHashString()

    await prisma?.urlEntry.create({
      data: {
        hashKey: entry,
        targetUrl: url
      },
    })

    res.status(200).json({
      urlEntry: entry
    });
  } catch(e: any) {
    if (typeof e?.code === "string" && e?.code.startsWith("P")) {
      throw new ApiError(404, "fail to create url entry")
    } else {
      throw e
    }
  }
}

const getHandler = async(req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const userId = req.session.user?.id

    const urlEntries = await prisma?.urlEntry.findMany({
      where: {
        userId
      },
      select: {
        createdAt: true,
        updatedAt: true,
        hashKey: true,
        targetUrl: true
      }
    })
    res.status(200).json({
      urlEntries
    })
  } catch(e: any) {
    if (typeof e?.code === "string" && e?.code.startsWith("P")) {
      throw new ApiError(404, "fail to create url entry")
    } else {
      throw e
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const sessionValidator = createSessionValidator(req, res)

    if (req.method === "POST") {
      await sessionValidator(postHandler);
    } else if (req.method === "GET") {
      await sessionValidator(getHandler);
    } else {
      res.status(404).json({});
    }
  } catch (e) {
    throw e;
  }
};

export default withSession(errorWrapper(handler));