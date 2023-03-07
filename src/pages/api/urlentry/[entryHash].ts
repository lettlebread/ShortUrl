import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "@/libs/dbService"
import { isString } from '@/libs/stringUtil'
import { ApiError } from '@/interfaces/request'
import { errorWrapper } from '@/middleware/errorWrapper'

const getHandler = async(req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const entryHash = req.query.entryHash

    if (!isString(entryHash)) {
      throw new ApiError(400, "invalid entry hash")
    }

    const entry = await prisma?.urlEntry.findUnique({
      where: {
        hashKey: entryHash as string,
      },
    })

    if (!entry) {
      res.status(404).json({});
    } else {
      res.redirect(307, entry.targetUrl);
    }
  } catch(e) {
    throw e
  }
}

const patchHandler = async(req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const entryHash = req.query.entryHash
    const url = req.body.url

    if (!isString(entryHash)) {
      throw new ApiError(400, "invalid entry hash")
    }

    if (!isString(url)) {
      throw new ApiError(400, "invalid url")
    }

    await prisma?.urlEntry.update({
      where: {
        hashKey: entryHash as string,
      },
      data: {
        targetUrl: url
      }
    })

    res.status(200).json({});
  } catch(e: any) {
    if (typeof e?.code === "string" && e?.code.startsWith("P")) {
      throw new ApiError(404, "fail to update url entry")
    } else {
      throw e
    }
  }
}

const deleteHandler = async(req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const entryHash = req.query.entryHash

    if (!isString(entryHash)) {
      throw new ApiError(400, "invalid entry hash")
    }

    await prisma?.urlEntry.delete({
      where: {
        hashKey: entryHash as string,
      }
    })

    res.status(200).json({});
  } catch(e: any) {
    if (typeof e?.code === "string" && e?.code.startsWith("P")) {
      throw new ApiError(404, "fail to delete url entry")
    } else {
      throw e
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      await getHandler(req, res);
    } else if (req.method === "PATCH") {
      await patchHandler(req, res);
    } else if (req.method === "DELETE") {
      await deleteHandler(req, res);
    } else {
      res.status(404).json({});
    }
  } catch (e) {
    throw e;
  }
};

export default errorWrapper(handler);