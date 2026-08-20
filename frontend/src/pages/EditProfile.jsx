import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { ServerURl } from "../App";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const EditProfile = () => {
  const [bio, setBio] = useState("");
  const [previewImage, setPreviewImage] = useState(""); // avatar preview ke liye
  const [selectedFile, setSelectedFile] = useState(null); // backend ko bhejne wali actual file
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Page open hote hi current user ka data la ke fields fill karna
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${ServerURl}/api/current-user`, {
          withCredentials: true,
        });
        setBio(res.data.user?.bio || "");
        setPreviewImage(res.data.user?.dp || "");
      } catch (error) {
        console.error("Fetch Current User Error", error);
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // User jab naya image select kare — turant preview dikhana
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      // File upload ke liye FormData zaroori hai
      const formData = new FormData();
      formData.append("bio", bio);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await axios.post(
        `${ServerURl}/api/edit-profile`,
        formData,
        { withCredentials: true },
      );

      console.log("thisi ",res)

      if (res.status == 200) {
        toast.success(res.data.message);
        navigate("/profile");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Edit Profile Error", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="glint-edit-root">
        <style>{editProfileStyles}</style>
        <p className="glint-loading-text">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="glint-edit-root">
      <style>{editProfileStyles}</style>

      <div className="glint-edit-card">
        <h2>Edit Profile</h2>
        <p className="glint-sub">Update your photo and bio.</p>

        <form onSubmit={handleSubmit}>
          {/* Avatar preview — click karke naya photo choose karo */}
          <div className="glint-avatar-picker">
            <button
              type="button"
              className="glint-avatar-btn"
              onClick={() => fileInputRef.current.click()}
              aria-label="Change profile photo"
            >
              <div className="glint-avatar-ring">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="glint-avatar-img"
                  />
                ) : (
                  <div className="glint-avatar-placeholder">Add photo</div>
                )}
              </div>
              <span className="glint-avatar-edit-badge">Change</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
              name="image"
            />
          </div>

          <div className="glint-field">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Tell people a little about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={150}
              rows={4}
            />
            <span className="glint-char-count">{bio.length}/150</span>
          </div>

          <div className="glint-edit-actions">
            <button
              type="button"
              className="glint-cancel-btn"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
            <button type="submit" className="glint-save-btn" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const editProfileStyles = `
  .glint-edit-root {
    --ink: #120f1a;
    --ink-soft: #1c1728;
    --panel-line: rgba(255,255,255,0.08);
    --violet: #6c2bd9;
    --magenta: #e1306c;
    --amber: #ffe500;
    --cloud: #f7f5fb;
    --lilac: #9c93b8;
    --lilac-dim: #6f6789;
    --gradient: linear-gradient(135deg, var(--violet) 0%, var(--magenta) 55%, var(--amber) 100%);

    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ink);
    font-family: 'Inter', sans-serif;
    color: var(--cloud);
    padding: 2rem 1.25rem;
  }

  .glint-loading-text {
    color: var(--lilac);
    font-size: 0.95rem;
  }

  .glint-edit-card {
    width: 100%;
    max-width: 400px;
    background: var(--ink-soft);
    border: 1.5px solid var(--panel-line);
    border-radius: 20px;
    padding: 2.5rem 2rem;
  }

  .glint-edit-card h2 {
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 1.4rem;
    margin: 0 0 0.3rem;
    text-align: center;
  }

  .glint-edit-card .glint-sub {
    color: var(--lilac);
    font-size: 0.88rem;
    text-align: center;
    margin: 0 0 1.75rem;
  }

  .glint-avatar-picker {
    display: flex;
    justify-content: center;
    margin-bottom: 1.75rem;
  }

  .glint-avatar-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .glint-avatar-ring {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    padding: 3px;
    background: var(--gradient);
    transition: opacity 0.15s ease;
  }

  .glint-avatar-btn:hover .glint-avatar-ring {
    opacity: 0.85;
  }

  .glint-avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--ink-soft);
    display: block;
  }

  .glint-avatar-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--ink);
    border: 3px solid var(--ink-soft);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    color: var(--lilac-dim);
    text-align: center;
    padding: 0 0.5rem;
  }

  .glint-avatar-edit-badge {
    font-size: 0.76rem;
    font-weight: 600;
    color: var(--amber);
  }

  .glint-field {
    margin-bottom: 1.5rem;
  }

  .glint-field label {
    display: block;
    font-size: 0.76rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--lilac-dim);
    margin-bottom: 0.4rem;
  }

  .glint-field textarea {
    width: 100%;
    background: var(--ink);
    border: 1.5px solid var(--panel-line);
    border-radius: 12px;
    color: var(--cloud);
    font-family: 'Inter', sans-serif;
    font-size: 0.92rem;
    padding: 0.8rem 1rem;
    resize: none;
    outline: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
  }

  .glint-field textarea:focus {
    border-color: transparent;
    background:
      linear-gradient(var(--ink), var(--ink)) padding-box,
      var(--gradient) border-box;
    box-shadow: 0 0 0 4px rgba(225, 48, 108, 0.12);
  }

  .glint-char-count {
    display: block;
    text-align: right;
    font-size: 0.72rem;
    color: var(--lilac-dim);
    margin-top: 0.3rem;
  }

  .glint-edit-actions {
    display: flex;
    gap: 0.75rem;
  }

  .glint-cancel-btn,
  .glint-save-btn {
    flex: 1;
    border-radius: 12px;
    padding: 0.85rem 1rem;
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 0.92rem;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  }

  .glint-cancel-btn {
    background: transparent;
    border: 1.5px solid var(--panel-line);
    color: var(--lilac);
  }

  .glint-cancel-btn:hover {
    border-color: var(--lilac-dim);
    color: var(--cloud);
  }

  .glint-save-btn {
    border: none;
    color: #17101c;
    background: var(--gradient);
  }

  .glint-save-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px -12px rgba(225, 48, 108, 0.55);
  }

  .glint-save-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .glint-cancel-btn:focus-visible,
  .glint-save-btn:focus-visible,
  .glint-avatar-btn:focus-visible {
    outline: 2px solid var(--amber);
    outline-offset: 2px;
  }
`;

export default EditProfile;
