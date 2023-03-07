import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "@/libs/dbService"
import { isString } from '@/libs/stringUtil'

const getHandler = async(req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const entryHash = req.query.entryHash

    if (!isString(entryHash)) {
      throw {
        status: 400,
        message: "invalid entry hash"
      }
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
    console.log("error in /api/urlentry/[entryHash] getHandler", e)
    
    res.status(200).json({
      error: e,
    });
  }
}

const patchHandler = async(req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const entryHash = req.query.entryHash
    const url = req.body.url

    if (!isString(entryHash)) {
      throw {
        status: 400,
        message: "invalid entry hash"
      }
    }

    if (!isString(url)) {
      throw {
        status: 400,
        message: "invalid url"
      }
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
    console.log("error in /api/urlentry/[entryHash] patchHandler", e)

    if (typeof e?.code === "string" && e?.code?.startsWith("P")) {
      res.status(404).json({
        error: "fail to update url entry",
      });
    } else {
      res.status(500).json({
        error: e,
      });
    }
  }
}

const deleteHandler = async(req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const entryHash = req.query.entryHash

    if (!isString(entryHash)) {
      throw {
        status: 400,
        message: "invalid entry hash"
      }
    }

    const data = await prisma?.urlEntry.delete({
      where: {
        hashKey: entryHash as string,
      }
    })

    res.status(200).json({});
  } catch(e: any) {
    console.log("error in /api/urlentry/[entryHash] deleteHandler", e)

    if (typeof e?.code === "string" && e?.code.startsWith("P")) {
      res.status(404).json({
        error: "fail to delete url entry",
      });
    } else {
      res.status(500).json({
        error: e,
      });
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

export default handler;