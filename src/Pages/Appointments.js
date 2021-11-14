import React, { useState,useRef,useEffect } from 'react';
import Navbars from "../Components/Navbars";
import Calendar from 'react-calendar';
import Calendars from '../Components/Calendar';
import { Alert,Modal,Button,Form,Col,Row } from 'react-bootstrap'
import moment from 'moment';
import { useAuth } from '../Contexts/AuthContext'
import {db} from "../firebase"



export default function Appointments() {
  const [modalShow, setModalShow] = useState(false);
  const [date, setDate] = useState(new Date());
  const [error,setError] = useState("")
  const dateRef = useRef()
  const timeFromRef = useRef()
  const timeToRef = useRef()
  const reasonRef = useRef()
  const {createAppointment,currentUser} = useAuth()
  const [userInfo,setUserInfo] = useState(null)

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
  },[currentUser])

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
    var d1 = new Date(getAddedDays())
    var d2 = new Date(newDate);
    if(d2 >= d1){
      
      setDate(newDate)
      setModalShow(true)
    }else{
      alert("You can only request an appointment Two(2) Days from now.")
    }
  }
  const getAppointmentsPerDay = () => {
    setModalShow(true)
    console.log(date)
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
        userInfo.Name)
    }catch(err){
        setError("Failed to create an account. " +err.message)
    }
    
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
          <Form.Group controlId="ReasonOfVisiting">
            <Form.Label>Reason of visiting</Form.Label>
            <select ref={reasonRef} className="form-control" name="cars" id="cars" form="carform">
              <option value="">-- Select Reason --</option>
              <option value='{"rsn":"checkup","span":"30","priority":7}'>Pet Checkup</option>
              <option value='{"rsn":"grooming","span":"60","priority":6}'>Pet Grooming</option>
              <option value='{"rsn":"injury","span":"90","priority":2}'>Injury/wound </option>     
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
  return (
    <>
      <Navbars title="Appointments"></Navbars>
      <h2 className="text-center mb-4">Schedule an Appointment</h2>
      <Calendars click={onChange}></Calendars>
      
      {/* <Container className="d-flex align-items-center justify-content-center">
        <Calendar
          style={{width:"100%"}}
          onChange={onChange}
          value={date}
          onClickDay={getAppointmentsPerDay}
        />
      </Container> */}
      <ModalCenter
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  )
}
