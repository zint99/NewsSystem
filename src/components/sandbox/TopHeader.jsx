import { useSelector, useDispatch } from "react-redux";
import { toggleCollapse } from "../../redux/features/collapse/collapseSlice";
import { useNavigate } from "react-router";
import { Layout, Dropdown, Menu, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
const { Header } = Layout;
//使用antd中的Layout->Header封装TopHeader组件
export default function TopHeader() {
  //控制header图标
  const { isCollapsed } = useSelector((state) => state.collapse);
  const dispatch = useDispatch();
  const userInfo = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  //Dropdown menu
  const menu = (
    <Menu>
      <Menu.Item key="1">{userInfo.role.roleName}</Menu.Item>
      <Menu.Item danger key="2" onClick={exitHandler}>
        退出
      </Menu.Item>
    </Menu>
  );
  //退出到登录页面
  function exitHandler() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {isCollapsed ? (
        <MenuUnfoldOutlined
          className="trigger"
          onClick={() => dispatch(toggleCollapse())}
        />
      ) : (
        <MenuFoldOutlined
          className="trigger"
          onClick={() => dispatch(toggleCollapse())}
        />
      )}
      <div style={{ float: "right" }}>
        <span>
          欢迎<span style={{ color: "#1890ff" }}>{userInfo.username}</span>回来
        </span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}
