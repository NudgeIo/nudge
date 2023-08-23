import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext } from 'next';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, Key, useEffect, useState } from "react";
// import SignInButton from "@/components/googleButton";
import { signIn, signOut, useSession } from 'next-auth/react';
import { getSession } from "next-auth/react";
import axios from "axios";



interface CreatorProfileProps {
  creator: {
    channelBanner: string;
    channelAvatar: string;
    channelName: string;
    channelDescription: string;
    YoutubeVideos: {
      videoThumbnail: string;
      videoTitle: string;
    }[];
  };
}

const CreatorProfile: React.FC<CreatorProfileProps> = ({ creator }) => {
  const router = useRouter();
  const { query } = router;
  const channelSlug = query.channelSlug;
  const { data: nudgeUser, status, update } = useSession();
  const [isAuthenticated,setIsAuthenticated] = useState(false);

  useEffect(() => { 
    async function fetchData() {
      if(status === "authenticated"){
        const data = await axios.get(`http://localhost:3000/api/fan`);
        console.log(data);
      }
    }
    fetchData();
  }, [status]);

  const isSignedIn = !!nudgeUser?.user;

  if (!creator) {
    return <div>loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-end absolute m-4 bg-white text-black">
        {/* Sign in google here */}
         <div>
      {isSignedIn ? (
        <button
          onClick={() => signOut()}
          className={`text-black font-bold p-3 px-12 rounded-3xl`}
        >
          Sign out
        </button>
      ) : 
      
      (
        <button
          onClick={() =>
            signIn("google")
          }
        >
          Sign in with Google
        </button>
      )}
    </div>
      </div>
      <div
        className="bg-cover bg-center h-56"
        style={{ backgroundImage: `url(${creator.channelBanner}=w2120-fcrop64=1,00000000ffffffff-k-c0xffffffff-no-nd-rj)` }}
      />
      <div className="flex justify-center -mt-24">
        <img
          className="h-32 w-32 rounded-full border-4 border-white"
          src={creator.channelAvatar}
          alt="Creator's Avatar"
        />
      </div>
      <div className="text-center mt-4 text-2xl font-semibold text-gray-900">
        {creator.channelName}
      </div>
      <div className="text-center text-gray-700">
        {creator.channelDescription}
      </div>
      <div className="mt-12 max-w-2xl mx-auto">
        {creator.YoutubeVideos.map((video, index) => (
          <div
            key={index}
            className="rounded-lg shadow-lg overflow-hidden mb-8 bg-white flex flex-row"
          >
            <div className="flex-shrink-0">
              <img
                className="h-48 w-full object-cover"
                src={video.videoThumbnail}
                alt="Video thumbnail"
              />
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
              <a href="#" className="text-center mt-2">
                <p className="text-xl font-semibold text-black">
                  {video.videoTitle}
                </p>
              </a>
              <div className="flex flex-col items-center space-y-2">
                <button
                  className="py-2 px-4 rounded bg-black text-white"
                  onClick={() => console.log("Like clicked")}
                >
                  Like
                </button>
                <button
                  className="py-2 px-4 rounded bg-gray-400 text-black"
                  onClick={() => console.log("Comment clicked")}
                >
                  Comment
                </button>
                <button
                  className="py-2 px-4 rounded bg-black text-white"
                  onClick={() => console.log("Subscribe clicked")}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        ))}
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

  const data = await response.json();
  const creator = data.data;

  return { props: { creator } };
}
