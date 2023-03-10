import React from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'antd/dist/reset.css'
import '@/styles/index.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
