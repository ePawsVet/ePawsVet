import React, { useState, useEffect } from 'react'
import { Navbar, Nav, ListGroup, Image, Dropdown } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthContext'
import { GiHamburgerMenu, GiMedicinePills } from 'react-icons/gi';
import { FiLogOut } from 'react-icons/fi';
import { FaChartBar, FaRegCalendarAlt, FaUsers, FaUser, FaEnvelope, FaHome,/*FaBoxes,*/ FaRegCalendarCheck } from 'react-icons/fa';
import { SiMicrosoftpowerpoint } from 'react-icons/si';
import { db, storage } from "../firebase"
import { VersionInfo } from './VersionInfo';
import Notifications from './Notifications'



import Sidebar from "react-sidebar";

export default function Navbars({ title = "" }) {
    const [toggleSidenav, setToggleSidenav] = useState(false)
    const { logout, currentUser } = useAuth()
    const history = useHistory()
    const [userInfo, setUserInfo] = useState(null)
    const [vetInfo, setVetInfo] = useState(null)

    const [imageURL, setImageURL] = useState("")

    useEffect(() => {
        const filenames = ['user-placeholder.png'];
        filenames.forEach(filename => {
            storage
                .ref(`/icons/placeholders/${filename}`)
                .getDownloadURL()
                .then(url => {
                    setImageURL({ "url": url });
                });
        })

    }, [])
    useEffect(() => {
        var element = document.getElementById(title)
        element.className += element.classList.contains("active") ? "" : " active"
        if (!toggleSidenav) {
            document.getElementsByTagName("body")[0].style = "overflow:auto"
            document.querySelectorAll('[role="navigation"]').forEach(function (el) {
                setTimeout(function () {
                    el.style.zIndex = -1
                }, 500)
            });
        }
    })

    useEffect(() => {
        db.collection("Owner_Info")
            .where("userID", "==", currentUser.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setUserInfo(doc.data());
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });

        db.collection("Owner_Info")
            .where("userID", "==", currentUser.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setVetInfo(doc.data());
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }, [currentUser])

    useEffect(() => {
        db
            .collection("Profile_Pictures")
            .where("userID", "==", currentUser.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setImageURL(doc.data());
                });
            })
    }, [currentUser])
    function sidebarOpen() {
        db
            .collection("Profile_Pictures")
            .where("userID", "==", currentUser.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setImageURL(doc.data());
                });
            })

        setToggleSidenav(true)
        document.getElementsByTagName("body")[0].style = "overflow:hidden"
        document.querySelectorAll('[role="navigation"]').forEach(function (el) {
            el.style.zIndex = 2
        });
    }

    async function handleLogout() {

        try {
            await logout()
            history.push("/login")
        } catch {
            alert("Failed to Logout")
        }
    }
    function handleSidedbarClick(linkTo) {
        history.push(linkTo)
    }
    return (
        <>
            <div className="sidebar">
                <Sidebar style={{ zIndex: "2" }}
                    children=""
                    sidebar=
                    {
                        <>
                            <div className="navbar-profile-container pt-2">
                                <div className="navbar-profile-img-container" >
                                    <Image
                                        className="navbar-profile-img"
                                        src={imageURL ? imageURL.url : "https://d20iq7dmd9ruqy.cloudfront.net/images/locations%20staff/default-profile-with-dog.png"}
                                        roundedCircle
                                        width="200"
                                    />
                                </div>
                                <div className="navbar-profile-name p-2" >
                                    {userInfo ? userInfo.Name : vetInfo ? vetInfo.Name : "User"}
                                </div>
                            </div>
                            <ListGroup>
                                <ListGroup.Item action id="Home" onClick={() => { handleSidedbarClick("/") }}>
                                    <FaHome /> Home
                                </ListGroup.Item>
                                {
                                    userInfo && userInfo.userType === "Client" ? "" :
                                        <>
                                            <ListGroup.Item action id="Dashboard" onClick={() => { handleSidedbarClick("/dashboard") }}>
                                                <FaChartBar /> Dashboard
                                            </ListGroup.Item>
                                            <ListGroup.Item action id="Clients" onClick={() => { handleSidedbarClick("/clients") }}>
                                                <FaUsers /> Clients
                                            </ListGroup.Item>
                                            <ListGroup.Item action id="Medicines" onClick={() => { handleSidedbarClick("/inventory") }}>
                                                <GiMedicinePills /> Inventory
                                            </ListGroup.Item>
                                            {/* <ListGroup.Item action id="Inventory" onClick={()=>{handleSidedbarClick("/inventory")}}>
                                <FaBoxes/> Inventory
                            </ListGroup.Item> */}
                                            <ListGroup.Item action id="Reports" onClick={() => { handleSidedbarClick("/reports") }}>
                                                <SiMicrosoftpowerpoint /> Reports
                                            </ListGroup.Item>
                                        </>
                                }
                                <ListGroup.Item action id="Schedule List" onClick={() => { handleSidedbarClick("/schedule") }}>
                                    <FaRegCalendarCheck /> Schedule List
                                </ListGroup.Item>
                                <ListGroup.Item action id="Appointments" onClick={() => { handleSidedbarClick("/appointments") }}>
                                    <FaRegCalendarAlt /> Appointments
                                </ListGroup.Item>
                                <ListGroup.Item action id="Profile" onClick={() => { handleSidedbarClick("/profile") }}>
                                    <FaUser /> Profile
                                </ListGroup.Item>
                                {
                                    userInfo && userInfo.userType === "Admin" ? "" :
                                        <>
                                            <ListGroup.Item action id="Message" onClick={() => { handleSidedbarClick("/message") }}>
                                                <FaEnvelope /> Message
                                            </ListGroup.Item>
                                        </>
                                }
                                <VersionInfo></VersionInfo>
                            </ListGroup>
                        </>
                    }
                    open={toggleSidenav}
                    onSetOpen={() => { setToggleSidenav(false) }}
                    styles={{ sidebar: { backgroundColor: "#7cc1ac", width: 300 } }}
                ></Sidebar>
            </div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand className="sidebar-button" onClick={sidebarOpen}><GiHamburgerMenu /></Navbar.Brand>
                <Navbar.Brand className="navbar-title" onClick={() => { handleSidedbarClick(title === "Home" ? "/" : title.toLowerCase()) }}>{title}</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    <Nav className={"me-auto nav nav-title-" + title}>
                        <Navbar.Brand>E-Paws Veterinary</Navbar.Brand>
                    </Nav>
                    <Nav className="nav-notif">
                        <Notifications />
                    </Nav>
                    <Dropdown className="nav-logout">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Nav.Link className="navbar-logout" onClick={handleLogout}><FiLogOut /> Logout</Nav.Link>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Navbar>

        </>
    )
}
