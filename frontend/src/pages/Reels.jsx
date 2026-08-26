import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { ServerURl } from "../App";
import { setUserData } from "../redux/slices/userSlice";

const GRADIENT = "bg-gradient-to-tr from-[#6c2bd9] via-[#e1306c] to-[#ffe500]";

// Scrollbar ko hide karne ke liye — koi plugin ki zaroorat nahi
const HIDE_SCROLLBAR = "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

// "2h", "5m" jaise short time labels ke liye
const timeAgo = (date) => {
  if (!date) return "";
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);

  const [commentModalOpen, setCommentModalOpen] = useState(""); // active reel id
  const [message, setMessage] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const videoRefs = useRef([]);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchReels = async () => {
    try {
      const result = await axios.get(`${ServerURl}/api/get-loops`, {
        withCredentials: true,
      });
      setReels(result.data);
    } catch (error) {
      console.error("Fetch reels error:", error);
      toast.error("Could not load reels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // Current reel ko automatically play/pause karna
  useEffect(() => {
    if (!reels.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.7 },
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [reels]);

  // ---------- Like — optimistic update, server response se sync ----------
  const handleLike = async (reelId) => {

    try {
      const result = await axios.get(`${ServerURl}/api/like-reel/${reelId}`, {
        withCredentials: true,
      });

      const loop = result.data
      const updatedLoop = reels.map((reel)=>reel?._id==reelId?loop:reel)
      setReels(updatedLoop)

    } catch (error) {
      console.error("Like error:", error);
      toast.error("Could not update like");


    }
  };

  // ---------- Follow / Unfollow ----------
  const handleFollow = async (authorId) => {
    try {
      const result = await axios.get(`${ServerURl}/api/follow/${authorId}`, {
        withCredentials: true,
      });
      // Redux ka userData update — following list yahin se refresh ho jayegi
      dispatch(setUserData(result.data.user));
      toast.success(result.data.message);
    } catch (error) {
      console.error("Follow error:", error);
      toast.error(error?.response?.data?.message || "Could not update follow");
    }
  };

  // ---------- Comments ----------
  const handleComment = async (reelId) => {
    if (!message.trim()) return;

    try {
      setPostingComment(true);
      const result = await axios.post(
        `${ServerURl}/api/comment/${reelId}`,
        { message },
        { withCredentials: true },
      );
      setReels((prev) => prev.map((r) => (r._id === reelId ? result.data : r)));
      setMessage("");
    } catch (error) {
      console.error("Comment error:", error);
      toast.error("Could not post comment");
    } finally {
      setPostingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm text-white/60">Loading reels...</p>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <p className="text-sm text-white/60">No reels available</p>
      </div>
    );
  }

  // Jis reel ka comment modal khula hai, uska data
  const activeReel = reels.find((r) => r?._id === commentModalOpen);

  return (
    <div className="h-screen bg-black flex justify-center overflow-hidden">
      {/* Reels Container */}
      <div className={`w-full md:w-[450px] h-screen overflow-y-scroll snap-y snap-mandatory ${HIDE_SCROLLBAR}`}>
        {reels.map((reel, index) => {
          const isLiked = reel?.like?.includes(userData?._id);
          const isOwnReel = reel?.author?._id === userData?._id;
          const isFollowing = userData?.following?.includes(reel?.author?._id);
          const profilePath = isOwnReel ? "/friend-profile-page" : `/friend-profile-page/${reel?.author?._id}`;

          return (
            <div key={index} className="relative w-full h-screen snap-start bg-black">
              {/* Video */}
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={reel?.media}
                className="w-full h-full object-cover"
                loop
                playsInline
                muted={muted}
                preload="metadata"
              />

              {/* Gradient — top aur bottom dono, taaki icons/text hamesha readable rahein */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

              {/* Top bar — back button + sound button */}
              <div className="absolute top-5 left-5 right-5 z-10 flex items-center justify-between">
                <Link
                  to="/"
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg shadow-black/30"
                >
                  <ArrowLeft size={20} />
                </Link>

                <button
                  onClick={() => setMuted((prev) => !prev)}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg shadow-black/30"
                >
                  {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>

              {/* Right Side Buttons */}
              <div className="absolute right-4 bottom-28 z-10 flex flex-col items-center gap-5">
                {/* Like */}
                <button
                  onClick={() => handleLike(reel?._id)}
                  className="flex flex-col items-center gap-1 text-white"
                >
                  <span className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                    <Heart
                      size={24}
                      fill={isLiked ? "#e1306c" : "none"}
                      className={isLiked ? "text-[#e1306c]" : "text-white"}
                    />
                  </span>
                  <span className="text-xs font-medium drop-shadow">{reel?.like?.length || 0}</span>
                </button>

                {/* Comment */}
                <button
                  onClick={() => setCommentModalOpen(reel?._id)}
                  className="flex flex-col items-center gap-1 text-white"
                >
                  <span className="w-11 h-11 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
                    <MessageCircle size={23} />
                  </span>
                  <span className="text-xs font-medium drop-shadow">{reel?.comments?.length || 0}</span>
                </button>

              </div>

              {/* Bottom Information */}
              <div className="absolute bottom-8 left-4 right-20 z-10 text-white">
                {/* Author — profile page ka link */}
                <div className="flex items-center gap-3 mb-3">
                  <Link to={profilePath} className={`shrink-0 rounded-full p-[2px] ${GRADIENT}`}>
                    <img
                      src={reel?.author?.dp}
                      alt={reel?.author?.username}
                      className="w-10 h-10 rounded-full object-cover border-2 border-black"
                    />
                  </Link>

                  <Link to={profilePath} className="font-semibold hover:underline">
                    {reel?.author?.username}
                  </Link>

                  {!isOwnReel && (
                    <button
                      onClick={() => handleFollow(reel?.author?._id)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                        isFollowing
                          ? "border border-white/40 text-white hover:bg-white/10"
                          : `${GRADIENT} text-[#17101c] shadow-md shadow-black/30`
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>

                {/* Caption */}
                {reel?.caption && (
                  <p className="text-sm leading-5 text-white/90 drop-shadow">{reel?.caption}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- Comment modal ---------- */}
      {commentModalOpen && activeReel && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="w-full sm:w-[480px] h-[80vh] sm:h-[640px] bg-[#161320] rounded-t-3xl sm:rounded-3xl border border-white/10 flex flex-col shadow-2xl">
            {/* Drag handle — mobile feel */}
            <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mt-3" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-base text-white">Comments</h2>
                <span className="text-xs text-white/40">({activeReel.comments?.length || 0})</span>
              </div>
              <button
                onClick={() => setCommentModalOpen("")}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Comments list */}
            <div className={`flex-1 overflow-y-auto px-4 py-4 space-y-5 ${HIDE_SCROLLBAR}`}>
              {(activeReel.comments?.length || 0) === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <MessageCircle size={26} className="text-white/25" />
                  </div>
                  <p className="text-sm text-white/50">No comments yet</p>
                  <p className="text-xs text-white/30 mt-1">Be the first one to comment</p>
                </div>
              ) : (
                activeReel.comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3 items-start">
                    <img
                      src={comment?.author?.dp}
                      alt={comment?.author?.username}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="bg-white/5 rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                        <p className="text-xs font-semibold text-white mb-1">
                          {comment?.author?.username}
                        </p>
                        <p className="text-sm text-white/80 break-words">{comment?.message}</p>
                      </div>
                      <p className="text-[11px] text-white/30 px-2 pt-1">
                        {timeAgo(comment?.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment input */}
            <div className="border-t border-white/10 p-4 bg-[#161320]">
              <div className="flex items-center gap-3">
                <img
                  src={userData?.dp}
                  alt="profile"
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && message.trim()) {
                        handleComment(activeReel._id);
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(225,48,108,0.25)] transition"
                  />
                  <button
                    onClick={() => handleComment(activeReel._id)}
                    disabled={!message.trim() || postingComment}
                    className={`absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full ${GRADIENT} flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition`}
                  >
                    <Send size={16} className="text-black" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reels;
