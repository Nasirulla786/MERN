
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import {
    ArrowLeft,
    MessageCircle
} from "lucide-react";
import { ServerURl } from "../App";

const FriendList = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // -----------------------------------------
    // Fetch only users with whom chat exists
    // -----------------------------------------

    const fetchChatUsers = async () => {
        try {

            const res = await axios.get(
                `${ServerURl}/api/chat-users`,
                {
                    withCredentials: true
                }
            );

            setUsers(res.data.users || []);

        } catch (error) {

            console.error(
                "Fetch chat users error:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    // -----------------------------------------
    // Fetch chats when page opens
    // -----------------------------------------

    useEffect(() => {

        fetchChatUsers();

    }, []);


    // -----------------------------------------
    // Format message time
    // -----------------------------------------

    const formatTime = (date) => {

        if (!date) {
            return "";
        }

        const messageDate = new Date(date);
        const now = new Date();

        // Today
        if (
            messageDate.toDateString() ===
            now.toDateString()
        ) {

            return messageDate.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
        }

        // Yesterday
        const yesterday = new Date();
        yesterday.setDate(
            yesterday.getDate() - 1
        );

        if (
            messageDate.toDateString() ===
            yesterday.toDateString()
        ) {

            return "Yesterday";
        }

        // Older messages
        return messageDate.toLocaleDateString(
            [],
            {
                day: "2-digit",
                month: "short"
            }
        );
    };


    // -----------------------------------------
    // UI
    // -----------------------------------------

    return (

        <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb]">

            {/* ================================
                HEADER
            ================================= */}

            <div
                className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    border-b
                    border-white/10
                    sticky
                    top-0
                    bg-[#120f1a]/95
                    backdrop-blur
                    z-10
                "
            >

                {/* Back button */}

                <Link
                    to="/"
                    className="
                        p-1.5
                        rounded-full
                        hover:bg-white/5
                        transition
                    "
                >
                    <ArrowLeft size={20} />
                </Link>


                {/* Title */}

                <p className="font-semibold text-base">
                    Messages
                </p>

            </div>


            {/* ================================
                LOADING
            ================================= */}

            {loading && (

                <div className="flex justify-center mt-10">

                    <p className="text-sm text-[#9c93b8]">
                        Loading...
                    </p>

                </div>

            )}


            {/* ================================
                NO CHAT
            ================================= */}

            {!loading && users.length === 0 && (

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        mt-24
                        text-center
                        px-5
                    "
                >

                    {/* Icon */}

                    <div
                        className="
                            w-16
                            h-16
                            rounded-full
                            bg-white/5
                            flex
                            items-center
                            justify-center
                            mb-4
                        "
                    >

                        <MessageCircle
                            size={28}
                            className="text-white/30"
                        />

                    </div>


                    {/* Heading */}

                    <p className="font-medium">
                        No conversations yet
                    </p>


                    {/* Description */}

                    <p className="text-sm text-[#9c93b8] mt-1">
                        Start chatting with someone
                    </p>

                </div>

            )}


            {/* ================================
                CHAT LIST
            ================================= */}

            {!loading && users.length > 0 && (

                <div className="flex flex-col">

                    {users.map((user) => (

                        <Link
                            key={user._id}
                            to={`/chat-page/${user?._id}`}
                            className="
                                flex
                                items-center
                                gap-3
                                px-4
                                py-3
                                border-b
                                border-white/5
                                hover:bg-white/5
                                transition
                            "
                        >

                            {/* =====================
                                PROFILE IMAGE
                            ====================== */}

                            <img
                                src={
                                    user.dp ||
                                    "https://i.pravatar.cc/100"
                                }
                                alt={user.username}
                                className="
                                    w-12
                                    h-12
                                    rounded-full
                                    object-cover
                                    shrink-0
                                "
                            />


                            {/* =====================
                                USER INFORMATION
                            ====================== */}

                            <div className="flex-1 min-w-0">

                                {/* Username + Time */}

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            truncate
                                        "
                                    >
                                        {user.username}
                                    </p>


                                    {/* Last message time */}

                                    <span
                                        className="
                                            text-[11px]
                                            text-[#6f687e]
                                            shrink-0
                                        "
                                    >
                                        {formatTime(
                                            user.lastMessage?.createdAt
                                        )}
                                    </span>

                                </div>


                                {/* =====================
                                    LAST MESSAGE
                                ====================== */}

                                <p
                                    className="
                                        text-xs
                                        text-[#9c93b8]
                                        truncate
                                        mt-1
                                    "
                                >

                                    {user.lastMessage?.message ||
                                        "Start a conversation"}

                                </p>

                            </div>

                        </Link>

                    ))}

                </div>

            )}

        </div>
    );
};

export default FriendList;
