import React, { useState, useEffect } from 'react'
import Navbars from "../Components/Navbars";
import { Row, Col,Image,Alert,Table } from 'react-bootstrap'
import {db} from "../firebase"
import { useAuth } from '../Contexts/AuthContext'
import moment from 'moment';
import { TiContacts } from 'react-icons/ti';
import { FaEnvelope,FaMapMarked,FaTransgender,FaBirthdayCake,FaDna } from 'react-icons/fa';
import { IoMdPaw } from 'react-icons/io';
import { MdColorLens }from 'react-icons/md';
import { SiGooglecalendar }from 'react-icons/si';
import { RiScissorsCutFill }from 'react-icons/ri';




export default function Profile() {
  const { currentUser } = useAuth()
  const [userInfo,setUserInfo] = useState(null)
  const [petInfo,setPetInfo] = useState(null)

  useEffect(()=>{
    db
    .collection("Owner_Info")
    .where("ownerID", "==", currentUser.uid)
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
        querySnapshot.forEach((doc) => {
          setPetInfo(doc.data());
        });
    })
  },[currentUser])

  return (
    <>
      <Navbars title="Profile"></Navbars>
        <Row>
          <Col sm={6} className="profile-container">
            <h2 className="text-center">Owner Info</h2>
            {userInfo ?
              <>
              <Image src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=1200:*" fluid />
              <div className="navbar-profile-name" >
                  <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th colSpan="3">{userInfo.OwnerName}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><TiContacts/></td>
                      <td>Contact No.</td>
                      <td>{userInfo.OwnerContactNo}</td>
                    </tr>
                    <tr>
                      <td><FaMapMarked/></td>
                      <td>Address</td>
                      <td>{userInfo.OwnerAddress}</td>
                    </tr>
                    <tr>
                      <td><FaEnvelope/></td>
                      <td>Email</td>
                      <td>{currentUser.email}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              </> : 
              <Alert variant="danger">No user found.</Alert>
            }
          </Col>
          <Col sm={6} className="profile-container">
            <h2 className="text-center">Pet/s Info</h2>
            {petInfo ?
              <>
              <Image src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=1200:*" fluid />
              <div className="navbar-profile-name" >
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th colSpan="3">{petInfo.PetName}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><IoMdPaw/></td>
                      <td>Pet Type</td>
                      <td>{petInfo.PetType}</td>
                    </tr>
                    <tr>
                      <td><FaDna/></td>
                      <td>Breed</td>
                      <td>{petInfo.Breed}</td>
                    </tr>
                    <tr>
                      <td><FaBirthdayCake/></td>
                      <td>Birthday</td>
                      <td>{moment(petInfo.Birthday).format("MMMM D, YYYY")}</td>
                    </tr>
                    <tr>
                      <td><FaTransgender/></td>
                      <td>Gender</td>
                      <td>{petInfo.Gender}</td>
                    </tr>
                    <tr>
                      <td><SiGooglecalendar/></td>
                      <td>Age</td>
                      <td>{petInfo.Age}</td>
                    </tr>
                    <tr>
                      <td><MdColorLens/></td>
                      <td>Color/Markings</td>
                      <td>{petInfo.Color}</td>
                    </tr>
                    <tr>
                      <td><RiScissorsCutFill/></td>
                      <td>Spayed/Nuetered</td>
                      <td>{petInfo.Spayed}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              
              </> : 
              <Alert variant="danger">No pet found.</Alert>
            }
          </Col>
        </Row>
    </>
  )
}
