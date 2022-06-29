import { HashRouter } from "react-router-dom";
import { useHttp } from "./util/http";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store";
import BaseRouter from "./router/BaseRouter";
import "./App.css";

function App() {
  useHttp();
  return (
    <PersistGate loading={null} persistor={persistor}>
      <HashRouter>
        {/* 一级路由 */}
        <BaseRouter></BaseRouter>
      </HashRouter>
    </PersistGate>
  );
}

export default App;
