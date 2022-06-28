import { useEffect, useState, useCallback } from "react";
import { message } from "antd";

/*
    @publishState   要请求哪种发布状态的新闻 
    @dataSource 封装好的请求待发布、已发布、已下线的新闻列表
    @getSetdataSource 取最新数据并设置为dataSource
*/
const usePublish = (publishState) => {
  const [dataSource, setDataSource] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("token"));

  const getSetdataSource = useCallback(
    async (publishState) => {
      let data = null;
      try {
        if (userInfo.roleId === 1) {
          data = await (
            await fetch(
              `http://localhost:5000/news?publishState=${publishState}&_expand=category`
            )
          ).json();
        } else {
          data = await (
            await fetch(
              `http://localhost:5000/news?publishState=${publishState}&region=${userInfo.region}&_expand=category`
            )
          ).json();
        }
      } catch (error) {
        message.error("获取数据失败");
      } finally {
        setDataSource(data);
      }
    },
    [userInfo.region, userInfo.roleId]
  );

  useEffect(() => {
    getSetdataSource(publishState);
  }, [getSetdataSource, publishState]);

  return {
    dataSource,
    getSetdataSource,
  };
};

export default usePublish;
