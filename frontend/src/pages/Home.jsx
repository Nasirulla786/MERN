import React, { useState } from "react";
import { data, Link, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Home as HomeIcon,
  Bookmark,
  Settings,
  LogOut,
  Search,
  Heart,
  MessageCircle,
  Send,
  Plus,
  Camera,
  Film,
  Play,
  Image,
  X,
} from "lucide-react";
import { ServerURl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUserData } from "../redux/slices/userSlice";
import StoryComponent from "../components/StoryComponent";
import SearchBarLaptop from "../components/SearchBarLaptop";

// ---- Dummy data (replace these with real API calls later) ----
const dummyFriends = [
  { id: 1, name: "Aarav Mehta", dp: "https://i.pravatar.cc/100?img=1" },
  { id: 2, name: "Isha Kapoor", dp: "https://i.pravatar.cc/100?img=2" },
  { id: 3, name: "Rohan Shah", dp: "https://i.pravatar.cc/100?img=3" },
];



const dummyReels = [
  {
    id: 1,
    thumbnail: "https://picsum.photos/300/500?random=11",
    views: "12.4K",
  },
  {
    id: 2,
    thumbnail: "https://picsum.photos/300/500?random=12",
    views: "8.1K",
  },
  { id: 3, thumbnail: "https://picsum.photos/300/500?random=13", views: "24K" },
  {
    id: 4,
    thumbnail: "https://picsum.photos/300/500?random=14",
    views: "3.9K",
  },
];




const dummyChats = [
  {
    id: 1,
    name: "Aarav Mehta",
    dp: "https://i.pravatar.cc/100?img=1",
    lastMsg: "See you tomorrow!",
  },
  {
    id: 2,
    name: "Isha Kapoor",
    dp: "https://i.pravatar.cc/100?img=2",
    lastMsg: "Haha that's great 😂",
  },
  {
    id: 3,
    name: "Rohan Shah",
    dp: "https://i.pravatar.cc/100?img=3",
    lastMsg: "Sent the files ✅",
  },
];



// Small reusable style for the gradient the whole theme is built around
const GRADIENT = "bg-gradient-to-tr from-[#6c2bd9] via-[#e1306c] to-[#ffe500]";

// Options shown inside the "Create" bottom sheet
const createOptions = [
  {
    label: "Post",
    desc: "Share a photo or video",
    icon: Image,
    path: "/create-post",
  },
  {
    label: "Reel",
    desc: "Record a short video",
    icon: Film,
    path: "/upload-reel",
  },
  {
    label: "Story",
    desc: "Share a 24 hour moment",
    icon: Camera,
    path: "/upload-story",
  },
];

