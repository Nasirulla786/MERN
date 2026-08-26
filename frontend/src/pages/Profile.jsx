
import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router";

import { useSelector } from "react-redux";

import axios from "axios";

import toast from "react-hot-toast";
import def from "../../public/default.png"

import {
    Grid3x3,
    Film,
    Bookmark,
    Play,
    ImageIcon,
    ArrowLeft,
    Menu,
    LogOut,
} from "lucide-react";

import { ServerURl } from "../App";

const GRADIENT =
    "bg-gradient-to-tr from-[#6c2bd9] via-[#e1306c] to-[#ffe500]";

const tabs = [
    { key: "posts", label: "Posts", icon: Grid3x3 },
    { key: "reels", label: "Reels", icon: Film },
    { key: "saved", label: "Saved", icon: Bookmark },
];

const Profile = () => {

    const { userData } = useSelector((state) => state.user);

    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("posts");

    const [posts, setPosts] = useState([]);

    const [reels, setReels] = useState([]);

    const [loadingPosts, setLoadingPosts] = useState(true);

    const [loadingReels, setLoadingReels] = useState(true);

    const [showMenu, setShowMenu] = useState(false);


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = async () => {
        try {

            await axios.get(
                `${ServerURl}/api/logout`,
                {
                    withCredentials: true,
                }
            );

            toast.success("Logged out successfully");

            navigate("/login");

        } catch (error) {

            console.error("Logout error:", error);

            toast.error("Logout failed");

        }
    };


    // =========================
    // FETCH ALL POSTS
    // =========================

    const fetchPosts = async () => {

        try {

            setLoadingPosts(true);

            const result = await axios.get(
                `${ServerURl}/api/my-posts`,
                {
                    withCredentials: true,
                }
            );

            const allPosts = result.data;

            const myPosts = allPosts.filter(
                (post) =>
                    post.author?._id?.toString() ===
                    userData?._id?.toString()
            );

            setPosts(myPosts);

        } catch (error) {

            console.error("Fetch posts error:", error);

            toast.error("Could not load posts");

        } finally {

            setLoadingPosts(false);

        }
    };


    // =========================
    // FETCH ALL REELS
    // =========================

    const fetchReels = async () => {

        try {

            setLoadingReels(true);

            const result = await axios.get(
                `${ServerURl}/api/get-loops`,
                {
                    withCredentials: true,
                }
            );

            const allReels = result.data;

            const myReels = allReels?.filter(
                (reel) =>
                    reel.author?._id?.toString() ===
                    userData?._id?.toString()
            );

            setReels(myReels);

        } catch (error) {

            console.error("Fetch reels error:", error);

            toast.error("Could not load reels");

        } finally {

            setLoadingReels(false);

        }
    };


    // =========================
    // FETCH DATA
    // =========================

    useEffect(() => {

        if (!userData?._id) return;

        fetchPosts();

        fetchReels();

    }, [userData?._id]);


    // =========================
    // ACTIVE TAB DATA
    // =========================

    let activeItems = [];

    if (activeTab === "posts") {

        activeItems = posts;

    } else if (activeTab === "reels") {

        activeItems = reels;

    } else if (activeTab === "saved") {

        activeItems = userData?.saved || [];

    }


    // =========================
    // LOADING
    // =========================

    if (!userData) {

        return (
            <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb] flex items-center justify-center">

                <p className="text-sm text-[#9c93b8]">
                    Loading profile...
                </p>

            </div>
        );
    }


    return (

        <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb]">

            {/* ================= TOP BAR ================= */}

            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 bg-[#120f1a]/95 backdrop-blur z-10">

                <Link to={"/"}>
                    <ArrowLeft />
                </Link>


                <p className="font-semibold text-base">
                    {userData.username}
                </p>


                {/* ================= MOBILE MENU ================= */}

                <div className="relative md:hidden">

                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 rounded-full hover:bg-white/10 transition"
                    >
                        <Menu size={22} />
                    </button>


                    {showMenu && (

                        <div className="absolute right-0 top-11 w-40 bg-[#1c1728] border border-white/10 rounded-xl shadow-xl overflow-hidden">

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition"
                            >
                                <LogOut size={18} />

                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </div>


            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* ================= PROFILE HEADER ================= */}

                <div className="flex gap-6 md:gap-16 items-center">

                    {/* DP */}

                    <div className="shrink-0">

                        <div
                            className={`w-24 h-24 md:w-36 md:h-36 rounded-full p-[3px] ${GRADIENT}`}
                        >

                            <img
                                src={userData.dp || def}
                                alt={`${userData.username}'s avatar`}
                                className="w-full h-full rounded-full object-cover border-4 border-[#120f1a]"
                            />

                        </div>

                    </div>


                    {/* USER INFO */}

                    <div className="flex-1 min-w-0">

                        <div className="flex flex-wrap items-center gap-4">

                            <h1 className="text-xl md:text-2xl font-semibold">
                                {userData.username}
                            </h1>


                            <button
                                onClick={() => navigate("/edit-profile")}
                                className="px-5 py-2 rounded-xl font-semibold text-sm border border-white/15 hover:bg-white/5 transition cursor-pointer"
                            >
                                Edit Profile
                            </button>

                        </div>


                        {/* ================= STATS ================= */}

                        <div className="flex gap-6 md:gap-10 mt-5">

                            <div className="text-sm">

                                <span className="font-semibold">
                                    {posts.length}
                                </span>{" "}

                                <span className="text-[#9c93b8]">
                                    posts
                                </span>

                            </div>


                            <Link
                                to="/followers"
                                className="text-sm hover:text-[#ffe500]"
                            >

                                <span className="font-semibold">
                                    {userData.followers?.length || 0}
                                </span>{" "}

                                <span className="text-[#9c93b8]">
                                    followers
                                </span>

                            </Link>


                            <Link
                                to="/following"
                                className="text-sm hover:text-[#ffe500]"
                            >

                                <span className="font-semibold">
                                    {userData.following?.length || 0}
                                </span>{" "}

                                <span className="text-[#9c93b8]">
                                    following
                                </span>

                            </Link>

                        </div>


                        {/* ================= BIO ================= */}

                        <div className="mt-5">

                            <p className="font-semibold text-sm">
                                {userData.username}
                            </p>

                            <p className="text-[#9c93b8] text-sm mt-1">
                                {userData.bio || "No bio added yet."}
                            </p>

                        </div>

                    </div>

                </div>


                {/* ================= TABS ================= */}

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

                            <Icon size={16} />

                            {label.toUpperCase()}

                        </button>

                    ))}

                </div>


                {/* ================= CONTENT ================= */}

                <div className="mt-6">

                    {/* POSTS LOADING */}

                    {activeTab === "posts" && loadingPosts ? (

                        <div className="flex justify-center py-16 text-[#6f6789]">
                            Loading posts...
                        </div>

                    ) : null}


                    {/* REELS LOADING */}

                    {activeTab === "reels" && loadingReels ? (

                        <div className="flex justify-center py-16 text-[#6f6789]">
                            Loading reels...
                        </div>

                    ) : null}


                    {/* EMPTY */}

                    {(
                        (activeTab === "posts" && !loadingPosts) ||
                        (activeTab === "reels" && !loadingReels) ||
                        activeTab === "saved"
                    ) &&
                    activeItems.length === 0 ? (

                        <div className="flex flex-col items-center gap-2 py-16 text-[#6f6789]">

                            {activeTab === "reels" ? (

                                <Film size={32} />

                            ) : activeTab === "posts" ? (

                                <ImageIcon size={32} />

                            ) : (

                                <Bookmark size={32} />

                            )}

                            <p className="text-sm">
                                No {activeTab} yet
                            </p>

                        </div>

                    ) : null}


                    {/* ================= GRID ================= */}

                    {activeItems.length > 0 && (

                        <div className="grid grid-cols-3 gap-1 md:gap-3">

                            {activeItems.map((item, idx) => (

                                <div
                                    key={item?._id || idx}
                                    className="relative aspect-square bg-[#1c1728] rounded-md overflow-hidden group cursor-pointer"
                                >

                                    {/* REEL */}

                                    {activeTab === "reels" ? (

                                        <video
                                            src={item?.media}
                                            className="w-full h-full object-cover"
                                            muted
                                            preload="metadata"
                                        />

                                    ) : (

                                        /* POST */

                                        <img
                                            src={
                                                item?.image ||
                                                item?.media ||
                                                item?.thumbnail
                                            }
                                            alt="post"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />

                                    )}


                                    {/* REEL ICON */}

                                    {activeTab === "reels" && (

                                        <Play
                                            size={18}
                                            className="absolute top-2 right-2 text-white/90 fill-white/90"
                                        />

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
