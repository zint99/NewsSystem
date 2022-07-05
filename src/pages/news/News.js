import { useEffect, useState } from "react";
import { PageHeader, Card, Col, Row, List } from "antd";
import { Link } from "react-router-dom";

export default function News() {
  const [colList, setColList] = useState(null);

  const fetchData = async () => {
    const data = await Promise.all([
      (
        await fetch(
          "http://localhost:5000/news?publishState=2&_expand=category"
        )
      ).json(),
      (await fetch("http://localhost:5000/categories")).json(),
    ]);
    const [newsList, categories] = data;
    // console.log(newsList, categories);
    const colData = categories.map((category) => {
      return {
        title: category.title,
        news: newsList.filter((news) => news.category.title === category.title),
      };
    });
    // console.log(colData);
    setColList(
      colData.map((col) => {
        return (
          <Col span={8} key={col.title}>
            <Card title={col.title} bordered hoverable>
              <List
                size="small"
                pagination={{
                  pageSize: 3,
                }}
                dataSource={col.news}
                renderItem={(item) => {
                  // console.log(item);
                  return (
                    <List.Item>
                      {
                        <Link to={`/detail/${item.id}`} state={{ ...item }}>
                          {item.title}
                        </Link>
                      }
                    </List.Item>
                  );
                }} //路由链接跳转到详情页
              />
            </Card>
          </Col>
        );
      })
    );
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div
      style={{
        width: "95%",
        margin: "0 auto",
      }}
    >
      <PageHeader
        className="site-page-header"
        title="全球新闻"
        subTitle="查看新闻"
      />
      <div className="site-card-wrapper">
        <Row gutter={[16, 16]}>{colList}</Row>
      </div>
    </div>
  );
}
