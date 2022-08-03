import React from 'react'
import { Button } from 'antd'
import axios from 'axios'
export default function Home() {
  const ajax = ()=>{
    // 取数据 get
    // axios.get("http://localhost:8000/posts/2").then(res=>{
    //   console.log(res.data);
    // })

    // 增加数据 post
    // axios.post("http://localhost:8000/posts",{
    //   title:"33333",
    //   author:"xiaoming"
    // })

    // 修改 put替换式更新
    // axios.put("http://localhost:8000/posts/1",{
    //   title:"1111-xiugai"
    // })
    // 更新 patch 补丁式更新
    // axios.patch("http://localhost:8000/posts/1",{
    //   title:"1111-xiugai-111"
    // })

    // 删除 delete
    // axios.delete("http://localhost:8000/posts/1",{
      
    // })

    // _embed  取新闻拿评论
    // axios.get("http://localhost:8000/posts?_embed=comments").then(res=>{
    //   console.log(res.data);
    // })

    // _expand 取评论 拿新闻
    // axios.get("http://localhost:8000/comments?_expand=post").then(res=>{
    //   console.log(res.data);
    // })
  }
  return (
    <div>
      <Button type="primary" onClick={ajax}>Button</Button>
    </div>
  )
}
