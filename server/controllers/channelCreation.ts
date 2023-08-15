import { Request, Response } from "express";
import axios from "axios";

const channelCreation = {
  fetchChannel: async (req: Request, res: Response) => {
    // const response = await fetch(`/api/channels/${channelId}`)

    return res.status(200).json({ message: "hello" });
  },

  createChannel: async (req: Request, res: Response) => {
    // const {videoUrl} = req.body
    const videoUrl = "https://www.youtube.com/watch?v=Qn5IpWXWub0";
    const videoId = videoUrl.split("v=")[1];
    console.log(process.env.YOUTUBE_API_KEY);

    const video_fetch = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet",
          id: videoId,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );
    if (video_fetch) {
      console.log(video_fetch.data);
    }

    return res.status(200).send(video_fetch.data);
  },
};

export default channelCreation;
