import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";

import { ServerURl } from "../App";
import { useSelector } from "react-redux";
import socket from "../socket/socket";
import { useRef } from "react";

const GRADIENT = "bg-gradient-to-tr from-[#6c2bd9] via-[#e1306c] to-[#ffe500]";

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [storeMessages, setStoreMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData?._id) {
      socket.emit("join", userData._id);
    }
  }, []);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setStoreMessages((prev) => [...prev, data]);
    };

    socket.on("receiver-message", handleReceiveMessage);

    return () => {
      socket.off("receiver-message", handleReceiveMessage);
    };
  }, []);

  const fetchFriendProfile = async () => {
    try {
      const res = await axios.get(`${ServerURl}/api/friend-profile/${id}`, {
        withCredentials: true,
      });

      setUser(res.data.user);
    } catch (error) {
      console.error("fetch friend profile error", error);
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
          message: message,
        },
        {
          withCredentials: true,
        },
      );

      // console.log("Message sent:", res.data.data);
      setStoreMessages((prev) => [...prev, res.data.data]);

      // Socket se receiver ko message bhejna
      socket.emit("send-message", {
        senderId: userData._id,
        receiverId: id,
        message: message,
      });

      setMessage("");
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${ServerURl}/api/messages/${id}`, {
          withCredentials: true,
        });

        setStoreMessages(res.data.data);
      } catch (error) {
        console.error("Fetch messages error:", error);
      }
    };

    if (id) {
      fetchMessages();
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [storeMessages]);

  return (
    <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb]">
      {/* Chat Navbar */}

      <div className="h-[70px] px-4 flex items-center justify-between border-b border-white/10 bg-[#1c1728]/95 backdrop-blur sticky top-0 z-10">
        {/* Left Side */}

        <div className="flex items-center gap-3 min-w-0">
          {/* Back Button */}

          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/10 transition shrink-0"
          >
            <ArrowLeft size={21} />
          </button>

          {/* Friend Profile */}

          {user && (
            <div className="flex items-center gap-3 min-w-0">
              <div className={`shrink-0 rounded-full p-[2px] ${GRADIENT}`}>
                <img
                  src={user.dp}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#1c1728]"
                />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{user.username}</p>

                <p className="text-xs text-[#6f6789]">Offline</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Icons */}

        <div className="flex items-center gap-1 shrink-0">
          <button className="p-2.5 rounded-full hover:bg-white/10 transition">
            <Phone size={19} />
          </button>

          <button className="p-2.5 rounded-full hover:bg-white/10 transition">
            <Video size={20} />
          </button>

          <button className="p-2.5 rounded-full hover:bg-white/10 transition">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Chat Area */}

      <div className="h-[calc(100vh-70px)] flex flex-col">
        {/* Messages Area */}

        <div className="flex-1 p-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {storeMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-1">
              <p className="text-sm text-[#9c93b8]">No messages yet</p>
              <p className="text-xs text-[#6f6789]">Say hi to start the conversation</p>
            </div>
          ) : (
            storeMessages.map((message, idx) => {
              const isMyMessage =
                message.sender.toString() === userData?._id.toString();

              return (
                <div key={idx}>
                  {isMyMessage ? (
                    <div className="flex justify-end mb-3">
                      <div
                        className={`${GRADIENT} text-[#17101c] font-medium px-4 py-2.5 rounded-2xl rounded-br-md max-w-[70%] text-sm shadow-md shadow-black/20`}
                      >
                        {message?.message}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start items-end gap-2 mb-3">
                      <img
                        src={user?.dp}
                        alt={user?.username}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                      <div className="bg-[#1c1728] border border-white/10 px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[70%] text-sm">
                        {message?.message}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* 👇 YE REF WALA DIV HAMESHA MESSAGES KE BAAD */}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Message Input */}

        <div className="p-3 border-t border-white/10 bg-[#1c1728]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-[#120f1a] border border-white/10 rounded-full px-4 py-3 outline-none text-sm placeholder:text-[#6f6789] focus:border-transparent focus:shadow-[0_0_0_3px_rgba(225,48,108,0.2)] transition"
            />

            <button
              className={`${GRADIENT} disabled:opacity-40 disabled:cursor-not-allowed px-5 py-3 rounded-full text-sm font-bold text-[#17101c] hover:-translate-y-0.5 transition-transform`}
              onClick={handleSendMessage}
              disabled={!message.trim()}
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
