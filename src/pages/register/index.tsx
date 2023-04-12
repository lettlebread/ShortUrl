import { Layout, Button, Typography, Form, Row, Col, Input, Alert  } from 'antd'
import React, { useState, useEffect } from 'react'
const { Header, Content } = Layout
const { Title } = Typography

import { signUpUserApi, checkSessionApi } from '@/clientLib/request'
import LoadingScreen from '../../components/LoadingScreen'

export default function Home() {
  const [showTransScreen, setShowTransScreen] = useState(true)
  const [showAlert, setShowAlert] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  
  const onFinish = async (formData: any) => {
    try {
      await signUpUserApi(formData.email, formData.password)
      showHintWithTimer('success', 'login success')
      window.location.href = '/login'
    } catch(e: any) {
      showHintWithTimer('alert', 'login failed')
    }
  }

  const onClickSignIn = (e: any) => {
    window.location.href = '/login'
  }

  const alertStyle = {
    position: 'absolute',
    zIndex: 99,
    top: 30,
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    left: 0,
    right: 0
  } as React.CSSProperties

  const showHintWithTimer = (type: string, text: string) => {
    setAlertMessage(text)

    if (type === 'alert') {
      setShowAlert(true)
    } else if (type === 'success') {
      setShowSuccess(true)
    }

    setTimeout(() => {
      if (type === 'alert') {
        setShowAlert(false)
      } else if (type === 'success') {
        setShowSuccess(false)
      }
    }, 3000)
  }

  const App = () => (
    <Layout className="layout">
      <Layout className="site-layout">
        { showSuccess && (
              <Alert type="success" style={alertStyle} message={alertMessage} showIcon/>
        )}
        { showAlert && (
          <Alert type={'error'} style={alertStyle} message={alertMessage} showIcon/>
        )}
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            paddingInline: 50,
          }}
        >
          <Row align="middle">
            <Col span={8} >
              <Title level={2}>Short Url Service</Title>
            </Col>
            <Col span={1} offset={12} >
              <Button onClick={onClickSignIn}>Sign in</Button>
            </Col>
          </Row>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
          }}
        >
          <Title level={2}>Sign Up</Title>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            autoComplete="off"
            onFinish={onFinish}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input email' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input password!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </Layout>
  )

  useEffect(() => {
    checkSessionApi().then((userData) => {
      window.location.href = '/urlentry'
    }).catch((e) => {
      setShowTransScreen(false)
      console.log('user not login')
    })
  }, [])

  return (
    <div>
      {showTransScreen ? <LoadingScreen /> : <App />}
    </div>
  )
}