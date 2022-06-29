import { configureStore } from "@reduxjs/toolkit";
import collapseReducer from "./features/collapse/collapseSlice";
import loadingReducer from "./features/loading/loadingSlice";

export const store = configureStore({
  reducer: {
    collapse: collapseReducer,
    loading: loadingReducer,
  },
});
