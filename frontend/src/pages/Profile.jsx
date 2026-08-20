import axios from "axios";
import React, { useEffect, useState } from "react";
import { ServerURl } from "../App";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Login user ki profile fetch karna
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${ServerURl}/api/current-user`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (error) {
      console.error("Fetch Profile Error", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="glint-profile-root">
        <style>{profileStyles}</style>
        <p className="glint-loading-text">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="glint-profile-root">
      <style>{profileStyles}</style>

      <div className="glint-profile-card">
        <div className="glint-avatar-ring">
          <img
            src={user?.dp || "/default-avatar.png"}
            alt={`${user?.username || "User"}'s avatar`}
            className="glint-avatar-img"
          />
        </div>

        <h2 className="glint-profile-name">{user?.username}</h2>
        <p className="glint-profile-email">{user?.email}</p>

        <p className="glint-profile-bio">
          {user?.bio || "No bio added yet."}
        </p>

        <button
          className="glint-edit-btn"
          onClick={() => navigate("/edit-profile")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

const profileStyles = `
  .glint-profile-root {
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

  .glint-profile-card {
    width: 100%;
    max-width: 380px;
    background: var(--ink-soft);
    border: 1.5px solid var(--panel-line);
    border-radius: 20px;
    padding: 2.5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .glint-avatar-ring {
    width: 104px;
    height: 104px;
    border-radius: 50%;
    padding: 3px;
    background: var(--gradient);
    margin-bottom: 1.1rem;
  }

  .glint-avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--ink-soft);
    display: block;
  }

  .glint-profile-name {
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 1.3rem;
    margin: 0 0 0.15rem;
  }

  .glint-profile-email {
    color: var(--lilac);
    font-size: 0.86rem;
    margin: 0 0 1.1rem;
  }

  .glint-profile-bio {
    font-size: 0.92rem;
    line-height: 1.5;
    color: var(--cloud);
    margin: 0 0 1.6rem;
  }

  .glint-edit-btn {
    width: 100%;
    border: none;
    border-radius: 12px;
    padding: 0.85rem 1rem;
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    color: #17101c;
    background: var(--gradient);
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .glint-edit-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px -12px rgba(225, 48, 108, 0.55);
  }

  .glint-edit-btn:focus-visible {
    outline: 2px solid var(--amber);
    outline-offset: 2px;
  }
`;

export default Profile;
