import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'

const { Option } = Select;


const UserForm = forwardRef((props, ref) => {

    const [isDisabled,setisDisabled] = useState(false)

    useEffect(()=>{
        setisDisabled(props.isUpdateDisabled)
    },[props.isUpdateDisabled])
    
    // console.log(ref);

    return (
        <Form ref={ref} layout="vertical" >
            <Form.Item
                name="username"
                label="用户名"
                // 表单中的输入规则 可搭配正则使用
                rules={[{ required: true, message: 'Please input the title of collection!' }]}>
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="密码"
                // 表单中的输入规则 可搭配正则使用
                rules={[{ required: true, message: 'Please input the title of collection!' }]}>
                <Input />
            </Form.Item>

            <Form.Item
                name="region"
                label="区域"
                // 表单中的输入规则 可搭配正则使用
                rules={isDisabled?[]:[{ required: true, message: 'Please input the title of collection!' }]}>
                <Select disabled = {isDisabled}  >
                    {
                        props.regionList.map(item =>
                            <Option value={item.value} key={item.id}>{item.title}</Option>
                        )
                    }
                </Select>
            </Form.Item>

            <Form.Item
                name="roleId"
                label="角色"
                // 表单中的输入规则 可搭配正则使用
                rules={[{ required: true, message: 'Please input the title of collection!' }]}>
                <Select onChange={(value)=>{
                    // console.log(typeof value)
                    if(value === "1"){
                        setisDisabled(true)
                        ref.current.setFieldsValue({
                            region:""
                        })
                    }else{
                        setisDisabled(false)
                    }
                }}>
                    {
                        props.roleList.map(item =>
                            <Option value={item.value} key={item.id}>{item.roleName}</Option>
                        )
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})

export default UserForm