import { useState, useEffect, useRef } from "react";
import { Card, Col, Row, List, Avatar } from "antd";
import { Link } from "react-router-dom";
import * as echarts from "echarts";
import _ from "lodash";
import {
  EditOutlined,
  EllipsisOutlined,
  PieChartOutlined,
  BarChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

export default function Home() {
  const [viewList, setViewList] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("token"));
  const barRef = useRef(null);

  useEffect(() => {
    fetch(
      "http://localhost:5000/news?_expand=category&publishState=2&_sort=view&_order=desc&_limit=6"
    )
      .then((res) => res.json())
      .then((data) => {
        setViewList(data);
      });
  }, []);

  useEffect(() => {
    fetch(
      "http://localhost:5000/news?_expand=category&publishState=2&_sort=star&_order=desc&_limit=6"
    )
      .then((res) => res.json())
      .then((data) => {
        setLikeList(data);
      });
  }, []);
  const renderBar = (data) => {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(barRef.current);
    // 绘制图表
    myChart.setOption({
      title: {
        text: "新闻分类柱状图",
      },
      tooltip: {},
      legend: {
        data: ["数量"],
      },
      xAxis: {
        data: Object.keys(data),
        axisLabel: {
          interval: 0,
          rotate: 45,
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: "数量",
          type: "bar",
          data: Object.values(data).map((item) => item.length),
        },
      ],
    });
    window.onresize = myChart.resize;
  };
  // init bar
  useEffect(() => {
    fetch("http://localhost:5000/news?publishState=2&_expand=category")
      .then((res) => res.json())
      .then((data) => {
        const groupData = _.groupBy(data, (data) => data.category.title);
        renderBar(groupData);
      });
    return () => {
      window.onresize = null;
    };
  }, []);

  return (
    <>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="用户最常浏览" bordered={true}>
              <List
                dataSource={viewList}
                renderItem={(item) => (
                  <List.Item>
                    <Link
                      to={`/news-manage/preview/${item.id}`}
                      state={{ ...item }}
                    >
                      {item.title}
                    </Link>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="用户点赞最多" bordered={true}>
              <List
                dataSource={likeList}
                renderItem={(item) => (
                  <List.Item>
                    <Link
                      to={`/news-manage/preview/${item.id}`}
                      state={{ ...item }}
                    >
                      {item.title}
                    </Link>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <PieChartOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar icon={<UserOutlined />} size="large" />}
                title={userInfo.username}
                description={
                  <div>
                    <b>{userInfo.region ? userInfo.region : "全球"}</b>
                    <span style={{ marginLeft: "10px" }}>
                      {userInfo.role.roleName}
                    </span>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>
      </div>
      <div
        ref={barRef}
        style={{
          width: "100%",
          height: "400px",
          marginTop: "30px",
        }}
      ></div>
    </>
  );
}
