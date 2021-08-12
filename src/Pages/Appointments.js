import React, { useState } from 'react';
import Navbars from "../Components/Navbars";
import Calendar from 'react-calendar';
import { Container,Modal,Button,Form,Col,Row } from 'react-bootstrap'
import moment from 'moment';



export default function Appointments() {
  const [modalShow, setModalShow] = useState(false);
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate)
  }
  const getAppointmentsPerDay = () => {
    setModalShow(true)
    console.log(date)
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
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="AppointmentDate">
            <Form.Label>Date</Form.Label>
            <Form.Control type="text" disabled defaultValue={moment(date.toString()).format('L')} />
          </Form.Group>
          <Row>
              <Col sm={6} className="time-container">
                <Form.Group controlId="TimeFrom">
                  <Form.Label>From</Form.Label>
                  <Form.Control type="time"/>
                </Form.Group>
              </Col>
              <Col sm={6} className="time-container">
                <Form.Group controlId="TimeTo">
                  <Form.Label>To</Form.Label>
                  <Form.Control type="time"/>
                </Form.Group>
              </Col>
          </Row>
          <Form.Group controlId="ReasonOfVisiting">
            <Form.Label>Reason of visiting</Form.Label>
            <select className="form-control" name="cars" id="cars" form="carform">
              <option value="">-- Select Reason --</option>
              <option value="checkup">Pet Checkup</option>
              <option value="grooming">Pet Grooming</option>
            </select>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
          <Button onClick={props.onHide}>Request Appointment</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  return (
    <>
      <Navbars title="Appointments"></Navbars>
      <h2 className="text-center mb-4">Schedule an Appointment</h2>
      <Container className="d-flex align-items-center justify-content-center">
        <Calendar
          style={{width:"100%"}}
          onChange={onChange}
          value={date}
          onClickDay={getAppointmentsPerDay}
        />
      </Container>
      <ModalCenter
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  )
}
