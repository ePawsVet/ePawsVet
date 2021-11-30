import React, { useState } from "react";
import { storage, db } from "../firebase";
import { useAuth } from "../Contexts/AuthContext";
import { InputGroup, Button } from 'react-bootstrap';
import Loader from "react-loader-spinner";

const EditImage = ({ userInfo = null, petInfo = null, editImage = "", imageURL = "", close = null }) => {
    const { currentUser } = useAuth()
    const [file, setFile] = useState(null);
    const [url, setURL] = useState("");
    const [loading, setLoading] = useState(false)

    function handleChange(e) {
        setFile(e.target.files[0]);
        document.getElementById('profile-image').src = window.URL.createObjectURL(e.target.files[0])
    }

    function handleUpload(e) {
        e.preventDefault();
        setLoading(true)
        const ref = storage.ref(`/images/${file.name}`);
        const uploadTask = ref.put(file);
        uploadTask.on("state_changed", console.log, console.error, () => {
            ref
                .getDownloadURL()
                .then((url) => {
                    setFile(null);
                    setURL(url);
                    saveURL(url)
                }).then(() => {
                    setLoading(false)
                    close();
                });

        });
    }
    const saveURL = (url) => {
        if (imageURL) {
            if (editImage === "Profile") {
                db.collection('Profile_Pictures').doc(imageURL.id).set({
                    url: url,
                    userID: currentUser.uid
                })
            } else if (editImage === "Pet Image") {
                db.collection('Pet_Info').doc(petInfo.id).update({
                    url: url
                })
            }
        }
        else {
            if (editImage === "Profile") {
                db.collection('Profile_Pictures').add({
                    url: url,
                    userID: currentUser.uid
                })
            } else if (editImage === "Pet Image") {
                db.collection('Pet_Info').doc(petInfo.id).update({
                    url: url
                })
            }
        }
    }
    return (
        <div >
            {loading ?
                <Loader className="loading-spinner"
                    type="Grid"
                    color="#00BFFF"
                    height={100}
                    width={100}
                /> : null}
            <form onSubmit={handleUpload}>
                <InputGroup>
                    <input className="form-control" type="file" onChange={handleChange} accept="image/png, image/gif, image/jpeg" />
                    <Button disabled={!file} type="submit">Upload Image</Button>
                </InputGroup>
            </form><br />
            <img src={url ? url : imageURL ? imageURL.url :editImage === "Pet Image"?"https://www.google.com/url?sa=i&url=https%3A%2F%2Fvideowithmyvet.com%2Fmanage-pets%2F&psig=AOvVaw0hmjuTxzQOmDpT7icTtmyu&ust=1638397561762000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCIjGycmQwfQCFQAAAAAdAAAAABAE" : "https://d20iq7dmd9ruqy.cloudfront.net/images/locations%20staff/default-profile-with-dog.png"} alt="" id="profile-image" />
        </div>
    );
}

export default EditImage
