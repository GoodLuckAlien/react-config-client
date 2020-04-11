import { observer, inject } from 'mobx-react'
import  React , { Component  } from 'react'
import { connecType ,getStateType } from './mobx-connect'
import { isFuntion  } from '../../utils/index'

interface ProviderProps {
    children: (prop:connecType)=> React.ReactElement | React.FC
    store?:Object
    getState:getStateType
}


@inject('store')
@observer
class ProviderComponet extends Component<ProviderProps> {

    /**
     * 
     * @param type 
     */
    dispatch({ type , payload }){
       const { store } :any = this.props 
       const dispatchArr:string[] = type.split('.')
       if(dispatchArr.length !==2 ) return
       const moduleName = dispatchArr[0]
       const FuntionName = dispatchArr[1]
       if(!store[moduleName]) return
       store[moduleName][FuntionName] && isFuntion(store[moduleName][FuntionName]) && store[moduleName][FuntionName](payload)
    } 

    render() {
       const { store  , getState } : any = this.props 
       let state = {}
       try{
           state = getState(store)
       }catch(e){
           console.warn(e)
       } 
       return  this.props.children({ dispatch:this.dispatch.bind(this) , ...state }) 
    }   
}

export default ProviderComponet