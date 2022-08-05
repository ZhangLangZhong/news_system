import React, { useEffect, useState } from 'react'
// import { Button } from 'antd'
import axios from 'axios'
import { Card, Col, Row, List,Avatar } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;
export default function Home() {

  const[viewList,setviewList] = useState([])
  const[starList,setstarList] = useState([])

  useEffect(()=>{
    axios.get(`http://localhost:5000/news?publishState=2&_wxpand=category&_sort=view&_order=desc&_limit=6`).then(res=>{
      setviewList(res.data)
    })
  },[])

  useEffect(()=>{
    axios.get(`http://localhost:5000/news?publishState=2&_wxpand=category&_sort=star&_order=desc&_limit=6`).then(res=>{
      setstarList(res.data)
    })
  },[])

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
            />
          </Card>
        </Col>


        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
            />
          </Card>
        </Col>


        <Col span={8}>
          <Card
            style={{
              
            }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title="Card title"
              description="This is the description"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
