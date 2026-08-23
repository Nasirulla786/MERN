import React, { useEffect, useState } from "react";

import axios from "axios";

import { ServerURl } from "../App";

import { useDispatch, useSelector } from "react-redux";

import { setUserData } from "../redux/slices/userSlice";

const SuggestedFollowers = () => {

    const [users, setUsers] = useState([]);

    const { userData } = useSelector((state) => state.user);

    const dispatch = useDispatch();


    const fetchSuggestedUsers = async () => {

        try {

            const result = await axios.get(
                `${ServerURl}/api/all-users`,
                {
                    withCredentials: true
                }
            );

            const allUsers = result.data.users;


            const suggested = allUsers.filter((user) => {

                const alreadyFollow = userData?.following?.some(
                    (id) => id.toString() === user._id.toString()
                );

                return !alreadyFollow;

            });


            setUsers(suggested);

        } catch (error) {

            console.error(
                "Fetch suggested users error:",
                error
            );

        }
    };


    useEffect(() => {

        if (userData?._id) {
            fetchSuggestedUsers();
        }

    }, [userData?._id]);


    const handleFollow = async (userId) => {

        try {

            const result = await axios.get(
                `${ServerURl}/api/follow/${userId}`,
                {
                    withCredentials: true
                }
            );


            console.log(
                "FOLLOW RESPONSE:",
                result.data
            );


            const updatedCurrentUser = result?.data?.user;


            // Redux current user update
            dispatch(
                setUserData(updatedCurrentUser)
            );


            setUsers((prev) =>
                prev.filter(
                    (user) => user._id !== userId
                )
            );


        } catch (error) {

            console.log(
                "Follow error:",
                error
            );

        }
    };


    return (

        <div>

            <p className="text-xs uppercase tracking-wide text-[#6f6789] mb-2">
                Suggested for you
            </p>


            <div className="flex flex-col gap-3">

                {users.map((user) => {

                    return (

                        <div
                            key={user._id}
                            className="flex items-center gap-3 hover:bg-white/5 p-1.5 rounded-lg"
                        >

                            {/* DP */}

                            <img
                                src={user.dp}
                                alt={user.username}
                                className="w-9 h-9 rounded-full object-cover"
                            />


                            {/* Username */}

                            <p className="text-sm flex-1 truncate">
                                {user.username}
                            </p>


                            {/* Follow Button */}

                            <button
                                onClick={() =>
                                    handleFollow(user._id)
                                }
                                className="text-sm font-semibold text-blue-400 hover:text-blue-300"
                            >
                                Follow
                            </button>

                        </div>

                    );

                })}


                {users.length === 0 && (

                    <p className="text-xs text-[#6f6789]">
                        No suggestions
                    </p>

                )}

            </div>

        </div>

    );
};

export default SuggestedFollowers;
