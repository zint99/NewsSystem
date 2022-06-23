import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { PageHeader, Steps, Button, message, Form, Select, Input, notification } from 'antd';
import NewsEditor from '../../../components/news-manage/NewsEditor'
import './NewsAdd.css'
const { Step } = Steps
const { Option } = Select

//基本复用NewsAdd组件
export default function NewsUpdate() {
    const navigate = useNavigate()
    const [current, setCurrent] = useState(0)
    const [categories, setCategories] = useState([]) //新闻分类
    const [updateNewsInfos, setUpdateNewsInfos] = useState(null) //更新后的第一步的标题，类别
    const [newsEditorContent, setNewsEditorContent] = useState('')//第二步的编辑器html内容
    const [newsEditorText, setNewsEditorText] = useState('')//第二步的编辑器text内容，拿来判断是否为空
    const newsRef = useRef(null)
    const userInfo = JSON.parse(localStorage.getItem('token'))
    const defaultNewsInfo = useLocation().state //defaultNewsInfo是路由跳转过来的news未修改的老数据

    /*
        auditState: 0
        author: "admin"
        category: {id: 6, title: '生活理财', value: '生活理财'}
        categoryId: 6
        content: "<p>为何出现在彼此的生活又离开</p>"
        createTime: 1655811426121
        id: 10
        publishState: 0
        region: "全球"
        roleId: 1
        star: 0
        title: "出现又离开"
        view: 0
    */
    useEffect(() => {
        fetch('http://localhost:5000/categories')
            .then((res) => res.json())
            .then((data) => {
                setCategories(data)
            })
    }, [])

    //设置表单默认字段
    useEffect(() => {
        newsRef.current.setFieldsValue({
            title: defaultNewsInfo.title,
            categoryId: defaultNewsInfo.categoryId
        })
        setNewsEditorContent(defaultNewsInfo.content)
    }, [defaultNewsInfo.title, defaultNewsInfo.category.title])
    //获取新闻编辑器的html内容和text内容
    const getNewsEditorContent = (content, text) => {
        setNewsEditorContent(content)
        setNewsEditorText(text)
    }
    const next = async () => {
        try {
            if (current === 0) {
                const data = await newsRef.current.validateFields()
                setUpdateNewsInfos(data)
                setCurrent(current + 1);
            } else {
                // console.log(updateNewsInfos, newsEditorContent)
                //如果第二步没有输入内容，则提示错误
                if (newsEditorText === '') {
                    message.error('新闻内容不能为空')
                } else {
                    setCurrent(current + 1);
                }
            }
        } catch (error) {
            message.error('发生错误，无法下一步')
        }
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    // 更新后向 http://localhost:5000/news 提交更新过的新闻数据
    const saveHandler = async (auditState) => {
        try {
            //向指定的id patch 数据,只有title,category,content,auditState,createTime PATCH更新
            await fetch(`http://localhost:5000/news/${defaultNewsInfo.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    ...updateNewsInfos,
                    content: newsEditorContent,
                    auditState,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            //post成功后路由根据不同的auditState进行路由跳转
            navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/audit')
            //然后右下角通知提醒框
            notification.info({
                message: `通知`,
                description: `请前往${auditState === 0 ? '草稿箱' : '审核新闻'}查看您的新闻信息`,
                placement: 'bottomRight'
            })
            message.success(`成功保存到${auditState === 0 ? '草稿箱' : '审核新闻'}`)
        } catch (error) {
            console.log(error)
            message.error('提交时发生错误!')
        }
    }
    const steps = [
        {
            title: '基本信息',
            description: '新闻标题和分类',
        },
        {
            title: '新闻内容',
            description: '新闻主题内容',
        },
        {
            title: '新闻提交',
            description: '保存草稿或提交审核',
        },
    ];
    const updateNewsInfo = (<div className={current === 0 ? '' : 'hidden'}>
        <Form name="updateNewsInfo" ref={newsRef}>
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
                <Select
                    placeholder="选择新闻分类"
                >
                    {
                        categories.map(category => <Option value={category.id} key={category.id}>{category.title}</Option>)
                    }
                </Select>
            </Form.Item>
        </Form>
    </div>)
    const newsContent = (<div className={current === 1 ? '' : 'hidden'}>
        <NewsEditor getNewsEditorContent={getNewsEditorContent} defaultNewsContent={defaultNewsInfo.content} />
    </div>)
    const newsDone = (<div className={current === 2 ? '' : 'hidden'}></div>)
    const stepsContent = <>{updateNewsInfo}{newsContent}{newsDone}</>

    return (
        <>
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                onBack={() => navigate(-1)}
            />
            <Steps current={current}>
                {steps.map((item) => (
                    <Step key={item.title} title={item.title} description={item.description} />
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
                        <Button type="primary" onClick={() => saveHandler(0)} style={{
                            margin: '0 8px',
                        }}>
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
                            margin: '0 8px',
                        }}
                        onClick={() => prev()}
                    >
                        上一步
                    </Button>
                )}
            </div>
        </>
    )
}
