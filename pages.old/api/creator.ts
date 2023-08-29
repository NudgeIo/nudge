import { NextApiRequest, NextApiResponse } from "next";
import channelCreation from "./controllers/channelCreation";



export default async function creator(req: NextApiRequest, res: NextApiResponse) {
    // Create a new Creator
    // protect this route for the creator only
    if (req.method === "POST"){

        // TODO: verify that the user is the creator
        // TODO: verify that the video is not already associated with another creator

        channelCreation.createCreator(req, res);
    
    }
    else {
        res.status(405).end(); // Method Not Allowed
    }

}