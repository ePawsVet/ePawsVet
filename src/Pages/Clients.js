import React, { useState, useEffect, useRef } from 'react'
import Navbars from "../Components/Navbars";
import { Modal, Table, InputGroup, FormControl, Alert, Card, ListGroup, Button } from 'react-bootstrap'
import { db } from "../firebase"
import { TiContacts } from 'react-icons/ti';
import { FaSearch, FaEnvelope, FaMapMarked, FaTransgender, FaBirthdayCake, FaDna, FaTrashAlt } from 'react-icons/fa';
import { IoMdPaw } from 'react-icons/io';
import { MdColorLens, MdPets } from 'react-icons/md';
import { SiGooglecalendar } from 'react-icons/si';
import { RiScissorsCutFill, RiPencilFill } from 'react-icons/ri';
import moment from 'moment';
import CreateNew from '../Components/CreateNew';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Clients() {
  const keywordRef = useRef()
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [petInfo, setPetInfo] = useState([])
  const [currentPet, setCurrentPet] = useState([])
  const [modalTitle, setModalTitle] = useState("")
  const [owners, setOwners] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  const refreshPets = () => {
    setModalShow(false)
    getPetsPerUser(users.userID)
  }
  const closeModal = () => {
    setModalShow(false)
    setCurrentPet([])
  }
  useEffect(() => {

    const unsubscribe = db
      .collection('Owner_Info')
      .where("userType", "==", "Client")
      .limit(100)
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setOwners(data);
      })
    return unsubscribe
  }, [])


  const getPetsPerUser = async (userID) => {
    setPetInfo(null);
    await db
      .collection("Pet_Info")
      .where("ownerID", "==", userID)
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setPetInfo(data);
      })
  }
  const searchHandler = async () => {
    setUsers([])
    setPetInfo([])
    var keyword = keywordRef.current.value;
    const tempFilteredUsers = owners.filter(owner => {
      return owner.Name.toString().toLowerCase().includes(keyword.toString().toLowerCase());
    });
    setFilteredUsers(tempFilteredUsers);
  }
  const getUser = (info) => {
    setUsers(info)
    getPetsPerUser(info.userID)

  }
  const clearSearch = () => {
    keywordRef.current.value = ""
    setFilteredUsers([])
    setUsers([])
  }

  const deleteOwner = (info) => {
    db
      .collection("Owner_Info")
      .doc(info.id)
      .delete()
      .then(() => {
        toast.success("Client successfully deleted!");
        setUsers([])
        //searchHandler()
      }).catch((error) => {
        toast.error("Error removing document: ", error);
      });

    var pets_query = db.collection('Pet_Info').where("ownerID", "==", info.userID);
    pets_query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });

  }

  const createPet = (info) => {
    setModalTitle("Enroll New Pet")
    setModalShow(true)
  }
  const editPet = (info) => {
    setModalTitle("Edit Pet")
    setCurrentPet(info)
    setModalShow(true)
  }
  const [toBeDeleted, setToBeDeleted] = useState([])
  const [toBeDeletedType, setToBeDeletedType] = useState("")
  const deletePrompt = (info,type) => {
    setToBeDeleted(info)
    setToBeDeletedType(type)
    setConfirmModalShow(true)
  }
  const deleteConfirmed = (info) => {
    if(toBeDeletedType==="owner"){
      deleteOwner(info)
    }else if(toBeDeletedType==="pet"){
      deletePet(info)
    }
    setConfirmModalShow(false)
  }
  const deletePet = (info) => {
    db
      .collection("Pet_Info")
      .doc(info.id)
      .delete()
      .then(() => {
        toast.success("Document successfully deleted!");
        getPetsPerUser(info.ownerID)
      }).catch((error) => {
        toast.error("Error removing document: ", error);
      });
  }
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const ConfirmModal = (props) => {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete this record?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => deleteConfirmed(toBeDeleted)}>Yes</Button>
          <Button onClick={props.onHide}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {modalTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="create-new-container">
          <CreateNew userInfo={users} petInfo={currentPet} click={refreshPets}></CreateNew>
        </Modal.Body>
      </Modal>
    );
  }
  return (
    <>
      <Navbars title="Clients"></Navbars>
      <ToastContainer theme="colored" />
      <div className="row">
        <div className="col-lg-4 col-md-12 clients-search-container">
          <Card style={{ maxHeight: "50vh", minHeight: "50vh", padding: "10px" }}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Client's name"
                aria-label="Client's name"
                aria-describedby="search-client"
                ref={keywordRef}
                onChange={searchHandler}
              />
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1"><FaSearch /></span>
              </div>
            </InputGroup>
            {keywordRef.current && keywordRef.current.value ? <h5>Search Results</h5> : <h5>Active Users</h5>}
            <ListGroup><br />
              {
                filteredUsers.map((user) =>
                  <ListGroup.Item action onClick={() => getUser(user)} key={user.id}>
                    {user.Name}
                  </ListGroup.Item>
                )
              }
              {
                filteredUsers.length > 0 ?
                  <><Button className="client-search-buttons" onClick={clearSearch}>Clear Search</Button></>
                  :
                  keywordRef.current && keywordRef.current.value ?
                    <>
                      <Alert variant="danger">{keywordRef.current.value + " not found."}</Alert><Button className="client-search-buttons" onClick={clearSearch}>Clear Search</Button>
                    </>
                    : owners.length !== 0 ?
                      owners.map((user) =>
                        <ListGroup.Item action onClick={() => getUser(user)} key={user.id}>
                          {user.Name}
                        </ListGroup.Item>
                      ) : <Alert variant="danger">No Active Users</Alert>

              }

            </ListGroup>
          </Card>
        </div>
        <div className="col-lg-8 col-md-12 clients-search-container">
          {users.length === 0 ? <Alert variant="danger">No client selected.</Alert> :
            (
              <div className="account-profile-name client-profile-owner" >
                <Alert variant="success"><h1>Owner Info</h1></Alert>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th colSpan="1">
                        <Button className="client-card-buttons w-40" onClick={() => deletePrompt(users,"owner")} variant="danger"><FaTrashAlt /> Delete Client</Button>
                      </th>
                      <th colSpan="2">{users.Name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><TiContacts /></td>
                      <td>Contact No.</td>
                      <td>{users.ContactNo}</td>
                    </tr>
                    <tr>
                      <td><FaMapMarked /></td>
                      <td>Address</td>
                      <td>{users.Address}</td>
                    </tr>
                    <tr>
                      <td><FaEnvelope /></td>
                      <td>Email</td>
                      <td>{users.Email}</td>
                    </tr>
                  </tbody>
                </Table>
                <br />
                <Alert variant="success"><h1>Pet/s Info</h1></Alert>
                <div className="client-profile-pets">
                  {petInfo && petInfo.length > 0 ?
                    petInfo.map((info) =>
                      <div key={info.id} className="account-profile-name" >
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th colSpan="1">
                                <Button className="client-card-buttons w-40" onClick={() => editPet(info)} variant="warning"><RiPencilFill /> Edit Pets Profile</Button>
                                <Button className="client-card-buttons w-40" onClick={() => deletePrompt(info,"pet")} variant="danger"><FaTrashAlt /> Delete Pet</Button>
                              </th>
                              <th colSpan="2">{info.PetName}</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><IoMdPaw /></td>
                              <td>Pet Type</td>
                              <td>{info.PetType}</td>
                            </tr>
                            <tr>
                              <td><FaDna /></td>
                              <td>Breed</td>
                              <td>{info.Breed}</td>
                            </tr>
                            <tr>
                              <td><FaBirthdayCake /></td>
                              <td>Birthday</td>
                              <td>{moment(info.Birthday).format("MMMM D, YYYY")}</td>
                            </tr>
                            <tr>
                              <td><FaTransgender /></td>
                              <td>Gender</td>
                              <td>{info.Gender}</td>
                            </tr>
                            <tr>
                              <td><SiGooglecalendar /></td>
                              <td>Age</td>
                              <td>{info.Age}</td>
                            </tr>
                            <tr>
                              <td><MdColorLens /></td>
                              <td>Color/Markings</td>
                              <td>{info.Color}</td>
                            </tr>
                            <tr>
                              <td><RiScissorsCutFill /></td>
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
                <br />
                <Button className="client-card-buttons w-100" onClick={() => createPet(users)} variant="primary"><MdPets /> Add Pet/s</Button>
              </div>
            )
          }
        </div>
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={closeModal}
      />
      <ConfirmModal
        show={confirmModalShow}
        onHide={() => setConfirmModalShow(false)}
      />
    </>
  )
}
