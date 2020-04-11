import React from 'react'

type loadRouterType = () => Promise<{}>

type Component =  any 

type PropType = {
    history:any 
}

type HooksType = 'before' | 'after'

interface ObserverItem {
    type :HooksType
    callback:Function
}

const routerObserveQueue : Array<ObserverItem> = []

export let Router: any = null

/* 懒加载路由卫士钩子 */
export const RouterHooks = {
    /* 路由组件加载之前 */
    beforeRouterComponentLoad:function(callback:Function){
       routerObserveQueue.push({
           type:'before',
           callback,
       })
    },
    /* 路由组件加载之后 */
    afterRouterComponentDidLoaded(callback:Function){
       routerObserveQueue.push({
           type:'after',
           callback
       })
    }

}

export default function AsyncRouter(loadRouter:loadRouterType){
      return class Content extends React.Component<PropType>{
          constructor(props:PropType){
              super(props)
              this.dispatchRouterQueue('before')
          }
          state={
              Component:null,
          }
          dispatchRouterQueue(type:HooksType){
            const { history } = this.props
            if(!Router) Router = history
             routerObserveQueue.forEach((item:ObserverItem)=>{
                if(item.type===type) item.callback(history)
             })
          }
          componentDidMount(){
            if(this.state.Component) return
            loadRouter()
            .then((module: any) => module.default)
            .then((Component:Component) => this.setState({ Component },
            ()=>{
                this.dispatchRouterQueue('after')
            }))
          }
          render(){
              const { Component }:any = this.state
              return Component ? <Component {...this.props}  />  : null
          }
      }
}