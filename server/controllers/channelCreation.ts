import { Request, Response } from "express";
import axios from "axios";

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
interface VideoListResponse {
  kind: string;
  etag: string;
  items: VideoListItems[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

// for "Content Details" only fetch
interface ChannelContentDetailsResponse {
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
  }[];
}

interface ChannelUploadsResponse {
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
  fetchChannel: async (req: Request, res: Response) => {
    // const response = await fetch(`/api/channels/${channelId}`)

    return res.status(200).json({ message: "hello" });
  },

  // TODO: decontructionize this function, add database additions, and add error handling
  createChannel: async (req: Request, res: Response) => {
    // const {videoUrl} = req.body
    const videoUrl = "https://www.youtube.com/watch?v=Qn5IpWXWub0";
    const videoId = videoUrl.split("v=")[1];
    console.log(process.env.YOUTUBE_API_KEY);
    try {
      const video_fetch = await axios.get<VideoListResponse>(
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
      const channelTitle = video_fetch.data.items[0].snippet.channelTitle;
      const channelDescription = video_fetch.data.items[0].snippet.description;
      const channelThumbnail = video_fetch.data.items[0].snippet.thumbnails.maxres.url;

        
      const channelContentDetails = await axios.get<ChannelContentDetailsResponse>(
        "https://www.googleapis.com/youtube/v3/channels",
        {
          params: {
            part: "contentDetails",
            id: channelId,
            key: process.env.YOUTUBE_API_KEY,
          }
        }
      )

      const uploadsPlaylistId = channelContentDetails.data.items[0].contentDetails.relatedPlaylists.uploads;

      const channelUploads = await axios.get<ChannelUploadsResponse>(
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
          videoChannelTitle: item.snippet.channelTitle,
          videoThumbnail: item.snippet.thumbnails.maxres.url,
          videoPublishedAt: item.snippet.publishedAt,
          videoPosition: item.snippet.position,
          videoResourceId: item.snippet.resourceId.kind,
          videoOwnerChannelTitle: item.snippet.videoOwnerChannelTitle,
        }
      })
      
      
      const channelData = {
        channelId,
        channelTitle,
        channelDescription,
        channelThumbnail,
        uploadsPlaylistId,
        youtubeVideos
      }

      return res.status(200).send(channelData);
    } catch (err: any) {
      console.log(err);
      
      return res.status(400).send(err);
    }
  },
};

export default channelCreation;
