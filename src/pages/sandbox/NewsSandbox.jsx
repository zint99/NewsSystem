import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import Nprogress from "nprogress";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import "./NewsSandbox.css";
import "nprogress/nprogress.css";

//引入antd布局Layout
import { Layout } from "antd";
const { Content } = Layout;
export default function NewsSandbox() {
  const { isLoading } = useSelector((state) => state.loading);
  //进度条
  Nprogress.start();
  useEffect(() => {
    Nprogress.done();
  }, []);
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          {/*
            这里放匹配的二级路由内容,spinning使用redux管理 
          */}
          <Spin size="large" spinning={isLoading} tip="请求数据中...">
            <Outlet></Outlet>
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
}
