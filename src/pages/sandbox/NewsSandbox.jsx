import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Nprogress from 'nprogress'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import './NewsSandbox.css'
import 'nprogress/nprogress.css'

//引入antd布局Layout
import { Layout } from 'antd'
const { Content } = Layout
export default function NewsSandbox() {
    //进度条
    Nprogress.start()
    useEffect(() => {
        Nprogress.done()
    }, [])
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
