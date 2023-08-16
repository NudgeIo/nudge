

import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext } from 'next';

import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, Key } from "react";

const CreatorProfile = ({creator}) => {

  console.log(creator);
  

    const router = useRouter();

    const {query} = router
    const channelSlug = query.channelSlug;
    
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="bg-cover bg-center h-56" style={{ backgroundImage: `url(${creator.channelBanner})` }} />
        <div className="flex justify-center -mt-24">
          <img className="h-32 w-32 rounded-full border-4 border-white" src={creator.channelAvatar} alt="Creator's Avatar" />
        </div>
        <div className="text-center mt-4 text-2xl font-semibold text-gray-900">{creator.channelName}</div>
        <div className="text-center text-gray-700">{creator.channelDescription}</div>
  
        <div className="mt-12 max-w-2xl mx-auto">
        {creator.YoutubeVideos.map((video, index) => (
          <div key={index} className="rounded-lg shadow-lg overflow-hidden mb-8 bg-white flex flex-row">
            <div className="flex-shrink-0">
              <img className="h-48 w-full object-cover" src={video.videoThumbnail} alt="Video thumbnail" />
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
              <a href="#" className="text-center mt-2">
                <p className="text-xl font-semibold text-black">{video.videoTitle}</p>
              </a>
              <div className="flex flex-col items-center space-y-2">
                <button className="py-2 px-4 rounded bg-black text-white" onClick={() => console.log("Like clicked")}>Like</button>
                <button className="py-2 px-4 rounded bg-gray-400 text-black" onClick={() => console.log("Comment clicked")}>Comment</button>
                <button className="py-2 px-4 rounded bg-black text-white" onClick={() => console.log("Subscribe clicked")}>Subscribe</button>
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
  console.log("This is chanel slug",creatorSlug);
  

  // Fetch data from your Express backend
  const response = await fetch(`http://localhost:3001/creator/${creatorSlug}`);
  const data = await response.json();

  const creator = data.data;

  return { props: { creator } };
}
