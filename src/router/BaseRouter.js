import { useRoutes } from 'react-router-dom'
import routes from './routes'

//导出一级路由
export default function BaseRouter() {
    const element = useRoutes(routes);
    return element
}
