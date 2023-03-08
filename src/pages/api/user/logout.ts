import type { NextApiRequest, NextApiResponse } from 'next'
import { withSession } from '@/middleware/withSession';
import { errorWrapper } from '@/middleware/errorWrapper'

const postHandler = async(req: NextApiRequest, res: NextApiResponse) => {
  try {
    req.session.destroy();

    res.status(200).json({});
  } catch(e: any) {
    throw e
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

export default withSession(errorWrapper(handler));