import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserApi, signupUserApi } from "../utils/axiosApi/authApi";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

export const loginUser = createAsyncThunk("auth/login", async (data) => {
  return await loginUserApi(data);

  
});

export const signupUser = createAsyncThunk("auth/signup", async (data) => {
  return await signupUserApi(data);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.clear();
    },
    loadFromStorage: (state) => {
      state.user = JSON.parse(localStorage.getItem("user"));
      state.accessToken = localStorage.getItem("accessToken");
      state.refreshToken = localStorage.getItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload;
        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload;
        state.user = user;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      });
  },
});

export const { logout, loadFromStorage } = authSlice.actions;
export default authSlice.reducer;
