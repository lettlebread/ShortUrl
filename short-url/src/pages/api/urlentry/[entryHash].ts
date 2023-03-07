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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "GET") {
      await getHandler(req, res);
    } else {
      res.status(404).json({});
    }
  } catch (e) {
    throw e;
  }
};

export default handler;