import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    ArrowLeft,
    MoreVertical,
    Phone,
    Video
} from "lucide-react";

import { ServerURl } from "../App";
import { useSelector } from "react-redux";

const ChatPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [storeMessages, setStoreMessages] = useState([]);

    const {userData} = useSelector((state) => state.user);

    const fetchFriendProfile = async () => {
        try {

            const res = await axios.get(
                `${ServerURl}/api/friend-profile/${id}`,
                {
                    withCredentials: true
                }
            );

            setUser(res.data.user);

        } catch (error) {

            console.error(
                "fetch friend profile error",
                error
            );

        }
    };

    useEffect(() => {

        fetchFriendProfile();

    }, [id]);



    const handleSendMessage = async () => {

        if (!message.trim()) {
            return;
        }

        try {

            const res = await axios.post(
                `${ServerURl}/api/message/${id}`,
                {
                    message: message
                },
                {
                    withCredentials: true
                }
            );


            // console.log("Message sent:", res.data.data);
            setStoreMessages((prev)=>[...prev,res.data.data])

            setMessage("");

        } catch (error) {

            console.error(
                "Send message error:",
                error
            );

        }

    };


    useEffect(() => {

        const fetchMessages = async () => {

            try {

                const res = await axios.get(
                    `${ServerURl}/api/messages/${id}`,
                    {
                        withCredentials: true
                    }
                );


                setStoreMessages(res.data.data);

            } catch (error) {

                console.error(
                    "Fetch messages error:",
                    error
                );

            }

        };

        if (id) {
            fetchMessages();
        }

    }, [id]);




    console.log(storeMessages)
    return (

        <div className="min-h-screen bg-[#0f0b17] text-white">

            {/* Chat Navbar */}

            <div className="h-[70px] px-4 flex items-center justify-between border-b border-white/10 bg-[#15111f]">

                {/* Left Side */}

                <div className="flex items-center gap-3">

                    {/* Back Button */}

                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-white/10 transition"
                    >
                        <ArrowLeft size={21} />
                    </button>


                    {/* Friend Profile */}

                    {user && (

                        <div className="flex items-center gap-3">

                            <img
                                src={user.dp}
                                alt={user.username}
                                className="w-11 h-11 rounded-full object-cover"
                            />

                            <div>

                                <p className="font-semibold text-sm">
                                    {user.username}
                                </p>

                                <p className="text-xs text-gray-400">
                                    Offline
                                </p>

                            </div>

                        </div>

                    )}

                </div>


                {/* Right Side Icons */}

                <div className="flex items-center gap-1">

                    <button
                        className="p-2.5 rounded-full hover:bg-white/10 transition"
                    >
                        <Phone size={19} />
                    </button>

                    <button
                        className="p-2.5 rounded-full hover:bg-white/10 transition"
                    >
                        <Video size={20} />
                    </button>

                    <button
                        className="p-2.5 rounded-full hover:bg-white/10 transition"
                    >
                        <MoreVertical size={20} />
                    </button>

                </div>

            </div>


            {/* Chat Area */}

            <div className="h-[calc(100vh-70px)] flex flex-col">


                {/* Messages Area */}

                <div className="flex-1 p-4 overflow-y-auto">

                    {/* Dummy Message */}




                    {
                        storeMessages.map((message,idx)=>{
                            const isMyMessage = message.sender.toString() ===userData?._id.toString()


                            return(
                                <div key={idx}>

                                    {
                                        isMyMessage? <div className="flex justify-end mb-3">

                                        <div className="bg-purple-600 px-4 py-2 rounded-2xl rounded-br-md max-w-[70%]">

                                         {message?.message}

                                        </div>

                                    </div>:

<div className="flex justify-start mb-3">

<div className="bg-purple-600 px-4 py-2 rounded-2xl rounded-br-md max-w-[70%]">

 {message?.message}

</div>

</div>
                                    }




                                </div>
                            )
                        })
                    }




                </div>


                {/* Message Input */}

                <div className="p-3 border-t border-white/10 bg-[#15111f]">

                    <div className="flex items-center gap-2">

                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            className="flex-1 bg-[#24202e] rounded-full px-4 py-3 outline-none text-sm"
                        />

                        <button
                            className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-full text-sm font-medium transition"
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
};

export default ChatPage;
