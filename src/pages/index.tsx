import { Layout, Button, Space, Typography, Card, Row, Col, Input, Tooltip, Alert  } from 'antd';
import React, { useState } from 'react';
const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;
import { CopyOutlined } from '@ant-design/icons'

import { createUrlEntryApi } from "@/clientLib/request"

export default function Home() {
  const [shortUrl, setShortUrl] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const onSearch = async (targetUrl: string) => {
    try {
      const urlEntry = await createUrlEntryApi({ targetUrl })
      setShortUrl(`${window.location.origin}/api/urlentry/${urlEntry}`)
      setAlertMessage("create short url success")
      setShowSuccess(true)
    } catch (e: any) {
      setShowAlert(true)
      setAlertMessage(e.message)
    }
  }

  const copyToClipboard = async(e: any): Promise<void> => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shortUrl);
    }
  }

  const onClickSignIn = (e: any) => {
    window.location.href = '/login'
  }

  const onClickSignUp = (e: any) => {
    window.location.href = '/register'
  }

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
              <Alert type={"error"} message={alertMessage} showIcon/>
            )}
            <Row align="middle">
              <Col span={8} >
                <Title level={2}>Short Url Service</Title>
              </Col>
              <Col span={1} offset={12} >
              <Button onClick={onClickSignIn}>Sign in</Button>
              </Col>
              <Col span={1} offset={1} >
              <Button type='primary' onClick={onClickSignUp}>Sign up</Button>
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
            <Row align="middle" >
              <Col style={{width: '100%'}}>
                <Card title="Create new short url" bordered={true} style={{width: '80%', justifyContent: 'center'}}>
                  <Space direction="vertical"
                    style={{width: '100%'}}
                    size="large"
                  >
                  <Search
                    placeholder="input url"
                    allowClear
                    enterButton="create"
                    style={{width: "100%" }}
                    onSearch={onSearch}
                  />
                  <Input.Group compact>
                  <Input
                    addonBefore="short url:"
                    style={{ width: 'calc(100% - 200px)' }}
                    value={shortUrl}
                    readOnly={true}
                  />
                  <Tooltip title="copy url">
                    <Button icon={<CopyOutlined />} onClick={copyToClipboard} />
                  </Tooltip>
                </Input.Group>
                  </Space>
                </Card>
              </Col>
            </Row>  
          </Content>
        </Layout>
      </Layout>
  )
}