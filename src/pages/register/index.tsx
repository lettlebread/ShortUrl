import { Layout, Button, Typography, Form, Row, Col, Input, Alert  } from 'antd'
import React, { useState, useEffect } from 'react'
const { Header, Content } = Layout
const { Title } = Typography

import { signUpUserApi, checkSessionApi } from '@/clientLib/request'

export default function Home() {
  const [showAlert, setShowAlert] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  
  const onFinish = async (formData: any) => {
    try {
      await signUpUserApi(formData.email, formData.password)
      setAlertMessage('sign up success')
      setShowSuccess(true)
      window.location.href = '/login'
    } catch(e: any) {
      setAlertMessage('sign up failed')
      setShowAlert(true)
    }
  }

  const onClickSignIn = (e: any) => {
    window.location.href = '/login'
  }

  useEffect(() => {
    checkSessionApi().then((userData) => {
      window.location.href = '/urlentry'
    }).catch((e) => {
      console.log('user not login')
    })
  }, [])

  return (
    <Layout className="layout">
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            paddingInline: 50,
          }}
        >
          { showSuccess && (
            <Alert type="success" message={alertMessage} showIcon/>
          )}
          { showAlert && (
            <Alert type={'error'} message={alertMessage} showIcon/>
          )}
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
}