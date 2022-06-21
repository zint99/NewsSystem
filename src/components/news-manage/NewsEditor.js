import { Editor, Toolbar } from '@wangeditor/editor-for-react'
// import { IDomEditor, IEditorConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
import { useState, useEffect } from 'react'

export default function NewsEditor(props) {
    const [editor, setEditor] = useState(null) // 存储 editor 实例
    const [html, setHtml] = useState('') // 编辑器内容

    const toolbarConfig = {}
    const editorConfig = {
        placeholder: '请输入内容...',
    }
    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])
    return (
        <>
            <div style={{ border: '1px solid #ccc', zIndex: 100 }} onBlur={() => {
                props.getNewsEditorContent(html, editor.getText().trim())
            }}>
                <Toolbar
                    defaultConfig={toolbarConfig}
                    editor={editor}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={editor => setHtml(editor.getHtml())}
                    mode="default"
                    style={{ height: '300px', overflowY: 'auto' }}

                />
            </div>
        </>
    )
}