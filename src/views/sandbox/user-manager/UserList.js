import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'
// import { Switch } from 'react-router-dom';
const { confirm } = Modal;

export default function UserList() {
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const [isAddVisible, setisAddVisible] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const [isUpdateVisible,setisUpdateVisible] = useState(false)
  const [isUpdateDisabled,setisUpdateDisabled] = useState(false)
  const [current,setcurrent] = useState(null)

  useEffect(() => {
    axios.get("http://localhost:5000/users?_expand=role").then(res => {
      const list = res.data
      setDataSource(list)
    })
  }, [])

  useEffect(() => {
    axios.get("http://localhost:5000/regions").then(res => {
      const list = res.data
      setregionList(list)
    })
  }, [])

  useEffect(() => {
    axios.get("http://localhost:5000/roles").then(res => {
      const list = res.data
      setroleList(list)
    })
  }, [])


  // console.log(regionList);
  // console.log(...regionList);
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item=>({
          text:item.title,
          value:item.value
        })),
        {
          text:"全球",
          value:"全球"
        }
      ],
      onFilter:(value,item)=>{
        if(value ==="全球"){
          return item.region === ""
        }
        return item.region===value
      },
      
      render: (region) => {
        return <b>{region === "" ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (roles) => {
        // console.log(roles);
        return roles.roleName
      }

    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} 
        onChange={()=>handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        // console.log(item);
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />}
            onClick={() => confirmMethod(item)} disabled={item.default} />&nbsp;&nbsp;&nbsp;
          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} 
          onClick={()=>handleUpdate(item)}/>
        </div>
      }
    },
  ];

  const handleUpdate = async (item)=>{
    //  setTimeout(()=>{
      await setisUpdateVisible(true)
      if(item.roleId===1){
        // 禁用
        setisUpdateDisabled(true)
      }else{
        // 取消禁用
        setisUpdateDisabled(false)
      }
      // console.log(item);
      updateForm.current.setFieldsValue(item)
    //  },0)
      setcurrent(item)
  }

  const handleChange = (item)=>{
    // console.log(item);
    item.roleState = !item.roleState
    setDataSource([...dataSource])

    axios.patch(`http://localhost:5000/users/${item.id}`,{
      roleState:item.roleState
    })
  }


  const confirmMethod = (item) => {
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
  const deleteMethod = (item) => {
    setDataSource(dataSource.filter(data=>data.id!==item.id))
    axios.delete(`http://localhost:5000/users/${item.id}`)
  }

  const addFormOK = () => {
    addForm.current.validateFields().then(value => {
      // console.log(value);

      setisAddVisible(false)
      // setDataSource([...dataSource,{

      addForm.current.resetFieldValue()
      // }])
      // post到后端 生成id 再设置datasource 方便后面的删除和更新
      axios.post(`http://localhost:5000/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res=>{
        console.log(res.data);
        setDataSource([...dataSource,{
            ...res.data,
            role:roleList.filter(item=>item.id===value.roleId)[0]
        }])
      })
    }).catch(err => {
      console.log(err);
    })
  }

  const updateFormOK = ()=>{
    updateForm.current.validateFields().then(value => {
      // console.log(value);
      setisUpdateVisible(false)
      setDataSource(dataSource.map(item=>{
        if(item.id===current.id){
          return{
            ...item,
            ...value,
            role:roleList.filter(data=>data.id===value.roleId)[0]
          }
        }
        return item
      }))
      setisUpdateDisabled(!isUpdateDisabled)

      axios.patch(`http://localhost:5000/users/${current.id}`,value)
    })
  }

  return (
    <div>

      {/* dataSource是后端取回来的 所以要写成动态的 */}
      <Button type='primary' onClick={() => {
        setisAddVisible(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
      />

      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setisAddVisible(false)
        }}
        onOk={() => {
            addFormOK()
        }}>
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>

      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setisUpdateVisible(false)
          setisUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => {
          updateFormOK()
        }}>
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled}></UserForm>
      </Modal>

    </div>
  )
}
