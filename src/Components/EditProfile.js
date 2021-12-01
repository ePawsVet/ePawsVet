import React, { useRef} from 'react'
import { Form, Button, Container } from "react-bootstrap"
import { useAuth } from '../Contexts/AuthContext'

export default function EditProfile({userInfo=null,click=null}) {
    //OWNER INFO
    const ownerRef = useRef()
    const addressRef = useRef()
    const contactRef = useRef()
    const emailRef = useRef()
    const { updateClient, currentUser } = useAuth()

    async function updateHandler(e) {
        e.preventDefault()

        var info = {
            "Name": ownerRef.current.value,
            "Address": addressRef.current.value,
            "ContactNo": contactRef.current.value,
            "Email": emailRef.current.value,
            "userID" : currentUser.uid,
            "userType": userInfo.userType
        }
        try {
            updateClient(info, userInfo.id)
            click()
        } catch (err) {
            console.log("Failed to update info. " + err.message)
        }
    }

    return (
        <Container className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "40vh" }}
        >
            <div className="w-100 signup-container">
                <Form onSubmit={updateHandler}>
                    <div className="row">
                        <div>
                            <Form.Group id="owner-name" className="required">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" required ref={ownerRef} defaultValue={userInfo ? userInfo.Name : ""} />
                            </Form.Group>
                            <Form.Group id="owner-address" className="required">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" required ref={addressRef} defaultValue={userInfo ? userInfo.Address : ""} />
                            </Form.Group>
                            <Form.Group id="owner-contact" className="required">
                                <Form.Label>Contact No</Form.Label>
                                <Form.Control type="number" required ref={contactRef} defaultValue={userInfo ? userInfo.ContactNo : ""} />
                            </Form.Group>
                            <Form.Group id="owner-email" className="required">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required defaultValue={userInfo ? userInfo.Email : ""} />
                            </Form.Group>
                        </div>
                    </div>
                    <Button className="w-90 text-center mt-2" type="submit">
                        Update Info
                    </Button>
                </Form>
            </div></Container>
    )
}
