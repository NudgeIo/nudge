import { useState } from "react";
import { useRouter } from "next/router";
import { Arrow, NudgeIcon, YoutubeIcon } from "@/components/Icons/Icons";
import Button from "@/components/Button";
import SearchBar from "@/components/Search";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')

  // on submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const createChannel = await fetch("http://localhost:3000/api/creator", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoUrl: videoUrl,
      }),
    })

    const data = await createChannel.json()
    console.log(data);
    
    if(createChannel.status === 200 || createChannel.status === 201){
      // const slug = data.data.slug
      // console.log(slug);
      console.log("success !!", data);
      
      
      // router.push(`/creator/${slug}`)
    }
    else if(createChannel.status === 409){
      setErrorMessage('channel already exists :(')
    }
    else{
      console.log(createChannel);
      setErrorMessage('something went wrong :(')
    }
  }

  const handleInputChange = (e: any) => {
    e.preventDefault();
    setVideoUrl(e.target.value)
  }

  return (
    /// TODO: Add steps, verification, and setup page
    <form>
        {/* TODO: Add the trapezoid */}
        <div className="flex flex-col items-center gap-20 bg-yellow-yellow min-h-screen w-auto h-auto">
            <div className="gap-20 flex flex-col w-auto h-auto m-auto">
            {/* Nudge logo and tagline */}
            <div className="flex justify-center flex-col gap-6">

            {/* TODO: Add the Youtube Icon here */}
            <NudgeIcon className="w-[536px] h-40 mx-12"/>
            <text className="font-bold text-3xl text-center text-black">Beat the algo. Earn more.</text>
            </div>

            {/* Video search, channel creation, question */}
            <div className="gap-6 flex flex-col items-center">
                <SearchBar 
                placeholder={"Paste a link to one of your YouTube videos to get started"}
                leftIcon={<YoutubeIcon/>}
                onChange={handleInputChange}
                inputClassName={"text-black"}
                className="bg-white w-full"                
                />
                <Button 
                label={'Create my page'}
                className="bg-black text-white h-12 rounded-3xl gap-1 pl-5 pr-3"
                rightIcon={<Arrow />}
                onClick={handleSubmit}
                />
                <text className="text-black ">What is Nudge?</text>
            </div>
            </div>
        </div>
  </form>
  )
}
