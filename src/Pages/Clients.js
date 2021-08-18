import React, { useState,useEffect,useRef } from 'react'
import Navbars from "../Components/Navbars";
import { Table,InputGroup,FormControl,Alert,Card,ListGroup,Button } from 'react-bootstrap'
import {db} from "../firebase"
import { TiContacts } from 'react-icons/ti';
import { FaEnvelope,FaMapMarked,FaTransgender,FaBirthdayCake,FaDna,FaTrashAlt } from 'react-icons/fa';
import { IoMdPaw } from 'react-icons/io';
import { MdColorLens,MdPets }from 'react-icons/md';
import { SiGooglecalendar }from 'react-icons/si';
import { RiScissorsCutFill,RiPencilFill }from 'react-icons/ri';
import moment from 'moment';

export default function Clients() {
  const keywordRef = useRef()
  const [users,setUsers] = useState([]);
  const [filteredUsers,setFilteredUsers] = useState([]);
  const [petInfo,setPetInfo] = useState([])
  const [petError,setPetError] = useState("")
  const [petMessage,setPetMessage] = useState("")
  const [ownerError,setOwnerError] = useState("")
  const [ownerMessage,setOwnerMessage] = useState("")
  const [owners,setOwners] = useState([]);

  
  useEffect(()=>{
    
    const unsubscribe = db
        .collection('Owner_Info')
        .limit(100)
        .onSnapshot(querySnapshot =>{
        const data = querySnapshot.docs.map(doc =>({
            ...doc.data(),
            id:doc.id,
        }));
        setOwners(data);
    })
    return unsubscribe
  },[])
  

  const getPetsPerUser = async (user) =>{
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
    })
  }
  const searchHandler = async () => {
    setUsers([])
    setPetInfo([])
    setOwnerMessage("")
    setOwnerError("")
    setPetMessage("")
    setPetError("")
    var keyword = keywordRef.current.value;
    await db
    .collection("Owner_Info")
    .where("OwnerName", "==", keyword)
    .get()
    .then((querySnapshot) => {
        const data = querySnapshot.docs.map(doc =>({
            ...doc.data(),
            id:doc.id,
        }));
        setFilteredUsers(data);
    })
  }
  const getUser = (info) =>{
    setUsers(info)
    getPetsPerUser(info)
    
    setOwnerMessage("")
    setOwnerError("")
    setPetMessage("")
    setPetError("")
  }
  const clearSearch = () => {
    keywordRef.current.value = ""
    setFilteredUsers([])
    setUsers([])
  }
  const createOwner =(info)=>{
    alert(info)
  }
  const editOwner =(info)=>{
    alert(info)
  }
  const deleteOwner =(info)=>{
    setOwnerMessage("")
    setOwnerError("")
    db
    .collection("Owner_Info")
    .doc(info.id)
    .delete()
    .then(() => {
      setOwnerMessage("Document successfully deleted!");
      setUsers([])
      searchHandler()
    }).catch((error) => {
      setOwnerError("Error removing document: ", error);
    });
  }
  const createPet =(info)=>{
    alert(info)
  }
  const editPet =(info)=>{
    alert(info)
  }
  const deletePet =(info)=>{
    setPetMessage("")
    setPetError("")
    db
    .collection("Pet_Info")
    .doc(info.id)
    .delete()
    .then(() => {
      setPetMessage("Document successfully deleted!");
      getUser(info)
    }).catch((error) => {
      setPetError("Error removing document: ", error);
    });
  }
  return (
      <>
        <Navbars title="Clients"></Navbars>
        <div className="row">
          <div className="col-lg-4 col-md-12 clients-search-container">
            <Card style={{ maxHeight:"50vh",minHeight:"50vh",padding:"10px" }}>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Client's name"
                  aria-label="Client's name"
                  aria-describedby="seaech-client"
                  ref={keywordRef}
                />
                <Button 
                  onClick={searchHandler} 
                  variant="outline-secondary" 
                  id="search-client-btn">
                  Search
                </Button>
              </InputGroup>
              {keywordRef.current && keywordRef.current.value ? <h5>Search Results</h5> : <h5>Active Users</h5>}
              <ListGroup><br/>
              { 
                filteredUsers.map((user)=>
                  <ListGroup.Item action onClick={()=>getUser(user)} key={user.id}>
                    {user.OwnerName}
                  </ListGroup.Item>
                )
              }
              {
                filteredUsers.length > 0 ? 
                <><Button className="client-search-buttons" onClick={clearSearch}>Clear Search</Button></> 
                : 
                keywordRef.current && keywordRef.current.value ? 
                  <>
                  <Alert variant="danger">{keywordRef.current.value +" not found."}</Alert>
                  <Button className="client-search-buttons" variant="success">Create account for "{keywordRef.current.value}"</Button>
                  <Button className="client-search-buttons" onClick={clearSearch}>Clear Search</Button>
                  </>
                  : 
                    owners.map((user)=>
                    <ListGroup.Item action onClick={()=>getUser(user)} key={user.id}>
                      {user.OwnerName}
                    </ListGroup.Item>
                )
                  
              }
              
              </ListGroup>
            </Card>
          </div>
          <div className="col-lg-8 col-md-12 clients-search-container">
          { users.length ===0 ? <Alert variant="danger">No client selected.</Alert> :
            (
              <div className="account-profile-name client-profile-owner" >
                <Alert variant="success"><h1>Owner Info</h1></Alert>
                {ownerError && <Alert variant="danger">{ownerError}</Alert>}
                {ownerMessage && <Alert variant="success">{ownerMessage}</Alert>}
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th colSpan="1">
                        <Button className="client-card-buttons w-40" onClick={()=>editOwner(users)} variant="warning"><RiPencilFill/> Edit Client</Button>
                        <Button className="client-card-buttons w-40" onClick={()=>deleteOwner(users)} variant="danger"><FaTrashAlt/> Delete Client</Button>
                      </th>
                      <th colSpan="2">{users.OwnerName}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><TiContacts/></td>
                      <td>Contact No.</td>
                      <td>{users.OwnerContactNo}</td>
                    </tr>
                    <tr>
                      <td><FaMapMarked/></td>
                      <td>Address</td>
                      <td>{users.OwnerAddress}</td>
                    </tr>
                    <tr>
                      <td><FaEnvelope/></td>
                      <td>Email</td>
                      <td>{users.email}</td>
                    </tr>
                  </tbody>
                </Table>
                <br/>
                <Alert variant="success"><h1>Pet/s Info</h1></Alert>
                {petError && <Alert variant="danger">{petError}</Alert>}
                {petMessage && <Alert variant="success">{petMessage}</Alert>}
                <div className="client-profile-pets">
                { petInfo && petInfo.length > 0 ?
                  petInfo.map((info)=>
                  <div key={info.id} className="account-profile-name" >
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th colSpan="1">
                            <Button className="client-card-buttons w-40" onClick={()=>editPet(info)} variant="warning"><RiPencilFill/> Edit Pet</Button>
                            <Button className="client-card-buttons w-40" onClick={()=>deletePet(info)} variant="danger"><FaTrashAlt/> Delete Pet</Button>
                          </th>
                          <th colSpan="2">{info.PetName}</th>
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
                <br/>
                <Button className="client-card-buttons w-100" onClick={()=>getPetsPerUser(users)} variant="primary"><MdPets/> Add Pet/s</Button>
              </div>
            )
          }
        </div>
      </div>
    </>
  )
}
