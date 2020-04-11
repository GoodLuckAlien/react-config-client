import  Http  from '../axios'
import { successResponseType } from '../axios'

/* 创建路由 */
function apiCreateRouterMenus(params:any){
    return Http.postRequest('/api/menu/create',params).then((res:successResponseType)=>res)
}

/* 获取路由菜单 */
function apiGetMenusList(){
    return Http.getRequest('/api/menu/list').then((res:successResponseType)=>res)
}

/* 删除路由 */
function apiDeleteMenus(id:number){
    return Http.deleteRequest(`/api/menu/${id}/delete`).then((res:successResponseType)=>res)
}

/* 修改路由 */
function apiPutEditMenus(id:number,params:any){
    return Http.putRequest(`/api/menu/${id}/edit`,params).then((res:successResponseType)=>res)
}

export default {
    apiCreateRouterMenus,
    apiGetMenusList,
    apiDeleteMenus,
    apiPutEditMenus
}