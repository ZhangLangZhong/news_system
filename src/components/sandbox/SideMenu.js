import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import axios from 'axios'
import {
  // UploadOutlined,
  UserOutlined,
  // VideoCameraOutlined,
  // MailOutlined,
  // AppstoreOutlined,
  // SettingOutlined 
} from '@ant-design/icons';
import './index.css'

const { Sider } = Layout;
const { SubMenu } = Menu;

// 模拟数组结构
// const menuList = [
//   {
//     key:"/home",
//     title:"首页",
//     icon:<UserOutlined/>
//   },

//   {
//     key:"/user-manage",
//     title:"用户管理",
//     icon:<UserOutlined/>,
//     children:[
//       {
//         key:"/user-manage/list",
//         title:"用户列表",
//         icon:<UserOutlined/>
//       }
//     ]
//   },

//   {
//     key:"/right-manage",
//     title:"权限管理",
//     icon:<UserOutlined/>,
//     children:[
//       {
//         key:"/right-manage/role/list",
//         title:"角色列表",
//         icon:<UserOutlined/>
//       },
//       {
//         key:"/right-manage/right/list",
//         title:"权限列表",
//         icon:<UserOutlined/>
//       }
//     ]
//   },
// ]

const iconList = {
  "/home": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/user-manage": <UserOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/news-manage/add": <UserOutlined />,
  "/audit-manage/audit": <UserOutlined />,
  "/publish-manage/unpublished": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />,
  "/news-manage/draft": <UserOutlined />,
  "/news-manage/category": <UserOutlined />,
}


function SideMenu(props) {


  const [menu, setMenu] = useState([])

  useEffect(() => {
    axios.get("http://localhost:5000/rights?_embed=children").then(res => {
      // console.log(res.data);
      setMenu(res.data)
    })
  }, [])

  const checkPagePermisson = (item) => {
    return item.pagepermisson === 1
  }

  const renderMenu = (menuList) => {
    return menuList.map(item => {
      // console.log(item);
      // 如果这一栏有孩子参数则出现submenu 不然就映射menuitem
      if (item.children?.length > 0 && checkPagePermisson(item)) {
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      return checkPagePermisson(item) && <Menu.Item key={item.key} icon={iconList[item.key]} title={item.title} onClick={() => {
        // console.log(props);
        props.history.push(item.key)
      }}>{item.title}</Menu.Item>
    })
  }

  // console.log(props.location);

  const selectKeys = [props.location.pathname]
  const openKeys = ["/" +  props.location.pathname.split("/")[1]]
  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className="logo">新闻发布管理系统</div>
        <div style={{flex:1,"overflow":"auto"}}>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={selectKeys} 
            className = "aaaaaa"
            defaultOpenKeys={openKeys}>
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}


// 高阶组件获取低阶组件 把sidemenu当做参数传出去
export default withRouter(SideMenu)