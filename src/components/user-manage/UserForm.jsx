import React from 'react'
import { Form, Select, Input } from 'antd'
import { forwardRef } from 'react/cjs/react.production.min';
const { Option } = Select;

//forwardRef接收父组件传入的ref容器
const UserForm = forwardRef((props, ref) => {

    const { isDisabled, setisDisabled } = props
    const userInfo = JSON.parse(localStorage.getItem('token'))
    //此函数的作用是，若选中角色roleId为1(超级管理员)，setisDisabled(true)并清空region字段
    const handleSelect = (value) => {
        //这个value是字符串
        if (+value === 1) {
            setisDisabled(true)
            ref.current.setFieldsValue({
                region: ''
            })
        } else {
            setisDisabled(false)
        }
    }
    //判断region字段禁用
    //如果是添加用户表单，区域管理员将其他区域全部禁用
    //如果是修改表单，区域管理员禁用
    const checkRegionDisable = (region) => {
        // console.log(region)
        if (props.formType === 'add') {
            if (userInfo.roleId === 2) {
                return userInfo.region === region.value ? false : true
            } else {
                return false
            }
        } else {
            if (userInfo.roleId === 2) {
                return true
            } else {
                return false
            }
        }
    }
    //相同逻辑判断role字段禁用
    const checkRoleDisable = (role) => {
        console.log(role)
        if (props.formType === 'add') {
            if (userInfo.roleId === 2) {
                return role.roleType !== 3
            } else {
                return false
            }
        } else {
            if (userInfo.roleId === 2) {
                return true
            } else {
                return false
            }
        }
    }
    return (
        <Form
            layout="vertical"
            ref={ref}>
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名！',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: '请输入密码！',
                    },
                ]}
            >
                <Input type='password' />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={[
                    {
                        required: !isDisabled,
                    },
                ]}
            >
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map((item) => {
                            return <Option value={item.value} key={item.id} disabled={checkRegionDisable(item)}>{item.title}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select onSelect={item => handleSelect(item)}>
                    {
                        props.roleList.map((item) => {
                            return <Option value={item.roleType} key={item.id} disabled={checkRoleDisable(item)}>{item.roleName}</Option>
                        })
                    }
                </Select>
            </Form.Item>
        </Form>
    )
}
)
export default UserForm