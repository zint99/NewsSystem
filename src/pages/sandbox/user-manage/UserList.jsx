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
    const addRef = useRef(null) //表单UserForm的引用

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
                    <Button shape='circle' icon={<DeleteOutlined />} danger disabled={item.default}></Button>
                </div>
            )
        }
    ]



    return (
        <div>
            <Button type='primary' onClick={() => setIsAddVisible(true)}>添加用户</Button>
            <Table dataSource={userList} columns={columns}
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
                onOk={() => {
                    // console.log('add', addRef.current)
                    addRef.current.validateFields().then((res) => {
                        console.log(res)
                    }).catch((err) => {
                        console.log(err)
                    })
                }}
            >
                <UserForm roleList={roleList} regionList={regionList} ref={addRef}></UserForm>
            </Modal>

        </div>
    )
}
