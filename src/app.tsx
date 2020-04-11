import React from 'react'
import { BrowserRouter as Router ,Switch , Route ,Redirect } from 'react-router-dom'
import asyncRouter from './components/common/async-router/router'



export default ()=>(
    <Router >
        <Switch>
            <Route path={'/home'} exact name="index"  component={ asyncRouter(() => import('./pages/home/home')) }   />
            <Route path={'/login'} name="login"  component={  asyncRouter(() => import('./pages/login/login')) }   />
            <Route path={'/config/'} name="config"  component={  asyncRouter(() => import('./pages/config/config')) }   />
            <Redirect from='/*' to='/home' />
        </Switch>
    </Router>
)

