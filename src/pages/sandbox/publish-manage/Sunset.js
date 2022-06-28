import usePublish from "../../../hooks/usePublish";
import NewsPublish from "../../../components/publish-manage/NewsPublish";

export default function Sunset() {
  const { dataSource, getSetdataSource } = usePublish(3);

  return (
    <>
      <NewsPublish
        dataSource={dataSource}
        getSetdataSource={getSetdataSource}
      />
    </>
  );
}
