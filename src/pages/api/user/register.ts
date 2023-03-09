import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/libs/dbService'
import { isString } from '@/libs/stringUtil'
import { ApiError } from '@/interfaces/request'
import { encryptString } from '@/libs/bycryptUtil'
import isemail from 'isemail'
import { errorWrapper } from '@/middleware/errorWrapper'

const postHandler = async(req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const { email, password } = req.body

    if (!isString(email) ||
      !isString(password) ||
      !isemail.validate(email)
      ) {
      throw new ApiError(400, 'invalid argument')
    }

    await prisma?.user.create({
      data: {
        email,
        password: encryptString(password)
      },
    })

    res.status(200).json({})
  } catch(e: any) {
    if (typeof e?.code === 'string' && e?.code.startsWith('P')) {
      throw new ApiError(404, 'fail to create user')
    } else {
      throw e
    }
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      await postHandler(req, res)
    } else {
      res.status(404).json({})
    }
  } catch (e) {
    throw e
  }
}

export default errorWrapper(handler)