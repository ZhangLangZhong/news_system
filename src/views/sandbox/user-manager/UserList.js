import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Switch,Form ,Input} from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
// import { Switch } from 'react-router-dom';
const { confirm } = Modal;

export default function UserList() {

  const [isAddVisible,setisAddVisible] = useState(false)
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    axios.get("http://localhost:5000/users?_expand=role").then(res => {
      const list = res.data
      setDataSource(list)
    })
  }, [])

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === "" ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (roles) => {
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
        return <Switch checked={roleState} disabled={item.default} ></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        // console.log(item);
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />}
            onClick={() => confirmMethod(item)} disabled={item.default} />&nbsp;&nbsp;&nbsp;
          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} />
        </div>
      }
    },
  ];




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

  }

  return (
    <div>

      {/* dataSource是后端取回来的 所以要写成动态的 */}
      <Button type='primary' onClick={()=>{
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
        onCancel={()=>{
            setisAddVisible(false)
        }}
        onOk={() => {
          console.log("add");
        }}
      >
        <Form
          layout="vertical"
         
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the title of collection!' }]}
          >
            <Input />
          </Form.Item>
          
        </Form>
      </Modal>

    </div>
  )
}
