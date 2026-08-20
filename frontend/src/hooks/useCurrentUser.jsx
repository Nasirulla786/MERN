import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { ServerURl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/slices/userSlice";

const useCurrentUser = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get(`${ServerURl}/api/current-user`, {
                    withCredentials: true,
                });
                dispatch(setUserData(res.data.user));
            } catch (error) {
                console.error("Current user error", error);

                dispatch(setUserData(null));
            }
        };
        fetchCurrentUser();
    }, []);
};

export default useCurrentUser;
