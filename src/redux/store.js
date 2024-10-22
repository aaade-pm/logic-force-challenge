import { configureStore } from "@reduxjs/toolkit";
import { postsApi } from "../redux/services/PostApi";
import { usersApi } from "../redux/services/UserApi";

export const store = configureStore({
  reducer: {
    [postsApi.reducerPath]: postsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware, usersApi.middleware),
});
