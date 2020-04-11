import { menuArray } from '../../layout/menu'
/* 路由菜单 */

export const  configRouter : menuArray = [{
    id: 1,
    pid: 0,
    name: 'router',
    path: 'router',
    meta: {
        name: '路由中心'
    },
    children: [
        {
            id: 2,
            pid: 1,
            name: 'routerConfig',
            path: '/config/routerConfig',
            meta: {
                name: '配置路由'
            },
        },
        // {
        //     id: 3,
        //     pid: 1,
        //     name: 'routerList',
        //     path: '/config/routerList',
        //     meta: {
        //         name: '路由列表'
        //     },
        // }
    ],
}]