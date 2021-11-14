//import React from 'react'
import React, { useState } from 'react';

import Navbars from "../Components/Navbars";

import { Button, InputNumber, Form, Input, Select, Modal, Table, Tag, Space } from "antd";
import "antd/dist/antd.css";
import { DeleteFilled, EditFilled} from '@ant-design/icons';

const columns = [
  {
    title: 'Item Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Item Code',
    dataIndex: 'code',
    key: 'code',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Purpose',
    dataIndex: 'purpose',
    key: 'purpose',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: tags => (
      <>
        {tags.map(tag => {
          let color =  'green';
          if (tag === 'Out of Stock') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">        
        <Button 
          type="primary" 
          shape="round" icon={<EditFilled />} 
          size="small" 
          onClick={()=> 
            console.log(record)
            
          }
        >
          Edit
        </Button>
        <Button 
          type="primary" 
          shape="round" 
          icon={<DeleteFilled />} 
          size="small" 
          onClick={()=> 
            console.log(record)
          }
          >
            Delete
          </Button>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    code: 'ITM 1',
    purpose: "Antibiotic",
    type: 'New York No. 1 Lake Park',
    quantity: "100",
    status: ['Out of Stock'],
    description: ""
  },
  {
    key: '2',
    name: 'Jim Green',
    code: 'ITM 2',
    purpose: "Cholesterol",
    type: 'London No. 1 Lake Park',
    quantity: "100",
    status: ['In Stock'],
    description: ""
  },
  {
    key: '3',
    name: 'Joe Black',
    code: 'ITM 3',
    purpose: "Asthma",
    type: 'Sidney No. 1 Lake Park',
    quantity: "100",
    status: ['Out of Stock'],
    description: ""
  },
];

const expandable = { expandedRowRender: record => <p>{record.description}</p> };
const { TextArea } = Input;


  
export default function Medicines() {
  //MODAL FORM
  const [componentSize, setComponentSize] = useState('default');

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };

  //MODAL FUNCTIONS
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  return (
    <>
        <Navbars title="Medicines"></Navbars>

        {/* ADD ITEM */}
        <Button type="primary" className="inventory-add-item" onClick={showModal}>
          Add Item
        </Button>
        <Modal 
          title="Add Item" 
          visible={isModalVisible} 
          onCancel ={handleCancel}
          footer={[
            <Button
              type="primary"
              onClick={handleCancel}
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleOk}
            >
              Submit
            </Button>
          ]}
        >
          <Form
            layout="vertical"
            initialValues={{
              size: "default"
            }}
            onValuesChange={onFormLayoutChange}
            size={componentSize}
          >
            <Form.Item 
              label="Code" 
            >
              <Input />
            </Form.Item>
            <Form.Item label="Name">
              <Input />
            </Form.Item>
            <Form.Item label="Purpose">
              <Input />
            </Form.Item>
            <Form.Item label="Description">
              <TextArea showCount maxLength={100}/>
            </Form.Item>
            <Form.Item label="Type">
              <Select>
                <Select.Option value="medicine">Medicine</Select.Option>
                <Select.Option value="essential">Essential</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="Quantity">
              <InputNumber min="1"/>
            </Form.Item>
          </Form>
        </Modal>

        {/* TABLE */}
        <Table {...expandable} columns={columns} dataSource={data} />
    </>
  )
}