import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "town",
  storage,
};

const initialState = {
  isCollapsed: false,
};

export const collapseSlice = createSlice({
  name: "collapse",
  initialState,
  reducers: {
    toggleCollapse: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
  },
});

collapseSlice.reducer = persistReducer(persistConfig, collapseSlice.reducer);

export const { toggleCollapse } = collapseSlice.actions;

export default collapseSlice.reducer;
