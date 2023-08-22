// pages/api/channel.ts
import { NextApiRequest, NextApiResponse } from 'next';
import channelCreation from './controllers/channelCreation';

export default async function channel(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await channelCreation.fetchChannel(req, res);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}


