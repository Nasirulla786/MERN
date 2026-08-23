import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Grid3x3, Film, ImageIcon, UserPlus, UserCheck } from "lucide-react";

import { ServerURl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/slices/userSlice";

const GRADIENT = "bg-gradient-to-tr from-[#6c2bd9] via-[#e1306c] to-[#ffe500]";

const FriendProfilePage = () => {
  const params = useParams();
  const { userData } = useSelector((state) => state.user);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFollow = userData?.following?.some(
    (id) => id.toString() === user?._id?.toString()
);


  const fetchFriendProfile = async () => {
    try {
      const result = await axios.get(
        `${ServerURl}/api/friend-profile/${params.id}`,
        {
          withCredentials: true,
        },
      );

      const friendUser = result.data.user;

      setUser(friendUser);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const handleFollow = async () => {
    try {
      const result = await axios.get(`${ServerURl}/api/follow/${params.id}`, {
        withCredentials: true,
      });

      dispatch(setUserData(result.data.user));

      setUser(result.data.targetUser);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData?._id && params.id) {
      fetchFriendProfile();
    }
  }, [userData?._id, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${GRADIENT} animate-pulse`} />
          <p className="text-sm text-[#9c93b8]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb] flex items-center justify-center">
        <p className="text-sm text-[#9c93b8]">User not found</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb]">
      {/* Top bar with back button */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 sticky top-0 bg-[#120f1a]/95 backdrop-blur z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-full hover:bg-white/5 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <p className="font-semibold text-base">{user.username}</p>
      </div>

      {/* Profile Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex gap-6 md:gap-16 items-center">
          {/* DP */}
          <div className="shrink-0">
            <div className={`w-24 h-24 md:w-36 md:h-36 rounded-full p-[3px] ${GRADIENT}`}>
              <img
                src={user.dp}
                alt="profile"
                className="w-full h-full rounded-full object-cover border-4 border-[#120f1a]"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            {/* Username */}
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-xl md:text-2xl font-semibold">
                {user.username}
              </h1>

              <button
                onClick={handleFollow}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm transition ${
                  isFollow
                    ? "border border-white/15 text-[#f7f5fb] hover:bg-white/5"
                    : `${GRADIENT} text-[#17101c] hover:-translate-y-0.5`
                }`}
              >
                {isFollow ? <UserCheck size={16} /> : <UserPlus size={16} />}
                {isFollow ? "Following" : "Follow"}
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-6 md:gap-10 mt-5">
              <div className="text-sm">
                <span className="font-semibold">{user.posts?.length || 0}</span>{" "}
                <span className="text-[#9c93b8]">posts</span>
              </div>

              <div className="text-sm">
                <span className="font-semibold">
                  {user.followers?.length || 0}
                </span>{" "}
                <span className="text-[#9c93b8]">followers</span>
              </div>

              <div className="text-sm">
                <span className="font-semibold">
                  {user.following?.length || 0}
                </span>{" "}
                <span className="text-[#9c93b8]">following</span>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-5">
              <p className="font-semibold text-sm">{user.username}</p>
              <p className="text-[#9c93b8] text-sm mt-1">{user.bio}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-16 border-t border-white/10 mt-10">
          <button className="flex items-center gap-1.5 py-4 font-semibold text-sm border-t-2 border-[#ffe500] text-[#f7f5fb] -mt-px">
            <Grid3x3 size={16} /> POSTS
          </button>

          <button className="flex items-center gap-1.5 py-4 text-sm text-[#6f6789]">
            <Film size={16} /> REELS
          </button>
        </div>

        {/* Posts */}
        <div className="mt-6">
          {user.posts?.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-[#6f6789]">
              <ImageIcon size={32} />
              <p className="text-sm">No posts yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              {user.posts?.map((post, idx) => (
                <div key={idx} className="aspect-square bg-[#1c1728] rounded-md overflow-hidden group cursor-pointer">
                  <img
                    src={post.image}
                    alt="post"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reels */}
        <div className="mt-12">
          <div className="flex flex-col items-center gap-2 py-16 text-[#6f6789]">
            <Film size={32} />
            <p className="text-sm">No reels yet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendProfilePage;
