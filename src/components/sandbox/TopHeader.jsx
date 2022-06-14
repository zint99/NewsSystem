import React, { useState } from 'react'
import { Layout, Dropdown, Menu, Avatar } from 'antd'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
const { Header } = Layout
//使用antd中的Layout->Header封装TopHeader组件
export default function TopHeader() {
    //控制header图标
    const [collapsed, setCollapsed] = useState(false)
    //Dropdown menu
    const menu = (
        <Menu>
            <Menu.Item key='1'>
                超级管理员
            </Menu.Item>
            <Menu.Item danger key='2'>退出</Menu.Item>
        </Menu>
    );
    const toggle = () => {
        setCollapsed(!collapsed)
    }
    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {
                collapsed ? <MenuUnfoldOutlined className='trigger' onClick={toggle} /> : <MenuFoldOutlined className='trigger' onClick={toggle} />
            }
            <div style={{ float: 'right' }}>
                <span>欢迎admin回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
