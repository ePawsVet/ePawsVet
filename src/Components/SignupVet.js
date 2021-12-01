import React, { useRef, useState } from 'react'
import { Form, Button, Alert } from "react-bootstrap"
import { useAuth } from '../Contexts/AuthContext'
import Loader from "react-loader-spinner";
import { FaUser } from 'react-icons/fa';

export default function SignupVet({close=null}) {
    //OWNER INFO
    const ownerRef = useRef()
    const addressRef = useRef()
    const contactRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()

    const { signupVet,logout } = useAuth()
    const [error, setError] = useState("")
    const [ownerError, setOwnerError] = useState("")
    const [loading, setLoading] = useState(false)

    async function SignupHandler(e) {
        e.preventDefault()
        setError("")
        setOwnerError("")

        var info = getData()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setOwnerError("Passwords do not match!")
        }

        try {
            setLoading(true)
            await signupVet(emailRef.current.value, passwordRef.current.value, info)
            close()
            logout()
        } catch (err) {
            setError("Failed to create an account. " + err.message)
        }
        setLoading(false)
    }
    async function getData() {
        var dt =
        {
            OwnerInfo: {
                "Name": ownerRef.current.value,
                "Address": addressRef.current.value,
                "ContactNo": contactRef.current.value,
                "Type": "Admin"
            }
        }
        return dt
    }
    return (
        <>
            {loading ?
                <Loader className="loading-spinner"
                    type="Grid"
                    color="#00BFFF"
                    height={100}
                    width={100}
                /> : null
            }
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={SignupHandler}>
                <div className="row">
                    <h3 className="text-center mb-4"><FaUser className="owner-icon" />Vet Info</h3>
                    {ownerError && <Alert variant="danger">{ownerError}</Alert>}
                    <Form.Group id="owner-name" className="required">
                        <Form.Label>Name of Veterinarian</Form.Label>
                        <Form.Control type="text" required ref={ownerRef} />
                    </Form.Group>
                    <Form.Group id="owner-address" className="required">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" required ref={addressRef} />
                    </Form.Group>
                    <Form.Group id="owner-contact" className="required">
                        <Form.Label>Contact No</Form.Label>
                        <Form.Control type="number" required ref={contactRef} />
                    </Form.Group>
                    <Form.Group id="owner-email" className="required">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Form.Group id="owner-password" className="required">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>
                    <Form.Group id="password-confirm" className="required">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} required />
                    </Form.Group>
                </div>
                <Button disabled={loading} className="w-90 text-center mt-2" type="submit">
                    Create Vet
                </Button>
            </Form>
        </>
    )
}
