import React from 'react'
import { useNavigate } from 'react-router'
import Snowfall from 'react-snowfall'
import { Form, Button, Input, message } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './Login.css'


export default function Login() {
    const navigate = useNavigate()
    /*
        这里的逻辑是使用输入的username，password和roleState向server发送一个get查询请求
        如果返回的数据，将其存为token，并路由跳转
    */
    const onFinish = async (value) => {
        try {
            const { username, password } = value
            const data = await (await fetch(`http://localhost:5000/users?username=${username}&password=${password}&roleState=${true}&_expand=role`)).json()
            if (data.length === 0) {
                message.error("用户名或密码错误")
            } else {
                const userInfo = data[0]
                localStorage.setItem('token', JSON.stringify(userInfo))
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='background'>
            <Snowfall snowflakeCount={300} />
            <div className="form-box">
                <div className="title">新闻管理系统</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
