import React, { useContext, useState, useEffect } from 'react'
import {auth,db} from "../firebase"

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser,setCurrentUser] = useState(null)
    const [loading,setLoading] = useState(true)
    const [owners,setOwners] = useState([]);
    const [vets,setVets] = useState([]);

    async function signup(email,password,info){
        const data = await auth.createUserWithEmailAndPassword(email, password)
        var OwnerID = data.user.uid
        console.log(OwnerID, info)
        if (db) {
            db.collection('Owner_Info').add({
                OwnerName: info.OwnerInfo.OwnerName,
                OwnerContactNo: info.OwnerInfo.OwnerContactNo,
                OwnerAddress: info.OwnerInfo.OwnerAddress,
                ownerID: OwnerID
            })
            db.collection('Pet_Info').add({
                ownerID: OwnerID,
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
    }

    async function login(email,password,type){
        const data = await auth.signInWithEmailAndPassword(email,password)
        
        if(type==="Owner_Info"){
            var newOwners =  owners.filter(function(owner) {
                return owner.ownerID === data.user.uid;
            });
            if(newOwners.length>0){
                setCurrentUser(data.user)
            }else{
                setCurrentUser(null)
            }
        }else{
            var newVets =  vets.filter(function(vet) {
                return vet.ownerID === data.user.uid;
            });
            if(newVets.length>0){
                setCurrentUser(data.user)
            }else{
                setCurrentUser(null)
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
            .limit(100)
            .onSnapshot(querySnapshot =>{
            const data = querySnapshot.docs.map(doc =>({
                ...doc.data(),
                id:doc.id,
            }));
            setOwners(data);
        })
        const unsubscribe3 = db
            .collection('Vet_Info')
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
    },[loading])
    

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading  && children}
        </AuthContext.Provider>
    )
}
