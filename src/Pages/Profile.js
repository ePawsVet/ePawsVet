import React, { useState, useEffect } from 'react'
import Navbars from "../Components/Navbars";
import { Image,Alert,Table,Button } from 'react-bootstrap'
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
        const data = querySnapshot.docs.map(doc =>({
            ...doc.data(),
            id:doc.id,
        }));
        setPetInfo(data);
    })
  },[currentUser])

  return (
    <>
      <Navbars title="Profile"></Navbars>
      <div className="row">
        <div className="profile-container profile-owner-info-container col-lg-6 col-md-12">
            <h2 className="profile-owner-info-title profile-title text-center">Owner Info</h2>
            {userInfo ?
              <>
              <Image src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=1200:*" fluid />
              <div className="account-profile-name" >
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
          </div>
          <div className="profile-container profile-pet-info-container col-lg-6 col-md-12">
            <h2 className="profile-pet-info-title profile-title text-center">Pet/s Info</h2>
            { petInfo && petInfo.length > 0 ?
              petInfo.map((info)=>
              <>
              <Image src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=1200:*" fluid />
              <div className="account-profile-name" >
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
              </>
              ) : 
              <Alert variant="danger">No pet found.</Alert>
            }
            <Button className="client-card-buttons" variant="success">Add Pet</Button>
          </div>
        </div>
    </>
  )
}
