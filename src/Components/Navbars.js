import React, { useState, useEffect } from 'react'
import { Navbar,Nav,NavDropdown,ListGroup } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthContext'
import { GiHamburgerMenu } from 'react-icons/gi';
import { FiLogOut } from 'react-icons/fi';
import { FaChartBar,FaRegCalendarAlt,FaUsers,FaUser } from 'react-icons/fa';
import { IoMdPaw } from 'react-icons/io';


import Sidebar from "react-sidebar";

export default function Navbars({title=""}) {
    const [toggleSidenav,setToggleSidenav] = useState(false)
    const { logout } = useAuth()
    const history = useHistory()

    useEffect(()=>{
        var element = document.getElementById(title)
        element.className += element.classList.contains("active") ? "" : " active"
    })

    async function handleLogout() {

        try{
            await logout()
            history.push("/login")
        }catch{
            alert("Failed to Logout")
        }
    }
    function handleSidedbarClick(linkTo){
        history.push(linkTo)
    }
    return (
        <>
            <Sidebar
                children=""
                sidebar=
                {
                    <>
                    <h1 style={{padding:"10px"}}><IoMdPaw/> E-Paws Veterinary</h1>
                    <ListGroup>
                        <ListGroup.Item action id="Dashboard" onClick={()=>{handleSidedbarClick("/")}}>
                            <FaChartBar/> Dashboard
                        </ListGroup.Item>
                        <ListGroup.Item action id="Appointments" onClick={()=>{handleSidedbarClick("/appointments")}}>
                            <FaRegCalendarAlt/> Appointments
                        </ListGroup.Item>
                        <ListGroup.Item action id="Employees" onClick={()=>{handleSidedbarClick("/employees")}}>
                            <FaUsers/> Employees
                        </ListGroup.Item>
                        <ListGroup.Item action id="Profile" onClick={()=>{handleSidedbarClick("profile")}}>
                            <FaUser/> Profile
                        </ListGroup.Item>
                    </ListGroup>
                    </>
                }
                open={toggleSidenav}
                onSetOpen={() => setToggleSidenav(false)}
                styles={{ sidebar: { background: "white" } }}
            ></Sidebar>

            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand className="sidebar-button" onClick={() => setToggleSidenav(true)}><GiHamburgerMenu/></Navbar.Brand>
                <Navbar.Brand className="navbar-title" onClick={()=>{handleSidedbarClick(title==="Dashboard"? "/" : title.toLowerCase() )}}>{title}</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    <Nav.Link href="#features">Features</Nav.Link>
                    <Nav.Link href="#pricing">Pricing</Nav.Link>
                    <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                    <Nav>
                    <Nav.Link className="navbar-logout" onClick={handleLogout}><FiLogOut/> Logout</Nav.Link>
                    
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            
        </>
    )
}
