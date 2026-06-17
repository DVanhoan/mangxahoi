import { useState } from "react";
import Posts from "../../components/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-l border-gray-400 min-h-screen w-full lg:w-4/5 mx-auto">
        <div className="flex w-full border-b border-gray-400">
          <div
            className={
              "flex justify-center flex-1 p-3 hover:bg-gray-200 transition duration-300 cursor-pointer relative text-black"
            }
            onClick={() => setFeedType("forYou")}
          >
            Dành cho bạn
            {feedType === "forYou" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
          <div
            className="flex justify-center flex-1 p-3 hover:bg-gray-200 transition duration-300 cursor-pointer relative text-black"
            onClick={() => setFeedType("following")}
          >
            Đang Follow
            {feedType === "following" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
        </div>

        <CreatePost />

        <div className="pb-16">
          <Posts feedType={feedType} />
        </div>
      </div>
    </>
  );
};
export default HomePage;
