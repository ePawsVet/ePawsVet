import React, { useContext, useState, useEffect } from 'react'
import {auth,db} from "../firebase"
import moment from 'moment'
// import schedule from 'node-schedule'
// import emailjs from 'emailjs-com';

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser,setCurrentUser] = useState()
    const [loading,setLoading] = useState(true)
    const [owners,setOwners] = useState([]);
    const [vets,setVets] = useState([]);

    async function signup(email,password,info){

        const data = await auth.createUserWithEmailAndPassword(email, password)
        var id = data.user.uid
        info = await info
        if (db) {
            createUser(id,email,info);
            createPet(id,info);
        }
    }
    async function signupVet(email,password,info){

        const data = await auth.createUserWithEmailAndPassword(email, password)
        var id = data.user.uid
        info = await info
        if (db) {
            createUser(id,email,info);
        }
    }

    async function createUser(id,email,info) {
        info = await info
        db.collection('Owner_Info').add({
            Name: info.OwnerInfo.Name,
            ContactNo: info.OwnerInfo.ContactNo,
            Address: info.OwnerInfo.Address,
            Email: email,
            userID: id,
            userType: info.OwnerInfo.Type
        })
    }
    
    async function createPet(id,info) {
        info = await info
        db.collection('Pet_Info').add({
            ownerID: id,
            PetName: info.PetInfo.PetName,
            PetType: info.PetInfo.PetType,
            Breed: info.PetInfo.Breed,
            Birthday: info.PetInfo.Birthday,
            Gender: info.PetInfo.Gender,
            Age: info.PetInfo.Age,
            Color: info.PetInfo.Color,
            Spayed: info.PetInfo.Spayed,
        })
    }
    async function updatePet(id,info,ownerID) {
        info = await info
        db.collection('Pet_Info').doc(id).set({
            Age : info.PetInfo.Age,
            Birthday : info.PetInfo.Birthday,
            Breed : info.PetInfo.Breed,
            Color : info.PetInfo.Color,
            Gender : info.PetInfo.Gender,
            PetName : info.PetInfo.PetName,
            PetType : info.PetInfo.PetType,
            Spayed : info.PetInfo.Spayed,
            ownerID : ownerID
        })
    }
    async function createAppointment(clientID,Date,reason,span,priority,email,clientName,petName) {
        db.collection('Appointments').add({
            Date : Date,
            time : moment().format("hh:mm A"),
            reason : reason,
            span : span,
            priority : priority,
            clientID : clientID,
            email: email,
            clientName : clientName,
            status: "Pending",
            sched: "Time will be emailed",
            petName:petName
        })
    }

    async function login(email,password,type){
        const data = await auth.signInWithEmailAndPassword(email,password)
        var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
        var string = '';
        for(var ii=0; ii<15; ii++){
            string += chars[Math.floor(Math.random() * chars.length)];
        }
        var randomEmail = string + '@gmail.com';
        if(type==="Owner_Info"){
            var newOwners =  owners.filter(function(owner) {
                return owner.userID === data.user.uid;
            });
            if(newOwners.length>0){
                setCurrentUser(data.user)
            }else{
                setCurrentUser(null)
                await auth.signInWithEmailAndPassword(randomEmail,randomEmail)
            }
        }else{
            var newVets =  vets.filter(function(vet) {
                return vet.userID === data.user.uid;
            });
            if(newVets.length>0){
                setCurrentUser(data.user)
            }else{
                setCurrentUser(null)
                await auth.signInWithEmailAndPassword(randomEmail,randomEmail)
            }
        }
    }

    function logout(){
        return auth.signOut();
    }

    function resetPassword(email){
        return auth.sendPasswordResetEmail(email)
    }

    useEffect(()=>{
        const unsubscribe1 = auth.onAuthStateChanged(user=> {
            user ? setCurrentUser(user) : setCurrentUser(null)
            setLoading(false)
        })
        const unsubscribe2 = db
            .collection('Owner_Info')
            .where("userType","==","Client")
            .limit(100)
            .onSnapshot(querySnapshot =>{
            const data = querySnapshot.docs.map(doc =>({
                ...doc.data(),
                id:doc.id,
            }));
            setOwners(data);
        })
        const unsubscribe3 = db
            .collection('Owner_Info')
            .where("userType","==","Admin")
            .limit(100)
            .onSnapshot(querySnapshot =>{
            const data = querySnapshot.docs.map(doc =>({
                ...doc.data(),
                id:doc.id,
            }));
            setVets(data);
        })
        return ()=>{    
            unsubscribe1();
            unsubscribe2();
            unsubscribe3();
        }
    },[])
    

    const value = {
        currentUser,
        signup,
        signupVet,
        login,
        logout,
        resetPassword,
        createPet,
        createUser,
        updatePet,
        createAppointment
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading  && children}
        </AuthContext.Provider>
    )
}
