import axios,{ AxiosRequestConfig  , AxiosError , AxiosResponse } from 'axios'
import { message } from 'antd'
import qs from 'qs'

import { Router } from '../components/common/async-router/router'
import { BASE_URL, CODE, REQUEST_FAIL_MESSAGE } from '../utils/const'
import { parseQueryString } from '../utils/index'

export type Method = 'get' | 'post' | 'delete' | 'put' | 'option' | 'POST' | 'GET' | 'DELETE' | 'PUT'
export interface successResponseType extends AxiosResponse {
    code:number,
    data:any,
    message:string
}

const baseURL = process.env.NODE_ENV === 'development' ? BASE_URL : '/api'
axios.defaults.baseURL = baseURL

/* 超时时间 */
axios.defaults.timeout = 100 * 60 * 1000

/* 携带cookis */
//axios.defaults.withCredentials = true

/* 请求头类型 */
const contentType = {
    'MF': 'multipart/form-data;charset=utf-8',
    'AP': 'application/json; charset=utf-8',
    'AX': 'application/x-www-form-urlencoded;charset=UTF-8'
}


/**
 * 处理成功响应
 * @param res 请求成功返回
 */
function handerRequestSuccess(res:successResponseType){
    const { code  } = res
    if(code!==0){
       message.error(res.message)
    }
}

/**
 * 处理失败响应
 */
function handerRequestFail(req:any){
    const { status } = req
    const errorMessage = REQUEST_FAIL_MESSAGE[String(status)]
    message.error(errorMessage)
    switch(status){
        case CODE.EXPIRE: /* 跳转登陆 */
          return setTimeout(()=> Router && Router.push('/login'),500)
        case CODE.UNAUTHORIZED:
          return setTimeout(()=> Router && Router.push('/login'),1000)
    }
}

/* 请求拦截器 */
axios.interceptors.request.use(
    (config:AxiosRequestConfig):AxiosRequestConfig => {
        const method   = config.method || 'get'
        if (method.toLowerCase() === 'get') {  /* 防止浏览器缓存 */
            const url  = config.url || ''
            const t = new Date().getTime()
            config.url = `${url}${url.indexOf('?') === -1 ? '?' : '&'}t=${t}`
        }else if(method.toLowerCase() === 'post'){ /* 设置不同请求头 */
            const type = parseQueryString(config.url || '' ).CT
            config.headers['Content-Type'] = contentType[type ? type : 'AP' ]
        }
        const token = window.localStorage.getItem('token')
        if (token) {
            config.headers.common['Authorization'] = 'Bearer ' + token;
        }
        return config
    },
    (error:AxiosError) => {
        return Promise.reject(error)
    }
)

/* 响应拦截器 */
axios.interceptors.response.use(
    (res:AxiosResponse) :AxiosResponse =>{
        const { status , data } = res
        if(status===200){
            return data
        }
        return res
    },
    (error:AxiosError)=>{
        handerRequestFail(error.request)
        return Promise.reject(error)
    }
)

/**
 * axios请求
 * @param requestConfig 请求配置项
 */
function httpRequst(requestConfig:AxiosRequestConfig):Promise<any>{
    return new Promise((resolve,reject)=>{
        axios(requestConfig)
        .then((res:AxiosResponse)=>{
           resolve(res)
        })
        .catch((error:AxiosError)=>{
            reject(error)
        })
    })
}

/**
 * 处理get请求
 * @param url 请求url
 * @param params 请求参数
 */
httpRequst.getRequest = function(url:string,params={}):Promise<any>{
   return new Promise((resolve,reject)=>{
       axios.get(url,{ params })
       .then((response:successResponseType)=>{
          handerRequestSuccess(response)
          resolve(response)
       },(err)=>{
          reject(err)
       })
       .catch((err:AxiosError)=>reject(err))
   })
}

/**
 * 处理post请求
 * @param url 请求url
 * @param params 请求参数
 * @param options 请求配置项
 * @param isNeedQs 是否需要qs转译
 */
httpRequst.postRequest = function(url:string,params?:any,options={},isNeedQs?:boolean){
    return new Promise((resolve,reject)=>{
        axios
        .post(
            url,
            isNeedQs ? qs.stringify(params, {
                indices: false
            }) : params,
            options
        ).then((response:successResponseType)=>{
            handerRequestSuccess(response)
            resolve(response)
        },(err)=>{
            reject(err)
        })
        .catch((err:AxiosError)=>reject(err))
    })
}

/**
 * 处理delete请求
 * @param url 请求url
 * @param params 请求参数
 */
httpRequst.deleteRequest = function(url:string,params?:any){
    return new Promise((resolve,reject)=>{
        axios
        .delete(
            url,
            params ? qs.stringify(params) : ''
        ).then((response:successResponseType)=>{
            handerRequestSuccess(response)
            resolve(response)
        },(err)=>{
            reject(err)
        })
        .catch((err:AxiosError)=>reject(err))
    })
}

/**
 * 处理put请求请求
 * @param url 请求url
 * @param params 请求参数
 */
httpRequst.putRequest = function(url:string,params?:any){
    return new Promise((resolve,reject)=>{
        axios
        .put(
           url,
           params
        ).then((response:successResponseType)=>{
            handerRequestSuccess(response)
            resolve(response)
        },(err)=>{
            reject(err)
        })
        .catch((err:AxiosError)=>reject(err))
    })
}

export default httpRequst