import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Form, Input, notification } from 'antd'
import styled from 'styled-components'
import { login } from "../services"
import { useCookies } from 'react-cookie'

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
  const [cookies, setCookie] = useCookies(['accessToken'])

  console.log(cookies)

    const onFinish = async (values) => {
        try {
            const { data } = await login(values)
            setCookie('accessToken', data.token)
            localStorage.setItem('accessToken', data.token)
            sessionStorage.setItem('user', true)
            navigate('/')
        } catch (e) {
            notification.error({
                message: 'Account not exist'
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
                  className="login-form-forgot"
                  href=""
              >
                Forgot password
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
              Don't have an account <Link to="/register">Sign Up</Link>
            </Form.Item>
          </StyledForm>
        </Card>
      </Wrapper>
  )
}

export default Login