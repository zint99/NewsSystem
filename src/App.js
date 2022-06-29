import { HashRouter } from "react-router-dom";
import { useHttp } from "./util/http";
import BaseRouter from "./router/BaseRouter";
import "./App.css";

function App() {
  useHttp();
  return (
    <HashRouter>
      {/* 一级路由 */}
      <BaseRouter></BaseRouter>
    </HashRouter>
  );
}

export default App;
