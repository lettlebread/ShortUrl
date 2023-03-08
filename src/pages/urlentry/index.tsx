import { Layout, Button, Typography, Row, Col, Alert  } from 'antd';
import React, { useEffect, useState } from 'react';
const { Header, Content } = Layout;
const { Title } = Typography;

import { checkSessionApi } from "@/clientLib/request"

export default function Home() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userData, setUserData] = useState();

  const checkCookie = async() => {
    try {
      const data: any = await checkSessionApi()
      setUserData(data)
    } catch(e) {
      window.location.href = '/'
    }

  }

  useEffect(() => {
    checkCookie()
    console.log("checkCookie")
  }, [])

  return (
    <Layout className="layout">
      <Layout className="site-layout">
        { showAlert && (
          <Alert type="error" message={alertMessage} showIcon/>
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
            <Col span={1} offset={1} >
              <Button>Logout</Button>
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
        </Content>
      </Layout>
    </Layout>
  )
}