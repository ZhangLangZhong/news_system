import React, { useEffect, useRef, useState } from 'react'
// import { Button } from 'antd'
import axios from 'axios'
import *as echarts from 'echarts'
import { Card, Col, Row, List, Avatar } from 'antd'
import _ from 'lodash'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;
export default function Home() {

  const [viewList, setviewList] = useState([])
  const [starList, setstarList] = useState([])

  const barRef = useRef()

  useEffect(() => {
    axios.get(`http://localhost:5000/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
      setviewList(res.data)
    })
  }, [])

  useEffect(() => {
    axios.get(`http://localhost:5000/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
      setstarList(res.data)
    })
  }, [])

  useEffect(() => {

    axios.get(`http://localhost:5000/news?publishState=2&_expand=category`).then(res=>{
      // console.log(res.data);
      // console.log(_.groupBy(res.data,item=>item.category.title));

      renderBarView(_.groupBy(res.data,item=>item.category.title))
    },[])

    const renderBarView = (obj) =>{
      // var chartDom = document.getElementById('main');
    var myChart = echarts.init(barRef.current);

    // 基于准备好的dom，初始化echarts实例
    // 绘制图表
    myChart.setOption({
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend:{
        data:['数量']
      },
      xAxis: {
        data: Object.keys(obj)
      },
      yAxis: {},
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item=>item.length)
        }
      ]
    });


    } 

  })

  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem("token"))


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
              title={username}
              description={
                <div>
                  <b>{region ? region : "全球"}</b>
                  <span style={{ paddingLeft: "30px" }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <div ref={barRef} style={{
        width: '100%',
        height: "400px",
        margin: "30px"
      }}></div>

    </div>
  )
}
