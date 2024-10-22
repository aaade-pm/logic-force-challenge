// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { postsApi } from "../redux/services/PostApi.js";

export const store = configureStore({
  reducer: {
    [postsApi.reducerPath]: postsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware),
});
