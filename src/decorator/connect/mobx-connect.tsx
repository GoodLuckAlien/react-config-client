import React from 'react'
import ProviderComponent from './context'

export type dispatchType = Function

export interface  connecType {
   dispatch:dispatchType,
}

export type getStateType = (T:any)=> Object

export default function connect(getState:getStateType) :any {
    return (Content:React.FC | typeof React.Component)=>(prop:Object)=>(<ProviderComponent  getState={getState} >
        { (connectProps:connecType) => <Content {...prop} { ...connectProps } /> }
   </ProviderComponent>)
}
