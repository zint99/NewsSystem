import { createSlice } from "@reduxjs/toolkit";

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

export const { toggleCollapse } = collapseSlice.actions;

export default collapseSlice.reducer;
