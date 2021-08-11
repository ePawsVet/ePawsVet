import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import Navbars from "../Components/Navbars";
import { Form,Button, Container, Alert } from 'react-bootstrap'
import { useAuth } from '../Contexts/AuthContext'


export default function ContactUs() {
    const [error,setError] = useState("")
    const [message,setMessage] = useState("")
    const { currentUser } = useAuth()
    function sendEmail(e) {
        e.preventDefault();
        setError("")
        setMessage("")

        emailjs.sendForm('gmail', 'email_template', e.target, 'user_q4V9lFfLOBoJCZa2j8NVZ')
        .then((result) => {
            setMessage("Email was sent successfully!");
        }, (error) => {
            setError(error.text);
        });
        e.target.reset()
    }

    return (
        <>
        <Navbars title="Dashboard"></Navbars>
        <Container >
            <h2 className="text-center mb-4">Contact Form</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            <Form className="contact-form" onSubmit={sendEmail}>
                <input type="hidden" name="contact_number" />
                <Form.Group className="mb-3" controlId="UserName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control required name="user_name" type="text" placeholder="Your Name" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="ContactNumber">
                    <Form.Label>Contact #</Form.Label>
                    <Form.Control required name="contact_number" type="number" placeholder="Contact Number" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="EmailAddress">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control required name="user_email" type="email" placeholder="sample.email@gmail.com" defaultValue={currentUser.email}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="EmailMessage">
                    <Form.Label>Message</Form.Label>
                    <Form.Control required name="message" as="textarea" rows={3} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Send Email
                </Button>
            </Form>
        </Container>
        
        
        </>
    );
}