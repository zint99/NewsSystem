import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import "@wangeditor/editor/dist/css/style.css";
import { useState, useEffect } from "react";

export default function NewsEditor(props) {
  const [editor, setEditor] = useState(null); // 存储 editor 实例
  const [html, setHtml] = useState(""); // 编辑器内容
  console.log(props);
  const toolbarConfig = {};
  const editorConfig = {
    placeholder: "请输入内容...",
  };
  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  //设置路由跳转过来的原来的未更新前html内容
  const handleDefault = async () => {
    setHtml(props.defaultNewsContent);
    props.getNewsEditorContent(html, "未修改内容则默认不为空");
  };
  useEffect(() => {
    //如果是修改则执行这个handleDefault
    props.defaultNewsContent && handleDefault();
  }, [props.defaultNewsContent, handleDefault]);
  return (
    <>
      <div
        style={{ border: "1px solid #ccc", zIndex: 100 }}
        onBlur={() => {
          props.getNewsEditorContent(html, editor.getText().trim());
        }}
      >
        <Toolbar
          defaultConfig={toolbarConfig}
          editor={editor}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => {
            setHtml(editor.getHtml());
          }}
          mode="default"
          style={{ height: "320px", overflowY: "auto" }}
        />
      </div>
    </>
  );
}
