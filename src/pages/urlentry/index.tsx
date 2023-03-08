import { Layout, Button, Typography, Row, Col, Alert, List, Space, Modal, Input, Form } from 'antd';
import React, { useEffect, useState } from 'react';
const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

import { checkSessionApi, getUserUrlEntryApi, updateUrlEntryApi, deleteUrlEntryApi } from "@/clientLib/request"
import { UrlEntryClientData, SessionUser } from "@/interfaces/request"

export default function Home() {
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userData, setUserData] = useState<SessionUser>({} as SessionUser);
  const [urlEntryList, setUrlEntryList] = useState<UrlEntryClientData[]>([]);
  const [initLoading, setInitLoading] = useState(true);
  const [openEditModel, setOpenEditModel] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [inEditItem, setInEditItem] = useState<UrlEntryClientData>({} as UrlEntryClientData);
  const [modelForm] = Form.useForm();

  const checkCookie = async() => {
    try {
      const data: any = await checkSessionApi()
      setUserData(data)
    } catch(e) {
      setAlertMessage("please login")
      setShowAlert(true)
      window.location.href = '/'
    }
  }

  const showHintWithTimer = (type: string, text: string) => {
    setAlertMessage(text)

    if (type === "alert") {
      setShowAlert(true)
    } else if (type === "success") {
      setShowSuccess(true)
    }
    
    setTimeout(() => {
      if (type === "alert") {
        setShowAlert(false)
      } else if (type === "success") {
        setShowSuccess(false)
      }
    }, 3000)
  }

  const onClickEdit = (item: UrlEntryClientData) => {
    return (e: any) => {
      console.log("click", item)
      setInEditItem(item)
      setOpenEditModel(true)
    }
  }

  const onClickDelete = (item: UrlEntryClientData) => {
    return (e: any) => {
      setInEditItem(item)
      setOpenDeleteModel(true)
    }
  }

  const onClickModelCancel = (e: any) => {
    setOpenEditModel(false)
    modelForm.resetFields()
  }

  const onModelFormFinish = (formData: any) => {
    const updateData: UrlEntryClientData = inEditItem

    updateData.targetUrl = formData.targetUrl
    updateData.name = formData.name
    updateData.description = formData.description
    updateUrlEntryApi(updateData).then((newUrlEntry) => {
      let idx = urlEntryList.findIndex(o => o.hashKey === newUrlEntry.hashKey)
      let newList = [...urlEntryList]
      newList[idx] = newUrlEntry
      setUrlEntryList(newList)
      setOpenEditModel(false)
      modelForm.resetFields()
      showHintWithTimer("success", "update success")
    }).catch((error) => {
      showHintWithTimer("alert", "update failed")
    })
  }

  const onClickDeleteModelOk = (e: any) => {
    deleteUrlEntryApi(inEditItem.hashKey).then(() => {
      let idx = urlEntryList.findIndex(o => o.hashKey === inEditItem.hashKey)
      let newList = [...urlEntryList]
      newList.splice(idx, 1)
      setUrlEntryList(newList)
      showHintWithTimer("success", "delete success")
      setOpenDeleteModel(false)
    }).catch((error) => {
      showHintWithTimer("alert", "delete failed")
    })
  }

  const onClickDeleteModelCancel = (e: any) => {
    setOpenDeleteModel(false)
  }

  useEffect(() => {
    checkCookie().then(() => {
      return getUserUrlEntryApi()
    }).then((urlEntryData) => {
      console.log("get urlEntryData", urlEntryData)
      setUrlEntryList(urlEntryData)
      setInitLoading(false)
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
            <Alert type={"success"} message={alertMessage} showIcon/>
          )}
          { showAlert && (
            <Alert type={"error"} message={alertMessage} showIcon/>
          )}
          <Row align="middle">
            <Col span={8} >
              <Title level={2}>Short Url Service</Title>
            </Col>
            <Col span={2} offset={9} >
              <Title level={4}>{userData.email}</Title>
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
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="vertical"
          dataSource={urlEntryList}
          renderItem={(item) => (
            <List.Item
              key={item.name}
              actions={[
                <Button type="primary" key="edit-btn" onClick={onClickEdit(item)}>edit</Button>,
                <Button key="delete-btn" onClick={onClickDelete(item)}>delete</Button>
              ]}
            >
              <List.Item.Meta
                title={<Typography>{item.name || "Untitled"}</Typography>}
                description={item.description || "No description"}
              ></List.Item.Meta>
              <Space direction='vertical'>
                <Text type="secondary">target url: <a href={item.targetUrl}>{item.targetUrl}</a></Text>
                <Text type="secondary">hash: <Text>{item.hashKey}</Text></Text>
              </Space>

            </List.Item>
          )}
        />
          <Modal
            title="Update Url Entry"
            open={openEditModel}
            okText="Save"
            footer={null}
            onCancel={onClickModelCancel}
          >
            <Form
              form={modelForm}
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: false }}
              onFinish={onModelFormFinish}
              requiredMark
              autoComplete="off"
              validateTrigger="onChange"
            >
              <Form.Item
                label="Target Url"
                name="targetUrl"
                rules={[{ required: true, message: 'Please input target url' }]}
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
        </Content>
      </Layout>
    </Layout>
  )
}