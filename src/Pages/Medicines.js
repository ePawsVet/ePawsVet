//import React from 'react'
import React, { useRef,useState,useEffect } from 'react';

import Navbars from "../Components/Navbars";

import { Button,Modal, Table, Tag, Space } from "antd";
import "antd/dist/antd.css";
import { DeleteFilled, EditFilled} from '@ant-design/icons';
import { db } from '../firebase';
import { Form } from"react-bootstrap"
import Loader from "react-loader-spinner";

export default function Medicines() {

  const [loading,setLoading] = useState(false)
  
const columns = [
  {
    title: 'Item Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <h6>{text}</h6>,
  },
  {
    title: 'Item Code',
    dataIndex: 'code',
    key: 'code',
    render: text => <h6>{text}</h6>,
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
        <Button onClick={()=>editHandler(record)} type="primary" shape="round" icon={<EditFilled />} size="small">Edit</Button>
        <Button onClick={()=>deleteHandler(record)} type="primary" shape="round" icon={<DeleteFilled />} size="small">Delete</Button>
      </Space>
    ),
  },
];

const expandable = { expandedRowRender: record => <p>{record.description}</p> };

  //MEDS INFO
  const codeRef = useRef(null)
  const nameRef = useRef(null)
  const purposeRef = useRef(null)
  const descRef = useRef(null)
  const typeRef = useRef(null)
  const quantityRef = useRef(null)

  //MODAL FORM
  const [meds,setMeds] = useState(null)
  const [editData,setEditData] = useState(null)

  //MODAL FUNCTIONS
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setEditData(null)
    setIsModalVisible(true);
  };

  const handleOk = (type) => {
    console.log(type)
    var info = getData()
    setLoading(true)
    if(type==="Add"){
      db.collection('Meds').add({
        Item_Code: info.code,
        Item_Name: info.name,
        Description: info.description,
        Purpose: info.purpose,
        Quantity: info.qty,
        Type: info.type,
        Status: "In-Stock"
      })
    }
    else{
      db.collection('Meds').doc(editData.key).set({
        Item_Code: info.code,
        Item_Name: info.name,
        Description: info.description,
        Purpose: info.purpose,
        Quantity: info.qty,
        Type: info.type,
        Status: "In-Stock"
      })
    }
    setIsModalVisible(false);
    setLoading(false)
    document.getElementById("Med-form").reset();
  };
  const editHandler = (record) =>{
    setEditData(record)
    setIsModalVisible(true);
  }
  const deleteHandler = (record) =>{
    setLoading(true)
    db
    .collection("Meds")
    .doc(record.key)
    .delete()
    .then(() => {
      setLoading(false)
      alert("Record successfully deleted!");
    }).catch((error) => {
      setLoading(false)
      alert("Error removing document: ", error);
    });
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getData = () => {
    var dt =
    { 
      "code"   : codeRef.current.value,
      "name"     : nameRef.current.value,
      "purpose"  : purposeRef.current.value,
      "description"    : descRef.current.value,
      "type"       : typeRef.current.value,
      "qty"     : quantityRef.current.value
    }
    return dt
}

  useEffect(()=>{
    const subscribe =
    db
    .collection('Meds')
    .limit(100)
    .onSnapshot(querySnapshot =>{
      const data = querySnapshot.docs.map(doc =>({
          ...doc.data(),
          id:doc.id,
      }));
      var Medicines = []
      data.forEach(med=>{
        Medicines.push({
          key: med.id,
          name: med.Item_Name,
          code: med.Item_Code,
          purpose: med.Purpose,
          type: med.Type,
          quantity: med.Quantity,
          status: [med.Status],
          description: med.Description
        })
      })
      setMeds(Medicines)
    })
    return subscribe
  })

  return (
    <>
        
        <Navbars title="Medicines"></Navbars>
        
        {/* ADD ITEM */}
        <Button className="inventory-add-item" type="primary" onClick={showModal}>
          Add Item
        </Button>

        <Modal 
          title="Add Item" 
          visible={isModalVisible} 
          onCancel ={handleCancel}
          footer={[
            <Button type="primary" onClick={handleCancel}> Cancel</Button>,
            <Button key="submit" type="primary" onClick={()=>{handleOk(editData ? "Update" : "Add")}}>{editData ? "Update Item" : "Add Item" }</Button>
          ]}
        >
          <Form id="Med-form">
              <Form.Group id="Code">
                  <Form.Label>Code</Form.Label>
                  <Form.Control type="text" ref={codeRef} required defaultValue={editData? editData.code : ""} />
              </Form.Group>
              <Form.Group id="Name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" ref={nameRef} required defaultValue={editData? editData.name : ""}/>
              </Form.Group>
              <Form.Group id="Purpose">
                  <Form.Label>Purpose</Form.Label>
                  <Form.Control type="text" ref={purposeRef} required defaultValue={editData? editData.purpose : ""}/>
              </Form.Group>
              <Form.Group id="Description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text" ref={descRef} required defaultValue={editData? editData.description : ""}/>
              </Form.Group>
              <Form.Group id="Type">
                  <Form.Label>Type</Form.Label>
                  <select ref={typeRef} id="type">
                    <option selected={editData && editData.type==="Medicine" ? true : false } value="Medicine">Medicine</option>
                    <option selected={editData && editData.type==="Essentials" ? true : false } value="Essentials">Essentials</option>
                  </select>
              </Form.Group>
              <Form.Group id="Quantity">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control type="number" ref={quantityRef} required defaultValue={editData? editData.quantity : ""}/>
              </Form.Group>
          </Form>
        </Modal>

        {/* TABLE */}
        <Table {...expandable} columns={columns} dataSource={meds} />
        {loading ?
            <Loader className="loading-spinner"
                type="Grid"
                color="#00BFFF"
                height={"100"}
                width={"100"}
        /> : null}
    </>
  )
}