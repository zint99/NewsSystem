import { Link,  } from 'react-router-dom'
import { Table, Button,  Tag, message } from 'antd'


export default function NewsPublish(props) {
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
          {
            item.publishState === 1 ?<Button type="primary" onClick={()=>publishHandler(item)}>发布</Button>
            :item.publishState === 2?<Button type="primary" onClick={()=>publishHandler(item)}>下线</Button>
            :<Button danger onClick={()=>publishHandler(item)}>删除</Button>
          }
        </>
      )
    },
  ]
  const publishHandler =async (news) => { 
    const {publishState,id} = news
    try {
      //发布，下线，删除
    if(publishState === 1){
      await fetch(`http://localhost:5000/news/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          publishState: 2
        }),
        headers: {
          "Content-Type": 'application/json'
        }
      }
     )
     props.getSetdataSource(1)
    }else if(publishState === 2){
      await fetch(`http://localhost:5000/news/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          publishState: 3
        }),
        headers: {
          "Content-Type": 'application/json'
        }
      }
     )
     props.getSetdataSource(2)
    }else {
      await fetch(`http://localhost:5000/news/${id}`, {
        method: 'DELETE'
      }
     )
     props.getSetdataSource(3)
    }
    } catch (error) {
      message.error('操作出现错误！')
    }
   }

  return (
    <>
      <Table columns={columns} dataSource={props.dataSource} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
    </>
  )
}
