import usePublish from "../../../hooks/usePublish";
import NewsPublish from "../../../components/publish-manage/NewsPublish";

export default function Published() {
  const { dataSource, getSetdataSource } = usePublish(2);

  return (
    <>
      <NewsPublish
        dataSource={dataSource}
        getSetdataSource={getSetdataSource}
      />
    </>
  );
}
