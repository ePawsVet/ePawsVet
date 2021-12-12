import React, { useRef, useState, useEffect } from 'react'
import { FaRegBell } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap'
import $ from 'jquery'
import { db } from "../firebase"
import { useAuth } from '../Contexts/AuthContext'
import moment from 'moment';
import { useHistory } from 'react-router-dom'



const Notifications = () => {
    const [dataSource, setDataSource] = useState([])
    const [showNotificatons, setShowNotificatons] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [modalData, setModalData] = useState([])
    const { currentUser } = useAuth()
    const history = useHistory();
    const [userInfo, setUserInfo] = useState(null)


    const useOutsideAlerter = (ref) => {
        useEffect(() => {
            /**
             * Alert if clicked on outside of element
             */
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setShowNotificatons(false)
                }
            }

            // Bind the event listener
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                // Unbind the event listener on clean up
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    useEffect(() => {
        db
            .collection("Owner_Info")
            .where("userID", "==", currentUser.uid)
            .get()
            .then((querySnapshot) => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setUserInfo(data[0]);
            })
    }, [currentUser])


    useEffect(() => {
        const unsubscribe =
            db
                .collection("Notifications")
                .where("forUser", "==", userInfo ? userInfo.userType === "Admin" ? "Admin" : currentUser.uid : currentUser.uid)
                .get()
                .then((querySnapshot) => {
                    const data = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setDataSource(data);
                })
        return unsubscribe
    }, [dataSource])

    const notifHandler = () => {
        setShowNotificatons(!showNotificatons)
    }
    const NotificationModal = (data, classNm) => {
        setModalData(data)
        setOpenModal(true)
        if (data.isRead === false) {
            $('.' + classNm).removeClass('notif-info-unread')
            $('.' + classNm).addClass('notif-info-read')

            db.collection('Notifications').doc(data.id)
                .update({
                    "isRead": true
                });
        }
    }
    const goToNotif = () => {
        history.push("/Appointments")
    }
    const NotificationsInfo = (props) => {
        return (
            <Modal
                {...props}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                animation={false}
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {modalData.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalData.message}
                </Modal.Body>
                <Modal.Footer>
                    {userInfo && userInfo.userType === "Admin" ? <Button onClick={goToNotif}>Go</Button> : null}
                    <Button onClick={() => setOpenModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    const markAllasRead = () => {
        if (dataSource.length > 0)
            dataSource.forEach(notif => {
                db.collection('Notifications').doc(notif.id)
                    .update({
                        "isRead": true
                    });
            })

    }
    const getDiff = (notifDate) => {
        var now = moment(new Date()); //todays date
        var end = moment(new Date(notifDate)); // another date

        var seconds = (now.diff(end, 'seconds'))
        var minutes = (now.diff(end, 'minutes'))
        var hours = (now.diff(end, 'hours'))
        var days = (now.diff(end, 'days'))
        var weeks = (now.diff(end, 'weeks'))
        var months = (now.diff(end, 'months'))
        var years = (now.diff(end, 'years'))

        var stamp = (
            years > 0 ? years + (years === 1 ? ' year ago' : ' years ago') :
                months > 0 ? months + (months === 1 ? ' month ago' : ' months ago') :
                    weeks > 0 ? weeks + (weeks === 1 ? ' week ago' : ' weeks ago') :
                        days > 0 ? days + (days === 1 ? ' day ago' : ' days ago') :
                            hours > 0 ? hours + (hours === 1 ? ' hour ago' : ' hours ago') :
                                minutes > 0 ? minutes + (minutes === 1 ? ' minute ago' : ' minutes ago') :
                                    seconds > 0 && seconds > 60 ? seconds + (seconds === 1 ? ' second ago' : ' seconds ago') :
                                        'a few seconds ago'
        )
        return stamp

    }
    return (
        <>
            <div onClick={notifHandler} ref={wrapperRef}>
                <div>
                    <FaRegBell />
                    {dataSource.filter(data => data.isRead === false).length > 0 ? <div className='notif-count'>{dataSource.filter(data => data.isRead === false).length}</div> : null}
                </div>
                <div style={{ display: showNotificatons === true ? 'block' : "none" }} className='notif-data-container'>
                    <div className="notif-header">
                        <h5 className="notif-header-info"><strong>Notifications</strong></h5>
                        <span className="notif-header-info notif-markall" onClick={markAllasRead}>Mark all as Read</span>
                    </div>
                    <div className="notif-body">
                        {dataSource.length > 0 ?
                            dataSource.map((value, index) =>
                                <div onClick={() => NotificationModal(value, 'notif-info-' + index)} key={index} className={'notif-info notif-info-' + index + (value.isRead === false ? ' notif-info-unread' : ' notif-info-read')}>
                                    <h5 className='notif-message notif'><strong>{value.title}</strong></h5>
                                    <div className='notif-message notif'>{value.message}</div>
                                    <span className='notif-text notif'>{getDiff(value.dateCreated)}</span>
                                </div>
                            ) : <div className='notif-empty'>No notifications</div>
                        }
                    </div>
                </div>
            </div>

            <NotificationsInfo
                show={openModal}
                onHide={() => setOpenModal(false)}
            />
        </>
    )
}

export default Notifications
