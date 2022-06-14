import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'



export default function RightList() {
    const [data, setData] = useState([]);
    const { confirm } = Modal

    useEffect(() => {
        axios('http://localhost:5000/rights?_embed=children').then((res) => {
            console.log('获取data并setData' + res.data)
            const list = res.data;
            list.forEach((item) => {
                if (item.children.length === 0) {
                    list[0].children = '';
                }
            })
            setData(list)
        })
    }, [])

    /*
        key可选
    */
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
            render: (item) => (
                <div>
                    <Popover content={<div style={{ "textAlign": 'center' }}><Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch></div>} title="页面配置项" trigger={item.pagepermisson === undefined ? '' : 'click'} >
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
                console.log(item)
                if (item.grade === 1) {
                    setData(data.filter(data => data.id !== item.id))
                    axios.delete(`http://localhost:5000/rights/${item.id}`)
                } else {
                    //item为二级权限，通过item.rightId找到data中对应的一级权限，再操作一级权限中对应item.id的children
                    //深复制Data
                    //找到对应的一级权限项
                    //操作其children，得到新的Data。
                    //setData
                    const newData = JSON.parse(JSON.stringify(data));
                    newData.forEach((newDataItem) => {
                        if (newDataItem.id === item.rightId) {
                            newDataItem.children = newDataItem.children.filter((child) => {
                                return child.id !== item.id
                            })
                        }
                    })
                    setData(newData)
                    //向后端children接口发送delete请求
                    axios.delete(`http://localhost:5000/children/${item.id}`)
                }
            },
            onCancel() {
                return
            },
        })
    }

    const switchMethod = item => {
        //修改前端状态
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        setData([...data])
        //根据grade调后端接口
        if (item.grade === 1) {
            axios.patch(`http://localhost:5000/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`http://localhost:5000/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }
    }

    return (
        <div>
            权限列表
            <hr />
            <Table columns={columns} dataSource={data} pagination={
                {
                    pageSize: 5
                }
            }
            />
        </div>
    )
}
