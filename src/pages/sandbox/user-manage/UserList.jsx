import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Table, Button, Modal, Switch } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'

export default function UserList() {
    const [userList, setUserList] = useState([])    //用户列表
    const [isAddVisible, setIsAddVisible] = useState(false)     //控制添加用户模态框
    const [isEditVisible, setIsEditVisible] = useState(false)   //控制编辑用户模态框
    //这个isDisabled状态变量用于控制角色为超级管理员时，区域region字段的禁用状态
    const [isDisabled, setisDisabled] = useState(false)
    const [currentEditUserId, setCurrentEditUserId] = useState(0)
    const [regionList, setRegionList] = useState([])
    const [roleList, setRoleList] = useState([])
    const addRef = useRef(null) //添加用户时，表单UserForm的ref容器
    const editRef = useRef(null) //编辑用户时，表单UserForm的ref容器
    const userInfo = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        //这里的逻辑是如果是权限最高的管理员就渲染所有user到userList，如果是区域管理员，则只取自己和同一地区的编辑
        axios.get(`http://localhost:5000/users?_expand=role`)
            .then((res) => {
                if (userInfo.roleId === 1) {
                    setUserList(res.data)
                } else {
                    setUserList([
                        ...res.data.filter(item => item.username === userInfo.username),
                        ...res.data.filter(item => item.region === userInfo.region && item.roleId === 3)
                    ])
                }
            })
    }, [userInfo.username, userInfo.region, userInfo.roleId])
    useEffect(() => {
        axios.get(`http://localhost:5000/regions`)
            .then((res) => {
                setRegionList(res.data)
            })
    }, [])
    useEffect(() => {
        axios.get(`http://localhost:5000/roles`)
            .then((res) => {
                setRoleList(res.data)
            })
    }, [])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            render: region => region === '' ? <b>全球</b> : <b>{region}</b>,
            filters: [{
                text: '全球',
                value: '全球'
            }, ...regionList.map((item) => {
                return {
                    text: item.title,
                    value: item.value
                }
            })],
            onFilter: (value, item) => {
                if (value === '全球' && item.region === '') {
                    return true
                } else {
                    return item.region === value
                }
            }
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
            render: (roleState, item) => <Switch
                checked={roleState}
                disabled={item.default}
                onChange={() => { changeUserStateHandler(item) }}
            ></Switch>
        },
        {
            title: '操作',
            render: (item) => (
                <div>
                    <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.default} onClick={() => { editUserHandler(item) }}></Button>
                    <Button shape='circle' icon={<DeleteOutlined />} danger disabled={item.default} onClick={() => { deleteUserHander(item) }}></Button>
                </div>
            )
        }
    ]

    //修改用户状态，roleState为false则用户无法登录
    const changeUserStateHandler = (user) => {
        fetch(`http://localhost:5000/users/${user.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                roleState: !user.roleState
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                fetch(`http://localhost:5000/users?_expand=role`)
                    .then((res) => { return res.json() })
                    .then((data) => { setUserList(data) })
            })
    }
    //打开编辑用户模态框，如果为超级管理员
    const editUserHandler = async (user) => {
        await setIsEditVisible(true)
        if (+user.roleId === 1) {
            setisDisabled(true)
        } else {
            setisDisabled(false)
        }
        setCurrentEditUserId(user.id)
        //设置模态框中表单字段
        editRef.current.setFieldsValue(user)
    }
    //确定编辑用户信息
    const clickEditHandler = async () => {
        try {
            const value = await editRef.current.validateFields()
            await fetch(`http://localhost:5000/users/${currentEditUserId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    ...value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await (await fetch(`http://localhost:5000/users?_expand=role`)).json() //这里将fetch的两步连起写
            setUserList(data)
            setIsEditVisible(false)
        } catch (error) {
            console.log(error)
        }
    }
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
    const clickAddHandler = async () => {
        try {
            const value = await addRef.current.validateFields() //value为校验后各表单的值
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
            addRef.current.resetFields()
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
                }}>
            </Table>
            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => setIsAddVisible(false)}
                onOk={() => clickAddHandler()}>
                <UserForm roleList={roleList}
                    regionList={regionList}
                    ref={addRef}
                    isDisabled={isDisabled}
                    setisDisabled={setisDisabled}
                    formType={'add'}
                ></UserForm>
            </Modal>
            <Modal
                visible={isEditVisible}
                title="编辑用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    // 注意关闭编辑用户模态框使将setisDisabled(false)
                    setIsEditVisible(false)
                    setisDisabled(false)
                }}
                onOk={() => clickEditHandler()}>
                <UserForm roleList={roleList}
                    regionList={regionList}
                    ref={editRef}
                    isDisabled={isDisabled}
                    setisDisabled={setisDisabled}
                    formType={'update'}
                ></UserForm>
            </Modal>
        </div >
    )
}
