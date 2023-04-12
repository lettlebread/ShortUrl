import { Layout, Button, Typography, Row, Col, Alert, List, Space, Modal, Input, Form, FloatButton, Tooltip, Spin } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
const { Header, Content } = Layout
const { Title, Text } = Typography
const { TextArea } = Input
import { PlusOutlined } from '@ant-design/icons'

import { checkSessionApi, getUserUrlEntryApi, updateUrlEntryApi, deleteUrlEntryApi, createUrlEntryApi, userLogoutApi } from '@/clientLib/request'
import { UrlEntryApiData, SessionUser, NewUrlEntryArg } from '@/interfaces/request'
import { RuleObject } from 'antd/es/form'
import LoadingScreen from '../../components/LoadingScreen'

export default function Home() {
  const [showTransScreen, setShowTransScreen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [userData, setUserData] = useState<SessionUser>({} as SessionUser)
  const [apiBase, setApiBase] = useState('')
  const [urlEntryList, setUrlEntryList] = useState<UrlEntryApiData[]>([])
  const [initLoading, setInitLoading] = useState(true)
  const [openEditModel, setOpenEditModel] = useState(false)
  const [openDeleteModel, setOpenDeleteModel] = useState(false)
  const [openCreateModel, setOpenCreateModel] = useState(false)
  const [inEditItem, setInEditItem] = useState<UrlEntryApiData>({} as UrlEntryApiData)
  const [createModelForm] = Form.useForm()
  const [editModelForm] = Form.useForm()

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

  const onClickEditItem = (item: UrlEntryApiData) => {
    return (e: any) => {
      setInEditItem(item)
      setOpenEditModel(true)
      editModelForm.resetFields()
    }
  }

  const onClickDeleteItem = (item: UrlEntryApiData) => {
    return (e: any) => {
      setInEditItem(item)
      setOpenDeleteModel(true)
    }
  }

  const onClicEditModelCancel = (e: any) => {
    setOpenEditModel(false)
  }

  const onEditModelFormFinish = (formData: NewUrlEntryArg) => {
    const updateData = {
      targetUrl: formData.targetUrl,
      name: formData.name,
      description: formData.description
    } as NewUrlEntryArg

    setIsLoading(true)
    setOpenEditModel(false)
    updateUrlEntryApi(updateData, inEditItem.hashKey).then((newUrlEntry) => {
      setIsLoading(false)
      const idx = urlEntryList.findIndex(o => o.hashKey === newUrlEntry.hashKey)
      const newList = [...urlEntryList]
      newList[idx] = newUrlEntry
      setUrlEntryList(newList)
      showHintWithTimer('success', 'update success')
    }).catch((error) => {
      setIsLoading(false)
      setOpenEditModel(true)
      showHintWithTimer('alert', 'update failed')
    })
  }

  const onClickDeleteModelOk = (e: any) => {
    setOpenDeleteModel(false)
    setIsLoading(true)
    deleteUrlEntryApi(inEditItem.hashKey).then(() => {
      const idx = urlEntryList.findIndex(o => o.hashKey === inEditItem.hashKey)
      const newList = [...urlEntryList]
      newList.splice(idx, 1)
      setUrlEntryList(newList)
      setIsLoading(false)
      showHintWithTimer('success', 'delete success')
    }).catch((error) => {
      console.log('onClickDeleteModelOk err', error)
      setIsLoading(false)
      showHintWithTimer('alert', error)
    })
  }

  const onClickDeleteModelCancel = (e: any) => {
    setOpenDeleteModel(false)
  }

  const onClickCreateEntry = (e: any) => {
    setOpenCreateModel(true)
    createModelForm.resetFields()
  }

  const onClickCreateModelCancel = (e: any) => {
    setOpenCreateModel(false)
  }

  const onCreateModelFormFinish = (formData: NewUrlEntryArg) => {
    setIsLoading(true)
    setOpenCreateModel(false)
    createUrlEntryApi(formData).then((newEntry: UrlEntryApiData) => {
      setIsLoading(false)
      const newList = [...urlEntryList]
      newList.unshift(newEntry)
      setUrlEntryList(newList)
      showHintWithTimer('success', 'create success')
    }).catch((error) => {
      setIsLoading(false)
      setOpenCreateModel(true)
      showHintWithTimer('alert', 'create failed')
    })
  }

  const onClickLogout = (e: any) => {
    setIsLoading(true)
    userLogoutApi().then(() => {
      setIsLoading(false)
      showHintWithTimer('success', 'logout success')
      window.location.href = '/'
    }).catch((e) => {
      setIsLoading(false)
      showHintWithTimer('alert', 'logout failed')
    })
  }

  const copyToClipboard = async(targetUrl: string): Promise<void> => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(targetUrl)
    }
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

  const urlValidator = (_: RuleObject, value: string) => {
    if(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(value)) {
      return Promise.resolve()
    } else {
      return Promise.reject()
    }
  }

  const createListItem = (item: any) => {
    const shortUrl = `${apiBase + item.hashKey}`

    return (
      <List.Item
        key={item.name}
        actions={[
          <Button type="primary" key="edit-btn" onClick={onClickEditItem(item)}>edit</Button>,
          <Button key="delete-btn" onClick={onClickDeleteItem(item)}>delete</Button>
        ]}
      >
        <List.Item.Meta
          title={<Typography>{item.name || 'Untitled'}</Typography>}
          description={item.description || 'No description'}
        ></List.Item.Meta>
        <Space direction='vertical'>
          <Text type="secondary">target url: <a href={item.targetUrl}>{item.targetUrl}</a></Text>
          <Space direction='horizontal'>
            <Text type="secondary">
              short url: <a href={shortUrl}>{shortUrl}</a>
            </Text>
            <Tooltip title="copy url">
              <Button icon={<CopyOutlined />} onClick={()=>copyToClipboard(shortUrl)} />
            </Tooltip>
          </Space>
          <Text type="secondary">view times: <Text>{item.viewTimes}</Text></Text>
        </Space>
      </List.Item>
    )
  }

  const App = () => (
    <Spin spinning={isLoading} style={{minHeight: '100vh'}}>
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
              <Alert style={alertStyle} type={'success'} message={alertMessage} showIcon/>
            )}
            { showAlert && (
              <Alert style={alertStyle} type={'error'} message={alertMessage} showIcon/>
            )}
            <Row align="middle">
              <Col span={8} >
                <Title level={2}>Short Url Service</Title>
              </Col>
              <Col span={3} offset={9} >
                <Title level={5}>{userData.email}</Title>
              </Col>
              <Col span={1} offset={1} >
                <Button onClick={onClickLogout}>Logout</Button>
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
          <Title level={3}>My Url Entries</Title>
          <div
            id="scrollableDiv"
            style={{
              height: '100%',
              overflow: 'auto',
              padding: '0 16px',
            }}
          >
            <List
              className="demo-loadmore-list"
              loading={initLoading}
              itemLayout="vertical"
              dataSource={urlEntryList}
              renderItem={(item) => (
                createListItem(item)
              )}
            />
          </div>

            <Modal
              title="Update Url Entry"
              open={openEditModel}
              okText="Save"
              footer={null}
              onCancel={onClicEditModelCancel}
            >
              <Form
                form={editModelForm}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: isLoading }}
                onFinish={onEditModelFormFinish}
                requiredMark
                autoComplete="off"
                validateTrigger="onChange"
              >
                <Form.Item
                  label="Target Url"
                  name="targetUrl"
                  rules={[{
                    required: true,
                    message: 'Please input target url',
                    validator: urlValidator
                  }]}
                >
                  <TextArea />
                </Form.Item>
                <Form.Item
                  label="Entry Name"
                  name="name"
                  rules={[{ required: false, message: 'Please input entry name' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: false, message: 'Please input description' }]}
                >
                  <Input />
                </Form.Item>
                
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title="Title"
              open={openDeleteModel}
              onOk={onClickDeleteModelOk}
              onCancel={onClickDeleteModelCancel}
            >
              <p>Are you sure to delete this url entry?</p>
            </Modal>
            <Modal
              title="Create Url Entry"
              open={openCreateModel}
              okText="Create"
              footer={null}
              onCancel={onClickCreateModelCancel}
              maskClosable={isLoading}
            >
              <Form
                form={createModelForm}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: isLoading }}
                onFinish={onCreateModelFormFinish}
                requiredMark
                autoComplete="off"
                validateTrigger="onChange"
              >
                <Form.Item
                  label="Target Url"
                  name="targetUrl"
                  rules={[{
                    required: true,
                    message: 'Please input valid target url',
                    validator: urlValidator
                  }]}
                >
                  <TextArea />
                </Form.Item>
                <Form.Item
                  label="Entry Name"
                  name="name"
                  rules={[{ required: false, message: 'Please input entry name' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: false, message: 'Please input description' }]}
                >
                  <Input />
                </Form.Item>
                
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
            <FloatButton 
              tooltip="Create url entry"
              type="primary"
              icon={<PlusOutlined />}
              style={{ right: 100, top: 200 }}
              onClick={onClickCreateEntry} />
          </Content>
        </Layout>
      </Layout>
    </Spin>

  )

  useEffect(() => {
    checkSessionApi().then((userData) => {
      setShowTransScreen(false)
      setUserData(userData)
      return getUserUrlEntryApi()
    }).then((urlEntryData) => {
      setUrlEntryList(urlEntryData)
      setInitLoading(false)
    }).catch((e) => {
      window.location.href = '/'
    })

    setApiBase(`${location.protocol + '//' + window.location.host + '/api/urlentry/'}`)
  }, [])

  return (
    <div>
      {showTransScreen ? <LoadingScreen /> : <App />}
    </div>
  )
}