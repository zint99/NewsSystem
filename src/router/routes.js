import { Navigate } from 'react-router-dom'
import Login from '../pages/login/Login'
import NewsSandbox from '../pages/sandbox/NewsSandbox'
import Home from '../pages/sandbox/home/Home'
import UserList from '../pages/sandbox/user-manage/UserList'
import RightList from '../pages/sandbox/right-manage/RightList'
import RoleList from '../pages/sandbox/right-manage/RoleList'
import NotFound from '../pages/notFound/NotFound'

export default [
    //一级路由为 / 和 /login
    {
        path: '/',
        element: <AuthComponent>
            <NewsSandbox></NewsSandbox>
        </AuthComponent>,
        children:
            [
                {
                    //重定向到/home
                    path: '/',
                    element: <Navigate to='/home' />
                },
                {
                    path: 'home',
                    element: <Home />
                },
                {
                    path: '/user-manage/list',
                    element: <UserList />
                },
                {
                    path: '/right-manage/role/list',
                    element: <RoleList />
                },
                {
                    path: '/right-manage/right/list',
                    element: <RightList />
                },
                {
                    path: '*',
                    element: <NotFound />
                },
            ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        //如果上面路径都没匹配到，则匹配 <NotFound />这个组件
        path: '*',
        element: <NotFound />
    },
]

function AuthComponent({ children }) {
    const isLogin = localStorage.getItem('token');
    return isLogin ? children : <Navigate to='/login' />
}
