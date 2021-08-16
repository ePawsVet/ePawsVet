import React, { useRef, useState } from 'react'
import { Form,Button,Card,Alert, Container } from"react-bootstrap"
import { useAuth } from '../Contexts/AuthContext'
import { Link } from 'react-router-dom'
import Loader from "react-loader-spinner";

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error,setError] = useState("")
    const [message,setMessage] = useState("")
    const [loading,setLoading] = useState(false)
    
    async function SignupHandler(e) {
        e.preventDefault()
        try{
            setMessage("")
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage("Please check your inbox for further instructions")
        }catch{
            setError("Failed to reset password")
        }
        setLoading(false)
    }
    return (
        <Container className="d-flex align-items-center justify-content-center"
            style={{minHeight:"100vh"}}
        >
            {loading ?
            <Loader className="loading-spinner"
                type="Grid"
                color="#00BFFF"
                height={100}
                width={100}
            /> : null}
            <div className="w-100 reset-password-container">
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Password Reset</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {message && <Alert variant="success">{message}</Alert>}
                        <Form onSubmit={SignupHandler}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required />
                            </Form.Group>
                            
                            <Button disabled={loading} className="w-100 text-center mt-2" type="submit">
                                Reset Password
                            </Button>
                        </Form>
                        <div className="w-100 text-center mt-3">
                            <Link to="/login">Log in</Link>
                        </div>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    Need an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </Container>
    )
}
