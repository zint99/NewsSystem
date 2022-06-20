import { Outlet } from 'react-router-dom'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import './NewsSandbox.css'

//引入antd布局Layout
import { Layout } from 'antd'
const { Content } = Layout
export default function NewsSandbox() {
    return (
        <Layout>
            <SideMenu></SideMenu>
            <Layout className="site-layout">
                <TopHeader></TopHeader>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: 'auto'
                    }}
                >
                    {/* 这里放匹配的二级路由内容 */}
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </Layout>
    )
}
