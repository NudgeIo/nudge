import type { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { User, Account, Profile } from 'next-auth';
import GoogleProvider from "next-auth/providers/google"
import { useRouter } from 'next/router';
import prisma from '../../../lib/prisma';
import { Provider } from '@prisma/client';


export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.force-ssl',
        },
      }
    }),

  ],
    callbacks: {
      async signIn(params) {
        const { user, account, profile, credentials} = params
        if(!user) return false;
        if(!account) return false;
  

        let nudgeUser = await prisma.nudgeUser.findUnique({
          where: {email: user.email as string}
        })
        const accessToken = account.access_token
        console.log("This is the access token", accessToken);
        
        
        const response = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })


        if(nudgeUser) return true;

        
        nudgeUser = await prisma.nudgeUser.create(
          {
            data:{
              email: user.email,
              name: user.name,
              avatarUrl: user.image,
              provider: Provider.GOOGLE,
            }
          }
        )

        console.log("created nudge user", nudgeUser);
        
        
        return true;
      },

      async session(params) {

        const { session, token: jwtToken } = params;

        // (session.user as any).token = jwtToken.jwt;
        session.user = jwtToken

        // session.accessToken = jwtToken.accessToken;

        console.log("Session", session);
        console.log("UserOrToken", jwtToken);

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
        if (account) {
          token.accessToken = account.access_token
        }
        return token;
      }, 
    }
  });

