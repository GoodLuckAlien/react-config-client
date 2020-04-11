/* 用户中心 */
import  Http from '../axios'
import { successResponseType } from '../axios'

const { getRequest , postRequest } = Http

/* 注册用户名是否存在 */
function apiVerifyUsername(name:string){
    return getRequest('/user/verifyUsername',{ name }).then((res:successResponseType)=>res)
}

/* 注册用户 */
function apiRegisterUser(param:any){
    return postRequest('/user/register',param).then((res:successResponseType)=>res)
}

/*登陆 */
function apiLogin(param:any){
    return postRequest('/user/login',param).then((res:successResponseType)=>res)
}

/*获取用户信息 */
function apiUserInfo(){
    return getRequest('/api/user/info',{}).then((res:successResponseType)=>res)
}


export default {
    apiVerifyUsername,
    apiRegisterUser,
    apiLogin,
    apiUserInfo
}