import axios from "axios";
import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from 'next';
import { MilestoneType } from "@prisma/client";

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

  /// Verify that the User is actually the creator of the channel
  // TODO: To be implemented
  verifyCreator: async (req: NextApiRequest, res: NextApiResponse) => {
    // api call to fetch the channel id, save it,
    // get channel list, filter for videos posted by themselves
    // if the video id matches the video id of the video they are trying to add, then they are the creator
    return res.status(200).json({ message: "TODO" });
  },

  // TODO: decontructionize this function, add database additions, and add error handling
  createCreator: async (req: NextApiRequest, res: NextApiResponse) => {
    const { videoUrl } = req.body;
    // const videoUrl = "https://www.youtube.com/watch?v=Qn5IpWXWub0"
    const videoId = videoUrl.split("v=")[1];
  
    // const channelExists = await prisma.youtubeVideos.findUnique({
    //   where: {videoId},
    //   include: { creator:true}
    // })

    // if (channelExists) return res.status(409).send({error:"Channel already exists"})


    // create the creator first
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

      const channelData = channelContentDetails.data.items[0];
      const channelName = channelData.brandingSettings.channel.title;
      const channelDescription = channelData.brandingSettings.channel.description;
      const channelBanner = channelData.brandingSettings.image?.bannerExternalUrl+"=w2276-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj" ?? undefined;
      const channelAvatar = channelData.snippet.thumbnails.high.url;
      const channelCustomUrl = channelData.snippet.customUrl;
      
      // now create the creator
      
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
          }
        }
      )

      console.log("This is the creator",creator);
      

      // Creation of quests and milestones
      const uploadsPlaylistId = channelData.contentDetails.relatedPlaylists.uploads;

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
      const questsData = channelUploads.data.items.map(async item => {
        const quest = await prisma.quest.create({
          data: {
            creatorId: creator.id,
            videoId: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            videoThumbnail: item.snippet.thumbnails.maxres?.url ?? item.snippet.thumbnails.high.url,
            videoPublishedAt: item.snippet.publishedAt,
            Milestones: {
              create: [
                {
                  type: MilestoneType.LIKE,
                  reward: 5,
                  description: "Like our video",
                },
                {
                  type: MilestoneType.COMMENT,
                  reward: 10,
                  description: "Comment on our video",
                },
              ]
            },
          },
        });
      
        return quest;
      });
      
      const quests = await Promise.all(questsData);
      
      console.log("This the quests and milestones", quests);
      
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
