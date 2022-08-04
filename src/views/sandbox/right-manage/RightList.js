import React, { useState,useEffect } from 'react'
import {Table,Tag,Button,Modal,Popover,Switch} from 'antd'
import axios from 'axios'
import { EditOutlined ,DeleteOutlined,ExclamationCircleOutlined} from  '@ant-design/icons'
// import { Switch } from 'react-router-dom';
export default function RightList() {

  const {confirm} = Modal;
  const [dataSource,setDataSource] = useState([])

  useEffect(()=>{
    axios.get("http://localhost:5000/rights?_embed=children").then(res=>{
      const list = res.data
      // list[0].children = ''
      list.forEach(item=>{
        if(item.children.length === 0){
          item.children = ""
        }
      })
      setDataSource(res.data)
    })
  },[])

  // const dataSource = [
  //   {
  //     key: '1',
  //     name: '胡彦斌',
  //     age: 32,
  //     address: '西湖区湖底公园1号',
  //   },
  //   {
  //     key: '2',
  //     name: '胡彦祖',
  //     age: 42,
  //     address: '西湖区湖底公园1号',
  //   },
  // ];
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render:(key)=>{
        return <Tag color="orange">{key}</Tag>
      }
    },
    {
      title: '操作',
      render:(item)=>{
      // console.log(item);
      return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} 
           onClick={()=>confirmMethod(item)}/>&nbsp;&nbsp;&nbsp;

          <Popover content={<div style={{textAlign:"center"}}>
            <Switch defaultChecked={item.pagepermisson} onChange={()=>switchMethod(item)}></Switch>
            </div>} title="页面配置项" trigger={item.pagepermisson === undefined ?'':'click'}>
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled ={item.pagepermisson === undefined}/>
          </Popover>

        </div>
      }
    },
  ];


  //用户列表按钮点击的事件 
  const switchMethod = (item)=>{
    item.pagepermisson = item.pagepermisson === 1?0:1
    // console.log(item);
    // 强行更新的方法
    setDataSource([...dataSource])

    if(item.grade === 1){
      axios.patch(`http://localhost:5000/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }else{
      axios.patch(`http://localhost:5000/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
  }

  const confirmMethod = (item)=>{
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      onOk() {
        // console.log('OK');
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  // 删除确认
  const deleteMethod = (item)=>{
    console.log(item);
    // 当前页面同步状态+后端同步
    // setDataSource(dataSource.filter(data=>data.id!==item.id))

    if(item.grade === 1 ){
      setDataSource(dataSource.filter(data=>data.id !== item.id))
      axios.delete(`http://localhost:5000/rights/${item.id}`)
    }else{
      // console.log(item.rightId)   
      let list = dataSource.filter(data=>data.id===item.rightId)
      // console.log(list);
      list[0].children = list[0].children.filter(data=>data.id !== item.id)
      // console.log(list,dataSource);
      setDataSource([...dataSource])
      axios.delete(`http://localhost:5000/children/${item.id}`)
    }

    // 同步后端
    // axios.delete(`http://localhost:5000/rights/${item.id}`)
  }

  return (
    <div>

      {/* dataSource是后端取回来的 所以要写成动态的 */}
      <Table dataSource={dataSource} columns={columns} 
      pagination={{
        pageSize:10
      }}/>;
    </div>
  )
}
