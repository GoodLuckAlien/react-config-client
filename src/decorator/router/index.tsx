import React from 'react'
import { Route } from 'react-router-dom'


function router(url:string){
    return  (Content:React.FC | typeof React.Component)=><Route  path={ url} component={Content} />
}

export default router