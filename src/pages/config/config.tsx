import React, { useState, useMemo } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import asyncRouter from '../../components/common/async-router/router'
import { Layout } from 'antd'
import CommonMenus from '../../layout/menu'
import CommonHeader from '../../layout/head'
// import connect  from '../../decorator/connect/mobx-connect'
import { IndexProps } from '../home/home'
import { loginOut } from '../../utils/index'
import { configRouter } from './common'
const { Sider, Content } = Layout


const config = (props: IndexProps) => {
    const { history } = props
    const [collapsed, setCollapsed] = useState(false)
    return (<Layout>
        <Sider trigger={null}
            collapsible
            collapsed={collapsed}
            breakpoint="lg"
            theme="light"
        >
            <div className="logo" />
            {useMemo(() => (
                <CommonMenus
                    menus={configRouter}
                    theme="light"
                />
            ), [configRouter])}
        </Sider>
        <Layout className="site-layout">
            <CommonHeader
                toggle={() => setCollapsed(!collapsed)}
                collapsed={collapsed}
                {...props}
                loginOut={() => loginOut(history)}
                type='config'
            />
            <Content
                className="site-layout-background"
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                }}
            >
                <Switch>
                    <Route
                        path={'/config/index'}
                        component={
                            asyncRouter(() => import('./content'))
                        }
                    />
                    <Route
                        path={'/config/routerConfig'}
                        component={
                            asyncRouter(() => import('../config-router/config-router'))
                        }
                    />
                    <Redirect from='/config' to={'/config/index'} />
                    <Redirect from='/config/*' to={'/config/index'} />
                </Switch>
            </Content>
        </Layout>
    </Layout>)
}

export default config