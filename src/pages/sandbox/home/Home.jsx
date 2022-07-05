import { useState, useEffect, useRef } from "react";
import { Card, Col, Row, List, Avatar, Drawer } from "antd";
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
  const [visible, setVisible] = useState(false); //控制Drawer
  const [pieChart, setPieChart] = useState(null);
  const [groupedNewsList, setGroupedNewsList] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("token"));
  const barRef = useRef(null);
  const pieRef = useRef(null);
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
        text: "全系统新闻分类柱状图",
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
        setGroupedNewsList(groupData);
        renderBar(groupData);
      });
    return () => {
      window.onresize = null;
    };
  }, []);

  const onClose = () => {
    setVisible(false);
  };
  const renderPie = (data) => {
    // console.log(Object.entries(data));
    const pieData = Object.entries(data)
      .map((item) => {
        return {
          name: item[0],
          value: item[1].filter((news) => news.author === userInfo.username)
            .length,
        };
      })
      .filter((item) => item.value !== 0);
    // console.log(pieData);
    // 用状态来保存piechart容器，避免多次初始化
    let myChart;
    if (!pieChart) {
      myChart = echarts.init(pieRef.current);
      setPieChart(myChart);
    } else {
      myChart = pieChart;
    }
    const option = {
      title: {
        text: "当前用户新闻分类图示",
        subtext: "饼状图",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "发布新闻分类",
          type: "pie",
          radius: "50%",
          data: pieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    option && myChart.setOption(option);
  };
  const showPieChart = async () => {
    await setVisible(true);
    renderPie(groupedNewsList);
  };

  return (
    <>
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card
              title={
                <>
                  {"用户最常浏览"}
                  {
                    <span style={{ marginLeft: "5px" }}>
                      <BarChartOutlined />
                    </span>
                  }
                </>
              }
              bordered={true}
            >
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
            <Card
              title={
                <>
                  {"用户点赞最多"}
                  {
                    <span style={{ marginLeft: "5px" }}>
                      <BarChartOutlined />
                    </span>
                  }
                </>
              }
              bordered={true}
            >
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
                <PieChartOutlined
                  key="setting"
                  onClick={() => {
                    showPieChart();
                  }}
                />,
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
          // marginTop: "10px",
        }}
      ></div>
      <Drawer
        width="600px"
        title="个人新闻分类"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <div
          ref={pieRef}
          style={{
            width: "100%",
            height: "400px",
            marginTop: "30px",
          }}
        ></div>
      </Drawer>
    </>
  );
}
