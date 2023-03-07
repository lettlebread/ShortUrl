import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "@/libs/dbService"
import { isString } from '@/libs/stringUtil'
import { createHashString } from '@/libs/hashUtil'

const postHandler = async(req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const url = req.body.url

    if (!isString(url)) {
      throw {
        status: 400,
        message: "invalid url"
      }
    }

    let entry = createHashString()
    await prisma?.urlEntry.create({
      data: {
        hashKey: entry,
        targetUrl: url
      },
    })

    res.status(200).json({
      error: null,
      urlEntry: entry
    });
  } catch(e) {
    console.log("error in /api/urlentry postHandler", e)
    
    res.status(200).json({
      error: e,
    });
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

export default handler;