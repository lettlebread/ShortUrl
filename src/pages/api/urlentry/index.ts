import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/libs/dbService'
import { isString } from '@/libs/stringUtil'
import { createHashString } from '@/libs/hashUtil'
import { ApiError } from '@/interfaces/request'
import { errorWrapper } from '@/middleware/errorWrapper'
import { withSession, createSessionValidator } from '@/middleware/withSession'
import { NewUrlEntryMeta, UrlEntryApiData, NewUrlEntryArg } from '@/interfaces/request'

const postHandler = async(req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const newEntry: NewUrlEntryArg = req.body
    const user = req.session?.user

    if (!isString(newEntry.targetUrl)) {
      throw new ApiError(400, 'invalid url')
    }

    const hashKey = createHashString()
    const urlEntryData = {
      hashKey,
      targetUrl: newEntry.targetUrl,
      name: newEntry.name,
      description: newEntry.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      viewTimes: 0
    } as NewUrlEntryMeta

    if (user && user?.isLoggedIn) {
      urlEntryData.userId = user.id
    }
    
    const urlEntry = await prisma?.urlEntry.create({
      data: urlEntryData,
    })

    res.status(200).json(urlEntry)
  } catch(e: any) {
    if (typeof e?.code === 'string' && e?.code.startsWith('P')) {
      throw new ApiError(404, 'fail to create url entry')
    } else {
      throw e
    }
  }
}

const getHandler = async(req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const userId = req.session.user?.id

    const urlEntries: Array<UrlEntryApiData> = await prisma?.urlEntry.findMany({
      where: {
        userId
      },
      select: {
        createdAt: true,
        updatedAt: true,
        hashKey: true,
        targetUrl: true,
        name: true,
        description: true
      }
    })
    res.status(200).json({
      urlEntries
    })
  } catch(e: any) {
    if (typeof e?.code === 'string' && e?.code.startsWith('P')) {
      throw new ApiError(404, 'fail to create url entry')
    } else {
      throw e
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const sessionValidator = createSessionValidator(req, res)

    if (req.method === 'POST') {
      await postHandler(req, res)
    } else if (req.method === 'GET') {
      await sessionValidator(getHandler)
    } else {
      res.status(404).json({})
    }
  } catch (e) {
    throw e
  }
}

export default withSession(errorWrapper(handler))