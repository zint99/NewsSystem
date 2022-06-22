import { Descriptions, PageHeader } from 'antd';
import { useLocation } from 'react-router-dom'
import './NewsPreview.css'

export default function NewsPreview() {
    const newsInfo = useLocation().state
    // console.log(newsInfo)
    const auditList = ["未审核", "审核中", "已通过", "未通过",]
    const publishList = ["未发布", "待发布", "已上线", "已下线",]

    return (
        <div className="site-page-header-ghost-wrapper">
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsInfo.title}
                subTitle={newsInfo.category.title}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{new Date(newsInfo.createTime).toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{newsInfo.publishTime ? new Date(newsInfo.createTime).toLocaleString() : '-'}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                    <Descriptions.Item label="审核状态"><span style={{ color: 'red' }}>{auditList[newsInfo.auditState]}</span></Descriptions.Item>
                    <Descriptions.Item label="发布状态"><span style={{ color: 'red' }}>{publishList[newsInfo.publishState]}</span></Descriptions.Item>
                    <Descriptions.Item label="访问数量"><span style={{ color: 'green' }}>{newsInfo.view}</span></Descriptions.Item>
                    <Descriptions.Item label="点赞数量"><span style={{ color: 'green' }}>{newsInfo.star}</span></Descriptions.Item>
                    <Descriptions.Item label="评论数量"><span style={{ color: 'green' }}>{0}</span></Descriptions.Item>
                </Descriptions>
            </PageHeader>
            <div dangerouslySetInnerHTML={{
                __html: newsInfo.content
            }} className='preview-content'>

            </div>
        </div>
    )
}
