import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Tree } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'


export default function RoleList() {
    const [dataSource, setDataSource] = useState([])    //角色数据
    const [rightList, setRightList] = useState([])  //权限列表
    const [currentRights, setCurrentRights] = useState([])  //当前选中行的权限列表
    const [currentId, setCurrentId] = useState(0)   //当前选中行的ID
    const [isModalVisible, setIsModalVisible] = useState(false) //模态框状态

    const { confirm } = Modal
    useEffect(() => {
        axios.get(`http://localhost:5000/roles`).then((res) => {
            setDataSource(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get(`http://localhost:5000/rights?_embed=children`).then((res) => {
            setRightList(res.data)
        })
    }, [])

    //角色列表Table中的每一列
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'ID',
            render: id => <b>{id}</b>
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            key: 'roleName',
        },
        {
            title: '操作',
            render: (item) => (
                <div>
                    <Button type='primary' shape='circle' icon={<EditOutlined />} onClick={() => { showModal(item) }}></Button>
                    <Button shape='circle' icon={<DeleteOutlined />} danger onClick={() => showConfirm(item)}></Button>
                    <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} title='角色权限管理' >
                        <Tree
                            checkable
                            // onSelect={onSelect}
                            // onOk={onOk}
                            onCheck={onCheck}
                            treeData={rightList}
                            checkedKeys={currentRights}
                            checkStrictly
                        />
                    </Modal>
                </div>
            )
        }
    ]

    const onCheck = (checkKeys) => {
        setCurrentRights(checkKeys.checked)
    }

    const handleOk = () => {
        setIsModalVisible(false)
        //通过currentId，修改rightList中对应的rights为currentRights
        // console.log(currentRights)
        setDataSource(dataSource.map((item) => {
            if (item.id === currentId) {
                // 找到对应currentId的一项，修改其rights为currentRights
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))

        //patch 修改后端数据
        axios.patch(`http://localhost:5000/roles/${currentId}`, {
            rights: currentRights
        })
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const showModal = (item) => {
        //show modal and set currentRights and currentId
        setIsModalVisible(!isModalVisible)
        setCurrentRights(item.rights)
        setCurrentId(item.id)
    }

    const showConfirm = (item) => {
        confirm({
            title: '你确定删除吗?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                console.log(item)
                setDataSource(dataSource.filter(data => data.id !== item.id))
                axios.delete(`http://localhost:5000/roles/${item.id}`)
            },
            onCancel() {
                return
            },
        })
    }

    return (
        <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}></Table>
    )
}
