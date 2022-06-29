import { useRoutes } from "react-router-dom";
import { useState, useEffect } from "react";
// import routes from './routes'
import { Navigate } from "react-router-dom";
import Login from "../pages/login/Login";
import NewsSandbox from "../pages/sandbox/NewsSandbox";
import Home from "../pages/sandbox/home/Home";
import UserList from "../pages/sandbox/user-manage/UserList";
import RightList from "../pages/sandbox/right-manage/RightList";
import RoleList from "../pages/sandbox/right-manage/RoleList";
import NoPermisson from "../pages/noPermisson/NoPermisson";
import NewsAdd from "../pages/sandbox/news-manage/NewsAdd";
import NewsDraft from "../pages/sandbox/news-manage/NewsDraft";
import NewsCategory from "../pages/sandbox/news-manage/NewsCategory";
import NewsPreview from "../pages/sandbox/news-manage/NewsPreview";
import NewsUpdate from "../pages/sandbox/news-manage/NewsUpdate";
import Audit from "../pages/sandbox/audit-manage/Audit";
import AuditList from "../pages/sandbox/audit-manage/AuditList";
import Published from "../pages/sandbox/publish-manage/Published";
import Unpublished from "../pages/sandbox/publish-manage/Unpublished";
import Sunset from "../pages/sandbox/publish-manage/Sunset";

function AuthComponent({ children }) {
  const isLogin = localStorage.getItem("token");
  return isLogin ? children : <Navigate to="/login" />;
}
//登录的用户信息
const userInfo = JSON.parse(localStorage.getItem("token"));
//路由组件映射
const routesMap = {
  "/home": <Home />,
  "/user-manage/list": <UserList />,
  "/right-manage/role/list": <RoleList />,
  "/right-manage/right/list": <RightList />,
  "/news-manage/add": <NewsAdd />,
  "/news-manage/draft": <NewsDraft />,
  "/news-manage/category": <NewsCategory />,
  "/news-manage/preview/:id": <NewsPreview />,
  "/news-manage/update/:id": <NewsUpdate />,
  "/audit-manage/audit": <Audit />,
  "/audit-manage/list": <AuditList />,
  "/publish-manage/unpublished": <Unpublished />,
  "/publish-manage/published": <Published />,
  "/publish-manage/sunset": <Sunset />,
};

//导出一级路由
export default function BaseRouter() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await Promise.all([
        (await fetch("http://localhost:5000/rights")).json(),
        (await fetch("http://localhost:5000/children")).json(),
      ]);
      let newsBackRoutes = [...data[0], ...data[1]];
      //取得newsRoutes后和userInfo的权限对比，然后动态渲染出二级的routes
      const userRoutes = newsBackRoutes.map((item) => {
        //如果后台权限中设置的pagepermisson为1，且userinfo也有这个权限，则渲染
        if (
          (item.pagepermisson === 1 || item.routepermisson === 1) &&
          userInfo?.role.rights.includes(item.key)
        ) {
          return {
            path: item.key,
            element: routesMap[item.key],
          };
        } else {
          return null;
        }
      });
      //处理后的路由
      const userRoutesHandled = userRoutes.filter((route) => {
        return route !== null && route.element !== undefined;
      });
      const routes = [
        {
          path: "/",
          element: (
            <AuthComponent>
              <NewsSandbox></NewsSandbox>
            </AuthComponent>
          ),
          children: [
            {
              //重定向到/home
              path: "/",
              element: <Navigate to="/home" />,
            },
            ...userRoutesHandled,
            {
              path: "*",
              element: <NoPermisson />,
            },
          ],
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          //如果上面路径都没匹配到，则匹配 <NotFound />这个组件
          path: "*",
          element: <NoPermisson />,
        },
      ];
      setRoutes(routes);
    }
    fetchData();
  }, []);

  const element = useRoutes(routes);

  return element;
}
