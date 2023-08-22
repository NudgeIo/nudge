import { NextApiRequest, NextApiResponse } from "next";
import channelCreation from "../controllers/channelCreation";



export default async function creator(req: NextApiRequest, res: NextApiResponse) {
    // this is to post
    if (req.method === "POST"){
        await channelCreation.fetchChannel(req, res);
    }
    // else if(req.method === "GET"){
    //     await channelCreation.fetchCreator(req, res);
    // }
    else {
        res.status(405).end(); // Method Not Allowed
    }

}