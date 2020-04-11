import React, { useState } from 'react'
import { Form, Input, Button, Select, message } from 'antd'
import API from '../../http/api/user'
import './login.scss'

type submitValueType = {
    username: string,
    password: string,
    confirmPassword: string,
    phone: string
}

const { apiVerifyUsername, apiRegisterUser, apiLogin } = API
const { Option } = Select

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 },
}

const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
}

const prefixSelector = (
    <Form.Item name="prefix" noStyle>
        <Select style={{ width: 70 }} defaultValue="86" >
            <Option value="86">+86</Option>
            <Option value="87">+87</Option>
        </Select>
    </Form.Item>
)

/* 验证用户名是否存在 */
export const verifyUsername = async (username: string) => {
    const res = await apiVerifyUsername(username)
    const { data, code } = res
    return code === 0 ? (data === 0) : true
}

/* 登陆页面 */
export default (props) => {
    const [form] = Form.useForm()
    const [isRegister, setRegister] = useState(false)
    const Submit = async (values: submitValueType) => {
        const { username, password, confirmPassword, phone } = values
        if (isRegister) { /* 注册 */
            if (password !== confirmPassword) {
                return message.error('确保两次输入验证码一致！')
            }
            const alreadyExist = await verifyUsername(username)
            if (alreadyExist) return message.error('该用户名已存在')
            const payload = {
                phone,
                password,
                username
            }
            const res = await apiRegisterUser(payload)
            if (res.code === 0) {
                message.success('注册成功')
                form.resetFields()
                setRegister(false)
            }
        } else { /* 登陆 */
            const res = await apiLogin({ username, password })
            const { code, data } = res
            if (code === 0) {
                window.localStorage.setItem('token', data)
                message.success('登陆成功！')
                setTimeout(() => {
                    props.history.push('/')
                }, 500)
            }
        }
    }
    return (
        <div className="login-box" >
            <div className="form-box" >
                <Form
                    {...layout}
                    onFinish={Submit}
                    initialValues={{ remember: true }}
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请输入密码!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    {
                        isRegister && (
                            <Form.Item
                                label="确认密码"
                                name="confirmPassword"
                                rules={[{ required: true, message: '请再次输入密码!' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                        )
                    }
                    {
                        isRegister && (
                            <Form.Item
                                label="手机号"
                                name="phone"
                                rules={[{ required: false }]}
                            >
                                <Input addonBefore={prefixSelector} />
                            </Form.Item>
                        )
                    }
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            {isRegister ? '注册' : '登陆'}
                        </Button>
                        <Button htmlType="button" style={{ marginLeft: "30px" }} onClick={() => setRegister(!isRegister)}>
                            {isRegister ? '返回登陆' : '注册'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}