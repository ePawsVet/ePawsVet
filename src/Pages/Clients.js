import React, { useState, useEffect } from 'react'
import Navbars from "../Components/Navbars";
import { Card,ListGroup,ListGroupItem,Button } from 'react-bootstrap'
import {db} from "../firebase"

export default function Clients() {
  const [users,setUsers] = useState([]);
  const [petInfo,setPetInfo] = useState(null)

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

  const getPetsPerUser = (id) =>{
    db
    .collection("Pet_Info")
    .where("ownerID", "==", id)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setPetInfo(doc.data());
        });
    })
  }
  console.log(petInfo)
  return (
    <>
    <Navbars title="Clients"></Navbars>
    {
      users.map((user)=>
      <Card style={{ width: '20rem',display:"inline-block",margin:"10px" }}>
        <Card.Img variant="top" src="https://image.flaticon.com/icons/png/512/149/149071.png" />
        <Card.Body>
          <Card.Title><b>Name</b>: {user.OwnerName}</Card.Title>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem><b>Address</b>: {user.OwnerAddress}</ListGroupItem>
          <ListGroupItem><b>Contact No.</b>: {user.OwnerContactNo}</ListGroupItem>
          <ListGroupItem><b>Email</b>: {user.OwnerEmail}</ListGroupItem>
        </ListGroup>
        <Card.Footer>
          <Button onClick={()=>getPetsPerUser(user.ownerID)} variant="primary">View Enrolled Pets</Button>
        </Card.Footer>
      </Card>
      )
    }
    </>
  )
}
