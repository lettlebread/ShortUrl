import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "@/libs/dbService"
import { isString } from '@/libs/stringUtil'
import { createHashString } from '@/libs/hashUtil'
import { ApiError } from '@/interfaces/request'
import { errorWrapper } from '@/middleware/errorWrapper'

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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      await postHandler(req, res);
    } else {
      res.status(404).json({});
    }
  } catch (e) {
    throw e;
  }
};

export default errorWrapper(handler);