import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { Layout, Dropdown, Menu, Avatar } from 'antd'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
const { Header } = Layout
//使用antd中的Layout->Header封装TopHeader组件
export default function TopHeader() {
    const userInfo = JSON.parse(localStorage.getItem('token'))
    const navigate = useNavigate()
    //控制header图标
    const [collapsed, setCollapsed] = useState(false)
    //Dropdown menu
    const menu = (
        <Menu>
            <Menu.Item key='1'>
                {userInfo.role.roleName}
            </Menu.Item>
            <Menu.Item danger key='2' onClick={exitHandler}>退出</Menu.Item>
        </Menu>
    );
    //点击切换header折叠图标的处理函数
    const toggleCollapsedHandler = () => {
        setCollapsed(!collapsed)
    }
    //退出到登录页面
    function exitHandler() {
        localStorage.removeItem('token')
        navigate('/login')
    }
    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {
                collapsed ? <MenuUnfoldOutlined className='trigger' onClick={toggleCollapsedHandler} /> : <MenuFoldOutlined className='trigger' onClick={toggleCollapsedHandler} />
            }
            <div style={{ float: 'right' }}>
                <span>欢迎<span style={{ color: '#1890ff' }}>{userInfo.username}</span>回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
