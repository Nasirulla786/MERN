import axios from "axios";
import { ArrowLeft, Search } from "lucide-react";
import React, { useState } from "react";
import { ServerURl } from "../App";
import { Link } from "react-router-dom";

const MobileSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const handleSearch = async (value) => {
    setSearchValue(value);

    if (!value.trim()) {
      setSuggestedUsers([]);
      return;
    }

    try {
      const res = await axios.get(
        `${ServerURl}/api/search?query=${value}`,
        {
          withCredentials: true,
        }
      );

      setSuggestedUsers(res.data.users);
    } catch (error) {
      console.error("handle search error", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#120f1a] text-[#f7f5fb] px-4 py-5">

      {/* Search Bar */}


      <Link to={"/"} className=" ">
      <ArrowLeft />
      </Link>


      <div className="flex items-center gap-2 bg-[#1c1728] border border-white/10 rounded-xl px-3 py-3 mt-4">

        <Search
          size={18}
          className="text-[#6f6789]"
        />

        <input
          type="text"
          placeholder="Search people..."
          className="bg-transparent outline-none text-sm w-full placeholder:text-[#6f6789]"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
        />

      </div>

      {/* Empty Search */}

      {suggestedUsers.length === 0 && (
        <div className="flex items-center justify-center text-gray-500 mt-8">
          Search Your Profile
        </div>
      )}

      {/* Search Results */}

      {suggestedUsers.length > 0 && (
        <div className="mt-6">

          <p className="text-xs uppercase tracking-wide text-[#6f6789] mb-3">
            Search Results
          </p>

          <div className="flex flex-col gap-2">

            {suggestedUsers.map((user) => (

              <Link
                to={`/friend-profile-page/${user?._id}`}
                key={user._id}
                className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-3 rounded-xl"
              >

                <img
                  src={user.dp}
                  alt={user.username}
                  className="w-11 h-11 rounded-full object-cover"
                />

                <div className="min-w-0">

                  <p className="text-sm font-medium">
                    {user.username}
                  </p>

                  <p className="text-xs text-[#9c93b8] truncate">
                    {user.bio}
                  </p>

                </div>

              </Link>

            ))}

          </div>

        </div>
      )}

    </div>
  );
};

export default MobileSearch;
