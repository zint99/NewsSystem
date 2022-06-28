import usePublish from "../../../hooks/usePublish";
import NewsPublish from "../../../components/publish-manage/NewsPublish";

export default function Unpublished() {
  const { dataSource, getSetdataSource } = usePublish(1);

  return (
    <>
      <NewsPublish
        dataSource={dataSource}
        getSetdataSource={getSetdataSource}
      />
    </>
  );
}
