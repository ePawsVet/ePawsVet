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

  const onChange = (newDate) => {
    setDate(newDate)
    setModalShow(true)
  }
  const getAppointmentsPerDay = () => {
    setModalShow(true)
    console.log(date)
  }
  const addSchedule = async () =>{
    try{
      setModalShow(false)
      await createAppointment(currentUser.uid,dateRef.current.value,
        new Date( dateRef.current.value + " " + timeFromRef.current.value),
        new Date( dateRef.current.value + " " + timeToRef.current.value),
        reasonRef.current.value, currentUser.email,userInfo.Name)
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
          <Row>
              <Col sm={6} className="time-container">
                <Form.Group controlId="TimeFrom">
                  <Form.Label>From</Form.Label>
                  <Form.Control ref={timeFromRef} step="3600" type="time" step="3600000"/>
                </Form.Group>
              </Col>
              <Col sm={6} className="time-container">
                <Form.Group controlId="TimeTo">
                  <Form.Label>To</Form.Label>
                  <Form.Control ref={timeToRef} step="3600" type="time"/>
                </Form.Group>
              </Col>
          </Row>
          <Form.Group controlId="ReasonOfVisiting">
            <Form.Label>Reason of visiting</Form.Label>
            <select ref={reasonRef} className="form-control" name="cars" id="cars" form="carform">
              <option value="">-- Select Reason --</option>
              <option value="checkup">Pet Checkup</option>
              <option value="grooming">Pet Grooming</option>
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
