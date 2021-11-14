import React from 'react'
import Navbars from "../Components/Navbars";
import BarChart from '../Components/Charts/BarChart';
import PieChart from '../Components/Charts/PieChart';
import LineChart from '../Components/Charts/LineChart';
import TableChart from '../Components/Charts/TableChart';
import { Row,Col } from 'react-bootstrap'

export default function Dashboard() {
  return (
    <>
    <Navbars title="Dashboard"></Navbars>
    <Row>
    <Col className="chart-container mt-4" sm={5}><TableChart></TableChart></Col>
      <Col className="chart-container mt-4" sm={5}><PieChart></PieChart></Col>
    </Row>
    <Row>
      <Col className="chart-container" sm={10}><LineChart></LineChart></Col>
    </Row>
    <Row>
      <Col className="chart-container" sm={10}><BarChart></BarChart></Col>
    </Row>
    
    
    </>
  )
}
