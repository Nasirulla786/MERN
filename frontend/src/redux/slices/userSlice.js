import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading:true,
    // following:null
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.loading = false
    },
    clearUserData: (state) => {
      state.userData = null;
      state.loading = false;
  },
  // setFollowing :(state,action)=>{
  //   state.following = action.payload
  // },
  // toggleFollow :(state,action)=>{

  // }
  },
});


export const {setUserData ,clearUserData} = userSlice.actions
export default userSlice.reducer
