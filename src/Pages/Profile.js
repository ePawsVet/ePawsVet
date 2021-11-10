import React, { useState, useEffect } from 'react'
import Navbars from "../Components/Navbars";
import { Image,Alert,Table } from 'react-bootstrap'
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
    .where("userID", "==", currentUser.uid)
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
              <div className="account-profile-name" >
                <Image src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=1200:*" fluid />
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th colSpan="3">{userInfo.Name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><TiContacts/></td>
                      <td>Contact No.</td>
                      <td>{userInfo.ContactNo}</td>
                    </tr>
                    <tr>
                      <td><FaMapMarked/></td>
                      <td>Address</td>
                      <td>{userInfo.Address}</td>
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
              <div key={info.id} className="account-profile-name" >
                <Image src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=1200:*" fluid />
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th colSpan="3">{info.PetName}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><IoMdPaw/></td>
                      <td>Pet Type</td>
                      <td>{info.PetType}</td>
                    </tr>
                    <tr>
                      <td><FaDna/></td>
                      <td>Breed</td>
                      <td>{info.Breed}</td>
                    </tr>
                    <tr>
                      <td><FaBirthdayCake/></td>
                      <td>Birthday</td>
                      <td>{moment(info.Birthday).format("MMMM D, YYYY")}</td>
                    </tr>
                    <tr>
                      <td><FaTransgender/></td>
                      <td>Gender</td>
                      <td>{info.Gender}</td>
                    </tr>
                    <tr>
                      <td><SiGooglecalendar/></td>
                      <td>Age</td>
                      <td>{info.Age}</td>
                    </tr>
                    <tr>
                      <td><MdColorLens/></td>
                      <td>Color/Markings</td>
                      <td>{info.Color}</td>
                    </tr>
                    <tr>
                      <td><RiScissorsCutFill/></td>
                      <td>Spayed/Nuetered</td>
                      <td>{info.Spayed}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              ) : 
              <Alert variant="danger">No pet found.</Alert>
            }
            
          </div>
        </div>
    </>
  )
}
