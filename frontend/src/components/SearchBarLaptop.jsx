import axios from "axios";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { ServerURl } from "../App";
import { Link } from "react-router-dom";

const SearchBarLaptop = () => {

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
                    withCredentials: true
                }
            );


            setSuggestedUsers(res.data.users);

        } catch (error) {

            console.error("handle search error", error);

        }
    };

    return (

        <aside className="hidden lg:flex flex-col gap-5 sticky top-4 h-fit">

            {/* Search bar */}

            <div className="flex items-center gap-2 bg-[#1c1728] border border-white/10 rounded-xl px-3 py-2">

                <Search
                    size={16}
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


            {/* Search Results */}


            {
                suggestedUsers.length==0 && <div className="flex items-center justify-center w-full h-full text-gray-500 mt-5">
                    Search Your Profile
                </div>
            }

            {suggestedUsers.length > 0 && (

                <div>

                    <p className="text-xs uppercase tracking-wide text-[#6f6789] mb-2">
                        Search Results
                    </p>

                    <div className="flex flex-col gap-2">

                        {suggestedUsers.map((user) => (

                            <Link to={"friend-profile-page/"+user?._id}
                                key={user._id}
                                className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-xl"
                            >

                                <img
                                    src={user.dp}
                                    alt={user.username}
                                    className="w-10 h-10 rounded-full object-cover"
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

        </aside>
    );
};

export default SearchBarLaptop;
