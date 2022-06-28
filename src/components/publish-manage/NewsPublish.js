import { Link } from "react-router-dom";
import { Table, Button, Tag, message, notification, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export default function NewsPublish(props) {
  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return (
          <Link to={`/news-manage/preview/${item.id}`} state={{ ...item }}>
            {title}
          </Link>
        );
      },
    },
    {
      title: "作者",
      dataIndex: "author",
      render: (author) => <Tag color="orange">{author}</Tag>,
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (category) => category.title,
    },
    {
      title: "操作",
      render: (item) => (
        <>
          {item.publishState === 1 ? (
            <Button type="primary" onClick={() => publishHandler(item)}>
              发布
            </Button>
          ) : item.publishState === 2 ? (
            <Button type="primary" onClick={() => publishHandler(item)}>
              下线
            </Button>
          ) : (
            <Button danger onClick={() => publishHandler(item)}>
              删除
            </Button>
          )}
        </>
      ),
    },
  ];
  const publishHandler = async (news) => {
    const { publishState, id } = news;
    try {
      //发布，下线，删除
      if (publishState === 1) {
        await fetch(`http://localhost:5000/news/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            publishState: 2,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        props.getSetdataSource(1);
        //然后右下角通知提醒框
        notification.info({
          message: `通知`,
          description: `请前往【发布管理/已发布】查看您刚发布的新闻`,
          placement: "bottomRight",
        });
      } else if (publishState === 2) {
        await fetch(`http://localhost:5000/news/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            publishState: 3,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        props.getSetdataSource(2);
        notification.info({
          message: `通知`,
          description: `请前往【发布管理/已下线】查看您刚下线的新闻`,
          placement: "bottomRight",
        });
      } else {
        Modal.confirm({
          title: "你确定删除吗?",
          icon: <ExclamationCircleOutlined />,
          async onOk() {
            await fetch(`http://localhost:5000/news/${id}`, {
              method: "DELETE",
            });
            props.getSetdataSource(3);
          },
          onCancel() {
            return;
          },
        });
      }
    } catch (error) {
      message.error("操作出现错误！");
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={props.dataSource}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </>
  );
}
