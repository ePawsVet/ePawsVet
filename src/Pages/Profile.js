import React from 'react'
import Navbars from "../Components/Navbars";
import { Row, Col,Image } from 'react-bootstrap'

export default function Profile() {
  return (
    <>
      <Navbars title="Profile"></Navbars>
        <Row>
          <Col sm={6} className="profile-container">
            <h2 className="text-center">Owner Info</h2>
            <Image src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=1200:*" fluid />
          </Col>
          <Col sm={6} className="profile-container">
            <h2 className="text-center">Pet/s Info</h2>
            <Image src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=1200:*" fluid />
          </Col>
        </Row>
    </>
  )
}
