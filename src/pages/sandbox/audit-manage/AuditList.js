import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Table, Button, Tag, message, notification } from 'antd'

export default function AuditList() {
  const navigate = useNavigate()
  const [auditList, setAuditList] = useState([])
  const userInfo = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    try {
      (async () => {
        //根据管理用户的权限发送不同请求 -> 分为全球和区域
        const url = userInfo.roleId === 1 ? `http://localhost:5000/news?auditState_ne=0&publishState_lte=1&_expand=category`
          : userInfo.roleId === 2 ? `http://localhost:5000/news?auditState!=0&publishState_lte=1&region=${userInfo.region}&_expand=category`
            : `http://localhost:5000/news?auditState!=0&publishState_lte=1&author=${userInfo.username}&_expand=category`
        const auditNewsData = await (await fetch(url)).json()
        setAuditList(auditNewsData)
      })()
    } catch (error) {
      message.error("审核列表出错")
    }

  }, [])

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <Link to={`/news-manage/preview/${item.id}`} state={{ ...item }}>{title}</Link>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      render: (author) => <Tag color='orange'>{author}</Tag>
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => category.title
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => <Tag color={auditState === 1 ? 'orange' : auditState === 2 ? 'green' : 'red'}>{auditState === 1 ? '审核中' : auditState === 2 ? '已通过' : '未通过'}</Tag>
    },
    {
      title: '操作',
      render: (item) => item.auditState === 1 ? <Button type="danger" onClick={() => { withdrawAuditHandler(item) }}>撤销</Button> : item.auditState === 2 ? <Button onClick={() => { publishNewsHandler(item) }}>发布</Button> : <Button type="primary" onClick={() => { updateNewsHandler(item) }}>修改</Button>
    },
  ]
  //撤销新闻审核
  const withdrawAuditHandler = async (news) => {
    try {
      await fetch(`http://localhost:5000/news/${news.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          auditState: 0
        }),
        headers: {
          "Content-Type": 'application/json'
        }
      })
      const auditNewsData = await (await fetch(userInfo.roleId === 1 ? `http://localhost:5000/news?auditState_ne=0&publishState_lte=1&_expand=category` : `http://localhost:5000/news?auditState!=0&publishState_lte=1&region=${userInfo.region}&_expand=category`)).json()
      setAuditList(auditNewsData)
      notification.info({
        message: `通知`,
        description: `请前往草稿箱查看您刚才撤销审核的新闻信息`,
        placement: 'bottomRight'
      })
      //这里可以定时自动跳转，然后在Effect中清除定时器
      //  timer = setTimeout(() => {
      //   navigate(`/news-manage/draft`)
      // }, 3000);
    } catch (error) {
      message.error("撤销失败")
    }
  }
  //修改审核不通过的新闻
  const updateNewsHandler = (news) => {
    navigate(`/news-manage/update/${news.id}`, { state: { ...news } })
  }
  //发布新闻
  const publishNewsHandler = async (news) => {
    try {
      await fetch(`http://localhost:5000/news/${news.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          publishState: 2,
          publishTime: Date.now()
        }),
        headers: {
          "Content-Type": 'application/json'
        }
      })
      notification.info({
        message: `通知`,
        description: `请前往【发布管理/已发布】查看您刚才发布的新闻信息`,
        placement: 'bottomRight'
      })
      navigate(`/publish-manage/published`)
    } catch (error) {
      message.error('发布新闻失败！')
    }
  }

  return (
    <>
      <Table columns={columns} dataSource={auditList} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
    </>
  )
}
