import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Features/AuthSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
