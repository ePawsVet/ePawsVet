import React from 'react'
import Navbars from "../Components/Navbars";
import { Row, Col } from 'react-bootstrap'

export default function Profile() {
  return (
    <>
      <Navbars title="Profile"></Navbars>
      <Row>
        <Col style={{background:"red"}}>
          <h2 className="text-center">Owner Info</h2>
        </Col>
        <Col style={{background:"blue"}}>
          <h2 className="text-center">Pet/s Info</h2>
        </Col>
      </Row>
    </>
  )
}
