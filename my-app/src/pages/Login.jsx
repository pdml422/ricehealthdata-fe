import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Form, Input, notification } from 'antd'
import styled from 'styled-components'
import { login } from "../services"
import { useCookies } from 'react-cookie'
import axios from "axios";
import {getUsers} from "../services/user";
import { jwtDecode } from "jwt-decode"

const Wrapper = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.02);

  h1 {
    text-align: center;
  }
`

const StyledForm = styled(Form)`
    width: 300px;

    button {
        width: 100%;
        margin-bottom: 1rem;
    }

`

const Login = () => {
    const navigate = useNavigate()
    const [, setCookie] = useCookies(['accessToken'])

    const onFinish = async (values) => {
        try {
            const { data } = await login(values)
            setCookie('accessToken', data.token)
            localStorage.setItem('accessToken', data.token)
            sessionStorage.setItem('user', true)
            let decodedToken = jwtDecode(data.token);
            // console.log(decodedToken);
            if (decodedToken.groups[0] === 'ADMIN') {
                navigate('/')
            } else {
                    const config = {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                        },
                    };
                    const response = await axios.get('http://100.96.184.148:8080/users/me', config);
                    const userId = response.data.id;
                    localStorage.setItem('userId', userId);
                navigate('/users')
            }
            console.log(decodedToken.groups[0]);

        } catch (e) {
            notification.error({
                message: 'Error!',
                error: e
            })
            navigate('/login')
        }
    }

    return (
        <Wrapper>
            <Card>
                <h1>Login</h1>
                <StyledForm
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Username"
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            noStyle
                        >
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <a
                            href=""
                        >
                            {/*Forgot password*/}
                        </a>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                        >
                            Log in
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        Don't have an account ? <Link className="signup-link" to="/register">Sign Up</Link>
                    </Form.Item>
                </StyledForm>
            </Card>
        </Wrapper>
    )
}

export default Login
