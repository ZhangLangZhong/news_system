import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {Table,Button,Modal,Tree} from 'antd'
import {EditOutlined ,DeleteOutlined,ExclamationCircleOutlined} from  '@ant-design/icons'
const {confirm} = Modal

export default function RoleList() {

  const [dataSource,setDataSource] = useState([])
  const [RightList,setRightList] = useState([])
  const [currentRights,setcurrentRights] = useState([])
  const [isModalVisible,setisModalVisible] = useState(false)
  const [currentId,setcurrentId] = useState(0)

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render:(id)=>{
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render:(item)=>{
      // console.log(item);
      return <div>
          <Button danger shape="circle" icon={<DeleteOutlined onClick={()=>confirmMethod(item)}/>}  />&nbsp;&nbsp;&nbsp;
          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{
            setisModalVisible(true)
            setcurrentRights(item.rights)
            setcurrentId(item.id)
          }}/>
        </div>
      }
    }
  ]

  const confirmMethod = (item)=>{
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions', 
      onOk() {
        // console.log('OK');
        deleteMethod(item)
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }

  const deleteMethod = (item)=>{
      setDataSource(dataSource.filter(data=>data.id !== item.id))
      axios.delete(`http://localhost:5000/roles/${item.id}`)
  }

  useEffect(()=>{
    axios.get("http://localhost:5000/roles").then(res=>{
      // console.log(res.data);
      setDataSource(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get("http://localhost:5000/rights?_embed=children").then(res=>{
      // console.log(res.data);
      setRightList(res.data)
    })
  },[])

  // 成功的处理函数
  const handleOk = ()=>{
    console.log(currentRights);
    setisModalVisible(false)
    setDataSource(dataSource.map(item=>{
      if(item.id===currentId){
        return{
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
    axios.patch(`http://localhost:5000/roles/${currentId}`,{
      rights:currentRights
    })
  }
  // 失败的处理函数
  const handleCancel = ()=>{
    setisModalVisible(false)
  }

  const onCheck = (checkKeys)=>{
    // console.log(checkKeys);
    setcurrentRights(checkKeys)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        rowKey={(item)=>item.id}></Table>

      <Modal  title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Tree
              checkable
              checkedKeys={currentRights}
              onCheck={onCheck}
              // checkStrictly = {true}
              treeData={RightList}
          />
      </Modal>
    </div>
  )
}
