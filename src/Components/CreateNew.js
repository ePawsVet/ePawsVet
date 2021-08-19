import React, { useRef, useState,useEffect } from 'react'
import { Form,Button,Alert,Container } from"react-bootstrap"
import { useAuth } from '../Contexts/AuthContext'
import moment from 'moment'
import Loader from "react-loader-spinner";

export default function CreateNew({click,petInfo=[],userInfo=[]}) {
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
    const [error,setError] = useState("")
    const [petError,setPetError] = useState("")
    const [loading,setLoading] = useState(false)
    const { createPet,updatePet } = useAuth()

    async function SignupHandler(e) {
        e.preventDefault()
        setError("")

        var info = getData()

        try{
            setLoading(true)
            petInfo.length !== 0 ? updatePet(petInfo.id,info,userInfo.userID):createPet(userInfo.userID,info)
            click()
        }catch(err){
            setError("Failed to enroll pet. " +err.message)
        }
        setLoading(false)
    }
    
    useEffect(()=>{
        if(petInfo.length !== 0){
            petRef.current.value = petInfo.PetName
            breedRef.current.value = petInfo.Breed
            dobRef.current.value = petInfo.Birthday
            ageRef.current.value = petInfo.Age
            colorRef.current.value = petInfo.Color

            var PetType = document.getElementsByName('pettype');
            var Gender = document.getElementsByName('gender');
            var Neutered = document.getElementsByName('neutered');
            
            PetType.forEach(ele => {
                if(petInfo.PetType !== "Cat" && petInfo.PetType !== "Dog"){
                    document.getElementById("other-type").style.display = "block"
                    petTypeOthersRef.current.value = petInfo.PetType
                    ele.checked =true
                }else{
                    document.getElementById("other-type").style.display = "none"
                    if(ele.value === petInfo.PetType){
                        ele.checked =true
                    }
                }
                setPetType(ele.value)
            })
            Gender.forEach(ele => {
                if(ele.value === petInfo.Gender){
                    ele.checked =true
                    setGender(ele.value)
                }
            })
            Neutered.forEach(ele => {
                if(
                    (ele.value === "Neutered" && petInfo.Spayed === "Neutered") ||
                    (ele.value === "Not neutered" && petInfo.Spayed === "Not neutered")
                 ){
                    ele.checked = true
                    setNeutered(ele.value)
                }
            })
        }
    },[petInfo])

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
        <Container 
      style={{minHeight:"50vh"}}>
        {loading ?
            <Loader className="loading-spinner"
                type="Grid"
                color="#00BFFF"
                height={100}
                width={100}
        /> : null}
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={SignupHandler}>
                <div className="row">
                    {petError && <Alert variant="danger">{petError}</Alert>}
                    <Form.Group id="pet-name" className="required">
                        <Form.Label>Name of Pet</Form.Label>
                        <Form.Control ref={petRef} type="text" required />
                    </Form.Group>
                    <Form.Group id="pet-type" className="required">
                        <Form.Label>Pet Type</Form.Label><br/>
                        <Form.Check value="Cat" required onClick={radioButtonHandler} inline name="pettype" type="radio" label="Cat" />
                        <Form.Check value="Dog" required onClick={radioButtonHandler} inline name="pettype" type="radio" label="Dog" />
                        <Form.Check value="Others" required onClick={radioButtonHandler} inline name="pettype" type="radio" label="Others" />
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
                <Button disabled={loading} className="w-100 text-center mt-2" type="submit">
                    {petInfo.length !== 0 ? "Update Pet" : "Enroll Pet"}
                </Button>
            </Form>
        </>
        </Container>
    )
}
