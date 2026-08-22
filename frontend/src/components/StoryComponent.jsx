import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ServerURl } from "../App";

const GRADIENT = "bg-gradient-to-tr from-[#6c2bd9] via-[#e1306c] to-[#ffe500]";

const StoryComponent = ({ data }) => {
  const [storeStories, setStoreStories] = useState([]);

  const [showMyStory, setShowMyStory] = useState(false);

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);




const [showFriendStory, setShowFriendStory] = useState(false);
const [selectedFriendStories, setSelectedFriendStories] = useState([]);
const [friendStoryIndex, setFriendStoryIndex] = useState(0);







  useEffect(() => {
    const getStories = async () => {
      try {
        const res = await axios.get(`${ServerURl}/api/get-stories`, {
          withCredentials: true,
        });

        setStoreStories(res.data.stories);
      } catch (error) {
        console.error("GET STORIES ERROR:", error);
      }
    };

    getStories();
  }, []);

  const myStory = storeStories.filter((story) => story.user?._id === data?._id);

  const myFriendSTory = storeStories.filter(
    (story) => story.user?._id !== data?._id,
  );

  const friendsStoriesMap = new Map()
  myFriendSTory.forEach((story)=>{
    const userId = story?.user?._id
    if (!friendsStoriesMap.has(userId)){
        friendsStoriesMap.set(userId , story)
    }
  })


  const myFriendStory = [...friendsStoriesMap.values()]


  const deleteStory = async (storyId) => {

    try {

        const res = await axios.delete(
            `${ServerURl}/api/delete-stories/${storyId}`,
            {
                withCredentials: true
            }
        );

        // deleted story ko frontend state se hata do
        setStoreStories((prev) =>
            prev.filter((story) => story._id !== storyId)
        );

        closeMyStory();

    } catch (error) {

        console.log(
            "DELETE STORY ERROR:",
            error
        );

    }

};



