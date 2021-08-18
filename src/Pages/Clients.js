import React, { useState, useEffect } from 'react'
import Navbars from "../Components/Navbars";
import { Alert,Modal,Card,ListGroup,ListGroupItem,Button } from 'react-bootstrap'
import {db} from "../firebase"
import { TiContacts } from 'react-icons/ti';
import { FaEnvelope,FaMapMarked,FaTransgender,FaBirthdayCake,FaDna } from 'react-icons/fa';
import { IoMdPaw } from 'react-icons/io';
import { MdColorLens }from 'react-icons/md';
import { SiGooglecalendar }from 'react-icons/si';
import { RiScissorsCutFill }from 'react-icons/ri';

export default function Clients() {
  const [users,setUsers] = useState([]);
  const [petInfo,setPetInfo] = useState([])
  const [selectedUser, setSelectedUser] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  useEffect(()=>{
    const unsubscribe = db
        .collection('Owner_Info')
        .limit(100)
        .onSnapshot(querySnapshot =>{
        const data = querySnapshot.docs.map(doc =>({
            ...doc.data(),
            id:doc.id,
        }));
        setUsers(data);
    })

    return unsubscribe
  },[])

  const getPetsPerUser = async (user) =>{
    setSelectedUser(null);
    setPetInfo(null);
    await db
    .collection("Pet_Info")
    .where("ownerID", "==", user.ownerID)
    .get()
    .then((querySnapshot) => {
        const data = querySnapshot.docs.map(doc =>({
            ...doc.data(),
            id:doc.id,
        }));
        setPetInfo(data);
        
      console.log(data)
        setSelectedUser(user);
    })
    setModalShow(true)
  }

  const MyVerticallyCenteredModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            {selectedUser ? selectedUser.OwnerName : "Pet Info"}'s Pets
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        { petInfo && petInfo.length > 0 ?
         petInfo.map((info)=>
          <Card key={info.id} style={{ width: '20rem',display:"inline-block",margin:"10px" }}>
            <Card.Img variant="top" src="https://image.flaticon.com/icons/png/512/149/149071.png" />
            <Card.Body>
              <Card.Title><b>Name</b>: {info.PetName}</Card.Title>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem><IoMdPaw/><b> Type</b>: {info.PetType}</ListGroupItem>
              <ListGroupItem><FaDna/><b> Breed</b>: {info.Breed}</ListGroupItem>
              <ListGroupItem><FaBirthdayCake/><b> Birthday</b>: {info.Birthday}</ListGroupItem>
              <ListGroupItem><SiGooglecalendar/><b> Age</b>: {info.Age}</ListGroupItem>
              <ListGroupItem><FaTransgender/><b> Gender</b>: {info.Gender}</ListGroupItem>
              <ListGroupItem><MdColorLens/><b> Color/Markings</b>: {info.Color}</ListGroupItem>
              <ListGroupItem><RiScissorsCutFill/><b> Spayed/Neutered</b>: {info.Spayed}</ListGroupItem>
            </ListGroup>
          </Card>
          ) : <Alert variant="danger">No pet found.</Alert>
        }
        </Modal.Body>
        <Modal.Footer>
          <Button className="client-card-buttons" variant="success">Add Pet</Button>
          <Button className="client-card-buttons" onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
    <Navbars title="Clients"></Navbars>
    {
      users.map((user)=>
      <Card key={user.ownerID} style={{ width: '20rem',display:"inline-block",margin:"10px" }}>
        <Card.Img variant="top" src="https://image.flaticon.com/icons/png/512/149/149071.png" />
        <Card.Body>
          <Card.Title><b>Name</b>: {user.OwnerName}</Card.Title>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem><FaMapMarked/><b> Address</b>: {user.OwnerAddress}</ListGroupItem>
          <ListGroupItem><TiContacts/><b> Contact No.</b>: {user.OwnerContactNo}</ListGroupItem>
          <ListGroupItem><FaEnvelope/><b> Email</b>: {user.OwnerEmail}</ListGroupItem>
        </ListGroup>
        <Card.Footer>
          <Button className="client-card-buttons" onClick={()=>getPetsPerUser(user)} variant="primary">View Enrolled Pets</Button>
        </Card.Footer>
      </Card>
      )
    }
    <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  )
}
