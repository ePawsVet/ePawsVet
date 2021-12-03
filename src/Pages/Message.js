import React, { useState,useEffect } from 'react';
import emailjs from 'emailjs-com';
import Navbars from "../Components/Navbars";
import { Form,Button, Container, Alert } from 'react-bootstrap'
import { useAuth } from '../Contexts/AuthContext'
import { FaPhoneAlt,FaEnvelope,FaMapMarked } from 'react-icons/fa';
import {db} from "../firebase"
import Footer from "../Components/Footer";


export default function Message() {
    const [error,setError] = useState("")
    const [message,setMessage] = useState("")
    const { currentUser } = useAuth()
    const [userInfo,setUserInfo] = useState(null)
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
    useEffect(()=>{
        db.collection("Owner_Info").where("userID", "==", currentUser.uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setUserInfo(doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    },[currentUser])
    return (
        <>
        <Navbars title="Message"></Navbars>
        <section className="message-area" id="">
            <Container className="contact-container">
                <h1 className="text-center pb-1">Send us a message!</h1>
                <p className="text-center pb-2">Have questions? Our contact information is below. If you need anything at all, please let us know. We’re here to help! Complete the form below and we’ll get back to you as quickly as possible!</p>
                <Form className="contact-form" onSubmit={sendEmail}>
                <div className="row">
                    <div className="contact-info-container signup-pet col-lg-6 col-md-12">
                        <div className="contact-info-details-container">
                            <div className="contact-info-icon contact-info-align"><FaPhoneAlt size={30}/></div>
                            <div className="contact-info-align contact-info-details">
                                <h5>PHONE NUMBER</h5>
                                <div class='pb-2'>(+639) 123-467-899</div>
                            </div>
                        </div>
                        <div className="contact-info-details-container">
                            <div className="contact-info-icon contact-info-align"><FaEnvelope/></div>
                            <div className="contact-info-align contact-info-details">
                                <h5>EMAIL ADDRESS</h5>
                                <div class='pb-2'>contact.epaws@gmail.com</div>
                            </div>
                        </div>
                        <div className="contact-info-details-container">
                            <div className="contact-info-icon contact-info-align"><FaMapMarked/></div>
                            <div className="contact-info-align contact-info-details">
                                <h5>ADDRESS</h5>
                                <div class='pb-2'>San Pablo City</div>
                        </div>
                        </div>
                    </div>
                    <div className="contact-info-container signup-pet col-lg-6 col-md-12">
                        {error && <Alert variant="danger">{error}</Alert>}
                        {message && <Alert variant="success">{message}</Alert>}
                        <Form.Group className="mb-3" controlId="UserName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control required name="user_name" type="text" placeholder="Your Name" defaultValue={userInfo ? userInfo.Name : "" } />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ContactNumber">
                            <Form.Label>Contact #</Form.Label>
                            <Form.Control required name="contact_number" type="number" placeholder="Contact Number" defaultValue={userInfo ? userInfo.ContactNo:""} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="EmailAddress">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control required name="user_email" type="email" placeholder="sample.email@gmail.com" defaultValue={currentUser.email}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="EmailMessage">
                            <Form.Label>Message</Form.Label>
                            <Form.Control required name="message" as="textarea" rows={3} />
                        </Form.Group>
                        <Button variant="primary" className="message-send-btn" type="submit">
                            Send Email
                        </Button>
                    </div>
                </div>
                </Form>
            </Container>
        </section>
        <Footer></Footer>
        
        </>
    );
}