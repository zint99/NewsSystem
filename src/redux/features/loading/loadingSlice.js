import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    changeLoading: ({ isLoading }, payload) => {
      isLoading = payload;
    },
  },
});

export const { changeLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
