import React,{useState,useEffect} from 'react'
import {message} from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'

export default function Published() {
  const [dataSource, setDataSource] = useState([])
  const userInfo = JSON.parse(localStorage.getItem('token'))

  const getSetdataSource = async (publishState) => { 
    let data = null
    try {
      if(userInfo.roleId === 1){
        data = await (await fetch(`http://localhost:5000/news?publishState=${publishState}&_expand=category`)).json()
      }else{
        data = await (await fetch(`http://localhost:5000/news?publishState=${publishState}&region=${userInfo.region}&_expand=category`)).json()
      }
    } catch (error) {
      message.error("获取数据失败")
    }finally{
      setDataSource(data)
    }
   }
  useEffect(() => { 
    getSetdataSource(2)
   },[])
  return (
    <>
      <NewsPublish dataSource={dataSource} getSetdataSource={getSetdataSource}/>
    </>
  )
}
