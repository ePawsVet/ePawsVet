import React, { useState, useEffect } from 'react'
import Navbars from "../Components/Navbars";
import { db } from "../firebase"
import { useAuth } from '../Contexts/AuthContext'
import { GoPlusSmall } from 'react-icons/go';
import { Alert, Modal } from 'react-bootstrap';
import { RiContactsBook2Fill } from 'react-icons/ri';
import { FaTrashAlt, FaEnvelope, FaMapMarked, FaTransgender, FaBirthdayCake, FaDna } from 'react-icons/fa';
import { IoMdPaw } from 'react-icons/io';
import { MdColorLens, MdPets } from 'react-icons/md';
import CreateNew from '../Components/CreateNew';
import EditProfile from '../Components/EditProfile';



const ClientProfile = () => {
    const { currentUser } = useAuth()
    const [userInfo, setUserInfo] = useState(null)
    const [petInfo, setPetInfo] = useState(null)
    const [currentPet, setCurrentPet] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [editProfileModalShow, setEditProfileModalShow] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [petError, setPetError] = useState("")
    const [petMessage, setPetMessage] = useState("")
    const [doneEvts, setDoneEvents] = useState([])
    const [pendingEvts, setPendingEvents] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
            db
                .collection("Owner_Info")
                .where("userID", "==", currentUser.uid)
                .get()
                .then((querySnapshot) => {
                    const data = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setUserInfo(data[0]);
                })
            db
                .collection("Pet_Info")
                .where("ownerID", "==", currentUser.uid)
                .get()
                .then((querySnapshot) => {
                    const data = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setPetInfo(data);
                })
    }, [currentUser])

    useEffect(() => {
        const unsubscribe =
            db
                .collection('Appointments')
                .where("clientID", "==", currentUser.uid)
                .where("status", "==", "Done")
                .onSnapshot(querySnapshot => {
                    const data = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setDoneEvents(data)
                })
        return unsubscribe
    }, [currentUser])

    useEffect(() => {
        const unsubscribe =
            db
                .collection('Appointments')
                .where("clientID", "==", currentUser.uid)
                .where("status", "==", "Pending")
                .onSnapshot(querySnapshot => {
                    const data = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setPendingEvents(data)
                })
        return unsubscribe
    }, [currentUser])

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
            setLoading(false)
    }

    const getUser = async (userID) => {
        setPetInfo(null);
        await db
            .collection("Owner_Info")
            .where("userID", "==", userID)
            .get()
            .then((querySnapshot) => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setUserInfo(data[0]);
            })
    }

    const closeModal = () => {
        setModalShow(false)
        setCurrentPet([])
    }
    const closeEditProfileModal = () => {
        setEditProfileModalShow(false)
        setCurrentPet([])
    }

    const refreshPets = () => {
        setLoading(true)
        setModalShow(false)
        getPetsPerUser(userInfo.userID)
    }

    const refreshProfile = () => {
        setLoading(true)
        setEditProfileModalShow(false)
        getUser(userInfo.userID)
        getPetsPerUser(userInfo.userID)
    }

    const createPet = () => {
        setCurrentPet([])
        setModalTitle("Enroll New Pet")
        setModalShow(true)
    }

    const editPet = (info) => {
        setModalTitle("Edit Pet")
        setCurrentPet(info)
        setModalShow(true)
    }

    const deletePet = (info) => {
        setPetMessage("")
        setPetError("")
        db
            .collection("Pet_Info")
            .doc(info.id)
            .delete()
            .then(() => {
                setPetMessage("Document successfully deleted!");
                getPetsPerUser(info.ownerID)
            }).catch((error) => {
                setPetError("Error removing document: ", error);
            });
    }

    const deleteMessage = () => {
        setPetMessage("");
        setPetError("");
    }
    const editOwner = (info) => {
        setEditProfileModalShow(true)
    }
    const AddPetModal = (props) => {
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
                    <CreateNew userInfo={userInfo} petInfo={currentPet} click={refreshPets}></CreateNew>
                </Modal.Body>
            </Modal>
        );
    }
    const EditProfileModal = (props) => {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update Personal Information
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="create-new-container">
                    <EditProfile userInfo={userInfo} click={refreshProfile}></EditProfile>
                </Modal.Body>
            </Modal>
        );
    }
    return (
        <>
            <Navbars title="Profile"></Navbars>
            <div className="client-profile profile-container">
                <header>

                    <div className="container">

                        <div className="profile">

                            <div className="profile-image">

                                <img src="https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces" alt="" />

                            </div>

                            <div className="profile-user-settings">

                                <h1 className="profile-user-name">{userInfo ? userInfo.Name : ""}</h1>

                                <button onClick={() => editOwner(userInfo)} className="btns profile-edit-btn">Edit Profile</button>

                                <button onClick={createPet} className="btns profile-settings-btn" aria-label="profile settings"><MdPets /><GoPlusSmall /> Add Pet</button>

                            </div>

                            <div className="profile-stats">

                                <ul>
                                    <li><span className="profile-stat-count">{petInfo ? petInfo.length : 0}</span> Pets</li>
                                    <li><span className="profile-stat-count">{doneEvts ? doneEvts.length : 0}</span> Visits</li>
                                    <li><span className="profile-stat-count">{pendingEvts ? pendingEvts.length : 0}</span> Pending Appointments</li>
                                </ul>

                            </div>

                            <div className="profile-bio">

                                <p><span className="profile-real-name">{userInfo ? userInfo.Name : ""} </span>
                                    &nbsp;&nbsp;<FaEnvelope /> {userInfo ? userInfo.Email : "N/A"}
                                    &nbsp;&nbsp;<FaMapMarked /> {userInfo ? userInfo.Address : "N/A"}
                                    &nbsp;&nbsp;<RiContactsBook2Fill /> {userInfo ? userInfo.ContactNo : "N/A"}
                                </p>

                            </div>
                        </div>
                    </div>
                </header>
                <main>
                    <div className="container">
                        {petError && <Alert variant="danger">{petError}<span onClick={deleteMessage} className="deleteMessage"><FaTrashAlt ></FaTrashAlt></span></Alert>}
                        {petMessage && <Alert variant="success">{petMessage}<span onClick={deleteMessage} className="deleteMessage"><FaTrashAlt></FaTrashAlt></span></Alert>}

                        <div className="gallery">
                            {petInfo && petInfo.length > 0 ?
                                petInfo.map((info) =>
                                    <div className="gallery-item" key={info.id}>

                                        <img src="https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=500&h=500&fit=crop" className="gallery-image" alt="" />

                                        <div className="gallery-item-info">
                                            <button onClick={() => deletePet(info)} className="btns pet-delete-btn"><FaTrashAlt></FaTrashAlt></button>
                                            <ul>
                                                <li className="gallery-item-likes"><span className="visually-hidden">Pet Name:</span><IoMdPaw></IoMdPaw> {info.PetName}</li>
                                                <li className="gallery-item-likes"><span className="visually-hidden">Pet Type:</span><FaDna></FaDna> {info.PetType}</li>
                                                <li className="gallery-item-likes"><span className="visually-hidden">Pet Type:</span><FaTransgender></FaTransgender> {info.Gender}</li>
                                                <li className="gallery-item-likes"><span className="visually-hidden">Pet Type:</span><FaBirthdayCake></FaBirthdayCake> {info.Birthday}</li>
                                                <li className="gallery-item-likes"><span className="visually-hidden">Pet Type:</span><MdColorLens></MdColorLens> {info.Color}</li>
                                                <li className="gallery-item-likes"><span className="visually-hidden">Pet Type:</span><FaDna></FaDna> {info.Breed}</li>
                                            </ul>

                                            <button onClick={() => editPet(info)} className="btns pet-edit-btn">Edit Pet</button>

                                        </div>

                                    </div>
                                ) :
                                <Alert variant="danger">No pet found.</Alert>
                            }
                        </div>

                        {loading ? <div className="loader"></div> : ""}

                    </div>

                </main>
            </div>
            <AddPetModal
                show={modalShow}
                onHide={closeModal}
            />
            <EditProfileModal
                show={editProfileModalShow}
                onHide={closeEditProfileModal}
            />
        </>
    )
}

export default ClientProfile
