import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import App from './app'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import './assets/styles/common.scss'
import 'antd/dist/antd.css'
import store from './model/index'
import { RouterHooks } from './components/common/async-router/router'

/* 全局路由守卫 */
RouterHooks.beforeRouterComponentLoad((history)=>{
   console.log('当前路由：',history.location.pathname)
})

ReactDOM.render(
    <Provider store={store}>
        <ConfigProvider locale={zhCN} >
            <App  />
        </ConfigProvider>
    </Provider>,
    document.getElementById('app')
)

