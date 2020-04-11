import React, { Component } from 'react'
import connect, { dispatchType } from '../../decorator/connect/mobx-connect'
import { Layout } from 'antd'
import { toJS } from 'mobx'
import CommonMenus , { menuArray } from '../../layout/menu'
import CommonHeader from '../../layout/head'
import commonApi from '../../http/api/common'
import { selectUploadFile , loginOut , formatList } from '../../utils/index'

const { apiUploadImage } = commonApi
const { Sider, Content } = Layout

export interface IndexProps {
    dispatch: dispatchType,
    userInfo: any,
    history: any
}


@connect((store) => ({ userInfo: toJS(store.userInfo.userInfo) }))
export default class Index extends Component<IndexProps, {}, {}> {

    state = {
        collapsed: false,
    }
    componentDidMount() {
        this.getUserInfo()
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        })
    }
    getUserInfo() {
        const { dispatch } = this.props
        dispatch({
            type: 'userInfo.getUserInfo',
        })
    }
    /* 上传头像 */
     uploadImg= async (ev:any)=> {
        const file = new FormData()
        file.append('file', ev.path[0].files[0])
        file.append('type','headImage')
        const res = await apiUploadImage(file)
        if(res.code === 0){
            this.getUserInfo()
        }
    }
    render() {
        const { menuList } = this.props.userInfo
        let newList:menuArray = []
        if(menuList && menuList.length > 0){
            newList =formatList(
                menuList.map(item=>{
                    return {
                        ...item,
                        meta:{
                            name:item.name,
                            icon:item.icon
                        }
                    }
                })
            )
        }
        return (
            <Layout>
                <Sider 
                    trigger={null} 
                    collapsible 
                    theme="dark"
                    collapsed={this.state.collapsed} 
                    breakpoint="lg" 
                >
                    <div className="logo" />
                    <CommonMenus  menus={newList} theme="dark" />
                </Sider>
                <Layout className="site-layout">
                    <CommonHeader
                        toggle={this.toggle.bind(this)}
                        collapsed={this.state.collapsed}
                        upload={() => selectUploadFile(this.uploadImg) }
                        loginOut={ () => loginOut(this.props.history)}
                        type='home'
                        { ...this.props }
                    />
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                        }}
                    >
                        展示中心
                </Content>
                </Layout>
            </Layout>
        )
    }
}