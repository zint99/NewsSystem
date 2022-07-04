import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  Steps,
  Button,
  message,
  Form,
  Select,
  Input,
  notification,
} from "antd";
import NewsEditor from "../../../components/news-manage/NewsEditor";
import "./NewsAdd.css";
const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [categories, setCategories] = useState([]); //新闻分类
  const [newsInfos, setNewsInfo] = useState(null); //第一步的标题，类别
  const [newsEditorContent, setNewsEditorContent] = useState(""); //第二步的编辑器html内容
  const [newsEditorText, setNewsEditorText] = useState(""); //第二步的编辑器text内容，拿来判断是否为空
  const newsRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);
  const next = async () => {
    try {
      if (current === 0) {
        const data = await newsRef.current.validateFields();
        setNewsInfo(data);
        setCurrent(current + 1);
      } else {
        // console.log(newsInfos, newsEditorContent);
        //如果第二步没有输入内容，则提示错误
        if (newsEditorText === "") {
          message.error("新闻内容不能为空");
        } else {
          setCurrent(current + 1);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  //获取新闻编辑器的html内容和text内容
  const getNewsEditorContent = (content, text) => {
    setNewsEditorContent(content);
    setNewsEditorText(text);
  };
  const steps = [
    {
      title: "基本信息",
      description: "新闻标题和分类",
    },
    {
      title: "新闻内容",
      description: "新闻主题内容",
    },
    {
      title: "新闻提交",
      description: "保存草稿或提交审核",
    },
  ];
  const newsInfo = (
    <div className={current === 0 ? "" : "hidden"}>
      <Form name="newsInfo" ref={newsRef}>
        <Form.Item
          name="title"
          label="新闻标题"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="新闻分类"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="选择新闻分类">
            {categories.map((category) => (
              <Option value={category.id} key={category.id}>
                {category.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
  const newsContent = (
    <div className={current === 1 ? "" : "hidden"}>
      <NewsEditor getNewsEditorContent={getNewsEditorContent} />
    </div>
  );
  const newsDone = <div className={current === 2 ? "" : "hidden"}></div>;
  const stepsContent = (
    <>
      {newsInfo}
      {newsContent}
      {newsDone}
    </>
  );

  // http://localhost:5000/news 提交新闻数据
  const saveHandler = async (auditState) => {
    try {
      //先post数据
      await fetch("http://localhost:5000/news", {
        method: "POST",
        body: JSON.stringify({
          ...newsInfos,
          content: newsEditorContent,
          region: userInfo.region ? userInfo.region : "全球",
          author: userInfo.username,
          roleId: userInfo.roleId,
          auditState,
          publishState: 0,
          createTime: Date.now(),
          star: 0,
          view: 0,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      //post成功后路由根据不同的auditState进行路由跳转
      navigate(auditState === 0 ? "/news-manage/draft" : "/audit-manage/audit");
      //然后右下角通知提醒框
      notification.info({
        message: `通知`,
        description: `请前往${
          auditState === 0 ? "草稿箱" : "审核新闻"
        }查看您的新闻信息`,
        placement: "bottomRight",
      });
      message.success(`成功保存到${auditState === 0 ? "草稿箱" : "审核新闻"}`);
    } catch (error) {
      console.log(error);
      message.error("提交时发生错误!");
    }
  };

  return (
    <>
      <PageHeader className="site-page-header" title="撰写新闻" />
      <Steps current={current}>
        {steps.map((item) => (
          <Step
            key={item.title}
            title={item.title}
            description={item.description}
          />
        ))}
      </Steps>
      <div className="steps-content">{stepsContent}</div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <>
            <Button
              type="primary"
              onClick={() => saveHandler(0)}
              style={{
                margin: "0 8px",
              }}
            >
              保存草稿箱
            </Button>
            <Button type="danger" onClick={() => saveHandler(1)}>
              提交审核
            </Button>
          </>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => prev()}
          >
            上一步
          </Button>
        )}
      </div>
    </>
  );
}
