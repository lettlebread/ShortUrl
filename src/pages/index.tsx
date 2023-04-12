import { Layout, Button, Space, Typography, Card, Row, Col, Input, Tooltip, Alert  } from 'antd'
import React, { useState, useEffect } from 'react'
const { Header, Content } = Layout
const { Title, Text } = Typography
const { Search } = Input
import { CopyOutlined } from '@ant-design/icons'

import { createUrlEntryApi, checkSessionApi } from '@/clientLib/request'
import LoadingScreen from '../components/LoadingScreen'

export default function Home() {
  const [showLoading, setShowLoading] = useState(true)
  const [shortUrl, setShortUrl] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const urlValidator = (value: string) => {
    return (/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(value))
  }

  const onSearch = async (targetUrl: string) => {
    try {
      if (!urlValidator(targetUrl)) {
        throw Error("invalid url")
      }

      const urlEntry = await createUrlEntryApi({ targetUrl })
      setShortUrl(`${window.location.origin}/api/urlentry/${urlEntry.hashKey}`)
      showHintWithTimer('success', 'short url create success')
      setShowSuccess(true)
    } catch (e: any) {
      setShowAlert(true)
      showHintWithTimer('alert', 'short url create failed')
    }
  }

  const copyToClipboard = async(e: any): Promise<void> => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shortUrl)
    }
  }

  const onClickSignIn = (e: any) => {
    window.location.href = '/login'
  }

  const onClickSignUp = (e: any) => {
    window.location.href = '/register'
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
              <Card title="Create new short url" bordered={true} style={{width: 1000, justifyContent: 'center'}}>
                <Space direction="vertical"
                  style={{width: '100%'}}
                  size="large"
                >
                <Search
                  placeholder="input url"
                  allowClear
                  enterButton="create"
                  style={{width: '100%' }}
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

  useEffect(() => {
    checkSessionApi().then((userData) => {
      setShowLoading(true)
      window.location.href = '/urlentry'
    }).catch((e) => {
      setShowLoading(false)
      console.log('user not login')
    })
  }, [])

  return (
    <div>
      {showLoading ? <LoadingScreen /> : <App />}
    </div>
  )
}