import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Table, Button, Modal, Tag, message } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons'

export default function NewsDraft() {
  const [draftNewsData, setDraftNewsData] = useState([])
  const userInfo = JSON.parse(localStorage.getItem('token'))
  const navigate = useNavigate()
  //取对应用户名且auditState=0的数据
  const fetchData = async () => {
    const data = await (await fetch(`http://localhost:5000/news?${userInfo.username}=admin&auditState=0&_expand=category`)).json()
    setDraftNewsData(data)
  }
  useEffect(() => {
    fetchData()
  }, [userInfo.username, fetchData])
  //配置NewsDraft的Table列columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: id => <b>{id}</b>,
    },
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
          {/* 更新按钮携带state参数(当前新闻信息进行路由跳转) */}
          <Button type="ghost" shape='circle' icon={<EditOutlined />} onClick={() => { navigate(`/news-manage/update/${item.id}`, { state: { ...item } }) }}></Button>
          <Button shape='circle' icon={<DeleteOutlined />} danger onClick={() => showConfirm(item)}></Button>
          <Button type="primary" shape='circle' icon={<UploadOutlined />}></Button>
        </>
      )
    },
  ]

  // 删除新闻
  const showConfirm = (item) => {
    Modal.confirm({
      title: '你确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteRightHandler(item)
      },
      onCancel() {
        return
      },
    })
  }
  const deleteRightHandler = async (item) => {
    try {
      await fetch(`http://localhost:5000/news/${item.id}`, {
        method: 'DELETE'
      })
      fetchData()
    } catch (error) {
      message.error("删除失败")
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Table columns={columns} dataSource={draftNewsData} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
    </div>
  )
}
