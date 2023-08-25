import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext } from 'next';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, Key, useEffect, useState } from "react";
// import SignInButton from "@/components/googleButton";
import { signIn, signOut, useSession } from 'next-auth/react';
import { getSession } from "next-auth/react";
import axios from "axios";
import { NudgeUser } from "@prisma/client";
// import { Quest } from "@prisma/client";


export interface Creator {
  id: string;
  slug: string;
  channelAvatar: string;
  channelBanner: string;
  channelDescription: string;
  channelId: string;
  channelName: string;
  customUrl: string;

  Quests: Quest[];
}
export interface Quest {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  videoThumbnail: string;
  videoPublishedAt: string;
  videoId: string;
  creatorId: string;
  Milestones: Milestone[];
}

interface Milestone {
  id: string;
  description: string;
  type: 'LIKE' | 'COMMENT';
  reward: number;
  questId: string;
}

const CreatorProfile: React.FC<Creator> = (creator) => {
  const router = useRouter();
  const { query } = router;
  const creatorSlug = query.creatorSlug;
  const { data: session, status, update } = useSession();
  const [isAuthenticated,setIsAuthenticated] = useState(false);
  const [nudgeUser, setNudgeUser] = useState<NudgeUser>()

  useEffect(() => {
    console.log(creator);
  },[]);

  useEffect(() => { 
    async function fetchData() {
      
      if(status === "authenticated" && creatorSlug){

        // hacked together, because i put token replacing the user
        // console.log((session.user as any)?.nudgeUser.id)        
        const data = await axios.get(`http://localhost:3000/api/creatorFan/`+creatorSlug)
        console.log(data);
        console.log(data.status);
        
        
        if(data.status === 201 || data.status === 304 || data.status === 200){
          console.log("got them");
          
          const nudgeUser = await data.data.creatorFan
          console.log("Nudge user",nudgeUser);
          
          setNudgeUser(nudgeUser)
        }
      }
    }
    fetchData();
  }, [status,creatorSlug]);

  const isSignedIn = !!session?.user;

  const handleVerify = async (quest: Quest) =>{
    console.log(quest);
    const data = await axios.post('http://localhost:3000/api/verify', {
      questId: quest.id,
    },

    {
      headers: {
        'Content-Type': 'application/json',
      }
    }
    )

    if(data.status === 200){
      console.log(data.data);
    }
    
    
  }

  const handleSignIn = async() =>{
    const data = await axios.get('http://localhost:3000/api/signIn');
    console.log(data);
  }

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* Sign in google here */}
      <div className="absolute right-4 m-4 bg-white text-black">
        <div>
          {isSignedIn ? (
            <button
              onClick={() => signOut()}
              className={`text-black font-bold p-3 px-12 rounded-3xl`}
            >
              Sign out
            </button>
          ) : (
            <button onClick={()=> signIn("google")}>
              Sign in with Google
            </button>
          )}
        </div>
      </div>

      <div>
        {/* Navbar */}

        {/* Channel Header Image */}
        {/* Channel Info here */}

        {/* Nudge your friends */}
        {/* Cards for the quests here */}
        
        {creator.Quests.map((quest,i) => {
          return (
            <div key={i}>
              {i === 0 && 
              <div>
                <div className="text-black">{quest.title}</div>
                <button onClick={() => handleVerify(quest)}> Check here maybe?</button>
              </div>}
            </div>
          )
        })}



        {/* {creator.Quests.map((quest) => {
          return (
            <div key={quest.id}>
              <div>
                <h1>{quest.title}</h1>
                <h2>{quest.description}</h2>
                <h3>{quest.videoId}</h3>
                <h4>{quest.videoPublishedAt}</h4>
                <h5>{quest.videoThumbnail}</h5>
                <h6>{quest.isActive}</h6>
              </div>
            </div>
          );
        })} */}
      </div>
    </div>
  );
}

export default CreatorProfile;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const creatorSlug = context.params?.creatorSlug as string;

  // Fetch data from your Express backend
  const response = await fetch(`http://localhost:3000/api/creator/${creatorSlug}`);

  if (response.status === 404) {
    return {
      notFound: true,
    };
  }

  const creator = await response.json();

  return { props: creator.creator };
}
