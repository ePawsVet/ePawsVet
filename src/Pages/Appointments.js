import React, { useState,useRef,useEffect } from 'react';
import Navbars from "../Components/Navbars";
import Calendars from '../Components/Calendar';
import { Alert,Modal,Button,Form,Table } from 'react-bootstrap'
import moment from 'moment';
import { useAuth } from '../Contexts/AuthContext'
import {db} from "../firebase"
import emailjs from 'emailjs-com';

import { notification } from "antd";
import { CalendarOutlined } from '@ant-design/icons';



export default function Appointments() {
  const [modalShow, setModalShow] = useState(false);
  const [adminModalShow, setAdminModalShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [error,setError] = useState("")
  const dateRef = useRef()
  const petRef = useRef()
  const reasonRef = useRef()
  const {createAppointment,currentUser} = useAuth()
  const [userInfo,setUserInfo] = useState(null)
  const [petInfo,setPetInfo] = useState(null)
  const [evts,setEvents] = useState([])

  //NOTIFICATION 1
  const openNotification1 = placement => {
    notification.warning({
      message: `Warning!`,
      description:
        'This date is already full. Please select another date.',
      placement,
    });
  };
  //NOTIFICATION 2
  const openNotification2 = placement => {
    notification.warning({
      message: `Warning!`,
      description:
        'You can only request an appointment Two(2) Days from now.',
      placement,
    });
  };

  useEffect(()=>{
    db
    .collection("Owner_Info")
    .where("userID", "==", currentUser.uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            setUserInfo(doc.data());
        });
    })

    db
    .collection("Pet_Info")
    .where("ownerID", "==", currentUser.uid)
    .get()
    .then((querySnapshot) => {
        const data = querySnapshot.docs.map(doc =>({
            ...doc.data(),
            id:doc.id,
        }));
        setPetInfo(data);
    })
  },[currentUser])


  useEffect(()=>{
    const unsubscribe = 
        db
        .collection('Appointments')
        .where("status","!=","Cancelled")
        .orderBy("status")
        .orderBy("priority")
        .orderBy("time")
        .onSnapshot(querySnapshot =>{
        const data = querySnapshot.docs.map(doc =>({
            ...doc.data(),
            id:doc.id,
        }));
        setEvents(data)
    })
    return unsubscribe
  },[])
  
  const getAddedDays = () =>{
    var someDate = new Date();
    var numberOfDaysToAdd = 2;
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd)
    var dd = someDate.getDate();
    var mm = someDate.getMonth() + 1;
    var y = someDate.getFullYear();

    var someFormattedDate = y + '-' + mm + '-' + dd;
    return someFormattedDate
  }

  const onChange = (newDate) => {
    var tot = 0;
    var evtDate = moment(newDate).format("L")
    evts.forEach(evt=>{
      if(evt.Date === evtDate){
        tot += parseInt(evt.span)
      }
    })
    
    var d1 = new Date(getAddedDays())
    var d2 = new Date(newDate);
    if(d2 >= d1 || userInfo.userType === "Admin"){
      if(tot < 480){
        setDate(newDate)
        userInfo.userType === "Client" ? setModalShow(true) : setAdminModalShow(true)
      }
      else{
        //alert("This date is already full. Please select another date.")
        openNotification1()
      }
    }else{
      openNotification2()
      //alert("You can only request an appointment Two(2) Days from now.")
    }
  }
  
  const addSchedule = async () =>{
    try{
      setModalShow(false)
      var variables = JSON.parse(reasonRef.current.value)
      await createAppointment(
        currentUser.uid,
        dateRef.current.value,
        variables.rsn,
        variables.span,
        variables.priority,
        currentUser.email,
        userInfo.Name,
        userInfo.ContactNo,
        userInfo.Address,
        petRef.current.value,)
    }catch(err){
        setError("Failed to create an account. " +err.message)
    }
    
  }
  const generateSchedule = () =>{
    var eventCounter=0;
    evts.forEach(evt=>{
      if(evt.Date === moment(date.toString()).format('L')){
        eventCounter++
      }
    })
    var minsToAdd = 480; //8hrs from 12AM
    if(eventCounter>0){
      evts.forEach(evt=>{
        if(evt.Date === moment(date.toString()).format('L')){
          var dtTime = moment(evt.Date).add(minsToAdd, 'minutes')
          db.collection('Appointments').doc(evt.id)
          .update({
              "status":"Approved",
              "sched": dtTime.format('hh:mm A') + " to "+moment(dtTime).add(evt.span, 'minutes').format('hh:mm A')
            });
          minsToAdd += parseInt(evt.span);

          var templateParams = {
            pet_name: evt.petName,
            to_email: evt.email,
            to_name: evt.clientName,
            reason: evt.reason,
            sched: evt.Date + " at " + dtTime.format('hh:mm A') + " to "+moment(dtTime).add(evt.span, 'minutes').format('hh:mm A')
          };
          
          emailjs.send('scheduleEmail', 'schedule_template', templateParams,'user_q4V9lFfLOBoJCZa2j8NVZ')
              .then(function(response) {
              console.log('SUCCESS!', response.status, response.text);
              }, function(error) {
              console.log('FAILED...', error);
              });
          }
      })
    }else{
      alert("There is no schedule fo this day!")
    }
    setAdminModalShow(false)
  }
  const  ModalCenter = (props) =>{
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Request Schedule for {moment(date.toString()).format('MMMM Do YYYY')}
            {error && <Alert variant="danger">{error}</Alert>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="AppointmentDate">
            <Form.Label>Date</Form.Label>
            <Form.Control ref={dateRef} type="text" disabled defaultValue={moment(date.toString()).format('L')} />
          </Form.Group>
          <Form.Group controlId="Pet">
              <Form.Label>Pet</Form.Label>
              <select className="form-select" ref={petRef} id="pet" >
                {
                  petInfo ? petInfo.map((pet)=>
                    <option key={pet.id} value={pet.PetName}>{pet.PetName}</option>
                  ) : ""
                }
              </select>
          </Form.Group>
          <Form.Group controlId="ReasonOfVisiting">
            <Form.Label>Reason of visiting</Form.Label>
            <select ref={reasonRef} className="form-control" name="cars" id="cars" form="carform">
              <option value="">-- Select Reason --</option>
              <option value='{"rsn":"checkup","span":"30","priority":7}'>Pet Checkup</option>
              <option value='{"rsn":"grooming","span":"60","priority":6}'>Pet Grooming</option>
              <option value='{"rsn":"injury","span":"90","priority":2}'>Injury/wound</option>     
              <option value='{"rsn":"infection","span":"60","priority":3}'>Infection/viruses</option>
              <option value='{"rsn":"fever","span":"30","priority":4}'>Fever/cough</option>
              <option value='{"rsn":"vaccination","span":"30","priority":5}'>Vaccination</option>
              <option value='{"rsn":"surgery","span":"120","priority":1}'>Surgery</option>
            </select>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
          <Button onClick={addSchedule}>Request Appointment</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  const AdminModal = (props) =>{
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Requested Appointments for {moment(date.toString()).format('MMMM Do YYYY')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>Requestor</th>
            <th>Appointment</th>
            <th>Time Requested</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {
            evts && evts.length > 0 ?
            evts.map((evt)=>
                evt.Date === moment(date.toString()).format('L') ?
                <tr key={evt.id}>
                <td>{evt.clientName}</td>
                  <td>{evt.reason}</td>
                  <td>{evt.time}</td>
                  <td>{evt.span} mins</td>
                  <td>{evt.status}</td>
                </tr> : null
            ) : ""
          }
          </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
          <Button onClick={generateSchedule}>Generate Time Schedule</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  return (
    <>
      <Navbars title="Appointments"></Navbars>
      <h3 className="text-center mb-3 mt-3"><CalendarOutlined />Schedule an Appointment</h3>
      <Calendars click={onChange}></Calendars>

      <ModalCenter
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
      <AdminModal
        show={adminModalShow}
        onHide={() => setAdminModalShow(false)}
      />
    </>
  )
}
