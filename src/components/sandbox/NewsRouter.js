import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import Home from '../../views/sandbox/Home/Home'
import Nopermission from '../../views/sandbox//nopermission/Nopermission'
import RightList from '../../views/sandbox//right-manage/RightList'
import RoleList from '../../views/sandbox//right-manage/RoleList'
import UserList from '../../views/sandbox//user-manager/UserList'

// 本地路径对照表
const LocalRouterMap = {
    "/home":Home,
    "/user-manage/list":UserList,
    "/right-manage/role/list":RoleList,
    "/right-manage/right/list":UserList
}

export default function NewsRouter() {
  return (
    <Switch>
            <Route path="/home" component={Home} />
            <Route path="/user-manage/list" component={UserList} />
            <Route path="/right-manage/role/list" component={RoleList} />
            <Route path="/right-manage/right/list" component={RightList} />
            <Redirect from='/' to="/home/" exact />
            <Route path="*" component={Nopermission} />
    </Switch>
  )
}
