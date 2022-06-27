import { Button, Form, Input, Modal, Table ,message} from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {  DeleteOutlined ,ExclamationCircleOutlined } from '@ant-design/icons'
import './NewsCategory.css'
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default function NewsCategory() {
  const [newsCategories, setNewsCategories] = useState([])

  //获取最新数据并设置
  const getSetNewsCategories = async () => { 
    const data = await (await fetch('http://localhost:5000/categories')).json()
    setNewsCategories(data)
   }

  useEffect(() => { 
    getSetNewsCategories()
    },[])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      editable: true,
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      })
    },
    {
      title: '操作',
      render: (item) => <Button shape='circle' icon={<DeleteOutlined />} danger onClick={() => showConfirm(item)}></Button>
    },
  ];

  // 弹出删除新闻的confirm
  const showConfirm = (item) => {
    Modal.confirm({
      title: '你确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        //删除该新闻分类
        deleteNewsCategory(item)
      },
      onCancel() {
        return
      },
    })
  }
  const deleteNewsCategory =async (category) => { 
    await fetch(`http://localhost:5000/categories/${category.id}`,{
      method: 'DELETE'
    })
    getSetNewsCategories()
   }
   //处理单元格编辑完成逻辑
   const handleSave =async (category) => {
    try {
      await fetch(`http://localhost:5000/categories/${category.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: category.title,
          value: category.value
        }),
        headers: {
          "Content-Type": 'application/json'
        }
      })
      getSetNewsCategories()
    } catch (error) {
      message.error("修改单元格发生错误！")
    }
  };
  const handleAdd = () => { 
    console.log('handle add')
   }
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        添加新闻分类
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={newsCategories}
        columns={columns}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
