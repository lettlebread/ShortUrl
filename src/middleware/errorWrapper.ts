import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from '@/interfaces/request';

export const errorWrapper = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>): (req: NextApiRequest, res: NextApiResponse) => Promise<void> => {
  return async(req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (e: any | ApiError) {
      if (e?.stack) {
        console.log("error stack:", e.stack, "message:", e.toString())
      }

      if (e?.statusCode) {
        res.status(e.statusCode).json({ error: e.message });
      } else {
        res.status(500).json({ error: "internal server error" });
      }
    }
  };
};
