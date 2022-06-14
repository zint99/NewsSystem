import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { Layout, Menu } from 'antd'
import {
    UserOutlined,
} from '@ant-design/icons';
import './SideMenu.css'
import { useNavigate } from 'react-router-dom';

const { Sider, } = Layout;
const { SubMenu } = Menu;

//建立icon映射表
const iconList = {
    '/home': <UserOutlined />,
    '/user-manage': <UserOutlined />,
    '/user-manage/list': <UserOutlined />,
    '/role-manage': <UserOutlined />,
    '/right-manage': <UserOutlined />,
    '/right-manage/role/list': <UserOutlined />,
    '/right-manage/right/list': <UserOutlined />,
}

// 使用antd中的Sider封装侧边栏
export default function SideMenu() {
    const [menuList, setMenuList] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const selectKeys = [location.pathname];
    const openkeys = '/' + selectKeys[0].split('/')[1];

    useEffect(() => {
        axios('http://localhost:5000/rights?_embed=children').then((res) => {
            setMenuList(res.data)
        })
    }, [])

    const checkPagePermisson = (item) => {
        return item.pagepermisson
    }

    const renderMenu = (menu) => {
        return menu.map((item) => {
            if (item.children?.length > 0 && checkPagePermisson(item)) {
                return (
                    <SubMenu key={item.key} title={item.title} icon={iconList[item.key]} >
                        {/* {
                            item.children.map((item) => {
                                return <Menu.Item key={item.key} icon={item.icon}>{item.title}</Menu.Item>
                            })
                        } */}
                        {/* 改用递归实现 */}
                        {renderMenu(item.children)}
                    </SubMenu>
                )
            } else {
                return checkPagePermisson(item) && <Menu.Item key={item.key} onClick={() => { navigate(item.key) }} icon={iconList[item.key]}>
                    {item.title}
                </Menu.Item>
            }
        })
    }

    return (
        <Sider trigger={null} collapsible collapsed={false}>
            <div style={{ display: 'flex', height: '100%', 'flexDirection': 'column' }}>
                <div className="logo" >新闻发布管理系统</div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                    <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={[openkeys]}>
                        {
                            renderMenu(menuList)
                        }
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}
