import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProfileOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Layout, Menu, Button } from 'antd'
import { Navigate, Outlet, Link } from 'react-router-dom'
import styled from 'styled-components'

const { Header, Sider, Content } = Layout

const StyledLogo = styled.figure`
  display: block;
  img {
    width: 100%;
  }
`

const StyledLayout = styled(Layout)`
  .ant-menu-item {
    padding-left: 1rem !important;
  }
`

const FullLayout = () => {
  let location = useLocation()
  const [current, setCurrent] = useState('home')
  const [collapsed, setCollapsed] = useState(false)
  const user = sessionStorage.getItem('user')

  // if (!user) {
  //   return (
  //     <Navigate
  //       to={'/login'}
  //       state={{ from: location }}
  //       replace
  //     />
  //   )
  // }

  return (
    <StyledLayout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <StyledLogo>
          <img
            src="logo.png"
            alt="Logo"
          />
        </StyledLogo>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[current]}
        >
          <Link to="/">
            <Menu.Item
              eventKey="home"
              icon={<HomeOutlined />}
              onClick={() => setCurrent('home')}
            >
              Dashboard
            </Menu.Item>
          </Link>
          <Link to="/about">
            <Menu.Item
              eventKey="about"
              icon={<UserOutlined />}
              onClick={() => setCurrent('about')}
            >
              About
            </Menu.Item>
          </Link>
          <Link to="/posts">
            <Menu.Item
              eventKey="posts"
              icon={<ProfileOutlined />}
              onClick={() => setCurrent('posts')}
            >
              Posts
            </Menu.Item>
          </Link>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: 'white'
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: 'white'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </StyledLayout>
  )
}

export default FullLayout
