import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, ImagePlus, X, Type } from "lucide-react";
import { ServerURl } from "../App";

const GRADIENT = "bg-gradient-to-tr from-[#6c2bd9] via-[#e1306c] to-[#ffe500]";

const UploadStory = () => {
  const [previewImage, setPreviewImage] = useState(""); // dikhane ke liye
  const [selectedFile, setSelectedFile] = useState(null); // backend ko bhejne ke liye
  const [caption, setCaption] = useState(""); // optional text overlay
  const [showCaptionInput, setShowCaptionInput] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Gallery se photo/video select hote hi turant preview dikhana
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const removeMedia = () => {
    setSelectedFile(null);
    setPreviewImage("");
    setCaption("");
    setShowCaptionInput(false);
  };

  const handleShare = async () => {
    if (!selectedFile) {
      toast.error("Please select a photo first");
      return;
    }

    try {
      setUploading(true);

      // File upload ke liye FormData zaroori hai
      const formData = new FormData();
      formData.append("media", selectedFile);


      const res = await axios.post(`${ServerURl}/api/upload-story`, formData, {
        withCredentials: true,
      });


      if(res.status==201){
        toast.success(res.data.message || "Story shared");
        navigate("/");


      }
      else{
        toast.success("Something went wrong");
      }


    } catch (error) {
      console.error("Upload Story Error", error);
      toast.error(error?.response?.data?.message || "Failed to share story");
    } finally {
      setUploading(false);
    }
  };

  // ---------- Step 1: Nothing selected yet — show picker screen ----------
  if (!previewImage) {
    return (
      <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb] flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Link to="/home" className="p-1.5 rounded-full hover:bg-white/5">
            <ArrowLeft size={20} />
          </Link>
          <p className="font-semibold text-base">Add to Story</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <button
            onClick={() => fileInputRef.current.click()}
            className={`w-24 h-24 rounded-full ${GRADIENT} flex items-center justify-center shadow-lg shadow-black/40`}
          >
            <ImagePlus size={32} className="text-[#17101c]" />
          </button>
          <p className="text-sm text-[#9c93b8]">Choose a photo from your gallery</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          hidden
        />
      </div>
    );
  }

  // ---------- Step 2: Media selected — full-screen preview ----------
  return (
    <div className="fixed  inset-0 z-50 bg-black flex flex-col">
      {/* Preview fills the whole screen, like a real story */}
      <img src={previewImage} alt="story preview" className="absolute inset-0 w-full h-full object-cover" />

      {/* Darken top/bottom so icons and text stay readable over any photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />

      {/* Top controls */}
      <div className="relative flex items-center justify-between px-4 py-4">
        <button onClick={removeMedia} className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center">
          <X size={20} />
        </button>
        <button
          onClick={() => setShowCaptionInput((v) => !v)}
          className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center"
        >
          <Type size={18} />
        </button>
      </div>

      {/* Caption typed onto the story image */}
      {(showCaptionInput || caption) && (
        <div className="relative flex-1 flex items-center justify-center px-6">
          <input
            autoFocus={showCaptionInput}
            type="text"
            placeholder="Type something..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={80}
            className="w-full bg-transparent text-center text-xl font-semibold text-white placeholder:text-white/50 outline-none"
          />
        </div>
      )}

      {!showCaptionInput && !caption && <div className="relative flex-1" />}

      {/* Bottom action */}
      <div className="relative px-4 pb-6 pt-3">
        <button
          onClick={handleShare}
          disabled={uploading}
          className={`w-full py-3 rounded-full font-bold text-[#17101c] ${GRADIENT} disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform`}
        >
          {uploading ? "Sharing..." : "Share to Story"}
        </button>
      </div>
    </div>
  );
};

export default UploadStory;
