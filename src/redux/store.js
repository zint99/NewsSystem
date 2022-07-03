import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import collapseReducer from "./features/collapse/collapseSlice";
import loadingReducer from "./features/loading/loadingSlice";

const store = configureStore({
  reducer: {
    collapse: collapseReducer,
    loading: loadingReducer,
  },
});
const persistor = persistStore(store);
export { store, persistor };
