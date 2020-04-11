import React from 'react'
import { Layout , Button} from 'antd'
import connect from '../decorator/connect/mobx-connect'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LoginOutlined,
    HomeOutlined,
    ToolOutlined
} from '@ant-design/icons'
const head = require('../assets/images/touxiang.png')
import './head.scss'

const { Header } = Layout

const CommonHeader = ({ toggle , collapsed ,userInfo , upload , loginOut, history , type  }) => (
    <Header className="site-layout-background" style={{ padding: 0 }}>
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: ()=>toggle(),
        })}
        <div className='isConfig' >
            <Button type="primary" 
                onClick={ ()=>  history.push( type === 'config' ? '/' : '/config' ) }  
                icon={  type === 'config' ? <HomeOutlined/> : <ToolOutlined /> } 
            >
                { type === 'home' ? '配置中心' : '展示中心' }
            </Button>
        </div>
        <div className="userInfo" >
            <img src={userInfo.avatar || head } onClick={ ()=>type ==='home' && upload() } />
            <span className="name" >{ userInfo.username }</span>
            <LoginOutlined onClick={ ()=> loginOut() } />
        </div>
    </Header>
)

export default connect((store) => ({ userInfo: store.userInfo.userInfo }))(CommonHeader)