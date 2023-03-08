import type { NextApiRequest, NextApiResponse } from 'next'
import { errorWrapper } from '@/middleware/errorWrapper'
import { withSession, createSessionValidator } from '@/middleware/withSession';

const postHandler = async(req: NextApiRequest, res: NextApiResponse ) => {
  try {
    const user = req.session?.user

    res.status(200).json(user);
  } catch(e: any) {
    throw e
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const sessionValidator = createSessionValidator(req, res)

    if (req.method === "POST") {
      await sessionValidator(postHandler);
    } else {
      res.status(404).json({});
    }
  } catch (e) {
    throw e;
  }
};

export default withSession(errorWrapper(handler));