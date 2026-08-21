import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
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

// ---- Dummy data (replace these with real API calls later) ----
const dummyFriends = [
  { id: 1, name: "Aarav Mehta", dp: "https://i.pravatar.cc/100?img=1" },
  { id: 2, name: "Isha Kapoor", dp: "https://i.pravatar.cc/100?img=2" },
  { id: 3, name: "Rohan Shah", dp: "https://i.pravatar.cc/100?img=3" },
];

const dummyStories = [
  { id: 1, name: "Riya", dp: "https://i.pravatar.cc/100?img=4" },
  { id: 2, name: "Kabir", dp: "https://i.pravatar.cc/100?img=5" },
  { id: 3, name: "Sana", dp: "https://i.pravatar.cc/100?img=6" },
];

const dummyReels = [
  { id: 1, thumbnail: "https://picsum.photos/300/500?random=11", views: "12.4K" },
  { id: 2, thumbnail: "https://picsum.photos/300/500?random=12", views: "8.1K" },
  { id: 3, thumbnail: "https://picsum.photos/300/500?random=13", views: "24K" },
  { id: 4, thumbnail: "https://picsum.photos/300/500?random=14", views: "3.9K" },
];

const dummyPosts = [
  {
    id: 1,
    name: "Riya Sharma",
    dp: "https://i.pravatar.cc/100?img=4",
    image: "https://picsum.photos/600/500?random=1",
    caption: "Sunset never disappoints 🌅",
    likes: 128,
  },
  {
    id: 2,
    name: "Kabir Singh",
    dp: "https://i.pravatar.cc/100?img=5",
    image: "https://picsum.photos/600/500?random=2",
    caption: "Weekend trip loading...",
    likes: 84,
  },
];

const dummyChats = [
  { id: 1, name: "Aarav Mehta", dp: "https://i.pravatar.cc/100?img=1", lastMsg: "See you tomorrow!" },
  { id: 2, name: "Isha Kapoor", dp: "https://i.pravatar.cc/100?img=2", lastMsg: "Haha that's great 😂" },
  { id: 3, name: "Rohan Shah", dp: "https://i.pravatar.cc/100?img=3", lastMsg: "Sent the files ✅" },
];

// Small reusable style for the gradient the whole theme is built around
const GRADIENT = "bg-gradient-to-tr from-[#6c2bd9] via-[#e1306c] to-[#ffe500]";

// Options shown inside the "Create" bottom sheet
const createOptions = [
  { label: "Post", desc: "Share a photo or video", icon: Image, path: "/create-post" },
  { label: "Reel", desc: "Record a short video", icon: Film, path: "/create-reel" },
  { label: "Story", desc: "Share a 24 hour moment", icon: Camera, path: "/create-story" },
];



