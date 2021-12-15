import React, { useRef, useState, useEffect } from 'react'
import { FaRegBell } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap'
import $ from 'jquery'
import { db } from "../firebase"
import { useAuth } from '../Contexts/AuthContext'
import moment from 'moment';
import { useHistory } from 'react-router-dom'
import CalendarIcons from './CalendarIcons';

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
                    refreshNotif()
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

                    var sortedData = data.sort(function (a, b) {
                        return new Date(a.dateCreated) - new Date(b.dateCreated)
                    });
                    setDataSource(sortedData);
                })
        return unsubscribe
    }, [currentUser, userInfo])

    const notifHandler = () => {
        setShowNotificatons(!showNotificatons)
        refreshNotif()
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
                    <Button onClick={closeNotifModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
    const closeNotifModal = () => {
        setOpenModal(false)
        refreshNotif()
    }
    const refreshNotif = () => {
        if (userInfo) {
            db
                .collection("Notifications")
                .where("forUser", "==", userInfo ? userInfo.userType === "Admin" ? "Admin" : currentUser.uid : currentUser.uid)
                .get()
                .then((querySnapshot) => {
                    const data = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    var sortedData = data.sort(function (a, b) {
                        return new Date(b.dateCreated) - new Date(a.dateCreated)
                    });
                    setDataSource(sortedData);
                })
        }
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
                        <h5 className="notif-header-info">Notifications</h5>
                        <span className="notif-header-info notif-markall" onClick={markAllasRead}>Mark all as Read</span>
                    </div>
                    <div className="notif-body">
                        {dataSource.length > 0 ?
                            dataSource.map((value, index) =>
                                <div onClick={() => NotificationModal(value, 'notif-info-' + index)} key={index} className={'notif-info notif-info-' + index + (value.isRead === false ? ' notif-info-unread' : ' notif-info-read')}>
                                    <CalendarIcons date={value.dateCreated} />
                                    <div className='notif-message notif'><strong>{value.title}</strong></div>
                                    <div className='notif-message notif'>{value.message}</div>
                                    <div className='notif-text'>{getDiff(value.dateCreated)}</div>
                                </div>
                            ) :
                            <div className="notif-empty ant-empty ant-empty-normal">
                                <div className="ant-empty-image">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="4em" width="4em" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M439.39 362.29c-19.32-20.76-55.47-51.99-55.47-154.29 0-77.7-54.48-139.9-127.94-155.16V32c0-17.67-14.32-32-31.98-32s-31.98 14.33-31.98 32v20.84C118.56 68.1 64.08 130.3 64.08 208c0 102.3-36.15 133.53-55.47 154.29-6 6.45-8.66 14.16-8.61 21.71.11 16.4 12.98 32 32.1 32h383.8c19.12 0 32-15.6 32.1-32 .05-7.55-2.61-15.27-8.61-21.71zM67.53 368c21.22-27.97 44.42-74.33 44.53-159.42 0-.2-.06-.38-.06-.58 0-61.86 50.14-112 112-112s112 50.14 112 112c0 .2-.06.38-.06.58.11 85.1 23.31 131.46 44.53 159.42H67.53zM224 512c35.32 0 63.97-28.65 63.97-64H160.03c0 35.35 28.65 64 63.97 64z">
                                        </path>
                                    </svg>
                                </div>
                                <div className="ant-empty-description">
                                    No Notifications
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <NotificationsInfo
                show={openModal}
                onHide={closeNotifModal}
            />
        </>
    )
}

export default Notifications
