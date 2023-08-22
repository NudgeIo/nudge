// pages/api/creator/[slug].ts
import { NextApiRequest, NextApiResponse } from 'next';
import channelCreation from '../controllers/channelCreation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await channelCreation.fetchCreator(req, res);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
