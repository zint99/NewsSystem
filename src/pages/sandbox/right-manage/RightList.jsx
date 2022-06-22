import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'



export default function RightList() {
    const [data, setData] = useState([]);
    const { confirm } = Modal

    useEffect(() => {
        getData('http://localhost:5000/rights?_embed=children')
    }, [])

    //从接口'http://localhost:5000/rights?_embed=children'获取最新权限数据，并设置为状态
    const getData = async (url = 'http://localhost:5000/rights?_embed=children') => {
        const response = await fetch(url)
        const data = await response.json()
        data.forEach((item) => {
            if (item.children.length === 0) {
                item.children = '';
            }
        })
        setData(data)
    }
    //配置Table列columns,key可选
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: id => <b>{id}</b>,
        },
        {
            title: '权限名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            key: 'key',
            render: key => <Tag color='orange'>{key}</Tag>
        },
        {
            title: '操作',
            // 没有写dataIndex，render的参数就是这一项
            render: (item) => (
                <div>
                    {/* 
                    只有页面路由权限才能修改权限，功能权限禁用修改按钮，并设置无法点开popover
                    pagepermisson字段控制权限
                    */}
                    <Popover
                        content={<div style={{ "textAlign": 'center' }}><Switch checked={item.pagepermisson} onChange={() => switchRightHandler(item)}></Switch></div>}
                        title="页面配置项"
                        trigger={item.pagepermisson === undefined ? '' : 'click'} >
                        <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.pagepermisson === undefined}></Button>
                    </Popover>
                    <Button shape='circle' icon={<DeleteOutlined />} danger onClick={() => showConfirm(item)}></Button>
                </div>
            )
        },
    ]

    const showConfirm = (item) => {
        confirm({
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

    //删除权限
    const deleteRightHandler = async (item) => {
        if (item.grade === 1) {
            //一级权限
            await fetch(`http://localhost:5000/rights/${item.id}`, {
                method: 'DELETE'
            })
            getData()
        } else {
            //二级权限在children删
            await fetch(`http://localhost:5000/children/${item.id}`, {
                method: 'DELETE'
            })
            getData()
        }
    }

    const switchRightHandler = async item => {
        //如果patch后再取数据更新状态，switch按钮会有明显的抖动
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        //深复制
        const newData = JSON.parse(JSON.stringify(data))
        setData(newData)
        if (item.grade === 1) {
            await fetch(`http://localhost:5000/rights/${item.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    pagepermisson: item.pagepermisson
                }),
                headers: {
                    "Content-Type": 'application/json'
                }
            })
        } else {
            await fetch(`http://localhost:5000/children/${item.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    pagepermisson: item.pagepermisson
                }),
                headers: {
                    "Content-Type": 'application/json'
                }
            })
        }
    }
    return (
        <div>
            权限列表
            <hr />
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
        </div>
    )
}
