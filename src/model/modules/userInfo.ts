import { observable ,action } from 'mobx'
import Api from '../../http/api/user'

const { apiUserInfo } = Api

class UserInfo{
   @observable userInfo={}
   @observable number = 1
   @action
   async getUserInfo(){
      const res = await apiUserInfo()
      const { code , data } = res
      if(code ===0 ){
         this.userInfo = data
      }
   }
}

export default new UserInfo()