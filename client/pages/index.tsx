import { useState } from "react";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('');

  // on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(videoUrl);
  }

  const handleInputChange = (e) => {
    e.preventDefault();
    setVideoUrl(e.target.value)
  }

  return (
    <form>
    <div className="min-h-screen flex justify-center items-center bg-white">
      <div className="flex flex-col justify-center items-center gap-6 p-8 bg-white">
        <h1 className="text-4xl md:text-5xl xl:text-6xl font-semibold text-black">welcome to nudge</h1>
        <h2 className="text-2xl md:text-3xl xl:text-4xl text-gray-800">elevate your youTube engagement like never before.</h2>
        <div className="flex flex-col w-full">
          <input 
            className="border rounded-md p-2 w-full text-black" 
            placeholder="paste your youTube video url here"
            onChange={handleInputChange}
          />
          <button 
            className="mt-4 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
            type="submit"
            onClick={handleSubmit}
          >
           engage your audience
          </button>
        </div>
      </div>
    </div>
  </form>
  );
}
