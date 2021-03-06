import React, { useState, useEffect } from 'react'
import Navbars from "../Components/Navbars";
import { db } from "../firebase"
import { useAuth } from '../Contexts/AuthContext'
import { Alert, Modal, Form, Button } from 'react-bootstrap';
import { GoPlusSmall, GoPlus } from 'react-icons/go';
import { RiContactsBook2Fill } from 'react-icons/ri';
import { FaTrashAlt, FaEnvelope, FaMapMarked, FaTransgender, FaBirthdayCake, FaDna, FaUser } from 'react-icons/fa';
import { IoMdPaw } from 'react-icons/io';
import { MdColorLens, MdPets } from 'react-icons/md';
import CreateNew from '../Components/CreateNew';
import EditProfile from '../Components/EditProfile';
import EditImage from '../Components/EditImage';
import Loader from "react-loader-spinner";
import SignupVet from '../Components/SignupVet';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const ClientProfile = () => {
    const { currentUser } = useAuth()
    const [userInfo, setUserInfo] = useState(null)
    const [petInfo, setPetInfo] = useState(null)
    const [currentPet, setCurrentPet] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [editProfileModalShow, setEditProfileModalShow] = useState(false)
    const [editImageShow, setEditImageShow] = useState(false)
    const [petImageShow, setPetImageShow] = useState(false)
    const [vetModalShow, setVetModalShow] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [doneEvts, setDoneEvents] = useState([])
    const [pendingEvts, setPendingEvents] = useState([])
    const [imageURL, setImageURL] = useState("")
    const [loading, setLoading] = useState(false)
    const [clients, setClients] = useState(null)
    const [pets, setPets] = useState(null)
    const [appointments, setAppointments] = useState(null)

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
        if (userInfo)
            if (userInfo.userType === "Admin") {
                db
                    .collection("Owner_Info")
                    .where("userType", "==", "Client")
                    .get()
                    .then((querySnapshot) => {
                        const data = querySnapshot.docs.map(doc => ({
                            ...doc.data(),
                            id: doc.id,
                        }));
                        setClients(data);
                    })
                db
                    .collection("Pet_Info")
                    .get()
                    .then((querySnapshot) => {
                        const data = querySnapshot.docs.map(doc => ({
                            ...doc.data(),
                            id: doc.id,
                        }));
                        setPets(data);
                        setPetInfo(data);
                    })
                db
                    .collection("Appointments")
                    .get()
                    .then((querySnapshot) => {
                        const data = querySnapshot.docs.map(doc => ({
                            ...doc.data(),
                            id: doc.id,
                        }));
                        setAppointments(data);
                    })
            }
    }, [userInfo])
    useEffect(() => {
        db
            .collection("Profile_Pictures")
            .where("userID", "==", currentUser.uid)
            .get()
            .then((querySnapshot) => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setImageURL(data);
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
    const closeEditImageModal = () => {
        setLoading(true)
        setEditImageShow(false)
        db
            .collection("Profile_Pictures")
            .where("userID", "==", currentUser.uid)
            .get()
            .then((querySnapshot) => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setImageURL(data);
            }).then(() => {
                setLoading(false)
            })
    }
    const closePetImageModal = () => {
        setLoading(true)
        setPetImageShow(false)
        getPetsPerUser(userInfo.userID)
    }
    const closeVetModal = () => {
        setVetModalShow(false)
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

    const createVet = () => {
        setVetModalShow(true)
    }

    const editPet = (info) => {
        setModalTitle("Edit Pet")
        setCurrentPet(info)
        setModalShow(true)
    }
    const editPetImage = (info) => {
        setCurrentPet(info)
        setPetImageShow(true)
    }

    const [toBeDeleted, setToBeDeleted] = useState([])
    const deletePrompt = (info) => {
        setToBeDeleted(info)
        setConfirmModalShow(true)
    }
    const deletePet = (info) => {
        db
            .collection("Pet_Info")
            .doc(info.id)
            .delete()
            .then(() => {
                toast.success("Pet has been successfully deleted!");
                getPetsPerUser(info.ownerID)
            }).catch((error) => {
                toast.error("Error removing document: ", error);
            });
        setConfirmModalShow(false)
    }

    const editOwner = (info) => {
        setEditProfileModalShow(true)
    }
    const openUploader = () => {
        setEditImageShow(true)
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
                    <Button onClick={() => deletePet(toBeDeleted)}>Yes</Button>
                    <Button onClick={props.onHide}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
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
    const EditImageModal = (props) => {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Upload Image
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="create-new-container">
                    <EditImage close={() => { closeEditImageModal() }} imageURL={imageURL[0]} editImage="Profile"></EditImage>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { setPetImageShow(false) }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    const EditPetImageModal = (props) => {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Upload Pet Image
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="create-new-container">
                    <EditImage userInfo={userInfo} petInfo={currentPet} close={() => { closePetImageModal() }} imageURL={currentPet} editImage="Pet Image"></EditImage>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => { setPetImageShow(false) }}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    const CreateVetModal = (props) => {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Create New Admin
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="create-new-container">
                    <SignupVet close={() => { setVetModalShow(false) }}></SignupVet>
                </Modal.Body>
            </Modal>
        );
    }
    return (
        <>
            <Navbars title="Profile"></Navbars>
            <ToastContainer theme="colored" />
            <div className="client-profile profile-container">
                {loading ?
                    <Loader className="loading-spinner"
                        type="Grid"
                        color="#00BFFF"
                        height={100}
                        width={100}
                    /> : null}
                <header>

                    <div className="container">

                        <div className="profile">

                            <div className="profile-image">

                                <img className="profile-pic" src={imageURL[0] ? imageURL[0].url : "https://d20iq7dmd9ruqy.cloudfront.net/images/locations%20staff/default-profile-with-dog.png"} alt="" />
                                <div onClick={openUploader} className="add-image"><GoPlus /></div>
                                <Form.Control
                                    type="file"
                                    required
                                    name="uploader"
                                    style={{ display: "none" }}
                                    accept="image/png, image/gif, image/jpeg"
                                />

                            </div>

                            <div className="profile-user-settings">

                                <h1 className="profile-user-name">{userInfo ? userInfo.Name : ""}</h1>

                                <button onClick={() => editOwner(userInfo)} className="btns profile-edit-btn">Edit Profile</button>
                                {userInfo ? userInfo.userType === "Client" ?
                                    <button onClick={createPet} className="btns profile-settings-btn" aria-label="profile settings"><MdPets /><GoPlusSmall /> Add Pet</button>
                                    : <button onClick={createVet} className="btns profile-settings-btn" aria-label="profile settings"><FaUser /><GoPlusSmall /> Add Admin</button> : ""
                                }
                            </div>

                            <div className="profile-stats">
                                {userInfo ? userInfo.userType === "Client" ?
                                    <ul>
                                        <li><span className="profile-stat-count">{petInfo ? petInfo.length : 0}</span> Pets</li>
                                        <li><span className="profile-stat-count">{doneEvts ? doneEvts.length : 0}</span> Visits</li>
                                        <li><span className="profile-stat-count">{pendingEvts ? pendingEvts.length : 0}</span> Pending Appointments</li>
                                    </ul> :
                                    <ul>
                                        <li><span className="profile-stat-count">{clients ? clients.length : 0}</span> Clients</li>
                                        <li><span className="profile-stat-count">{pets ? pets.length : 0}</span> Enrolled Pets</li>
                                        <li><span className="profile-stat-count">{appointments ? appointments.length : 0}</span> Total Appointments</li>
                                    </ul> :
                                    <ul>
                                        <li><span className="profile-stat-count">0</span> Pets</li>
                                        <li><span className="profile-stat-count">0</span> Visits</li>
                                        <li><span className="profile-stat-count">0</span> Pending Appointments</li>
                                    </ul>
                                }

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
                        <div className="gallery">
                            {petInfo && petInfo.length > 0 ?
                                petInfo.map((info) =>
                                    <div className="gallery-item" key={info.id}>

                                        {
                                            info.url ? <img key={info.id} src={info.url} className="gallery-image" alt={info.PetType} /> : null
                                        }

                                        <div className="gallery-item-info">
                                            {userInfo ? userInfo.userType === "Client" ?
                                                <button onClick={() => deletePrompt(info)} className="btns pet-delete-btn"><FaTrashAlt></FaTrashAlt></button> : "" : ""
                                            }
                                            <ul>
                                                <li className="gallery-item-likes"><span className="visually-hidden">Pet Name:</span><IoMdPaw></IoMdPaw> {info.PetName}</li>
                                                <li className="gallery-item-likes"><span className="visually-hidden">Pet Type:</span><FaDna></FaDna> {info.PetType}</li>
                                                <li className="gallery-item-likes"><span className="visually-hidden">Pet Gender:</span><FaTransgender></FaTransgender> {info.Gender}</li>
                                                <li className="gallery-item-likes"><span className="visually-hidden">Pet Birthday:</span><FaBirthdayCake></FaBirthdayCake> {info.Birthday}</li>
                                                <li className="gallery-item-likes"><span className="visually-hidden">Pet Color:</span><MdColorLens></MdColorLens> {info.Color}</li>
                                                <li className="gallery-item-likes"><span className="visually-hidden">Pet Breed:</span><FaDna></FaDna> {info.Breed}</li>

                                            </ul>
                                            {userInfo ? userInfo.userType === "Client" ?
                                                <ul className="pet-btn-container">
                                                    <button onClick={() => editPet(info)} className="btns pet-btn">Edit Pets Profile</button>
                                                    <button onClick={() => editPetImage(info)} className="btns pet-btn">Add Image</button>
                                                </ul> : "" : ""
                                            }
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
            <EditImageModal
                show={editImageShow}
                onHide={closeEditImageModal}
            />
            <EditPetImageModal
                show={petImageShow}
                onHide={closePetImageModal}
            />
            <CreateVetModal
                show={vetModalShow}
                onHide={closeVetModal}
            />
            <ConfirmModal
                show={confirmModalShow}
                onHide={() => setConfirmModalShow(false)}
            />
        </>
    )
}

export default ClientProfile
