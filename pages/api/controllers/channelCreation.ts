import axios from "axios";
import prisma from "../lib/prisma";
import { NextApiRequest, NextApiResponse } from 'next';

interface VideoListItems {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      standard: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
      maxres: {
        url: string;
        width: number;
        height: number;
      }
    };
    channelTitle: string;
    tags: string[];
    categoryId: string;
    liveBroadcastContent: string;
    defaultLanguage: string;
    localized: {
      title: string;
      description: string;
    };
  };
}
interface VideoListNextApiResponse {
  kind: string;
  etag: string;
  items: VideoListItems[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

interface ChannelNextApiResponse {
  kind: string;
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: {
    kind: string;
    etag: string;
    id: string;
    contentDetails: {
      relatedPlaylists: {
        likes: string;
        favorites: string;
        uploads: string;
      };
    };
    brandingSettings: {
      channel: {
        title: string;
        description: string;
        keywords: string;
      }
      image: {
        bannerExternalUrl: string;
      }
    },
    snippet:{
      title: string;
      description: string;
      thumbnails: {
        high: {
          url: string;
          width: number;
          height: number;
        }
      }
      customUrl: string;
    }
  }[];
}

interface ChannelUploadsNextApiResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: {
    kind: string;
    etag: string;
    id: string;
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        standard: {
          url: string;
          width: number;
          height: number;
        };
        high: {
          url: string;
          width: number;
          height: number;
        };
        maxres: {
          url: string;
          width: number;
          height: number;
        }
      };
      channelTitle: string;
      playlistId: string;
      position: number;
      resourceId: {
        kind: string;
        videoId: string;
      };
      videoOwnerChannelTitle: string;
      videoOwnerChannelId: string;
    };
  }[];
}

const channelCreation = {
  fetchChannel: async (req: NextApiRequest, res: NextApiResponse) => {
    // const NextApiResponse = await fetch(`/api/channels/${channelId}`)

    return res.status(200).json({ message: "hello" });
  },

  // TODO: decontructionize this function, add database additions, and add error handling
  createChannel: async (req: NextApiRequest, res: NextApiResponse) => {
    const { videoUrl } = req.body;
    // const videoUrl = "https://www.youtube.com/watch?v=Qn5IpWXWub0";
    const videoId = videoUrl.split("v=")[1];
    // return res.status(200).json({
    //   id: 'cllcsbi5u0005o0hrldr2rpgr',
    //   createdAt: new Date('2023-08-15T20:57:15.186Z'),
    //   updatedAt: new Date('2023-08-15T20:57:15.186Z'),
    //   channelName: 'braden garland',
    //   channelId: 'UCbbSc_txoLmjxYXVZ2EweEQ',
    //   customUrl: '@bradengarland',
    //   channelAvatar: 'https://yt3.ggpht.com/mOTPqsr5GKUdoyrrP0ExVq-DxB8Q9BXqpT5ole3pj-oCLYQw-FcP562tyGH0f0STqo0P00KS4Sk=s800-c-k-c0x00ffffff-no-rj',
    //   channelBanner: 'https://yt3.googleusercontent.com/RmXbjqLm6uKKOrnJ_-irhlrq677ay3-hAZusyoMFnlpyTagaIENoB5a9jmMEtoZJVPKpqGu0',
    //   channelDescription: 'making things',
    //   slug: 'braden-garland'
    // });
  
    const channelExists = await prisma.youtubeVideos.findUnique({
      where: {videoId},
      include: { creator:true}
    })

    if (channelExists) return res.status(409).send({error:"Channel already exists"})

    try {

      const video_fetch = await axios.get<VideoListNextApiResponse>(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "snippet",
            id: videoId,
            key: process.env.YOUTUBE_API_KEY,
          },
        }
      )

      const channelId = video_fetch.data.items[0].snippet.channelId;

      const channelContentDetails = await axios.get<ChannelNextApiResponse>(
        "https://www.googleapis.com/youtube/v3/channels",
        {
          params: {
            part: "contentDetails,brandingSettings,snippet",
            id: channelId,
            key: process.env.YOUTUBE_API_KEY,
          }
        }
      )

      const channelName = channelContentDetails.data.items[0].brandingSettings.channel.title;
      const channelDescription = channelContentDetails.data.items[0].brandingSettings.channel.description;
      const channelBanner = channelContentDetails.data.items[0].brandingSettings.image?.bannerExternalUrl;
      const channelAvatar = channelContentDetails.data.items[0].snippet.thumbnails.high.url;
      const channelCustomUrl = channelContentDetails.data.items[0].snippet.customUrl;

      const uploadsPlaylistId = channelContentDetails.data.items[0].contentDetails.relatedPlaylists.uploads;

      const channelUploads = await axios.get<ChannelUploadsNextApiResponse>(
        "https://www.googleapis.com/youtube/v3/playlistItems",
        {
          params: {
            part: "snippet",
            playlistId: uploadsPlaylistId,
            key: process.env.YOUTUBE_API_KEY,
            maxResults: 50
          }
        }
      )

      const youtubeVideos = channelUploads.data.items.map((item) => {
        return {
          videoId: item.snippet.resourceId.videoId,
          videoTitle: item.snippet.title,
          videoDescription: item.snippet.description,
          videoThumbnail: item.snippet.thumbnails.maxres?.url ?? item.snippet.thumbnails.high.url,
          videoPublishedAt: item.snippet.publishedAt,
          // videoPosition: item.snippet.position,
        }
      })
      
      
      const channelData = {
        channelId,
        channelName,
        channelDescription,
        channelAvatar,
        channelBanner,
        channelCustomUrl,
        youtubeVideos
      }

      const creator = await prisma.creator.create(
        {
          data:{
            channelId,
            channelName,
            channelDescription,
            channelAvatar,
            channelBanner,
            customUrl:channelCustomUrl,
            slug: channelName.replace(/\s+/g, '-').toLowerCase(),
            YoutubeVideos:{
              create: youtubeVideos.map((video) => {
                return {
                  videoId: video.videoId,
                  videoTitle: video.videoTitle,
                  videoDescription: video.videoDescription,
                  videoThumbnail: video.videoThumbnail,
                  videoPublishedAt: video.videoPublishedAt,   
            }})
            }
          }
        }
      )

      console.log(creator);
      



      return res.status(201).send({"data":creator});

    } catch (err: any) {
      console.log(err);
      
      return res.status(400).send({ message: "something went wrong :(" });
    }
  },

  fetchCreator: async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(req.query);
    
    const slug = req.query.creatorSlug as string
    console.log(slug)
    
    const creator = await prisma.creator.findUnique({
      where: { slug },
      include: { YoutubeVideos: true },
    });

    if(!creator) return res.status(404).send({error:"Creator not found"})
    

    return res.status(200).send({ data: creator });
  }
};

export default channelCreation;
