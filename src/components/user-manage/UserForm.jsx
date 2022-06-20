import React, { useState } from 'react'
import { Form, Select, Input } from 'antd'
import { forwardRef } from 'react/cjs/react.production.min';
const { Option } = Select;

//forwardRef接收父组件传入的ref容器
const UserForm = forwardRef((props, ref) => {
    //这个isDisabled状态变量用于控制角色为超级管理员时，区域的禁用状态
    const [isDisabled, setisDisabled] = useState(false)

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

    return (
        <Form
            layout="vertical"
            ref={ref}
        >
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
                        required: !isDisabled,  //若此项禁用则设置为非必填项
                    },
                ]}
            >
                <Select disabled={isDisabled}>
                    {
                        props.regionList.map((item) => {
                            return <Option value={item.value} key={item.id}>{item.title}</Option>
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
                            return <Option value={item.roleId} key={item.id}>{item.roleName}</Option>
                        })
                    }
                </Select>
            </Form.Item>
        </Form>
    )
}
)
export default UserForm