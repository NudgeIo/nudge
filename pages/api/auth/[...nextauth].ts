import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { User, Account, Profile } from 'next-auth';
import GoogleProvider from "next-auth/providers/google"
import { useRouter } from 'next/router';
import prisma from '../lib/prisma';
import { Provider } from '@prisma/client';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

  ],
    callbacks: {
      async signIn(params) {
        const { user, account, profile } = params
        if(!user) return false;
        
        const nudgeUser = prisma.nudgeUser.create(
          {
            data:{
              email: user.email,
              name: user.name,
              avatarUrl: user.image,
              provider: Provider.GOOGLE,
            }
          }
        )
        
        return true;
      },

      async session(params) {
        console.log("session params",params);
        
        const {session,token} = params
        console.log("Session",session);
        console.log("UserOrToken",token);

        return session;
      },
      async jwt(params) {
        console.log("params",params);
        
        const { account, user, token } = params;

        console.log("Account",account)
        if(!token.email) return token;

        const nudgeUser = await prisma.nudgeUser.findUnique({
          where: {email: token.email}
        })
          
        if (nudgeUser) {
          token.nudgeUser = {
            id: nudgeUser.id,
            email: nudgeUser.email,
            name: nudgeUser.name,
            avatarUrl: nudgeUser.avatarUrl,
            provider: nudgeUser.provider,
          }
        }
        return token;
      }, 
    }
  });

