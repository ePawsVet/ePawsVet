import React, { useRef, useState,useEffect } from 'react'
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { useAuth } from '../Contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import Loader from "react-loader-spinner";
import {
    storage
} from '../firebase';
export default function Login() {
    const userTypeRef1 = useRef()
    const userTypeRef2 = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory();
    const [showPassword, setShowPassword] = useState(false)
    const [iconURL, setIconURL] = useState([])

    useEffect(() => {
        setIconURL([])
        const filenames = ['veterinarian.png','pet-owner.png'];
        filenames.forEach(filename=>{
            storage
            .ref(`/icons/login-icons/${filename}`)
            .getDownloadURL()
            .then(url => {
                setIconURL(iconURL => [...iconURL,url]);
            });
        })
        
    }, [])

    async function LoginHandler(e) {
        e.preventDefault()
        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value, userTypeRef1.current.checked ? userTypeRef1.current.value : userTypeRef2.current.value)
            userTypeRef1.current.checked ? history.push("/Appointments") : history.push("/")
        } catch (err) {
            setError("Failed to sign in. " + err.message)
        }
        setLoading(false)
    }

    function userTypeHandler(id) {
        var elem = document.getElementsByName('userType');

        document.getElementById("usertype-vet").style.border = "none";
        document.getElementById("usertype-owner").style.border = "none";
        document.getElementById(id).style.border = "1px solid #7cc1ac";

        elem.forEach(ele => {
            if (ele.checked) {
                if (ele.value === "Vet_Info") {
                    document.getElementById("signup-link").style.display = "none"
                    document.getElementById("signup-admin-info").style.display = "block"
                } else {
                    document.getElementById("signup-admin-info").style.display = "none"
                    document.getElementById("signup-link").style.display = "block"
                }
            }
        })

    }

    return (
        <Container className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >

            {loading ?
                <Loader className="loading-spinner"
                    type="Grid"
                    color="#00BFFF"
                    height={100}
                    width={100}
                /> : null}
            <div className="w-100 login-container" style={{ maxWidth: "400px" }}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center login-header mb-1">Log In</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={LoginHandler} className="login-form">
                            <span>I'm Logging in as a : </span>
                            <Form.Group className="text-center mb-4" id="userType" >
                                <label id="usertype-vet" className="usertype-container">
                                    <Form.Check ref={userTypeRef1} value="Vet_Info" required onClick={() => userTypeHandler("usertype-vet")} name="userType" type="radio" aria-label="Veterinarian" />
                                    <img className="usertype-img" alt="I am a Veterinarian" src={iconURL?iconURL[0]:"https://cdn2.iconfinder.com/data/icons/professions-vivid-vol-2/256/Veterinarian_Male-512.png"}></img>
                                    <div>Veterinarian</div>
                                </label>
                                <label id="usertype-owner" className="usertype-container">
                                    <Form.Check ref={userTypeRef2} value="Owner_Info" defaultChecked required onClick={() => userTypeHandler("usertype-owner")} name="userType" type="radio" aria-label="Pet Owner" />
                                    <img className="usertype-img" alt="I am a Pet Owner" src={iconURL?iconURL[1]:"https://i.pinimg.com/originals/1d/86/de/1d86de1fd9ec27ea3693255f77333ad1.png"}></img>
                                    <div>Pet Owner</div>
                                </label>
                            </Form.Group>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type={showPassword ? "text" : "password"} ref={passwordRef} required />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="showPassword">
                                <Form.Check onChange={e => setShowPassword(e.target.checked)} type="checkbox" label="Show Password" />
                            </Form.Group>
                            <Button disabled={loading} className="w-100 text-center mt-2" type="submit">
                                Log In
                            </Button>
                        </Form>
                        <div className="w-100 text-center mt-3">
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2" id="signup-link">
                    <Alert variant="light ">Need an account? <Link to="/signup">Sign Up</Link></Alert>
                </div>
                <div className="w-100 text-center mt-2" id="signup-admin-info">
                    <Alert variant="danger">Ask an admin for an account.</Alert>
                </div>
            </div>
        </Container>
    )
}
