// Verify the milestones and quests 

import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import {Token} from '../../utils/types'
import prisma from "@/lib/prisma";



export default async function verifyQuest(req: NextApiRequest, res: NextApiResponse) {

    const token = await getToken({req})
    
    if (!token) {
        console.log('User is not authorized');
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === 'POST') {
        const { questId } = req.body

        // check what type of quest it is
        const {nudgeUser} = token as Token

        if(!nudgeUser) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // where does the nudgeUser and creatorFan get created?

        const creatorFan = await prisma.creatorFan.findUnique({
            where: {
                id: nudgeUser.id
            }
        })
        console.log(creatorFan);
        


        const {accessToken} = token

        // access token, if expired refresh it

        
        console.log("This is the questId", creatorFan);
        
        return res.status(200).send({creatorFan});
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}