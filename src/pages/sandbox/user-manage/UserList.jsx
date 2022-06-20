import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Switch } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'

export default function UserList() {
    const [userList, setUserList] = useState([])    //用户列表
    const [isAddVisible, setIsAddVisible] = useState(false)
    const [regionList, setRegionList] = useState([])
    const [roleList, setRoleList] = useState([])
    const addRef = useRef(null) //表单UserForm的ref容器

    useEffect(() => {
        axios.get(`http://localhost:5000/users?_expand=role`).then((res) => {
            setUserList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get(`http://localhost:5000/regions`).then((res) => {
            setRegionList(res.data)
        })
    }, [])
    useEffect(() => {
        axios.get(`http://localhost:5000/roles`).then((res) => {
            setRoleList(res.data)
        })
    }, [])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            render: region => region === '' ? <b>全球</b> : <b>{region}</b>
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: role => role.roleName
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => <Switch checked={roleState} disabled={item.default}></Switch>
        },
        {
            title: '操作',
            render: (item) => (
                <div>
                    <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.default}></Button>
                    <Button shape='circle' icon={<DeleteOutlined />} danger disabled={item.default} onClick={() => { deleteUserHander(item) }}></Button>
                </div>
            )
        }
    ]
    //删除用户按钮
    const deleteUserHander = (user) => {
        try {
            Modal.confirm({
                title: '你确定删除吗?',
                icon: <ExclamationCircleOutlined />,
                async onOk() {
                    await fetch(`http://localhost:5000/users/${user.id}`, {
                        method: 'DELETE'
                    })
                    const response = await fetch(`http://localhost:5000/users?_expand=role`)
                    const data = await response.json()
                    setUserList(data)
                },
                onCancel() {
                    return
                },
            })
        } catch (error) {
            console.log(error)
        }
    }
    // 表单组件validateFields校验成功后向users post新用户
    const clickOkHandler = async () => {
        try {
            const value = await addRef.current.validateFields()
            await fetch(`http://localhost:5000/users`, {
                method: 'POST',
                body: JSON.stringify({
                    ...value,
                    "roleState": true,
                    "default": false,
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const response = await fetch(`http://localhost:5000/users?_expand=role`)
            const data = await response.json()
            setUserList(data)
            setIsAddVisible(false)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <Button type='primary' onClick={() => setIsAddVisible(true)}>添加用户</Button>
            <Table dataSource={userList}
                columns={columns}
                rowKey={item => item.id}
                pagination={{
                    pageSize: 5
                }}
            >
            </Table>
            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => setIsAddVisible(false)}
                onOk={() => clickOkHandler()}
            >
                <UserForm roleList={roleList} regionList={regionList} ref={addRef}></UserForm>
            </Modal>
        </div>
    )
}
