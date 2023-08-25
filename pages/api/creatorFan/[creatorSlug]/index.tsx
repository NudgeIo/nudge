import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { creatorSlug } = req.query;
    let creatorFan

    const token = await getToken({req})
    
    if (!token) {
        console.log('User is not authorized');
        return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("User is authorized", token);

    if (req.method !== "GET") {
       return res.status(405).end(); // Method Not Allowed
    }

    const session = await getSession({ req });

    // user is not logged in
    if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.nudgeUser.findUnique({
        where: { email: session.user?.email as string },
        select: { id: true } // Only select the id for performance
    });

    if (!user) {
        return res.status(403).send({ error: "Not authorized" });
    }

    const creator = await prisma.creator.findUnique({
        where: { slug: creatorSlug as string },
        select: { id: true } // Only select the id for performance
    });

    if (!creator) {
        // api called with bad slug
        return res.status(403).send({ error: "Not authorized" });
    }

    creatorFan = await prisma.creatorFan.findUnique({
        where: {
            nudgeUserId_creatorId: {
                nudgeUserId: user.id,
                creatorId: creator.id
            }
        }
    })
    
    if(!creatorFan){
        creatorFan = await prisma.creatorFan.create({
            data:{
                nudgeUserId: user.id,
                creatorId: creator.id
            }
        })
        return res.status(201).json({ creatorFan });
    }

    return res.status(200).json({creatorFan})

}