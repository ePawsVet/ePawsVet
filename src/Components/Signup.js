import React, { useRef, useState } from 'react'
import { Form,Button,Card,Alert,Container } from"react-bootstrap"
import { useAuth } from '../Contexts/AuthContext'
import { Link,useHistory } from 'react-router-dom'
import moment from 'moment'
import Loader from "react-loader-spinner";

export default function Signup() {
    //OWNER INFO
    const ownerRef = useRef()
    const addressRef = useRef()
    const contactRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    //PET INFO
    const petRef = useRef()
    const petTypeRef = useRef()
    const petTypeOthersRef = useRef()
    const breedRef = useRef()
    const dobRef = useRef()
    const genderRef = useRef()
    const ageRef = useRef()
    const colorRef = useRef()
    const spayedRef = useRef()


    const {signup} = useAuth()
    const [error,setError] = useState("")
    const [petError,setPetError] = useState("")
    const [ownerError,setOwnerError] = useState("")
    const [loading,setLoading] = useState(false)
    const history = useHistory(); 

    async function SignupHandler(e) {
        e.preventDefault()
        setError("")
        setOwnerError("")

        var info = getData()

        if(passwordRef.current.value !== passwordConfirmRef.current.value){
            return setOwnerError("Passwords do not match!")
        }

        try{
            setLoading(true)
            await signup(emailRef.current.value,passwordRef.current.value,info)
            history.push("/")
        }catch(err){
            setError("Failed to create an account. " +err.message)
        }
        setLoading(false)
    }

    function petTypeHandler(){
        var elem = document.getElementsByName('pettype');
        
        elem.forEach(ele => {
            if(ele.checked){
                if(ele.value==="Others"){
                    document.getElementById("other-type").style.display = "block"
                }else{
                    document.getElementById("other-type").style.display = "none"
                }
            }
        })
    }

    async function getData(){
        var dt =
        {
            OwnerInfo : {
                "OwnerName"         : ownerRef.current.value,
                "OwnerAddress"      : addressRef.current.value,
                "OwnerContactNo"    : contactRef.current.value
            },
            PetInfo : {
                "PetName"   : petRef.current.value,
                "PetType"   : petTypeRef.current.value === "Others" ? petTypeOthersRef.current.value : petTypeRef.current.value,
                "Breed"     : breedRef.current.value,
                "Birthday"  : dobRef.current.value,
                "Gender"    : genderRef.current.value,
                "Age"       : ageRef.current.value,
                "Color"     : colorRef.current.value,
                "Spayed"    : spayedRef.current.value
            }
        }
        return dt
    }

    function birthdayHandler(){
        setPetError("")
        var bday = new Date(document.getElementById("pet-birthday").value);
        var today = new Date()
        console.log(bday)
        if(bday>today){
            setPetError("Date of Birth cannot be in the future")
            document.getElementById("pet-birthday").value = moment().format("YYYY-MM-DD")
        }else{
            var a = moment(today);
            var b = moment(bday);

            var years = a.diff(b, 'year');
            b.add(years, 'years');

            var months = a.diff(b, 'months');
            b.add(months, 'months');

            var days = a.diff(b, 'days');

            var age = "";
            age += years > 0 ? years + (years > 1 ? ' years ' : ' year ') : "";
            age += months > 0 ? months +  (months > 1 ? ' months ' : ' month ') : "";
            age += days > 0 ? days +  (days > 1 ? ' days ' : ' day '): "";

            document.getElementById("pet-computed-age").value = age + "old";
        }
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
        <div className="w-100 signup-container">
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Registration Form</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={SignupHandler}>
                        <div className="row">
                            <div className="signup-info-container signup-pet col-lg-6 col-md-12">
                                <h2 className="text-center mb-4">Pet Info</h2>
                                {petError && <Alert variant="danger">{petError}</Alert>}
                                <Form.Group id="pet-name" className="required">
                                    <Form.Label>Name of Pet</Form.Label>
                                    <Form.Control ref={petRef} type="text" required />
                                </Form.Group>
                                <Form.Group id="pet-type" className="required">
                                    <Form.Label>Pet Type</Form.Label><br/>
                                    <Form.Check ref={petTypeRef} required onClick={petTypeHandler} value="Cat" inline name="pettype" type="radio" label="Cat" />
                                    <Form.Check ref={petTypeRef} required onClick={petTypeHandler} value="Dog" inline name="pettype" type="radio" label="Dog" />
                                    <Form.Check ref={petTypeRef} required onClick={petTypeHandler} value="Others" inline name="pettype" type="radio" label="Others" />
                                    <Form.Control ref={petTypeOthersRef} id="other-type" type="text"/>
                                </Form.Group>

                                <Form.Group id="pet-breed" className="required">
                                    <Form.Label>Breed</Form.Label>
                                    <Form.Control ref={breedRef} type="text" required />
                                </Form.Group>

                                <Form.Group id="pet-dob" className="required">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control ref={dobRef} id="pet-birthday" onChange={birthdayHandler} type="date" required />
                                </Form.Group>

                                <Form.Group id="pet-gender" className="required">
                                    <Form.Label>Gender</Form.Label><br/>
                                    <Form.Check ref={genderRef} value="Male" inline required  type="radio" label="Male" name="gender" />
                                    <Form.Check ref={genderRef} value="Female"  inline required  type="radio" label="Female" name="gender" />
                                </Form.Group>

                                <Form.Group id="pet-age" className="required">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control ref={ageRef} required id="pet-computed-age" type="text" disabled />
                                </Form.Group>

                                <Form.Group id="pet-colormarkings" className="required">
                                    <Form.Label>Color/Markings</Form.Label>
                                    <Form.Control ref={colorRef} type="text" required />
                                </Form.Group>

                                <Form.Group id="pet-neutered" className="required">
                                    <Form.Label>Spayed/Neutered</Form.Label><br/>
                                    <Form.Check ref={spayedRef} value="Neutered" required inline type="radio" label="Yes" name="neutered" />
                                    <Form.Check ref={spayedRef} value="Not neutered" required inline type="radio" label="No" name="neutered" />
                                </Form.Group>
                            </div>
                            <div className="signup-info-container signup-owner col-lg-6 col-md-12">
                                <h2 className="text-center mb-4">Owner Info</h2>
                                {ownerError && <Alert variant="danger">{ownerError}</Alert>}
                                <Form.Group id="owner-name" className="required">
                                    <Form.Label>Name of Owner</Form.Label>
                                    <Form.Control type="text" required ref={ownerRef}/>
                                </Form.Group>
                                <Form.Group id="owner-address" className="required">
                                    <Form.Label>Address</Form.Label>
                                    <Form.Control type="text" required ref={addressRef}/>
                                </Form.Group>
                                <Form.Group id="owner-contact" className="required">
                                    <Form.Label>Contact No</Form.Label>
                                    <Form.Control type="number" required ref={contactRef}/>
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
                        </div>
                        <Button disabled={loading} className="w-100 text-center mt-2" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/login">Log In</Link>
            </div>
        </div></Container>
    )
}
