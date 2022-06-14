import React, { useState } from 'react'
import { Form, Select, Input } from 'antd'
import { forwardRef } from 'react/cjs/react.production.min';
const { Option } = Select;


const UserForm = forwardRef((props, ref) => {
    const [isDisabled, setisDisabled] = useState(false)

    const handleSelect = (item) => {
        // console.log(ref.current)
        //选中角色roleId为1时，设置区域select的disabled为true,name为1
        if (item == 1) {
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
                        required: !isDisabled,
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