import { configureStore } from "@reduxjs/toolkit";
import achievementsReducer from "./achievementsSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    achievements: achievementsReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

