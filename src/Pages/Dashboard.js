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
    <Col className="chart-container" sm={8}><BarChart></BarChart></Col>
    <Col className="chart-container" sm={4}><PieChart></PieChart></Col>
    </Row>
    <Row>
    <Col className="chart-container" sm={4}><TableChart></TableChart></Col>
    <Col className="chart-container" sm={8}><LineChart></LineChart></Col>
    </Row>
    
    
    </>
  )
}
