import React, { useState } from 'react';
import Navbars from "../Components/Navbars";
import Calendar from 'react-calendar';
import { Row,Col } from 'react-bootstrap'

export default function Appointments() {
  const [date, setDate] = useState(new Date());
  const [dateRange, setDateRange] = useState([]);

  const onChange = (newDate) => {
    setDate(newDate)
  }
  const getAppointmentsPerDay = () => {
    
    setDateRange([new Date(2017, 0, 1), new Date(2017, 0, 4)])
    console.log(date)
  }
  return (
    <>
    <Navbars title="Appointments"></Navbars>
    <Row>
      <Col sm={4} className="profile-container">
        <Calendar
          style={{width:"100%"}}
          onChange={onChange}
          value={date}
          setDateRange={dateRange}
          onClickDay={getAppointmentsPerDay}
        />
      </Col>
      <Col sm={8} className="profile-container"></Col>
    </Row>
    </>
  )
}