const Home = () => {
  const { userData } = useSelector((state) => state.user); // logged-in user ka data
  const navigate = useNavigate();
  const unreadChats = dummyChats.length; // replace with real unread count later
  const [showCreateMenu, setShowCreateMenu] = useState(false); // Post/Reel/Story sheet

  const dispatch = useDispatch()

  // Logout — session clear karke login page pe bhej dena
  const handleLogout = async () => {
    try {
      const res = await axios.get(`${ServerURl}/api/logout-user`, { withCredentials: true });
      dispatch(setUserData(null))
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };



  const [feedPosts, setFeedPosts] = useState([])


  useEffect(() => {
    fetchAllPosts()


  }, [])

  const fetchAllPosts = async () => {
    try {
      const res = await axios.get(`${ServerURl}/api/get-all-post`, { withCredentials: true })
      if (res.status === 200) {
        setFeedPosts(res.data.posts)
      }

    } catch (error) {
      console.error("Fetch all posts error", error)

    }


  }



  const handleClick = async(id)=>{
    try {
      const res = await axios.get(`${ServerURl}/api/like/${id}` , {withCredentials:true})
      // fetchAllPosts()
      const post = res.data.post
      const updatePost = feedPosts.map((p)=>p._id==post._id?post:p)
      setFeedPosts(updatePost)

      console.log("this is res",res)

    } catch (error) {
      console.error("handle like error",error)

    }

  }


  console.log(feedPosts)

  return (
    <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb]">
      {/* ---------- Mobile top bar (visible only below lg) ---------- */}
      <div className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 bg-[#120f1a]/95 backdrop-blur z-20">
        {/* Camera icon — Snapchat-style quick capture */}
        <Link to="/camera" className="p-1.5 rounded-full hover:bg-white/5">
          <Camera size={22} />
        </Link>

        <span className={`font-bold text-lg ${GRADIENT} bg-clip-text text-transparent`}>
          SnapGram
        </span>

        <div className="flex items-center gap-3">
          {/* Messages icon with unread badge */}
          <Link to="/messages" className="relative p-1.5 rounded-full hover:bg-white/5">
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
              <p className="font-semibold text-sm">{userData?.username || "You"}</p>
              <Link to="/profile" className="text-xs text-[#9c93b8] hover:text-[#ffe500]">
                View profile
              </Link>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1">
            <Link to="/home" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 text-sm font-medium">
              <HomeIcon size={18} /> Home
            </Link>
            <button
              onClick={() => setShowCreateMenu(true)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm text-left"
            >
              <Plus size={18} /> Create
            </button>
            <Link to="/reels" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm">
              <Film size={18} /> Reels
            </Link>
            <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm">
              <img src={userData?.dp} alt="" className="w-[18px] h-[18px] rounded-full object-cover" />
              Profile
            </Link>
            <Link to="/edit-profile" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm">
              <Settings size={18} /> Edit Profile
            </Link>
            <Link to="/saved" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm">
              <Bookmark size={18} /> Saved
            </Link>
            <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-sm">
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
            <p className="text-xs uppercase tracking-wide text-[#6f6789] mb-2">Friends</p>
            <div className="flex flex-col gap-3">
              {dummyFriends.map((friend) => (
                <div key={friend.id} className="flex items-center gap-3 hover:bg-white/5 p-1.5 rounded-lg cursor-pointer">
                  <img src={friend.dp} alt={friend.name} className="w-9 h-9 rounded-full object-cover" />
                  <p className="text-sm">{friend.name}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ===== SECTION 2: Stories + Reels + Post feed (middle, always visible) ===== */}
        <main className="flex flex-col gap-6 px-4 lg:px-0 py-4">
          {/* Stories row */}
          <div className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none]">
            {/* Add your own story */}
            <Link to="/camera" className="flex flex-col items-center gap-1 shrink-0">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#9c93b8] flex items-center justify-center hover:border-[#ffe500] transition-colors">
                <Plus size={22} className="text-[#9c93b8]" />
              </div>
              <span className="text-xs text-[#9c93b8]">Your story</span>
            </Link>

            {dummyStories.map((story) => (
              <div key={story.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
                <div className={`w-16 h-16 rounded-full p-[2px] ${GRADIENT} hover:scale-105 transition-transform`}>
                  <img src={story.dp} alt={story.name} className="w-full h-full rounded-full object-cover border-2 border-[#120f1a]" />
                </div>
                <span className="text-xs text-[#9c93b8]">{story.name}</span>
              </div>
            ))}
          </div>

          {/* Reels row */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm flex items-center gap-1.5">
                <Film size={16} /> Reels
              </p>
              <Link to="/reels" className="text-xs text-[#9c93b8] hover:text-[#ffe500]">
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
                  <Play size={26} className="absolute top-2 right-2 text-white/90 fill-white/90" />
                  <p className="absolute bottom-2 left-2 text-xs font-medium flex items-center gap-1">
                    <Play size={11} className="fill-white" /> {reel.views}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Post feed */}
          <div className="flex flex-col gap-5">
            {feedPosts.length == 0 ? <div className="h-full w-full text-2xl font-bold flex items-center justify-center my-10">Posts not found..</div> : feedPosts.map((post, idx) =>
              {
                const alreadyLike = post?.likes.some((userId)=>userId==userData?._id)
                return(
                  <div
                  key={idx}
                  className="bg-[#1c1728] border border-white/10 rounded-2xl overflow-hidden shadow-lg shadow-black/20"
                >
                  {/* Post header */}
                  <div className="flex items-center gap-3 p-3">
                    <div className={`p-[2px] rounded-full ${GRADIENT}`}>
                      <img src={post?.author?.dp} alt={post?.author?.username} className="w-9 h-9 rounded-full object-cover border-2 border-[#1c1728]" />
                    </div>
                    <p className="text-sm font-semibold">{post?.caption}</p>
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
                  <div className="cursor-pointer" onClick={()=>handleClick(post?._id)} >
                  {
                      alreadyLike? <Heart size={22} className="cursor-pointer hover:text-[#e1306c]  hover:scale-110 transition-transform " stroke="red"   fill="red"/>:<Heart size={22} className="cursor-pointer hover:text-[#e1306c] hover:scale-110 transition-transform" />
                    }
                  </div>

                    <MessageCircle size={22} className="cursor-pointer hover:text-[#ffe500] hover:scale-110 transition-transform" />
                    <Send size={22} className="cursor-pointer hover:text-[#6c2bd9] hover:scale-110 transition-transform" />
                  </div>

                  {/* Likes + caption */}
                  <div className="px-3 pb-3">
                    <p className="text-sm font-semibold">{post.likes.length} likes</p>
                    <p className="text-sm text-[#9c93b8]">
                      <span className="text-[#f7f5fb] font-semibold mr-1">{post.name}</span>
                      {post.caption}
                    </p>
                  </div>
                </div>
                )

              }

            )}
          </div>
        </main>

        {/* ===== SECTION 3: Search + Chat (right, hidden on mobile) ===== */}
        <aside className="hidden lg:flex flex-col gap-5 sticky top-4 h-fit">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-[#1c1728] border border-white/10 rounded-xl px-3 py-2">
            <Search size={16} className="text-[#6f6789]" />
            <input
              type="text"
              placeholder="Search people..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-[#6f6789]"
            />
          </div>

          {/* Chat list */}
          <div>
            <p className="text-xs uppercase tracking-wide text-[#6f6789] mb-2">Messages</p>
            <div className="flex flex-col gap-3">
              {dummyChats.map((chat) => (
                <div key={chat.id} className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-xl">
                  <img src={chat.dp} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{chat.name}</p>
                    <p className="text-xs text-[#9c93b8] truncate">{chat.lastMsg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
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
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${showCreateMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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
          <button onClick={() => setShowCreateMenu(false)} className="p-1 rounded-full hover:bg-white/5">
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
              <div className={`w-11 h-11 shrink-0 rounded-full ${GRADIENT} flex items-center justify-center`}>
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
