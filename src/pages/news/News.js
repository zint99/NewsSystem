import { useEffect, useState } from "react";
import { PageHeader, Card, Col, Row, List } from "antd";

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [colData, setColData] = useState([]);

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
    // console.log(colData)
    setNewsList(newsList);
    setCategoriesList(categories);

    setColData(colData);
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
        <Row gutter={[16, 16]}>
          {/* <Col span={8}>
            <Card title="Card title" bordered hoverable>
              <List
                size="small"
                pagination={{
                  pageSize: 3,
                }}
                dataSource={["11", "22"]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Card>
          </Col> */}
          {colData.map((col) => {
            return (
              <Col span={8}>
                <Card title={col.title} bordered hoverable>
                  <List
                    size="small"
                    pagination={{
                      pageSize: 3,
                    }}
                    dataSource={col.news}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
