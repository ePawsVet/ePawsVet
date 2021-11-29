import React, { useState,useRef } from 'react'
import Navbars from "../Components/Navbars";
import BarChart from '../Components/Charts/BarChart';
import PieChart from '../Components/Charts/PieChart';
import LineChart from '../Components/Charts/LineChart';
import TableChart from '../Components/Charts/TableChart';
import { Row,Col,Form } from 'react-bootstrap'
import moment from 'moment';
import $ from 'jquery'

export default function Dashboard() {
  const [filterFrom,setFilterFrom] = useState(moment().startOf('month').format('YYYY-MM-DD'))
  const [filterTo,setFilterTo] = useState(moment().endOf('month').format('YYYY-MM-DD'))
  const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD');
  const startRef = useRef()
  const endRef = useRef()

  const filterHandler = (e) => {
    if(startRef.current.value <= endRef.current.value){
      setFilterFrom(startRef.current.value)
      setFilterTo(endRef.current.value)
    }else{
      alert("Start date should be greater than end date.")
      $("#filterFrom").val(moment().startOf('month').format('YYYY-MM-DD'))
      $("#filterTo").val(moment().endOf('month').format('YYYY-MM-DD'))
    }
  }
  return (
    <>
    <Navbars title="Dashboard"></Navbars>
    <Row className="mb-3">
      <Form.Group as={Col} controlId="filterFrom">
        <Form.Label>Date from</Form.Label>
        <Form.Control onChange={filterHandler} ref={startRef} type="date" defaultValue={startOfMonth}/>
      </Form.Group>
      <Form.Group as={Col} controlId="filterTo">
        <Form.Label>Date to</Form.Label>
        <Form.Control onChange={filterHandler} ref={endRef} type="date" defaultValue={endOfMonth}/>
      </Form.Group>
    </Row>
    <Row>
    <Col className="chart-container mt-4" sm={5}><TableChart from={filterFrom} to={filterTo}></TableChart></Col>
      <Col className="chart-container mt-4" sm={5}><PieChart from={filterFrom} to={filterTo}></PieChart></Col>
    </Row>
    <Row>
      <Col className="chart-container" sm={10}><LineChart from={filterFrom} to={filterTo}></LineChart></Col>
    </Row>
    <Row>
      <Col className="chart-container" sm={10}><BarChart from={filterFrom} to={filterTo}></BarChart></Col>
    </Row>
    
    
    </>
  )
}
