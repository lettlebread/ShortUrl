import { Space, Spin } from 'antd'
import React from 'react'

const LoadingScreen = () => {
  return (
    <div style={{backgroundColor: 'white'}}>
      <Space direction="horizontal" style={{width: '100vw', justifyContent: 'center'}}>
        <Space direction="vertical" style={{height: '100vh', justifyContent: 'center'}}>
          <Spin tip="Loading" size="large">
          </Spin>
        </Space>
      </Space>
    </div>
  )
}

export default LoadingScreen