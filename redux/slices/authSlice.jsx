import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState:{
    user: null,     
    role: null,     
    initialized: false, 
  },
  reducers:{
    setUser: (state, action)=>{
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.initialized = true;
    },
    clearUser: (state)=>{
      state.user = null;
      state.role = null;
      state.initialized = true;
    },
  },
});

export const {setUser,clearUser}= authSlice.actions;
export default authSlice.reducer;