import React, { useState, useEffect } from 'react'
import { Navbar,Nav,ListGroup,Image } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthContext'
import { GiHamburgerMenu,GiMedicinePills } from 'react-icons/gi';
import { FiLogOut } from 'react-icons/fi';
import { FaChartBar,FaRegCalendarAlt,FaUsers,FaUser,FaEnvelope,FaHome,FaBoxes } from 'react-icons/fa';
import { IoMdPaw } from 'react-icons/io';
import { SiMicrosoftpowerpoint } from 'react-icons/si';
import {db} from "../firebase"



import Sidebar from "react-sidebar";

export default function Navbars({title=""}) {
    const [toggleSidenav,setToggleSidenav] = useState(false)
    const { logout,currentUser } = useAuth()
    const history = useHistory()
    const [userInfo,setUserInfo] = useState(null)
    const [vetInfo,setVetInfo] = useState(null)
    useEffect(()=>{
        var element = document.getElementById(title)
        element.className += element.classList.contains("active") ? "" : " active"
        if(!toggleSidenav){
            document.getElementsByTagName("body")[0].style = "overflow:auto"
            document.querySelectorAll('[role="navigation"]').forEach(function (el){
                setTimeout(function(){
                    el.style.zIndex = -1
                },500)
            });
        }
    })
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

        db.collection("Vet_Info").where("userID", "==", currentUser.uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setVetInfo(doc.data());
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    },[currentUser])

    function sidebarOpen(){
        setToggleSidenav(true)
        document.getElementsByTagName("body")[0].style = "overflow:hidden"
        document.querySelectorAll('[role="navigation"]').forEach(function (el){
            el.style.zIndex = 2
        });
    }
    
    async function handleLogout() {

        try{
            await logout()
            history.push("/login")
        }catch{
            alert("Failed to Logout")
        }
    }
    function handleSidedbarClick(linkTo){
        history.push(linkTo)
    }
    return (
        <>
            <Sidebar style={{zIndex:"2"}}
                children=""
                sidebar=
                {
                    <>
                    <h1 style={{padding:"10px"}}><IoMdPaw/> E-Paws Veterinary</h1>
                    <div className="navbar-profile-container"> 
                        <div className="navbar-profile-img-container" >
                            <Image
                                className="navbar-profile-img"
                                src="https://image.flaticon.com/icons/png/512/149/149071.png" 
                                roundedCircle
                                width="200"
                            />
                        </div>
                        <div className="navbar-profile-name" >
                            {userInfo ? userInfo.Name: vetInfo ? vetInfo.Name : "User"}
                        </div>
                    </div>
                    <ListGroup>
                        <ListGroup.Item action id="Home" onClick={()=>{handleSidedbarClick("/")}}>
                            <FaHome/> Home  
                        </ListGroup.Item>
                        <ListGroup.Item action id="Dashboard" onClick={()=>{handleSidedbarClick("/dashboard")}}>
                            <FaChartBar/> Dashboard
                        </ListGroup.Item>
                        <ListGroup.Item action id="Clients" onClick={()=>{handleSidedbarClick("/clients")}}>
                            <FaUsers/> Clients
                        </ListGroup.Item>
                        <ListGroup.Item action id="Medicines" onClick={()=>{handleSidedbarClick("/medicines")}}>
                            <GiMedicinePills/> Medicines
                        </ListGroup.Item>
                        <ListGroup.Item action id="Inventory" onClick={()=>{handleSidedbarClick("/inventory")}}>
                            <FaBoxes/> Inventory
                        </ListGroup.Item>
                        <ListGroup.Item action id="Reports" onClick={()=>{handleSidedbarClick("/reports")}}>
                            <SiMicrosoftpowerpoint/> Reports
                        </ListGroup.Item>
                        <ListGroup.Item action id="Appointments" onClick={()=>{handleSidedbarClick("/appointments")}}>
                            <FaRegCalendarAlt/> Appointments
                        </ListGroup.Item>
                        <ListGroup.Item action id="Profile" onClick={()=>{handleSidedbarClick("/profile")}}>
                            <FaUser/> Profile
                        </ListGroup.Item>
                        <ListGroup.Item action id="Message" onClick={()=>{handleSidedbarClick("/message")}}>
                            <FaEnvelope/> Message
                        </ListGroup.Item>
                    </ListGroup>
                    </>
                }
                open={toggleSidenav}
                onSetOpen={()=>{setToggleSidenav(false)}}
                styles={{ sidebar: { backgroundImage: "url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUVFBcVFRQYGBcZGh0dHBoaHBkaIB0aGh0aICIeHR0dICwkGh0pIBoeJDYkKS0vMzMzHCI4PjgwPSwyMy8BCwsLDw4PHRISHjIpIik0OjIyMjIyMjIyMjIyMjI6MjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIAQYAwQMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAADBAACAQUGBwj/xABEEAABAgQDBQYEAwYFAwQDAAABAhEAAyExBBJBBVFhcYEGEyKRobEywdHwQlLhFCNigpLxByQzcsJDorJTg7PSRGNz/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAJBEAAgICAwACAgMBAAAAAAAAAAECESExAxJBIlEyYUKh8AT/2gAMAwEAAhEDEQA/AOKSkFzVwNTuP0PpFVhJtXw793DzgKkggkBqMRwofKnrFp5qQ32Ke0c500HShne1DTgW+sYAADk0OWmtgDF5QBGY1Adh8v1ga5VmIZ07hoz8nh2Isiw/2g/OnCsWnOo5eND/ABf2jY7S2FiMLMTKmpBWtKVJCCVOCSLtdxVtw3wzt/Yq8HOTKWtK1kBQKczMaAFxd0HfQxWUTgQkSnqVXDtWxelt+sMJITzDn0f6R1aOzMuYkHCTiqahLLkzRkWCEkFgwsdD5xzs2XlOVaWKXCgqhBGUVGkDdAsmgx8o94SLaMXtBkoJ0oACx3pBfrf0i+0VHOGAFEuBoco+sYw6S7HV66MBrA5FJYLofwCjilvykmvBoqJILAOKAOGqwuPavO0Opk+FASxBLEXqW9gR5mKiQaitCzDTgd71S/HjEjE0YYGo1Dbqtu0vBZErKDQEMpn4NDK5WZ6MwYtvIc9KDyjK5JSTl89Gv8miHIpIUkJJKeHp9vBJqQlKiDUtVuNHEWw5fMAlg/sQPO0CSKuxqoMf5h9D5w1ITQGcP3gavhArxTzsXiSlKygGrn4eJDX+UEnl8xcDwln0BYDrpzjJQHFLJNDckVHIufeHYUaxAZRcDp8uOnlyjabLWkLZ/AaB6XIILb9OvWNWuYXUxI0DaWb74Q3KSUHxKJBAO88flFNqiaZNrEihVYkkNqHH09IL2XWP2/CtfvpXqtL6QLagKgFFmN94dtBxi/ZdJGNwhNzPk79VjdWDbQqpH0pAUTXWpLWA9YNCcpX71fAJ0PHV2jYwHIkSJAB8uZWYGxvyqPvlB1yhehenMkAtwgMgFyFNQkcDT2rBpgNAd5tdqEezRys6kSYPCdwY+RZjuAe8er9nOyeExeEw02ZhlIIT4k5mE0OfEvUpJ8Qtuqlo4nsVtNeHxSMiEKM1aZRCwSyVzEg5SDSpG8Uj3RKQAwDAUAFGA0Ea8aTMuR0ZSkCg0p0hfEYCVMWha5aFLQXQpSQVJI3G4jl+1na84VYky0JUtgVFbsAdGBBNNX1F6tuOy+3BjJOfLkUk5VJuAWBcHcQfeL7K6IppWc7trs/iTiZ2JStIASlaF5spBRm8IGhAYOaF+YjW7XlpxmHGKAAmo8E4AUUFAZVt5V56Jju9v7PE+QpBVksrObJyly9RRnHWOX2LggmZiJSVd5KXJWkzUjwFQCCGIJGZph1NoiUfPsqL9POMRhQqYA752FnZk38oYxOGaiUtkA3eI/CxDOaZo2if3YoR4k1cUBS9uH4utWgU2R+8SSsM9XLMyTY78xIjJSzk2f6AykfCzAMN4NmdjpYnkYwtABTwZm0ejnl4TGx2XhVLq4ACnU+lczUuGjOIwaSoZVKzFgl0qSFX/EaEsGEJtlKjWmWHdJZg13qCPVn9IpPS4TWgT6n2NfSGlGpo1QKaV/S8UmlwSaOpNKg6DyG7hGcpFJGuMrK5bW3+779IwmVZTfCSRxIch+HvDKU5iQ1Tm6eEW84DlBBTWwbm30pwcwKQNCqZZKaEmiWbUOPp6wxPQ7LTqlwNwIdz51imIWQoJANgAQbO2oteHsRLPdggUYAHeVZXSQK6mLvBNOzmESyatc7+OvpG0xKAcmVqPTRmHpApye7B8IoA1NTfyY0+zscAhkoGRIUaJLKopi4JZwaV/wB1wSIfgMRxiWlpSQkZvEB7FhRwKtvbfXHZpH+dwr1afKr/ADhr9YLtOUQyczqahe1WZhYMk2GsX7Mq/wA5hr/6sov/AO4gVu1fcxSeUR4z6GhOST3q92VFa8YchWWB3i97JJ9Wq/A6R0nMNRIkSAD5ilhySQ1AerB/n5wZZqwIazDQv+t4WTMbKL6/9x9wXgmJRdrkv7fQeccfp1nR9ku0kzBlYlykTO8KaEEqcEhkNcnN6CPcklwCHD1rQ13jfHz9snHfs6pc6Wod4hRyvXViCNAQWPMNrHo/YrtLOWnFTMXMR3UrxZ6AppUBKbo8NNXLB9NuOXjMuSN5Rsu1HY5OLWJqZndrYBTpzBQDs4cMQ/tujadntipwkrIlRUSoqUo0cmlBoABQQ1gtpyZqDMlzUKQCxUDRJYFlP8JYih3iB4/a8qVKM1SsyHCRk8TqJZqUFd5pGlRWTO3ottcJVLVLMxKDMGVJU1SdGcPSOI2VtBeEVMQMq0nwg6Zk5UhXFLE8/DE7SbckYhKChSs+VWZBBZIDVfeSRUXAqzRqAssCoWYlrf8ASv1HpHPOfytGsIYpmsxO0FGYVKDssqZgxfLUbmvFcQ9PDmISpTmhdia7zUHnAJqh3pDGoS+gbKk08veDy1UL+IpQQHvUX6U5ViTZLRstkzHQRUlMzN/LUdWINIdVJV41FSlAhRq4Dv4AkEBjyjRSwQHcgF2ILUa7PSpPmYfmziUspSlMoAGtGd9a1H20RKVD6gsTPAUo0ZwLX8I9C0LBCQwdyMr6hy7noPaMBZNjS7swHwl/pBQDXMpg4ubvf3ES2PQPEBw1AE6twJYam1eUCyMlWYAAelSbfd4L3a0PmSc5TR/hFa9b+cUUMrVzrIc/Xi5YdYaBgZawFBRSXOnDKputocG0EJooDK1DdlaU/M703ReRIdRC6sS54lO6KTpYCgwGYrpvuBbWuu7pAhOmxNEtgZi0jxKdCasCX4XtaznVoTSshUtqKU+boKPxjd4+Uku1wsnRnrp5N1jSyjmnqcWduTG/B7mKTwBbaqAhWZJ8JAZhSjV5frGOzdMXhQKf5iUD/W7U+6QbaU3OyWUAHB4U9fh9Yt2fmf5rDOynxEsvQgErRbzPnGiu0ZvTPeu8GbK9WduELyX71e7Knfx0iv8A1/8A29w/Nv6Wi8k/vFjgk+b/AEjqOUbiRIkAHzDKSMyXBoAdLfftB0ggsWfhpQfWBJoQzOw5AP7t7xlSvMfNvpHGzrQaWhwGa9uN/lB8MlJmeJRCD8RFfCbsNd4B1EYwgokWIUT6gGPTf8P8PJmyilWGQ8mZmTMNSVqJOtXAA1agpSCK7Ogk+qs2WzOzcySe6lTU/spXLmstJVMKk5CUkuAEnu01ajkNSNriNjBayozV5DMTMVKZBSpSQlqlOYB0BTA3eNvCeH2nJWrIiahSq0CgSWu29uEdVJHNbZxmP7JTFYqYoCWiUslQUGASnIlOUpDMSQ72qTpFdj7FROwy5gUvvUlaCElJCyigIBGoaO9my0rSUqAKVAgg2INCI4faEiXhFo7qYtUyWsqUFfCEqBLWAqOpEYzgovsXGbeDgJsv94Ry0sWDPq+jbjDWGAIbieLulSab9T04xvO2WFTLxJWlLIWlMwEfxuk+RAV1jQYZs7PoegsfviYylh0dKdxsZKRkSG6P/uis6Ycrl72tSm7fGVS/3Zs7lIZ3ob+oiKTQPWg9rA8YybKRWUokHyOjvTdWkExC3mNR2cDRIILPxb38sBB7wudwAG7+wMDWg5gQHcBNTvTp6wRecCZTE5kpCCXJKkk1JUWI8nMBmkpUybgDlShNNX8iIPPQoKPiJD1a6lKAJy7gOMZmkJUQzUzHXKD+Y6nhxikxFkTQC5fMoA7qlrelIFOnkTZRFFJd+Bq43P8AWBCWyt9TXiA3CM7TbLLKQoTC7WqgvcaFyW3wX4NLJjF4oKJSDUlyfT5PCMtf7x29rACpJer+8N4rCnIFBkqPxDea2bX0gchGUhKfiNDSg68BeBIpkxMvKyyp1O6hcAOSAG53idngBjMNUMZ8vUUaYGFuv9oYxMpPhKS4LkktZIUz8Kewhfs2gpxkgG4xEoln1WwqObdBGkXlGT0z3BeJSJ3wqdwh6NUZucVw+JSZyhlU6nS5IbwOKDTWHThUFWfKnN+Zg/nGE4VAVnCEhVasHresa1y3tVf9HFkYjMYjMbjPmeSK6b25A08/eJPlBhv+/oYyAQSTS3Rwx/XlDE+Xytmal6B+FI4bOwxh5jqTqHoN7mvyEe09jtqy8RLmFEmXKKVspKGYlqEskVjxnDyKMnz6hvePRuyvaWaVycOJCcnwnIGVQfGqwDG++pvSL45JSJ5Yto7TbmHXMw81CPjUhQFWckWfR7dY832Rgpy50tKUTErlzASShSQkZnLkilPOPV4kbz41JpmEZ9VRI4/tdOw/7wHN3wSkO5As9Q7HwvprHSbT2giRLVMmFkj1JsBxJjjZ+KwuKnSluUImArmd5Y5Q2XgSzXbdWFyPFehBemu7aE/5dB+JOHQVDjX6K9I5+UKkgUdvNvSghvtBtQz58xehOVIrRADB9zivN4TwiauKszudXDnraOeeZHVFVEbSzUDCzcwh26JpzgSkEJAYXtutx4+sRbsSwDv/ANqfPX3ihBZ81L+bG38rdIxZRRGJaZe+QON5OnQQxiUJKgRUFgw4CnIloXEkZmUSA+gszVHRoaxMuqWyhyLuzME+r+cCwDMgZAlTsqlSxZIBDi1W94RnITnKQfDYk/jO4C0MEgBaVuwapu6gCAIGuhKy2cMQkWQwNeHXjDTFoqmQFLBLt4Wr+a4ahqfcwKeVKNw6lFrULVbcbDk3FtklJUxI1cNqcotpQturCWJSlOQMxSFA60P/ADBFTyhscHkWSlyHuNflB1rCXBtRxd00LU3lorh0MXIpz0L34Uvyg0+UHcFi24VPGEtlSYCelyxDVAI0+JNHpuJgmxkA4yQQw/fSjvp3ibV3iAbQRnNDV3o1GSoaa+L0i2yPDi8KlX/rSww0PeC70Z2jZbRj4z3uJEiR2HISJEiQAfNaqqKQDVxyd2Dili3SLLX4WFaVV5AxklTBIZizmg3Fn+7RRJYMRcedvpHCdqNls5NEgcj1Yj1EdBhJE+RPSXVKWosHDeFRuQdC4LHcdYY7N9lUz5CJkqekqKimalQIyB6AAVKgN9DcER6d+zpdJUApSQwUQCaavpvi4cTeTOfKlg4zZs9WCxC8Ota1rmgGXRRQZkxSi6nJILsCrm8Mq7RTpSp8jErld6EJMlUtCzmUpJoUl65iin8WsdiDCczZclUwTTLT3iS4WzF2arfEws7sw3RuoNKkzDsm7aPMpu38TNQvDrImd9lBzJKikslwgD4S+jUIoxgS0BCVS/hCaBJNRmprYu/kY22N2BjU4ufinljuyZiFqIyqZNAxswDF2AYF9YbmCXtOUrIBLxctLsCwU9n3jR7pPA1wcJPe/DbsvNHD4xXjNDuO9wOEP4OWnKGo968C45V6e4MRJWVLGU5goO34TVxXW9OcGkyikJu2vL7HrGcvyNb+ITFkKAawJrxqfkIzLQFMaBiNOf36QGcPwDUNv+IsRTjB5Jyp+EEk0FKa3Ft3URDQ1oFiEJSkurxaasxHpbk/GL4yXUDQZjyqK8dPOF8XLdJo7vqzZn+nvBsRVq7nfW4HW/pCF6UnIJcO7sWLUIFx5348IDicIyT4n+F9XcG/X3htSqnKa25B6dX0i8yWGNvGDwD6D0vxgWAsFIlrdLKbeKuOlv7Rr58tYUSV5i9zQ1+o1jZz1MkNpdz+a46OYSUgljUGlOh9oY4l5aFUAs1dd9DvcaQebRQSSPa9jTjGxSoy2CVZUpypcAFS1lqVtGdpYYLAmAuoBwpgCQCxChTxCLURSkaPFSwCpVqpD8yaluED2NLyYvCEu6pso3o6piSR0cesXnSyQokk1DBrUPnd/IwfZqP8zhwDUTZbFnbxotvanlFdsohqkz2CRi3JSb5iGGg4ua61G6HYT2dIyoD3LkvU1JLE6kO3SHI6ePtWTlJEiRmNAPm1KwQnkH4FmI84b2AvCielWLQsyiFOEEvnIucpCikOTSrtQwglAK7FsvWjVjoOyM/BoXlxMhcxSloyKQWSm4JUM6XqxsbGOOKydb0ev7D2RKwsru5QIS5USqqiTvLaBhyAjYmLGNJ2vKv2SZlLWzEfkcP00PAmOt/FHKsswO1OD7zu/wBoTmtZWX+tsuu+N3HzoZihMLk3fz4R7X2FWs4CQVu7KCX/ACBagjplZuDRnCbk6ZpOCisDvaHZYxMhUoqyuxB0cHUaghw3GPOFSU4LEy1yp6ZuRlKUnVypK0FiRYb7kbo9bEeTbd2fh5KB3M5MxKgv4cvgykFnSdX9InmxTDjfhsu2uHEuf3iR4ZyQt/4ksktudOU840EiaVpAN7OBUhgL6UJjpO17iRgkqbMJXi55JY93jmsOrIAp6Xbnv4sIxmvkzWL+KMzEJlspwouBxBdJB/WlDCkhanB0OV/5iA0NY8ZmU7+Jh1KSabnMBwydf9rcGynzjORa0ZxR8JIrmccj+heDYskKCQQK1fgKevrAUHW7EuP6vm0XxqAKJudebFuZqOrQgL52CuTuTQctYwrFFqXDbv4nB3BzXhGMyjk0q9tKU50+2itO7ZgC5FK1LNXWgilETZJZUzmz0cpa1BzcDygs0HKKVdw51N6fdxAZbFmygP8AFqbew+UHnJCcrCoy31pmJ8y0CWQsd78LIUVFNKsAQSk3Y2L6xbFzHBSl8uWhJr4iVF9XcD1hNKnUHAAbnq59QPMwRaApQYchZrcdK+UXX7JEJiQ1PidgKVvXpTzi2xR/mZBDN30vdrMHGrxcygUhmBNNzFyB8/IRjY818Th6ADvpdN3jDVFzeFHaKlpntcZiRI7jjJEiRIAPnDunUVP4bbmDbo3OwMdIkzCufIM5OV0AM2Z6EgkAhnFQdGjTILoUx1avU/MCHMTLA8KSAEg9alm4fOOTR1POD23YO1k4qQiegMFiqXfKoUKXYOx1aH1oBBBAIIYg1BB0IjzzYHaudMmyZMuTLCAkJKEUG4qB/AAxLVo7vSO+l4uWpakJWkrT8SQQ45i+sdMZJo55RpnPHsFgDMzmUTV8mdeR+T1HB24R0yEgAAAACgAoABoBpF4BPxCUpWfiKElRSlipgCaB7lqQ0ktCbb2D2jjESkFcxWVNnDkudwANdekcDsrZmFXi1YcK72UZbpJoc1FUIuwS2mtILtztFLxMiYhcpQWCe6KS4Y6k0agqOIbfHN4FRExShQgULsQCSC/mej745pzTkvo2hBpM3nb6ehU4KTMSsJSEZE1yHM5fQk7uAfjzwJqOJ97ty+cAxCw5HHmaH9L84YkitLhy/JwfWM27bZolSoDjJJCTUs5LcXZ/R4NIHxEHlzBP6RMSk5QH8RHnlJJiuHAYjUl+jmIaKMOpiDQkX535QadNIIrmZurO3U0vuiuISaAGzGvCMTEtwrVt1WPBrxPoDK1pGUpoQT1sWhfEoIUWsSFbqFvL4fWCYVabBLnU8DT/AI9HgZBUqupFN4GY0379NI1SIC4VYAIDEsXtS394rMXmUHoxJ4Cqh8jGX8QOlB1YB+VYriUu4HH/AJ/OE/QRdKiC2ptuo59x6RdcwpLtYWpz9qQOXOKlpA/CkEvo5BaJiHdzRxVhx0PEKgV2Ngp5zPQhmZtwdyeN4JstX+ZkIb/8iSQauAF2pwaBIXQ2q9eBa3m3UQfZwBxeGI0nS/LOn9PSHF1JDawz2qJEiR3HGSJEiQAfPEhPxMKMab/E3WhMHns7EjxPpoDQNoKn1gOFoADUh2N3e7fWJMQbk+EJLUu1X3XjkR10TCLKE5wtSVgpKSkkEGhoQXFHL8I7Ds/JnSwjH933wUpSClJUV5lHKVKASSPFmGpqCY13YfZ+HnrXInJWpS0Hu1INJYSA54KqKlxprX1HYmyEYWUJct2dyVFypRABUd1hQbo0hC8mc5Vg1eFwk5GTEIlzFzF5+8lLmlIAWXBCVHKlikWDsqNPtTZs3CSkzMOlaZq0L71SfGEuxqwNQS2b+GO+iRo4poyUmeQbY2bNw4SqZlHegEB3KQSHChcK8Tah9Y1+BKnVu8Nf5nVzLfdY9T232dlYlaVLKgUsFZfxJDkD+GpuK35jzXGiX3swySRKJZIVcDx1L1Ad2erNrHNPj6m0Z9kJpDlRI+I0A0Fb+cM4RL0O4EM1yaDzJLQitficNetNQ4aGMNTU1px6cX+cSy6NhiJTlBo7kf1OPmIHIQKqZjWvlb1gcxXwg1083Hs3nDGHq2nDz+ZhNYGUxp8KW/MdK1s0Vx0l1O9nJ0B+7cozNQ5TpYk8k6PvJEFWvNanXQwqRIulQSKUAcPaimYmMIYkH+Gm9yUh/vdDUxIYgMznd+a1OEKzFFN7li3B3PtFWAYh0gb2/wDKBqknvCbVUPUt8z1gwSCKaJbqVJMUxSnCmFfF5qA9bwlkC8uWAU7vCKi4SKv5CAzpRJZRLMeDNT5iDILoCr0WefjQ3pC2JxBe5oln4ly/Ogilqg9ASwAHq3VmY20IcCv0g+xk5Z+H3d9LD0v3id/DLGZkg92mjFiWIY6cLWgeyVH9pw4f/ry24gLAoBvDQR/JFP8AFnt8SJEjtOMkSJEgA+epcwVZwE1GuqzG521sFeH7tcxaT3kvMEBwpLBOZJ4eJnBjV4RlTJYailpQrkreNzvXnHXdu9oqlbRlLyhQlSgoJLsolSix5/KOVJVZ0tu6R1fY3FS8RJ/aUYeXKWolBKG8QQRqACz6HdrHRxouyO1xi8MJuRKPEpOVNQGOlBoRG7eOmOjnls5bbHbCXJUpCEGYpKsqjmyJfUA5S7PWmsbXYW25eKSSiik/Ek1biDqI8w27gZkmfMRMB+NakE2Uk/Cx4+hjpf8ADrCrK1z8oEsywlKgPjcpsQasE1LXU2kZRlJzo0lGKjZ6BHnnbeZIkqMpGGAmTGWZtH8RW7a/mLUFRHoccP2323LQtWHOHRMWqSfGSApGZwGGQmnxXF4vk0RDZ5nhiSpQSb5jy0J62h7CYjxNM+yf7QrgSM6g3iNAeTgw1NSFKqG06AaceF+cczVs6bG5aVTFeEDwh3sE/FfdaNhIwzkhK0EuWAJfWz3vAMAn92fCarGfV0s3lWGe/UoKLghKVkZQGSUnwkEalrQqBsUxcxROXcxfyp5+0GWioa4Z25CBbSW0xRH5gTX+Ev5Enygk4kOEjUHezga9DE0CMzqEBvxEm/8AFSnBoVWkqL15ncf194OUZUufwg2H5SR7e0WnBgDoHf0p5keXCGv0JsGXOjUtvYp+kGoVEaH2cj2ikpq13n1jClmhJ/KH40H1gp5D6MYY5QkEWB8iW9gIIiSlsxQKocg1rUjgaHWLpQCApX+1nY1BU53UPsYFNmOVV8IYHi7W6Jhp4B7LYybmWAxNCGDN8KR0s/SNfs0H9swwZj30uhtRY40pGZayFBjvbnXXkYzs0vi8NZu+lm++Ymn3vgT+aKa+LPcIkSJHacZIkSJAB8/YVLJStwFBYqeS6+kdd/iBJ7xOHxqPhXLCFa5SDnS70oSsdI5FVBlZwxb+k+tTHT9ktryiiZg8SQZMwkgmyFKUSQT+EEsoHQnjTnjnB0yw7On7Kdop2JXlXKSlGWmQFkEfmJOtmAo0dcBHnKNg47CidLkrJlFObMlnWE3SBdCyDpcChtG02V2oRJwkleIm96tailkMpSUj87kPlDOTXxC940jKsMxlFPKOvmSkqDKSFDcQD7xcCNedtyBLlzFTUoRMAKCvw5gQ9Aa2gW1e0EnDpQVlRzglASHzAZaglh+Ia6xdommbRRYE1puqekeS9pu1SsQgoXIQlSVkoWxzoCc3hLg5VWcg6GkdB2s25NlzUKkzkmWJYWAgg1J/GPxJUmtdAWrWOFxi1zpi1zCDMWfERQVDFhuag4ARnOfhpxx9Ylh1lC3AHR2bjwpDkhYdnA8IpXQl78LRSYGVQM78mt8/PlGcMsKBDMxbz56fSMkayGE4qYhQKSx0pya/Tyg69oTFDxWzeFgAK1BpzhFKCpQJHHkQQ9IYkofw2FOgHh8/DEMYylbpVqTQ8kt75z5QXFKYPmyuAfelekKgmptUebt5t84OoAgC7BLWqC+u/wAPtA8IS2FS6ksXZ1f8/wBYDiQWNKAlvIAep9INnVQjm29yr6wKcCxJ1+WYecKIMiVBif4eWij7iLgApcVyij7/AAsPUQBCAU3JLU5gfKMranGhHAt+kUhFhMdKQbnMTqxoKV/h03QKYunh1cNer6npEWTlTT5XJr6RdUu6v4T5gfoPOFdj0xFcwEjcHrw8O7S9t0NbFWf2rDBi4mofg8xO612bgYRUCkly+m5tPOGNilX7Vh6Ejv5L2p4x52FP7Q0vkhv8T3aJEiR2HISJEiQAfPS1/CdC7eWvR/SFZIJqXu3UmpGh84aRM/dkEPlfp9uR0gK0MEsdQaVLMfR6dI5kjqs67Y/bNeFkiUEd4QSypi1FhQZUpaiRz1jmcRixMWtYShGYqOVILAqcsmpLV+VIAoAitL030bzaDbOQsLCpUtU1UshQCZZXlY6pANCRUnc0PLWQpLJ03ZhCsZNl4fFd4uVKQoSwkBAQUhIAWUpBYAMHNwBVzHfbI2RNlpyzZwmBMsy0AICcqKC7uSyRGwwCDkStaEImrSkzMo/E1nuQHIDxfGY2XKAVMmJQCWGYs53DeeUbKNHPKVnPyuySJaJwS01S0EIExKWSWVV95JHlzjlU7LxOECcXkQky15WmEOXdJLapajgvcilY9Nw2IRMSFoUlaTYpIIjV9pdjJxKEhS+7yEqzGqQGILhwLVd6NEyivBxl9nB7cwUqdJ/bMKnKArLOlhvAouQQPylSgf5npVuckqYDe715GgO+nvHUdmMicZMwqViZImpVLcWWMpUFNagSpL/xco0C5GVakGpSVpPNxGb+zVfQNBIKgWBAI3Vp8xB0Sny6Cr/1Et6xSWgF6mt34hX1h1Y0ApYH7vz4xmywcxNwA4D05kt/flGVSyEBqv7AqiJIzpfflPvEQSUhOtPV/pAIMFWc0YMeIB32iTUhxXf5uoX5j0ikpFAoB2uH0pv5+8ZmrqS1spbmS/RyPOEkDFsOoMeRPvf+oW3RicoEpAcOL8iA3q8TDJDcx7q/QQJYGdJGj6cw/KkVQBEziqWXoQch5pSoOOHiEZmLISSCRboGGnnGJ3h0q5r/ALuG/wAMLrmeAuxqBq3pB4Hotipvi8Nf1/v7wbs/MUrE4Zvh7+U/9aN44whOmKeoD0tah+/SHezYKcVhtxnSrP8AnA+XqYf8hvR79AVk5kjQu/GkGheb8aP5vaOo5BiJEiQAfPOEAKWL3U53kDjzPnwgU8gskO1PO+5xeLYRdAC9weXgUIk5BSRldzqdNPM0jnN7yWnySEuxJo7aP/b+0P8AZ3aU6RNCsO7rASUhAmFaQSWZiaOfhhMTVFKqAZquLs9qaXENbEx83DTDMlMFhKklw9Cz01qkHpBF0N5Pdo4H/ELBzVTELSgrl5GcfhUFEl/yuGrrlG6Oi7J46dNwsteIAExb5TQZ03SrKLONNwfWN5GzXZGKfVnIf4f4WahE1a0qRLWpGQKDE5UkKU2gPhH8p0aOmx6UmVMC1BKShQKjYAghy+54Zjndv7SwykTZC52Q5XJSHYpL5eJoPDS7QJUqDbOc2BsPu8agylpmS5Z8c1DAD92pkkBR4B+cc7iCJk6YoHwqmLUP5lKNN7w1sbbczCpnd2EkrapqE5HsLEnN/doSmTCVKWz5jWwuQdKBybtGLqsGqTvJaWh6EBrFi5DhXyEGQPh/l8v7GAJSxp0I4MB1eG0EqFKtU8AHA9z5GM6KbBLZzSgIc7nb0/WK5ACdzA8/iHygy0gA5izinN9f6YtMTQjcEgeaobQIpJIAKav9QIDPcOmjkBm3AuPvhBCGJD1O6poPrGcYirjz4faoY/QUuWyUdC27xP8AIwpPlsSUliAOgo8OmhHNXk6gPeFcWg+IPVQPRyD5wACUsrClAMcwAr+X9SYSmoUlgkNv5gNXh+sNqmCvAjo+nnC+KQSw0zB7G5P35RZKeRXEOKmxO/Rk6bob7MLBxWGANRPRW/40W6PGrxJUAkCzGtH3xsOzC/8AN4d2/wBaV/8AIBrzhJZRTeD6Eheb8aP5vaDKUwJ3QjhcSJglzAFJcKYKDFuMdBymwiRIkAHzhLQyK3a41oaRabOAq978xp97oWX8JIaoKtaaP6DzjC9QTrcvqKexjno3Npg051ID6gdSoGu+8b6Rs/wzVS5Y7uU+aYpJWXBYvuA4cTYRzmwkFc+UhS0ywpY8a2YB3c1rbeHLB49i7ObBVhzMKpgUmYaJApWpUXFyXpzu9KjGyZOjlsDshc7DGYkrCpKv3aJblJCsqs8smzgksNReOqxW1JqUGf8A6cpBQlUubLVnU6khSgQqlFMKF2JjfgeUYmSwoFKgCDcEOD0MaKNEOVnG7U7ULEzNJWFSk5C2Vsz3DkP/AHEcrtPFibMmLyBAWpykVYqSAS+pdL847TtNsxfdyZWHlDu0kjKkB00LXsOJN7xrpWAlrwa0GWk4qWiYoioUMq13KT4mFACTpoYlp3RSaqziJRNNwBHMnX19IMA1RX/7O59BAMNT1HKjD1aClJBAfT76VjJmgXLcbzQb7+VKw7IRRy4Nm6OG/MKEcHEBwyMqXUCdQNQf1HPlWLyZhNXcfRn9vSEJsyhLnN9kDdBFgnzqIuGynmLHj6boquwrWo3W+zBX2CYNBtqwc+wjGIBBGp06EfSDIGUGzvfkf7wGYbDd7Nf1iksD9F1PlOtx1ahEL4tC3o/DV339QekGzMk6sqvp8g0L4ya2VjTw1FAKG3B1Q47BjhCJeYAI8JBWpYKhmUPhSBup5wljZaVpzMBlZQKXyLS+W2h0blBlzpanVmSklSVKSsKbMKBQI4NCeKxqQMqXNCApmBzHMotpUADrDYkjUKBJrYqLDcCP7RsezwH7Zhm/9eU39aflCM9JBS5oXH/aB5gxsOzSXxeG/wD6yz0zoOnW0T6W9HuKMQVTFop4RQB3qE1e1z7UhXY8oply05WYzHBILVO4kH1gksgTJpKnLGmRmASn8Tkmjbn6QDs8hpMoBOUDO4d2LnUiOg5TeRIkSAD5tAcJDUIbooMfvhAl1DP+MNyrf71g8pBUkZTYA+o+ZhQkZQAxGYV1o5qON+sYpGtnRdmtgIxmdCp0uVkAbOxKiol8rqFm4/EI9ylICUhKQwSAANwFAI8A7NYeXOnJRNniQjKT3hb8GUs6iwJqxPJi8e84DGy5yBMlrC0F2UN4LH1EXEiRynbLtLMw81MqWQkZM6lEAmpIAS9AKF+Y3GNn2S2yvEy1d4xWgpdQDAhQLUs9DbhB9v8AZuTiwO8zpUkMFoICmd2OYEEPw374Z2PsiXhUd3KBZ3JUXUo7yfkABBT7WFqqGcclZlrCCyyk5TQeJqX4xw2w5U6VjZaZr5zmC3UFOFIJqXLuWPSOx20iaqRMTJ/1FJZNcpqQCQdCztxa0cR2YUrvVz5qlFMhC1qUpWapSUhLkl6ZvKCW0OOmcriZYRMmpDZUzFJA/wBqimnGnpBEKyl+FnYin1+ULLWVOo0KiVHcSo+lzGVU8WlQeVB9PIxlJZNUPlbnr7aPw+UXlk1+RhKXNpc6E+o6UMElLcHQfRr74VEs2KyyQB+JnDCzj11iwSUh/sOP0iuZgCdCKCw39QxHWKrWWsG+jCAZFkjXX7+cBUptN/sPnBDMcFhU1HrCc+YRTn7D6w/A9KFbvz86E+0KYhQACdwHU/Y9Yoqc1H1r5QKfUchfi/1eGsMrwFmUqjUsebB+tXjBd68Kfe8RnN8TOPGfZP6xVaByYmvImph7AosuoDQAHzb76RsezVMVhx/+2UNPzoZ/vWNZNUAQA5Gr6srTpG07NLfGSLf6sqpufHL+nrA1kXh7MJeadOdLpy5S9XcJpqLaNYjeYFsBDSpNvxnw5Wqf4Q3SCII7+cXoEh6WYC6nDBtP4TakB7PI/cyfh/GWTmAqTbMH+9Y2Oc30SJEgA+bkKIlmw4bg5PlSEFqZuQpwanqRDhV+Eae1hzpC2IlmrCtAOv8Af0jFM2JLUcp31/4vHe9mu2UrB4VEtEpa5hmFU0qUyWZsyToSAAEtRi+88HKS43OBfRz82EMITqzVNKHc/OGnQmrPep+35EtMpU5fdGYgKSldxQEgs4BDt5wLbfaSThShKwtSljMkJD+FwCXNNbXjxv8AaFzAnvFqVkSrLmUVMmoAqaDxQwrHzppBmLKsgZAV+FICaDd+kV2J6o6btftN8QVysQpScqWyEpyXzJBDO9zzY2hfaO1ZYwqcNJQpILKmk1K5g0cXSCAeLAUaNDMSMvN/d/vmYMtVCW+2+/KFHYxcs4oCAbcq+TAQvPXlal/v6wypFVktUeVfS0I46h5v7uPb0hNFphpM3Wznf1L9WhyVNAF3B9OfF41CVlIJBr8vq0MYdbUuN+9np7RNEs3aZjOH316v53iKW7c/mYUM4Vbh5i/SkEC6MeHPh6wNAmFkzDWv3lhdcx0kHc/1HrFhMOm4k8aQsssct733kQIYsTcnUfR4DOScvLjzZvTzhha/ipo3zeBlDpPKvJh8wIaHZTDIKgATfNfRku/r7RVdXqWKvN3++sVlKZKavVXokp++cGy+E2ow/wDJv/GGwTEZgVmSn7vbyeNpsDw4nDKa02UeJAULNyaE1IIUg6hzXgRbga+kbDYoBnSCQ37xN9XWPrEcjaTaG3hnrRx0tWcd1MUFBQUASWCy6mY+FzDuxsVLW6UBQKST4ySTnJJLuXrGqwygUgAgEO4JTd1OfGRcFPiDtla0W2MknEkoIygHMRYuA7cCqo4COHi/6eVyjbtPz/fRyps6qJEiR6tlHzn3DAF7AeqVfSF1pYs+8exiRIyWzQzkGYDiPLwetTDCZYISAG+tokSGUGlJASq5DJ+sHwq8wcircvu0SJDRLCT0eFxRi3mE/OLInXpv9KeUSJAvAIhjRrEh+RA+bxrpqfxUdh60iRIY0a9SilLjf7h4NJJoX+7xIkS9gx5JqCNx6vv8ofBoKbgeh/SJEhkmQWzDdr0f5QNSXUSfv4h9IkSEhieRxpp7RjKwCdCwPk3yjESGgF8OglYqwDnq30hlQuN5HT44xEgY0SYhyK6E/wBOnWkbHYiXxUhJAbvpQubGYn6xiJA1YPR7MdiyPyf9yvrBsLgpct8iWe9SbczEiRK4oRdpIxG4zEiRqM//2Q==')" } }}
            ></Sidebar>

            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand className="sidebar-button" onClick={sidebarOpen}><GiHamburgerMenu/></Navbar.Brand>
                <Navbar.Brand className="navbar-title" onClick={()=>{handleSidedbarClick(title==="Home"? "/" : title.toLowerCase() )}}>{title}</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    <Nav className="me-auto">
                    <Navbar.Brand>E-Paws Veterinary</Navbar.Brand>
                    </Nav>
                    <Nav>
                        <Nav.Link className="navbar-logout" onClick={handleLogout}><FiLogOut/> Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            
        </>
    )
}