const Home = () => {
  const { userData } = useSelector((state) => state.user); // logged-in user ka data
  const [feedPosts, setFeedPosts] = useState([]);
  const [commentModelOpen, setCommentModelOpen] = useState("")
  const [message, setMessage] = useState("")
  const [postComments, setPostComments] = useState([])


  const timeAgo = (date) => {
    if (!date) return "";
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return "now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const navigate = useNavigate();

  const unreadChats = dummyChats.length; // replace with real unread count later
  const [showCreateMenu, setShowCreateMenu] = useState(false); // Post/Reel/Story sheet

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${ServerURl}/api/logout-user`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const res = await axios.get(`${ServerURl}/api/get-all-post`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setFeedPosts(res.data.posts);
      }
    } catch (error) {
      console.error("Fetch all posts error", error);
    }
  };



  //Like
  const handleClick = async (id) => {
    try {
      const res = await axios.get(`${ServerURl}/api/like/${id}`, {
        withCredentials: true,
      });
      // fetchAllPosts() //alternative for ui re-render
      const post = res.data.post;
      const updatePost = feedPosts.map((p) => (p._id == post._id ? post : p));
      setFeedPosts(updatePost);
    } catch (error) {
      console.error("handle like error", error);
    }
  };


  const handleComment = async (id) => {
    try {
      const res = await axios.post(`${ServerURl}/api/add-comment/${id}`, { message }, { withCredentials: true })
      const post = res.data.post

      setPostComments(post.comments)
      setMessage("")

    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.error("handle comment error", error)
    }
  }


  useEffect(() => {

    const fetchComments = async (req, res) => {
      try {
        if (!commentModelOpen) return;
        const res = await axios.get(`${ServerURl}/api/get-comments/${commentModelOpen}`, { withCredentials: true })
        setPostComments(res.data.comments)


      } catch (error) {
        console.error("fetch comments error", error)

      }
    }

    fetchComments()

  }, [commentModelOpen])





  return (
    <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb]">
      {/* ---------- Mobile top bar (visible only below lg) ---------- */}
      <div className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 bg-[#120f1a]/95 backdrop-blur z-20">
        {/* Camera icon — Snapchat-style quick capture */}
        <Link to="/camera" className="p-1.5 rounded-full hover:bg-white/5">
          <Camera size={22} />
        </Link>

        <span
          className={`font-bold text-lg ${GRADIENT} bg-clip-text text-transparent`}
        >
          SnapGram
        </span>

        <div className="flex items-center gap-3">
          {/* Messages icon with unread badge */}
          <Link
            to="/messages"
            className="relative p-1.5 rounded-full hover:bg-white/5"
          >
            <Send size={20} />
            {unreadChats > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#e1306c] border border-[#120f1a]" />
            )}
          </Link>
          <Link to="/profile">
            <img
              src={userData?.dp || "https://i.pravatar.cc/100"}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#e1306c]"
            />
          </Link>
        </div>
      </div>

      {/* ---------- Main 3-section layout ---------- */}
      <div className="lg:grid lg:grid-cols-[260px_1fr_300px] lg:gap-4 lg:max-w-7xl lg:mx-auto lg:p-4 pb-20 lg:pb-4">
        {/* ===== SECTION 1: Profile + Friends (left, hidden on mobile) ===== */}
        <aside className="hidden lg:flex flex-col gap-6 sticky top-4 h-fit">
          {/* Mini profile card */}
          <div className="bg-[#1c1728] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <img
              src={userData?.dp || "https://i.pravatar.cc/100"}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-sm">
                {userData?.username || "You"}
              </p>
              <Link
                to="/profile"
                className="text-xs text-[#9c93b8] hover:text-[#ffe500]"
              >
                View profile
              </Link>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1">
            <Link
              to="/home"
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 text-sm font-medium"
            >
              <HomeIcon size={18} /> Home
            </Link>
            <button
              onClick={() => setShowCreateMenu(true)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-left"
            >
              <Plus size={18} /> Create
            </button>
            <Link
              to="/reels"
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm"
            >
              <Film size={18} /> Reels
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm"
            >
              <img
                src={userData?.dp}
                alt=""
                className="w-[18px] h-[18px] rounded-full object-cover"
              />
              Profile
            </Link>
            <Link
              to="/edit-profile"
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm"
            >
              <Settings size={18} /> Edit Profile
            </Link>
            <Link
              to="/saved"
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm"
            >
              <Bookmark size={18} /> Saved
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm"
            >
              <Settings size={18} /> Settings
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-left text-[#e1306c] cursor-pointer"
            >
              <LogOut size={18} /> Logout
            </button>
          </nav>

          {/* Friends list */}
          <div>
            <p className="text-xs uppercase tracking-wide text-[#6f6789] mb-2">
              Friends
            </p>
            <div className="flex flex-col gap-3">
              {dummyFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center gap-3 hover:bg-white/5 p-1.5 rounded-lg cursor-pointer"
                >
                  <img
                    src={friend.dp}
                    alt={friend.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <p className="text-sm">{friend.name}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ===== SECTION 2: Stories + Reels + Post feed (middle, always visible) ===== */}
        <main className="flex flex-col gap-6 px-4 lg:px-0 py-4">
       <StoryComponent data ={userData} />

          {/* Reels row */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm flex items-center gap-1.5">
                <Film size={16} /> Reels
              </p>
              <Link
                to="/reels"
                className="text-xs text-[#9c93b8] hover:text-[#ffe500]"
              >
                See all
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">
              {dummyReels.map((reel) => (
                <div
                  key={reel.id}
                  className="relative shrink-0 w-28 h-44 rounded-xl overflow-hidden cursor-pointer group"
                >
                  <img
                    src={reel.thumbnail}
                    alt="reel"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <Play
                    size={26}
                    className="absolute top-2 right-2 text-white/90 fill-white/90"
                  />
                  <p className="absolute bottom-2 left-2 text-xs font-medium flex items-center gap-1">
                    <Play size={11} className="fill-white" /> {reel.views}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Post feed */}
          <div className="flex flex-col gap-5">
            {feedPosts.length == 0 ? (
              <div className="h-full w-full text-2xl font-bold flex items-center justify-center my-10">
                Posts not found..
              </div>
            ) : (
              feedPosts.map((post, idx) => {
                const alreadyLike = post?.likes.some(
                  (userId) => userId == userData?._id,
                );
                return (
                  <Link to={"/friend-profile-page/"+post?.author?._id}
                    key={idx}
                    className="bg-[#1c1728] border border-white/10 rounded-2xl overflow-hidden shadow-lg shadow-black/20 relative"
                  >
                    {/* Post header */}
                    <div className="flex items-center gap-3 p-3">
                      <div className={`p-[2px] rounded-full ${GRADIENT}`}>
                        <img
                          src={post?.author?.dp}
                          alt={post?.author?.username}
                          className="w-9 h-9 rounded-full object-cover border-2 border-[#1c1728]"
                        />
                      </div>
                      <p className="text-sm font-semibold">{post?.author?.username}</p>
                    </div>

                    {/* Post image */}
                    <div className="overflow-hidden">
                      <img
                        src={post?.media}
                        alt="post"
                        className="w-full max-h-[500px] object-cover hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>

                    {/* Post actions */}
                    <div className="flex items-center gap-4 p-3 text-[#f7f5fb]">
                      <div
                        className="cursor-pointer"
                        onClick={() => handleClick(post?._id)}
                      >
                        {alreadyLike ? (
                          <Heart
                            size={22}
                            className="cursor-pointer hover:text-[#e1306c]  hover:scale-110 transition-transform "
                            stroke="red"
                            fill="red"
                          />
                        ) : (
                          <Heart
                            size={22}
                            className="cursor-pointer hover:text-[#e1306c] hover:scale-110 transition-transform"
                          />
                        )}
                      </div>

                      <MessageCircle
  onClick={() => setCommentModelOpen(post?._id)}
  size={22}
  className="cursor-pointer hover:text-[#ffe500] hover:scale-110 transition-transform"
/>

{commentModelOpen === post?._id && (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center">
    <div
      className="w-full sm:w-[480px] h-[82vh] sm:h-[640px] bg-[#161320] rounded-t-3xl sm:rounded-3xl border border-white/10 flex flex-col shadow-2xl shadow-black/60 animate-[slideUp_0.25s_ease-out]"
    >
      {/* subtle top drag handle — mobile feel */}
      <div className="sm:hidden w-10 h-1 rounded-full bg-white/15 mx-auto mt-3" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-base">Comments</h2>
          <span className="text-xs text-white/40">({postComments.length})</span>
        </div>

        <button
          onClick={() => setCommentModelOpen("")}
          className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Comments — scrollable, but scrollbar hidden for a cleaner look */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {postComments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <MessageCircle size={26} className="text-white/25" />
            </div>
            <p className="text-sm text-white/50">No comments yet</p>
            <p className="text-xs text-white/30 mt-1">Be the first one to comment</p>
          </div>
        ) : (
          postComments.map((comment) =>


            {

              return(
                <div key={comment._id} className="flex gap-3 items-start group">
                <img
                  src={comment?.author?.dp}
                  alt={comment?.author?.username}
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                />

                <div className="flex-1 min-w-0">
                  <div className="bg-white/[0.04] group-hover:bg-white/[0.07] transition-colors rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                    <p className="text-xs font-semibold text-white mb-1">
                      {comment?.author?.username}
                    </p>
                    <p className="text-sm text-white/80 break-words leading-relaxed">
                      {comment?.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 px-2 pt-1.5">
                    <span className="text-[11px] text-white/30">{timeAgo(comment?.createdAt)}</span>
                    <button className="flex items-center gap-1 text-[11px] text-white/40 hover:text-[#e1306c] transition">
                      <Heart size={12} /> Like
                    </button>
                    <button className="text-[11px] text-white/40 hover:text-white transition">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
              )

            }

          )
        )}
      </div>

      {/* Comment Input */}
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
                  handleComment(post?._id);
                }
              }}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm outline-none placeholder:text-white/30 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(225,48,108,0.25)] transition"
            />

            <button
              onClick={() => {
                if (message.trim()) {
                  handleComment(post?._id);
                }
              }}
              disabled={!message.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-tr from-[#6c2bd9] via-[#e1306c] to-[#ffe500] flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition cursor-pointer"
            >
              <Send size={16} className="text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


                      <Send
                        size={22}
                        className="cursor-pointer hover:text-[#6c2bd9] hover:scale-110 transition-transform"
                      />
                    </div>

                    {/* Likes + caption */}
                    <div className="px-3 pb-3">
                      <p className="text-sm font-semibold">
                        {post.likes.length} likes
                      </p>
                      <p className="text-sm text-[#9c93b8]">
                        <span className="text-[#f7f5fb] font-semibold mr-1">
                          {post.name}
                        </span>
                        {post.caption}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </main>

        {/* ===== SECTION 3: Search + Chat (right, hidden on mobile) ===== */}


        <SearchBarLaptop />

      </div>

      {/* ---------- Floating messages button — small navbar, mobile only ---------- */}
      <Link
        to="/messages"
        className="lg:hidden fixed right-4 bottom-20 z-20 w-12 h-12 rounded-full bg-[#1c1728] border border-white/10 shadow-lg shadow-black/40 flex items-center justify-center"
      >
        <MessageCircle size={20} />
        {unreadChats > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#e1306c] border border-[#1c1728]" />
        )}
      </Link>

      {/* ---------- Bottom navbar (mobile only) ---------- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-[#120f1a]/95 backdrop-blur border-t border-white/10 flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <Link to="/home" className="p-2 text-[#ffe500]">
          <HomeIcon size={22} />
        </Link>
        <Link to="/search" className="p-2 text-[#f7f5fb]">
          <Search size={22} />
        </Link>

        {/* Center create button — raised, gradient, opens Post/Reel/Story sheet */}
        <button
          onClick={() => setShowCreateMenu(true)}
          className={`-mt-6 w-14 h-14 rounded-full ${GRADIENT} flex items-center justify-center shadow-lg shadow-black/40 border-4 border-[#120f1a]`}
        >
          <Plus size={24} className="text-[#17101c]" />
        </button>

        <Link to="/reels" className="p-2 text-[#f7f5fb]">
          <Film size={22} />
        </Link>
        <Link to="/profile" className="p-2">
          <img
            src={userData?.dp || "https://i.pravatar.cc/100"}
            alt="profile"
            className="w-6 h-6 rounded-full object-cover"
          />
        </Link>
      </nav>

      {/* ---------- Create bottom sheet: Post / Reel / Story ---------- */}
      {/* Backdrop — click outside the sheet to close it */}
      <div
        onClick={() => setShowCreateMenu(false)}
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${showCreateMenu
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
      />

      <div
        className={`fixed left-0 right-0 bottom-0 z-40 bg-[#1c1728] border-t border-white/10 rounded-t-3xl p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-transform duration-300 max-w-md mx-auto ${showCreateMenu ? "translate-y-0" : "translate-y-full"
          }`}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-base">Create</p>
          <button
            onClick={() => setShowCreateMenu(false)}
            className="p-1 rounded-full hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {createOptions.map(({ label, desc, icon: Icon, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setShowCreateMenu(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5"
            >
              <div
                className={`w-11 h-11 shrink-0 rounded-full ${GRADIENT} flex items-center justify-center`}
              >
                <Icon size={19} className="text-[#17101c]" />
              </div>
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-[#9c93b8]">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
