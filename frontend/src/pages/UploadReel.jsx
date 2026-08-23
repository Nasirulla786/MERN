import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Film, X } from "lucide-react";
import { ServerURl } from "../App";

const GRADIENT = "bg-gradient-to-tr from-[#6c2bd9] via-[#e1306c] to-[#ffe500]";

const UploadReel = () => {
  const [previewUrl, setPreviewUrl] = useState(""); // dikhane ke liye
  const [selectedFile, setSelectedFile] = useState(null); // backend ko bhejne ke liye
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Video select hote hi turant preview dikhana
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeVideo = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleShare = async () => {
    if (!selectedFile) {
      toast.error("Please select a video first");
      return;
    }

    try {
      setUploading(true);

      // Backend multer field ka naam "media" hai — waisa hi bhejna zaroori hai
      const formData = new FormData();
      formData.append("media", selectedFile);
      formData.append("caption", caption);

      const res = await axios.post(`${ServerURl}/api/upload-loop`, formData, {
        withCredentials: true,
      });
      console.log("thos is ",res)

      toast.success("Reel uploaded");
      navigate("/");
    } catch (error) {
      console.error("Upload Reel Error", error);
      toast.error(error?.response?.data?.message || "Failed to upload reel");
    } finally {
      setUploading(false);
    }
  };

  // ---------- Step 1: No video selected — picker screen ----------
  if (!previewUrl) {
    return (
      <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb] flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Link to="/" className="p-1.5 rounded-full hover:bg-white/5">
            <ArrowLeft size={20} />
          </Link>
          <p className="font-semibold text-base">Create Reel</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <button
            onClick={() => fileInputRef.current.click()}
            className={`w-24 h-24 rounded-full ${GRADIENT} flex items-center justify-center shadow-lg shadow-black/40`}
          >
            <Film size={32} className="text-[#17101c]" />
          </button>
          <p className="text-sm text-[#9c93b8]">Choose a video from your gallery</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          hidden
        />
      </div>
    );
  }

  // ---------- Step 2: Video selected — full-screen preview ----------
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Video fills the whole screen, like a real reel */}
      <video
        src={previewUrl}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Darken top/bottom so icons and text stay readable over any video */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      {/* Top controls */}
      <div className="relative flex items-center justify-between px-4 py-4">
        <Link to="/" className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center">
          <ArrowLeft size={20} />
        </Link>
        <button onClick={removeVideo} className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center">
          <X size={20} />
        </button>
      </div>

      <div className="relative flex-1" />

      {/* Caption + share, pinned to the bottom */}
      <div className="relative px-4 pb-6 pt-3 flex flex-col gap-3">
        <input
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={200}
          className="w-full bg-white/10 border border-white/15 rounded-full px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/50 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(225,48,108,0.3)]"
        />

        <button
          onClick={handleShare}
          disabled={uploading}
          className={`w-full py-3 rounded-full font-bold text-[#17101c] ${GRADIENT} disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform`}
        >
          {uploading ? "Uploading..." : "Share Reel"}
        </button>
      </div>
    </div>
  );
};

export default UploadReel;
