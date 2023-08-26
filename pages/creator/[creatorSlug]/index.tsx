import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { GetServerSidePropsContext } from "next";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
  Key,
  useEffect,
  useState,
} from "react";
// import SignInButton from "@/components/googleButton";
import { signIn, signOut, useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import axios from "axios";
import { NudgeUser } from "@prisma/client";
import Image from "next/image";
import Button from "@/components/Button";
import {
  ArrowSync,
  CashAmountIcon,
  YoutubeComment,
  YoutubeIcon,
  YoutubeLike,
} from "@/components/Icons/Icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // Import the relativeTime plugin

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
  type: "LIKE" | "COMMENT";
  reward: number;
  questId: string;
}
dayjs.extend(relativeTime); // Use the relativeTime plugin

const CreatorProfile: React.FC<Creator> = (creator) => {
  const router = useRouter();
  const { query } = router;
  const tab = query.tab as string;

  const creatorSlug = query.creatorSlug;
  const { data: session, status, update } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [nudgeUser, setNudgeUser] = useState<NudgeUser>();
  const [currentTab, setCurrentTab] = useState<string>(
    (query.tab as string) || "home"
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quests, setQuests] = useState(creator.Quests);

  const currentTime = dayjs();

  const handleNextClick = () => {
    if (currentIndex + 2 < quests.length) {
      setCurrentIndex(currentIndex + 2);
    }
    //  else {
    //   // Call API to get more quests
    //   axios.get('http://localhost:3000/api/getMoreQuests')
    //     .then(response => {
    //       setQuests([...quests, ...response.data]);
    //       setCurrentIndex(currentIndex + 2);
    //     })
    //     .catch(error => console.error(error));
    // }
  };

  const handleTabChange = (newTab: string) => {
    setCurrentTab(newTab);
    // Update the URL without triggering a new server-side request
    router.replace(`/creator/${creatorSlug}?tab=${newTab}`, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    console.log(creator);
  }, []);

  useEffect(() => {
    if (!tab) {
      router.replace(`/creator/${creatorSlug}?tab=home`, undefined, {
        shallow: true,
      });
    }
  }, []);

  useEffect(() => {
    console.log(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    async function fetchData() {
      if (status === "authenticated" && creatorSlug) {
        // hacked together, because i put token replacing the user
        // console.log((session.user as any)?.nudgeUser.id)
        const data = await axios.get(
          `http://localhost:3000/api/creatorFan/` + creatorSlug
        );
        console.log(data);
        console.log(data.status);

        if (data.status === 201 || data.status === 304 || data.status === 200) {
          console.log("got them");

          const nudgeUser = await data.data.creatorFan;
          console.log("Nudge user", nudgeUser);

          setNudgeUser(nudgeUser);
        }
      }
    }
    fetchData();
  }, [status, creatorSlug]);

  const isSignedIn = !!session?.user;

  const handleVerify = async (quest: Quest) => {
    // TODO: unfinished
    console.log(quest);
    const data = await axios.post(
      "http://localhost:3000/api/verify",
      {
        questId: quest.id,
      },

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data.status === 200) {
      console.log(data.data);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Navbar */}
      <div>
        <div className="flex justify-center space-x-4 py-2 text-black font-semibold">
          <button
            className={`px-4 py-2 ${
              currentTab === "home" ? "border-b-2 border-blue-500 " : ""
            }`}
            onClick={() => handleTabChange("home")}
          >
            Home
          </button>
          <button
            className={`px-4 py-2 ${
              currentTab === "perks" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => handleTabChange("perks")}
          >
            Perks
          </button>
        </div>

        {tab === "home" && (
          // Render Home tab content
          <div className="bg-background">
            <div className="relative w-full h-[200px]">
              <Image
                src={creator.channelBanner}
                alt="Creator Youtube Banner"
                layout="fill"
                objectFit="cover"
              />
            </div>

            {/* Page Content */}
            <div className="gap-10 my-8 flex flex-col max-w-[100vh] mx-auto">
              {/* Channel Information */}
              <div className="bg-surface-60 p-6 rounded-3xl">
                <div className="flex flex-row gap-4">
                  <Image
                    src={creator.channelAvatar}
                    alt="Creator Avatar"
                    width={80}
                    height={80}
                    className="rounded-full border-2 border-utility-outline"
                  />
                  {/* Channel name and slug */}
                  <div className="flex flex-col text-black justify-center items-start w-full">
                    <text className="font-bold text-2xl">
                      {creator.channelName}
                    </text>
                    <text className="text-sm text-input-text-dim">
                      {creator.customUrl ?? creator.slug}
                    </text>
                  </div>
                  {/* About and Subscribe Button */}
                  <div className="flex flex-row text-black justify-center items-center gap-2">
                    <Button
                      label={"About"}
                      className="bg-surface-variant rounded-3xl h-12 px-6"
                    />
                    <Button
                      label={"Subscribe"}
                      className="rounded-3xl h-12 pl-5 bg-yellow-yellow"
                      rightIcon={
                        <CashAmountIcon
                          // TODO: add in the actual value for the Subcribe milestone
                          // if none, remove icon altogether
                          cashAmount={"100"}
                          className={
                            "bg-black text-yellow-yellow p-2 rounded-3xl font-bold h-7"
                          }
                        />
                      }
                    />
                  </div>
                </div>
              </div>
              {/* Nudge Referral and Stats */}
              {/* Quests cards */}
              <div className="flex flex-row w-full gap-6">
                {/* TODO: Make these into a component */}
                {quests
                  .slice(currentIndex, currentIndex + 2)
                  .map((quest, i) => (
                    <div
                      key={quest.id}
                      className="bg-surface-60 flex flex-col max-w-[400px] p-6 rounded-3xl"
                    >
                      <Image
                        src={quest.videoThumbnail}
                        alt="Video Thumbnail"
                        width={380}
                        height={213.7}
                        className="rounded-3xl"
                      />

                      <div className="flex flex-col gap-6 mt-4">
                        {/* Like and comment */}
                        <div className="flex flex-row gap-6">
                          {/* TODO: Replace with states */}
                          <div className="gap-2 flex flex-row justify-center items-center">
                            <YoutubeLike checked={false} completed={false} />
                            {/* TODO: checked and completed state for Cash Amount */}
                            <CashAmountIcon
                              cashAmount={"5"}
                              className="bg-utility-disabled-background text-utility-disabled-content px-[6px] py-[4px] rounded-3xl font-semibold h-6"
                            />
                          </div>

                          <div className="gap-2 flex flex-row justify-center items-center">
                            <YoutubeComment checked={false} completed={false} />
                            <CashAmountIcon
                              cashAmount={"5"}
                              className="bg-utility-disabled-background text-utility-disabled-content px-[6px] py-[4px] rounded-3xl font-semibold h-6"
                            />
                          </div>
                        </div>
                        {/* Published At, Title, description */}
                        <div className="flex flex-col gap-2">
                          {/* published how many days ago  */}
                          <text className="text-xs text-input-text-dim">
                            {" "}
                            {`${dayjs(quest.videoPublishedAt).from(
                              currentTime,
                              true
                            )} ago`}
                          </text>
                          <text className="truncate text-ellipsis text-lg text-black font-bold">
                            {quest.title}
                          </text>
                          <text className="truncate text-ellipsis text-regular text-input-text-dim">
                            {quest.description}
                          </text>
                        </div>
                        {/* Watch and Verify */}
                        <div className="gap-2 flex flex-col">
                          <Button
                            label={"Watch"}
                            leftIcon={<YoutubeIcon className="bg-black" />}
                            className="w-full bg-black text-white rounded-3xl"
                          />
                          <Button
                            label={"Verify"}
                            leftIcon={
                              <ArrowSync className="bg-surface-variant" />
                            }
                            className="w-full bg-surface-variant text-black rounded-3xl"
                          />
                        </div>
                        {i === 1  && (
                          <button
                            onClick={handleNextClick}
                            className="text-black absolute right-[18rem] bg-black rounded-full h-10 w-10"
                          >
                            Next
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {tab === "perks" && (
          // Render Perks tab content

          <div>PERKS !!</div>
        )}
      </div>
    </div>
  );
};

export default CreatorProfile;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const creatorSlug = context.params?.creatorSlug as string;

  // Fetch data from your Express backend
  const response = await fetch(
    `http://localhost:3000/api/creator/${creatorSlug}`
  );

  if (response.status === 404) {
    return {
      notFound: true,
    };
  }

  const creator = await response.json();

  return { props: creator.creator };
}
