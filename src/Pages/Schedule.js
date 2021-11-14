//import React from 'react'
import React, { useRef,useState,useEffect } from 'react';

import Navbars from "../Components/Navbars";

import { Button,Modal, Table, Tag, Space } from "antd";
import "antd/dist/antd.css";
import { EditFilled} from '@ant-design/icons';
import { db } from '../firebase';
import { Form } from"react-bootstrap"
import Loader from "react-loader-spinner";

export default function ScheduleList() {

  const [loading,setLoading] = useState(false)
  
const columns = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: text => <h6>{text}</h6>,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <h6>{text}</h6>,
  },
  {
    title: 'Reason',
    dataIndex: 'reason',
    key: 'reason',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: tags => (
      <>
        {tags.map(tag => {
          let color =  'green';
          if (tag === 'Completed') {
            color = 'blue';
          }else if(tag === 'Pending'){
            color = 'rgb(226, 125, 96)';
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
        <Button onClick={()=>editHandler(record)} type="primary" shape="round" icon={<EditFilled />} size="small">{record.status[0]==="Pending" ? "Approve":record.status[0]==="Completed" ? "Prescribe": "Complete"}</Button>
      </Space>
    ),
  },
];

  //MEDS INFO
  const codeRef = useRef(null)
  const nameRef = useRef(null)
  const purposeRef = useRef(null)
  const descRef = useRef(null)
  const typeRef = useRef(null)
  const quantityRef = useRef(null)

  //MODAL FORM
  const [scheds,setSched] = useState(null)
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
        Status: info.qty > 0 ? "In-Stock" : "Out of Stock"
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
        Status: info.qty > 0 ? "In-Stock" : "Out of Stock"
      })
    }
    setIsModalVisible(false);
    setLoading(false)
    document.getElementById("Med-form").reset();
  };

  const editHandler = (record) =>{
    console.log(record)
    if(record.status[0]==="Pending"){
      db.collection('Appointments').doc(record.key)
      .update({
        "status":"Approved"
      });
      alert("Status changed to Approved")
    }
    else if(record.status[0]==="Approved"){
      db.collection('Appointments').doc(record.key)
      .update({
        "status":"Completed"
      });
      alert("Status changed to Completed")
    }
    else{
      setIsModalVisible(true);
    }
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
    .collection('Appointments')
    .orderBy("Date")
    .limit(100)
    .onSnapshot(querySnapshot =>{
      const data = querySnapshot.docs.map(doc =>({
          ...doc.data(),
          id:doc.id,
      }));
      var Schedules = []
      data.forEach(sched=>{
        Schedules.push({
          key: sched.id,
          date: sched.Date,
          name: sched.clientName,
          reason: sched.reason,
          status: [sched.status],
        })
      })
      setSched(Schedules)
    })
    return subscribe
  },[])

  return (
    <>
        
        <Navbars title="Schedule List"></Navbars>
        
        <Modal 
          title={editData ? "Update Item" : "Add Item" }
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
                  <select className="form-select" ref={typeRef} id="type" >
                    <option selected={editData && editData.type==="Medicine" ? true : false } value="Medicine">Medicine</option>
                    <option selected={editData && editData.type==="Essentials" ? true : false } value="Essentials">Essentials</option>
                  </select>
              </Form.Group>
              <Form.Group id="Quantity">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control min={0} type="number" ref={quantityRef} required defaultValue={editData? editData.quantity : 0}/>
              </Form.Group>
          </Form>
        </Modal>

        {/* TABLE */}
        <Table columns={columns} dataSource={scheds} />
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