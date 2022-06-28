import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { SmileOutlined, UserOutlined, RightOutlined } from "@ant-design/icons";
import "./SideMenu.css";

const { Sider } = Layout;
const { SubMenu } = Menu;
//建立icon映射表
const iconList = {
  "/home": <SmileOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/role-manage": <UserOutlined />,
  "/right-manage": <RightOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />,
};

// 使用antd中的Sider封装侧边栏
export default function SideMenu() {
  const [menuList, setMenuList] = useState([]);
  const { isCollapsed } = useSelector((state) => state.collapse);
  const navigate = useNavigate();
  const location = useLocation();
  // 侧边栏选中和打开的菜单项
  const selectKeys = [location.pathname];
  const openkeys = ["/" + selectKeys[0].split("/")[1]];
  const userInfo = JSON.parse(localStorage.getItem("token")); //当前登录的用户信息

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await fetch(
          "http://localhost:5000/rights?_embed=children"
        );
        const data = await response.json();
        setMenuList(data);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const checkPagePermisson = (item) => {
    //必须同时满足次权限为pagepermisson和是当前登录用户所拥有的权限
    return item.pagepermisson === 1 && userInfo.role.rights.includes(item.key);
  };

  const renderMenu = (menu) => {
    return menu.map((item) => {
      //链式判断
      if (item.children?.length > 0 && checkPagePermisson(item)) {
        return (
          <SubMenu key={item.key} title={item.title} icon={iconList[item.key]}>
            {renderMenu(item.children)}
          </SubMenu>
        );
      } else {
        return (
          checkPagePermisson(item) && (
            <Menu.Item
              key={item.key}
              onClick={() => {
                navigate(item.key);
              }}
              icon={iconList[item.key]}
            >
              {item.title}
            </Menu.Item>
          )
        );
      }
    });
  };

  return (
    <Sider trigger={null} collapsible collapsed={isCollapsed}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo">新闻发布管理系统</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectKeys}
            defaultOpenKeys={openkeys}
          >
            {renderMenu(menuList)}
          </Menu>
        </div>
      </div>
    </Sider>
  );
}
