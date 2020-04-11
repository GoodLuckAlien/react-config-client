import React from 'react'
import { Menu } from 'antd'

import { Router } from '../components/common/async-router/router'

const { Item, SubMenu } = Menu

export type menuArray = Array<MenuItemType>

type MenuItemType = {
    id: number
    pid: number
    name: string
    path: string
    meta: any
    children?: menuArray
}

// /**
//  * 
//  * @param menus 原菜单列表
//  * @param currentPath 当前路径
//  */
// function findOpenkeys(menus:menuArray,currentPath:any){
//     if(!currentPath) return currentPath
//      return menus ? true : false
// }

const renderMenus = (menu: menuArray) => (
    menu.map((menu: MenuItemType) => {
        const {
            children,
            path,
            meta
        } = menu
        if (children && children.length > 0) {
            return (
                <SubMenu
                    key={path}
                    title={meta.name}  >
                    {
                        renderMenus(children)
                    }
                </SubMenu>
            )
        }
        return (
            <Item
                key={path}
                onClick={ ()=>Router && Router.push(path) }
            >
                {meta.name}
            </Item>
        )
    })
)

export default ({ theme, menus  }) => {
    //const { location } = Router || {}
    //const  openKeys = findOpenkeys(menus,location ? location.pathname : '')
    return (
        <Menu
            theme={theme || 'dark'}
            mode="inline"
            defaultSelectedKeys={[ location && location.pathname ]}
            defaultOpenKeys={['router']}
        >
            {renderMenus(menus)}
        </Menu>
    )
}