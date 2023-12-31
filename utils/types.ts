import { JWT } from "next-auth/jwt";


export interface Token extends JWT {
    nudgeUser: NudgeUser;
    accessToken: string;
    iat: number;
    exp: number;
    jti: string; 
  } 
  
  interface NudgeUser {
    id: string;
    email: string; 
    name: string;
    avatarUrl: string;
    provider: string;
  }


export interface VideoListItems {
    kind: string;
    etag: string;
    id: string;
    snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        thumbnails: {
            default: {
                url: string;
                width: number;
                height: number;
            };
            medium: {
                url: string;
                width: number;
                height: number;
            };
            high: {
                url: string;
                width: number;
                height: number;
            };
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
export interface VideoListResponse {
    kind: string;
    etag: string;
    items: VideoListItems;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
}