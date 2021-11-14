import React, { useContext, useState, useEffect } from 'react'
import {auth,db} from "../firebase"
import moment from 'moment'
import schedule from 'node-schedule'
import emailjs from 'emailjs-com';

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser,setCurrentUser] = useState()
    const [loading,setLoading] = useState(true)
    const [owners,setOwners] = useState([]);
    const [vets,setVets] = useState([]);
    const [evts,setEvents] = useState([])

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
        console.log(info)
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
        console.log(info)
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
    async function createAppointment(clientID,Date,reason,span,priority,email,clientName) {
        db.collection('Appointments').add({
            Date : Date,
            time : moment().format("hh:mm a"),
            reason : reason,
            span : span,
            priority : priority,
            clientID : clientID,
            email: email,
            clientName : clientName
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
        console.log(vets)
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
        const unsubscribe4 = 
          db
          .collection('Appointments')
          .limit(100)
          .onSnapshot(querySnapshot =>{
          const data = querySnapshot.docs.map(doc =>({
              ...doc.data(),
              id:doc.id,
          }));
          console.log(data)
          var eventData=[]
          data.forEach(dt=>{
            eventData.push({
              title : dt.clientName +" - " + dt.time +" - #" + dt.priority + " prio :: " + dt.reason,
              date : moment(new Date(dt.Date).toUTCString()).format("YYYY-MM-DD"),
              clientID : dt.clientID,
              email : dt.email,
              reason : dt.reason,
              clientName : dt.clientName,
              dateFrom : dt.timeFrom
            })
          })
          setEvents(eventData)
        })
        return ()=>{    
            unsubscribe1();
            unsubscribe2();
            unsubscribe3();
            unsubscribe4();
        }
    },[])

    useEffect(()=>{
        schedule.scheduleJob('0 0 * * *', () => { 
            console.log("EVENTS",evts)
            evts.forEach(schedule=>{
                var templateParams = {
                    to_email: schedule.email,
                    to_name: schedule.clientName,
                    reason: schedule.reason,
                    sched: schedule.date + " at 10:00AM"
                };
                
                emailjs.send('scheduleEmail', 'schedule_template', templateParams,'user_q4V9lFfLOBoJCZa2j8NVZ')
                    .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    }, function(error) {
                    console.log('FAILED...', error);
                    });
            })
        }) 
        
    },[evts])
    

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
