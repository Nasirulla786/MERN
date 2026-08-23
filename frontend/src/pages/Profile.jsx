import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Settings, Grid3x3, Film, Bookmark, Play, ImageIcon } from "lucide-react";

const GRADIENT = "bg-gradient-to-tr from-[#6c2bd9] via-[#e1306c] to-[#ffe500]";

// Which field on the user object each tab reads from
const tabs = [
  { key: "posts", label: "Posts", icon: Grid3x3 },
  { key: "reels", label: "Reels", icon: Film },
  { key: "saved", label: "Saved", icon: Bookmark },
];

const Profile = () => {
  const { userData } = useSelector((state) => state.user); // logged-in user (redux)
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb] flex items-center justify-center">
        <p className="text-sm text-[#9c93b8]">Loading profile...</p>
      </div>
    );
  }

  // Grid items for whichever tab is active
  const activeItems = userData[activeTab] || [];

  return (
    <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 bg-[#120f1a]/95 backdrop-blur z-10">
        <p className="font-semibold text-base">{userData.username}</p>
        <Link to="/settings" className="p-1.5 rounded-full hover:bg-white/5">
          <Settings size={20} />
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile header */}
        <div className="flex gap-6 md:gap-16 items-center">
          <div className="shrink-0">
            <div className={`w-24 h-24 md:w-36 md:h-36 rounded-full p-[3px] ${GRADIENT}`}>
              <img
                src={userData.dp || "/default-avatar.png"}
                alt={`${userData.username}'s avatar`}
                className="w-full h-full rounded-full object-cover border-4 border-[#120f1a]"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-xl md:text-2xl font-semibold">{userData.username}</h1>

              <button
                onClick={() => navigate("/edit-profile")}
                className="px-5 py-2 rounded-xl font-semibold text-sm border border-white/15 hover:bg-white/5 transition"
              >
                Edit Profile
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-6 md:gap-10 mt-5">
              <div className="text-sm">
                <span className="font-semibold">{userData.posts?.length || 0}</span>{" "}
                <span className="text-[#9c93b8]">posts</span>
              </div>
              <Link to="/followers" className="text-sm hover:text-[#ffe500]">
                <span className="font-semibold">{userData.followers?.length || 0}</span>{" "}
                <span className="text-[#9c93b8]">followers</span>
              </Link>
              <Link to="/following" className="text-sm hover:text-[#ffe500]">
                <span className="font-semibold">{userData.following?.length || 0}</span>{" "}
                <span className="text-[#9c93b8]">following</span>
              </Link>
            </div>

            {/* Bio */}
            <div className="mt-5">
              <p className="font-semibold text-sm">{userData.username}</p>
              <p className="text-[#9c93b8] text-sm mt-1">
                {userData.bio || "No bio added yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-16 border-t border-white/10 mt-10">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 py-4 text-sm font-semibold -mt-px border-t-2 transition ${
                activeTab === key
                  ? "border-[#ffe500] text-[#f7f5fb]"
                  : "border-transparent text-[#6f6789] hover:text-[#9c93b8]"
              }`}
            >
              <Icon size={16} /> {label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Grid for the active tab */}
        <div className="mt-6">
          {activeItems.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-[#6f6789]">
              {activeTab === "reels" ? <Film size={32} /> : <ImageIcon size={32} />}
              <p className="text-sm">No {activeTab} yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 md:gap-3">
              {activeItems.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="relative aspect-square bg-[#1c1728] rounded-md overflow-hidden group cursor-pointer"
                >
                  <img
                    src={item.image || item.thumbnail || item.media}
                    alt={activeTab}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {activeTab === "reels" && (
                    <Play size={18} className="absolute top-2 right-2 text-white/90 fill-white/90" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
