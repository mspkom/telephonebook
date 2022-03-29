import React, { FC, useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Space, Table } from "antd";

import "./PhoneNumbers.css";

interface Entery {
  id: number;
  key: number;
  name: string;
  phone: string;
}

export const initialData: Entery[] = [
  { id: 1, key: 1, name: "John Doe", phone: "+49-40-12345-11" },
  { id: 2, key: 2, name: "Jane Doe", phone: "+49-40-12345-12" },
  { id: 3, key: 3, name: "Jim Foo", phone: "+49-40-12345-13" },
  { id: 4, key: 4, name: "Robert Smith", phone: "+49-40-12345-14" },
];

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Entery;
  index: number;
  children: React.ReactNode;
}

interface PhomeNumbersProps {
  addFunction: (value: boolean) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const PhoneNumbers: FC<PhomeNumbersProps> = ({ addFunction }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(initialData);
  const [editingKey, setEditingKey] = useState(0);
  const [addDisabled, setAddDisabled] = useState(false);

  useEffect(() => {
    const dataString: string | null = localStorage.getItem("phonebook");

    if (dataString) {
      setData(JSON.parse(dataString));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("phonebook", JSON.stringify(data));
  }, [data]);

  const isEditing = (record: Entery) => record.id === editingKey;

  const addEntery = () => {
    const newId = data.length + 1;
    const newEntery: Entery = { id: newId, key: newId, name: "", phone: "" };

    setAddDisabled(true);
    setData([newEntery, ...data]);
    editEntery(newEntery);
    addFunction(true);
  };

  const editEntery = (record: Partial<Entery> & { id: number }) => {
    form.setFieldsValue({ name: "", phone: "", ...record });

    setEditingKey(record.id);
  };

  const deleteElement = (record: Entery) => {
    const newData = data.filter((item) => item.id !== record.id);

    setData(newData);
  };

  const cancleElement = (record: Entery) => {
    if (!record.name || !record.phone) {
      deleteElement(record);
    }

    setAddDisabled(false);
    setEditingKey(0);
  };

  const saveElement = async (key: number) => {
    try {
      const row = (await form.validateFields()) as Entery;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey(0);
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey(0);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }

    setAddDisabled(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      editable: true,
    },
    {
      title: "",
      dataIndex: "operation",
      render: (_: any, record: Entery) => {
        const editable = isEditing(record);

        return editable ? (
          <>
            <Button
              data-testid="save-button"
              type="primary"
              onClick={() => saveElement(record.id)}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button
              data-testid="cancel-button"
              title="Sure to cancel?"
              onClick={() => cancleElement(record)}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Space>
            <Button
              data-testid="edit-button"
              type="primary"
              onClick={() => editEntery(record)}
            >
              Edit
            </Button>
            <Button
              data-testid="delete-button"
              type="primary"
              danger
              onClick={() => deleteElement(record)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Entery) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div data-testid="form-wrapper">
      <h1>TelephoneBook</h1>
      <Button
        className="add-button"
        onClick={addEntery}
        type="primary"
        data-testid="add-button"
        disabled={addDisabled}
      >
        Add new Entery
      </Button>
      <Form form={form} data-testid="form-element">
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: () => setEditingKey(0),
          }}
        />
      </Form>
    </div>
  );
};
