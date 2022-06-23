import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Table, Button, Tag, message, notification } from 'antd'


export default function Audit() {
  const navigate = useNavigate()
  const [auditData, setAuditData] = useState([])
  const userInfo = JSON.parse(localStorage.getItem('token'))
  //根据登录用户角色获取不同数据
  useEffect(() => {
    try {
      const url =
        (async () => {
          const data = await (await fetch(userInfo.roleId === 1 ? `http://localhost:5000/news?auditState=1&_expand=category`
            : `http://localhost:5000/news?auditState=1&region=${userInfo.region}&_expand=category`)).json()
          setAuditData(data)
        })()
    } catch (error) {
      message.error('获取审核数据失败！')
    }
  })

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
      title: '操作',
      render: (item) => (
        <>
          <Button type="primary" onClick={() => { auditHandler(item, 2, 1) }}>通过</Button>
          <Button type="danger" onClick={() => { auditHandler(item, 3, 0) }}>驳回</Button>
        </>
      )
    },
  ]

  const auditHandler = async (news, auditState, publishState) => {
    try {
      (async () => {
        await fetch(`http://localhost:5000/news/${news.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            auditState,
            publishState
          }),
          headers: {
            "Content-Type": 'application/json'
          }
        })
        notification.info({
          message: `通知`,
          description: `请前往【审核管理/审核列表】查看审核状态`,
          placement: 'bottomRight'
        })
      })()
    } catch (error) {
      message.error("审核错误")
    }
  }

  return (
    <>
      <Table columns={columns} dataSource={auditData} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
    </>
  )
}
