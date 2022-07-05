import { useEffect, useState } from "react";
import { Descriptions, PageHeader } from "antd";
import { useLocation } from "react-router-dom";
import { HeartTwoTone } from "@ant-design/icons";
import "./NewsPreview.css";

export default function NewsPreview(props) {
  const newsInfo = useLocation().state;
  const [viewDetail, setViewDetail] = useState(newsInfo.view); //供detail使用的view变量
  const [starDetail, setStarDetail] = useState(newsInfo.star); //供detail使用的view变量
  const { isCustomer } = props; //区分后台和前台
  // console.log(newsInfo);
  const auditList = ["未审核", "审核中", "已通过", "未通过"];
  const publishList = ["未发布", "待发布", "已上线", "已下线"];
  useEffect(() => {
    // 如果是前台访问detail页面，取最新的view然后再加1
    const uploadView = async () => {
      const { view } = await (
        await fetch(`http://localhost:5000/news/${newsInfo.id}`)
      ).json();
      const result = await (
        await fetch(`http://localhost:5000/news/${newsInfo.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            view: view + 1,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      setViewDetail(result.view);
    };
    if (isCustomer) {
      uploadView();
    }
  }, [newsInfo.id, isCustomer]);

  // 点击就将点赞数加1
  const clickLikeHandler = async () => {
    const { star } = await (
      await fetch(`http://localhost:5000/news/${newsInfo.id}`)
    ).json();
    const result = await (
      await fetch(`http://localhost:5000/news/${newsInfo.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          star: star + 1,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();
    setStarDetail(result.star);
  };
  return (
    <div className="site-page-header-ghost-wrapper">
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title={newsInfo.title}
        subTitle={
          <>
            {newsInfo.category.title}
            {isCustomer && (
              <span style={{ marginLeft: "6px" }}>
                <HeartTwoTone
                  className="HeartTwoTone"
                  twoToneColor="#eb2f96"
                  onClick={() => clickLikeHandler()}
                />
              </span>
            )}
          </>
        }
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">
            {newsInfo.author}
          </Descriptions.Item>
          {!isCustomer && (
            <Descriptions.Item label="创建时间">
              {new Date(newsInfo.createTime).toLocaleString()}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="发布时间">
            {newsInfo.publishTime
              ? new Date(newsInfo.createTime).toLocaleString()
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
          {!isCustomer && (
            <>
              <Descriptions.Item label="审核状态">
                <span style={{ color: "red" }}>
                  {auditList[newsInfo.auditState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="发布状态">
                <span style={{ color: "red" }}>
                  {publishList[newsInfo.publishState]}
                </span>
              </Descriptions.Item>
            </>
          )}
          <Descriptions.Item label="访问数量">
            <span style={{ color: "green" }}>
              {isCustomer ? viewDetail : newsInfo.view}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="点赞数量">
            <span style={{ color: "green" }}>{starDetail}</span>
          </Descriptions.Item>
          <Descriptions.Item label="评论数量">
            <span style={{ color: "green" }}>{0}</span>
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div
        dangerouslySetInnerHTML={{
          __html: newsInfo.content,
        }}
        className="preview-content"
      ></div>
    </div>
  );
}
