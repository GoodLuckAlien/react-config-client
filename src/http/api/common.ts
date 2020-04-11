/* 公共api */
import  Http  from '../axios'
import { successResponseType } from '../axios'

function apiUploadImage(param:any){
    return Http.postRequest('/api/upload/image?CT=MF',param).then((res:successResponseType)=>res)
}

export default {
    apiUploadImage
}