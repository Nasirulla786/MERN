import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, ImagePlus, X } from "lucide-react";
import { ServerURl } from "../App";

const GRADIENT = "bg-gradient-to-tr from-[#6c2bd9] via-[#e1306c] to-[#ffe500]";

const CreatePostPage = () => {
  const [caption, setCaption] = useState("");
  const [previewImage, setPreviewImage] = useState(""); // dikhane ke liye
  const [selectedFile, setSelectedFile] = useState(null); // backend ko bhejne ke liye
  const [posting, setPosting] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // User jab image select kare — turant preview dikhana
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a photo first");
      return;
    }

    try {
      setPosting(true);

      // File upload ke liye FormData zaroori hai
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", selectedFile);

      const res = await axios.post(`${ServerURl}/api/upload-post`, formData, {
        withCredentials: true,
      });
      if(res.status===201){
        toast.success(res.data.message || "Post created");
        navigate("/")
      }

      else{
        toast.success("Something went wrong")
      }

    } catch (error) {
      console.error("Create Post Error", error);
      toast.error(error?.response?.data?.message || "Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb]">
      {/* Top bar with back button */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 sticky top-0 bg-[#120f1a]/95 backdrop-blur z-10">
        <Link to="/" className="p-1.5 rounded-full hover:bg-white/5">
          <ArrowLeft size={20} />
        </Link>
        <p className="font-semibold text-base">Create Post</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 flex flex-col gap-5">
        {/* Image picker / preview */}
        {previewImage ? (
          <div className="relative rounded-2xl overflow-hidden border border-white/10">
            <img src={previewImage} alt="preview" className="w-full max-h-[420px] object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex flex-col items-center justify-center gap-2 h-64 rounded-2xl border-2 border-dashed border-white/15 hover:border-[#ffe500] transition-colors text-[#9c93b8]"
          >
            <div className={`w-14 h-14 rounded-full cursor-pointer ${GRADIENT} flex items-center justify-center`}>
              <ImagePlus size={24} className="text-[#17101c]" />
            </div>
            <p className="text-sm font-medium">Tap to select a photo</p>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />

        {/* Caption */}
        <div>
          <label htmlFor="caption" className="block text-xs uppercase tracking-wide text-[#6f6789] mb-2">
            Caption
          </label>
          <textarea
            id="caption"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={2200}
            rows={4}
            className="w-full bg-[#1c1728] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-transparent focus:shadow-[0_0_0_4px_rgba(225,48,108,0.12)] placeholder:text-[#6f6789] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={posting}
          className={`w-full py-3 rounded-xl font-bold text-[#17101c] cursor-pointer ${GRADIENT} disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform`}
        >
          {posting ? "Posting..." : "Share Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