const openFriendStory = (userId) => {

    const stories = myFriendSTory.filter(
        (story) => story.user?._id === userId
    );

    setSelectedFriendStories(stories);
    setFriendStoryIndex(0);
    setShowFriendStory(true);

};




  return (
    <div>
      {/* STORIES ROW */}

      <div className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none]">
        {/* YOUR STORY */}

        {myStory.length > 0 ? (
          <div
            onClick={() => {
              setShowMyStory(true);
              setCurrentStoryIndex(0);
            }}
            className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
          >
            <div className={`w-16 h-16 rounded-full p-[2px] ${GRADIENT}`}>
              <img
                src={data?.dp}
                alt="profile"
                className="w-full h-full rounded-full object-cover border-2 border-[#120f1a]"
              />
            </div>

            <span className="text-xs text-[#9c93b8]">Your story</span>
          </div>
        ) : (
          <Link
            to="/upload-story"
            className="flex flex-col items-center gap-1 shrink-0"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#9c93b8] flex items-center justify-center hover:border-[#ffe500] transition-colors">
              <Plus size={22} className="text-[#9c93b8]" />
            </div>

            <span className="text-xs text-[#9c93b8]">Your story</span>
          </Link>
        )}

        {/* DUMMY FRIEND STORIES */}

        {myFriendStory.map((story) => (
          <div
            key={story._id}
            className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
            onClick={() =>
                openFriendStory(story.user?._id)
            }
          >
            <div className={`w-16 h-16 rounded-full p-[2px] ${GRADIENT}`}>
              <img
                src={story.user?.dp}
                alt={story.user?.username}
                className="w-full h-full rounded-full object-cover border-2 border-[#120f1a]"
              />
            </div>

            <span className="text-xs text-[#9c93b8]">
              {story.user?.username}
            </span>
          </div>
        ))}
      </div>

      {/* FreindStory view */}

      {showFriendStory && selectedFriendStories.length > 0 && (

<div className="fixed inset-0 z-[999] bg-black flex items-center justify-center">

    <div className="relative w-full h-full sm:w-[430px] sm:h-[90vh] bg-black sm:rounded-xl overflow-hidden">

        {/* PROGRESS */}

        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1">

            {selectedFriendStories.map((story, index) => (

                <div
                    key={story._id}
                    className="h-[3px] flex-1 bg-white/30 rounded-full overflow-hidden"
                >

                    <div
                        className={`h-full bg-white ${
                            index <= friendStoryIndex
                                ? "w-full"
                                : "w-0"
                        }`}
                    />

                </div>

            ))}

        </div>


        {/* HEADER */}

        <div className="absolute top-7 left-4 right-4 z-30 flex items-center justify-between">

            <div className="flex items-center gap-3">

                <img
                    src={
                        selectedFriendStories[
                            friendStoryIndex
                        ]?.user?.profilePic
                    }
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover"
                />

                <span className="text-white font-medium">

                    {
                        selectedFriendStories[
                            friendStoryIndex
                        ]?.user?.username
                    }

                </span>

            </div>


            <button
                onClick={() => {
                    setShowFriendStory(false);
                    setFriendStoryIndex(0);
                    setSelectedFriendStories([]);
                }}
                className="text-white"
            >

                <X size={25} />

            </button>

        </div>


        {/* STORY */}

        <img
            src={
                selectedFriendStories[
                    friendStoryIndex
                ]?.mediaUrl
            }
            alt="friend story"
            className="w-full h-full object-contain"
        />


        {/* PREVIOUS */}

        <button
            onClick={() => {

                if (friendStoryIndex > 0) {

                    setFriendStoryIndex(
                        friendStoryIndex - 1
                    );

                }

            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white"
        >

            <ChevronLeft size={35} />

        </button>


        {/* NEXT */}

        <button
            onClick={() => {

                if (
                    friendStoryIndex <
                    selectedFriendStories.length - 1
                ) {

                    setFriendStoryIndex(
                        friendStoryIndex + 1
                    );

                } else {

                    setShowFriendStory(false);
                    setFriendStoryIndex(0);
                    setSelectedFriendStories([]);

                }

            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
        >

            <ChevronRight size={35} />

        </button>

    </div>

</div>

)}

      {/* MY STORY VIEWER */}

      {showMyStory && myStory.length > 0 && (
        <div className="fixed inset-0 z-[999] bg-black flex items-center justify-center">
          <div className="relative w-full h-full sm:w-[430px] sm:h-[90vh] bg-black sm:rounded-xl overflow-hidden">
            {/* PROGRESS */}

            <div className="absolute top-3 left-3 right-3 z-30 flex gap-1">
              {myStory.map((story, index) => (
                <div
                  key={story._id}
                  className="h-[3px] flex-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full bg-white ${
                      index <= currentStoryIndex ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* HEADER */}

            <div className="absolute top-7 left-4 right-4 z-30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={data?.dp}
                  alt="profile"
                  className="w-9 h-9 rounded-full object-cover"
                />


                <span className="text-white font-medium">{data?.username}</span>
              </div>

              {/* //close button */}
              <button
                onClick={() => {
                  setShowMyStory(false);
                  setCurrentStoryIndex(0);
                }}
                className="text-white"
              >
                <X size={25} />
              </button>
            </div>

            {/* CURRENT STORY */}
            <img
              src={myStory[currentStoryIndex]?.mediaUrl}
              alt="my story"
              className="w-full h-full object-contain"
            />


<div className="absolute bottom-6 left-0 right-0 flex justify-center z-30">

<button
    onClick={() =>
        deleteStory(
            myStory[currentStoryIndex]?._id
        )
    }
    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
>
    Delete Story
</button>

</div>

            {/* PREVIOUS */}

            <button
              onClick={() => {
                if (currentStoryIndex > 0) {
                  setCurrentStoryIndex(currentStoryIndex - 1);
                }
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white"
            >
              <ChevronLeft size={35} />
            </button>

            {/* NEXT */}

            <button
              onClick={() => {
                if (currentStoryIndex < myStory.length - 1) {
                  setCurrentStoryIndex(currentStoryIndex + 1);
                } else {
                  closeMyStory();
                }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
            >
              <ChevronRight size={35} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryComponent;
