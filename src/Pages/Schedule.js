//import React from 'react'
import React, { useRef,useState,useEffect } from 'react';
import Navbars from "../Components/Navbars";
import { Button,Modal, Table, Tag, Space } from "antd";
import "antd/dist/antd.css";
import { EditFilled,CheckCircleTwoTone} from '@ant-design/icons';
import { db } from '../firebase';
import { Form,InputGroup} from"react-bootstrap"
import { useAuth } from '../Contexts/AuthContext'

export default function ScheduleList() {
  
  //MEDS INFO
  const codeRef = useRef(null)        
  const nameRef = useRef(null)        
  const petRef = useRef(null)
  const reasonRef = useRef(null)
  const prescRef = useRef(null)
  const notesRef = useRef(null)
  const durationRef = useRef(null)
  const durationTypeRef = useRef(null)
  

  //MODAL FORM
  const [scheds,setSched] = useState(null)
  const [meds,setMeds] = useState(null)
  const [presc,setPresc] = useState(null)
  const [editData,setEditData] = useState(null)
  const {currentUser} = useAuth()
  const [userInfo,setUserInfo] = useState(null)
  const [cond,setCond] = useState("==")

  //MODAL FUNCTIONS
  const [isModalVisible, setIsModalVisible] = useState(false);

  /*const showModal = () => {
    setEditData(null)
    setIsModalVisible(true);
  };*/


  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: text => <h6>{text}</h6>,
      sorter: (a, b) => (a.date > b.date ? 1:-1),
    },
    {
      title: 'Schedule',
      dataIndex: 'sched',
      key: 'sched',
      render: text => <h6>{text}</h6>,
      sorter: (a, b) => (a.sched > b.sched ? 1:-1),
    },
    {
      title: 'Owner Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <h6>{text}</h6>,
      sorter: (a, b) => (a.name > b.name ? 1:-1),
    },
    {
      title: 'Pet Name',
      dataIndex: 'petname',
      key: 'petname',
      render: text => <h6>{text}</h6>,
      sorter: (a, b) => (a.petname > b.petname ? 1:-1),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      sorter: (a, b) => (a.reason > b.reason ? 1:-1),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      sorter: (a, b) => (a.status > b.status ? 1:-1),
      render: tags => (
        <>
          {tags.map(tag => {
            let color =  'green';
            if (tag === 'Completed') {
              color = 'blue';
            }else if(tag === 'Pending'){
              color = 'rgb(226, 125, 96)';
            }else if(tag === 'Done'){
              color = 'gray';
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
          {
            userInfo.userType==="Client" && record.status[0]==="Done" ? <Button onClick={()=>actionHandler(record)} type="primary" >View Prescriptions</Button> : userInfo.userType==="Client" ? "N/A" :
            record.status[0]==="Done" ?  <CheckCircleTwoTone style={{ fontSize: '25px'}} twoToneColor="#52c41a" /> :
            <Button onClick={()=>actionHandler(record)} type="primary" shape="round" icon={<EditFilled />} size="small">{record.status[0]==="Pending" ? "Approve":record.status[0]==="Completed" ? "Prescribe": "Complete"}</Button>
          }
        </Space>
      ),
    },
  ];

  const handleOk = () => {
    var info = getData()
    db.collection('Prescriptions').add({
      code : info.code,
      name : info.name,
      pet : info.pet,
      reason : info.reason,
      presc : info.presc,
      notes : info.notes,
      duration : info.duration,
      durationType : info.durationType,
    })
    db.collection('Appointments').doc(info.code)
      .update({
        "status":"Done"
      });
    alert("Status changed to Done")
    setIsModalVisible(false);
    document.getElementById("Med-form").reset();
  };

  const actionHandler = (record) =>{
    setPresc(null);
    setEditData(record)
    if(userInfo.userType==="Client"){
      console.log(record)

      db
      .collection("Prescriptions")
      .where("code", "==", record.key)
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map(doc =>({
          ...doc.data(),
          id:doc.id,
        }));
        setPresc(data);
      })
      setIsModalVisible(true);
    }else{
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
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getData = () => {
    var dt =
    { 
      "code" : codeRef.current.value,
      "name" : nameRef.current.value,
      "pet" : petRef.current.value,
      "reason" : reasonRef.current.value,
      "presc" : prescRef.current.value,
      "notes" : notesRef.current.value,
      "duration" : durationRef.current.value,
      "durationType" : durationTypeRef.current.value
    }
    return dt
}

useEffect(()=>{
  db
  .collection("Owner_Info")
  .where("userID", "==", currentUser.uid)
  .get()
  .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          setUserInfo(doc.data());
          setCond(doc.data().userType==="Admin" ? "!=" : "==");
      });
  })
},[currentUser])

  useEffect(()=>{
    const subscribe =
    db
    .collection('Appointments')
    .where("clientID",cond,currentUser.uid)
    .limit(100)
    .onSnapshot(querySnapshot =>{
      const data = querySnapshot.docs.map(doc =>({
          ...doc.data(),
          id:doc.id,
      }));
      var Schedules = []
      data.forEach(scheds=>{
        Schedules.push({
          key: scheds.id,
          sched: scheds.sched,
          date: scheds.Date,
          name: scheds.clientName,
          petname: scheds.petName,
          reason: scheds.reason,
          status: [scheds.status],
        })
      })
      setSched(Schedules)
    })
    return subscribe
  },[currentUser,cond])
  useEffect(()=>{
    const subscribe =
    db
    .collection('Meds')
    .where("Status","==","In-Stock")
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
  },[])
  console.log(presc)
  return (
    <>
        
        <Navbars title="Schedule List"></Navbars>
        
        <Modal 
          title="Prescription"
          visible={isModalVisible} 
          onCancel ={handleCancel}
          footer={[
            <Button type="primary" onClick={handleCancel}> {presc?"Close":"Cancel"}</Button>,
            <Button key="submit" type="primary" onClick={handleOk} className={presc ? "d-none":""}>Prescribe</Button>
          ]}
        >
          <Form id="Med-form">
              <Form.Group id="OwnerCode" className="d-none">
                  <Form.Label>Owner Code</Form.Label>
                  <Form.Control type="text" ref={codeRef} required defaultValue={editData ? editData.key : ""} disabled/>
              </Form.Group>
              <Form.Group id="Name">
                  <Form.Label>Owner</Form.Label>
                  <Form.Control type="text" ref={nameRef} required defaultValue={editData? editData.name : ""} disabled/>
              </Form.Group>
              <Form.Group id="pet">
                  <Form.Label>Pet Name</Form.Label>
                  <Form.Control type="text" ref={petRef} required defaultValue={editData? editData.petname : ""} disabled/>
              </Form.Group>
              <Form.Group id="reason">
                  <Form.Label>Reason for Visiting</Form.Label>
                  <Form.Control type="text" ref={reasonRef} required defaultValue={editData? editData.reason : ""} disabled/>
              </Form.Group>
              <Form.Group id="Prescription">
                  <Form.Label>Prescription</Form.Label>
                  <select className="form-select" ref={prescRef} id="medicine" disabled={presc?true:false}>
                    <option key={0} value="">Select Medicine</option>
                    {
                      meds ? meds.map((med)=>
                        <option selected={presc && presc[0].presc === med.name? true : false} key={med.code} value={med.name}>{med.name}</option>
                      ) : ""
                    }
                  </select>
              </Form.Group>
              <Form.Group id="Notes">
                  <Form.Label>Prescription Notes</Form.Label>
                  <Form.Control as="textarea" rows={5} type="text" ref={notesRef} defaultValue={presc? presc[0].notes : ""} required disabled={presc?true:false}/>
              </Form.Group>
              <Form.Group id="Notes">
                  <Form.Label>Duration</Form.Label>
                  <InputGroup className="mb-3">
                    <Form.Control min={1} type="number" ref={durationRef} required defaultValue={presc? presc[0].duration : ""} disabled={presc?true:false}/>
                    <select className="form-select" ref={durationTypeRef} id="medicine" disabled={presc?true:false}>
                      <option selected={presc && presc[0].durationType === "Day"? true : false} value="Day">Day/s</option>
                      <option selected={presc && presc[0].durationType === "Week"? true : false} value="Week">Week/s</option>
                      <option selected={presc && presc[0].durationType === "Month"? true : false} value="Month">Month/s</option>
                    </select>
                  </InputGroup>
              </Form.Group>
          </Form>
        </Modal>

        {/* TABLE */}
        <Table columns={columns} dataSource={scheds} />
    </>
  )
}