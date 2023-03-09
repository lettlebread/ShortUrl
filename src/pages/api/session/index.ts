import type { NextApiRequest, NextApiResponse } from 'next'
import { errorWrapper } from '@/middleware/errorWrapper'
import { withSession, createSessionValidator } from '@/middleware/withSession'

const postHandler = async(req: NextApiRequest, res: NextApiResponse ) => {
  const user = req.session?.user

  res.status(200).json(user)
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const sessionValidator = createSessionValidator(req, res)

  if (req.method === 'POST') {
    await sessionValidator(postHandler)
  } else {
    res.status(404).json({})
  }
}

export default withSession(errorWrapper(handler))