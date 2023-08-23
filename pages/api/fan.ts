import { NextApiRequest, NextApiResponse } from "next";

import { getToken } from "next-auth/jwt"
import { getSession } from "next-auth/react";
import prisma from "./lib/prisma";




export default async function fan(req:NextApiRequest, res: NextApiResponse){
    // if (req.method === "POST"){
    //     await channelCreation.createChannel(req, res);
    // }

    // TODO: types for the token
    const token = await getToken({req})
    
    if (!token) {
        console.log('User is not authorized');
        return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("User is authorized", token);

    if(req.method === "GET"){
        const session = await getSession({req});
        console.log("This is the session", session);

        // user is not logged in
        if(!session) return res.status(401).json({message: "Unauthorized"});

        const user = await prisma.nudgeUser.findUnique({
            where: {email: session.user?.email as string}
        })
        
        return res.status(200).json({user});
    }
    else {
        res.status(405).end(); // Method Not Allowed
    }
}