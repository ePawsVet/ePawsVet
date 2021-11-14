import React, { useRef, useState } from 'react'
import { Form,Button,Card,Alert,Container } from"react-bootstrap"
import { useAuth } from '../Contexts/AuthContext'
import { Link,useHistory } from 'react-router-dom'
import moment from 'moment'
import Loader from "react-loader-spinner";
import { FaPaw, FaUser } from 'react-icons/fa';

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
    const petTypeOthersRef = useRef()
    const breedRef = useRef()
    const dobRef = useRef()
    const ageRef = useRef()
    const colorRef = useRef()

    const [pettype,setPetType] = useState("")
    const [gender,setGender] = useState("")
    const [neutered,setNeutered] = useState("")
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

    function radioButtonHandler(){
        var PetType = document.getElementsByName('pettype');
        var Gender = document.getElementsByName('gender');
        var Neutered = document.getElementsByName('neutered');
        PetType.forEach(ele => {
            if(ele.checked){
                if(ele.value==="Others"){
                    document.getElementById("other-type").style.display = "block"
                }else{
                    document.getElementById("other-type").style.display = "none"
                }
                setPetType(ele.value)
            }
        })
        Gender.forEach(ele => {
            if(ele.checked){
                setGender(ele.value)
            }
        })
        Neutered.forEach(ele => {
            if(ele.checked){
                setNeutered(ele.value)
            }
        })
    }

    async function getData(){
        var dt =
        {
            OwnerInfo : {
                "Name"         : ownerRef.current.value,
                "Address"      : addressRef.current.value,
                "ContactNo"    : contactRef.current.value,
                "Type"         : "Client"
            },
            PetInfo : {
                "PetName"   : petRef.current.value,
                "PetType"   : pettype === "Others" ? petTypeOthersRef.current.value : pettype,
                "Breed"     : breedRef.current.value,
                "Birthday"  : dobRef.current.value,
                "Gender"    : gender,
                "Age"       : ageRef.current.value,
                "Color"     : colorRef.current.value,
                "Spayed"    : neutered
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
                    <h2 className="text-center registration-header">Registration Form</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={SignupHandler}>
                        <div className="row">
                            <div className="signup-info-container signup-pet col-lg-6 col-md-12">
                                <h3 className="text-center mb-4"><FaPaw className="pet-icon"/>Pet Info</h3>
                                {petError && <Alert variant="danger">{petError}</Alert>}
                                <Form.Group id="pet-name" className="required">
                                    <Form.Label>Name of Pet</Form.Label>
                                    <Form.Control ref={petRef} type="text" required />
                                </Form.Group>
                                <Form.Group id="pet-type" className="required">
                                    <Form.Label>Pet Type</Form.Label><br/>
                                    <Form.Check value="Cat" required onClick={radioButtonHandler} inline name="pettype" type="radio" label="Cat" />
                                    <Form.Check value="Dog" required onClick={radioButtonHandler} inline name="pettype" type="radio" label="Dog" />
                                    <Form.Check value="Bird" required onClick={radioButtonHandler} inline name="pettype" type="radio" label="Bird" />
                                    <Form.Check value="Rabbit" required onClick={radioButtonHandler} inline name="pettype" type="radio" label="Rabbit" />
                                    <Form.Check value="Guinea Pig" required onClick={radioButtonHandler} inline name="pettype" type="radio" label="Guinea Pig" />
                                    {/* <Form.Check value="Others" required onClick={radioButtonHandler} inline name="pettype" type="radio" label="Others" /> */}
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
                                    <Form.Check onClick={radioButtonHandler} value="Male" inline required  type="radio" label="Male" name="gender" />
                                    <Form.Check onClick={radioButtonHandler} value="Female"  inline required  type="radio" label="Female" name="gender" />
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
                                    <Form.Check onClick={radioButtonHandler} value="Neutered" required inline type="radio" label="Yes" name="neutered" />
                                    <Form.Check onClick={radioButtonHandler} value="Not neutered" required inline type="radio" label="No" name="neutered" />
                                </Form.Group>
                            </div>
                            <div className="signup-info-container signup-owner col-lg-6 col-md-12">
                                <h3 className="text-center mb-4"><FaUser className="owner-icon"/>Owner Info</h3>
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
                        <Button disabled={loading} className="w-90 text-center mt-2" type="submit">
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
