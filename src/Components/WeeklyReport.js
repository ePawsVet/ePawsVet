//import React from 'react'
import React, { useState,useEffect } from 'react';
import {  Table } from "antd";
import "antd/dist/antd.css";
import { db } from '../firebase';
import moment from 'moment';


export default function WeeklyReport() {
  const [meds,setMeds] = useState(null)
const columns = [
  {
    title: 'Pet Owner',
    dataIndex: 'clientName',
    key: 'clientName',
    render: text => <h6>{text}</h6>,
  },
  {
    title: 'Pet Name',
    dataIndex: 'petName',
    key: 'petName',
    render: text => <h6>{text}</h6>,
  },
  {
    title: 'Reason of Visit',
    dataIndex: 'reason',
    key: 'reason',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
];
const getCurrentWeekDays = () => {
    const weekStart = moment().startOf('week');
  
    const days = [];
    for (let i = 0; i <= 6; i++) {
      days.push(moment(weekStart).add(i, 'days').format('L'));
    }
  
    return days;
  }
  useEffect(()=>{
    const subscribe =
    db
    .collection('Appointments')
    .limit(100)
    .onSnapshot(querySnapshot =>{
      const data = querySnapshot.docs.map(doc =>({
          ...doc.data(),
          id:doc.id,
      }));
      var scheds = []
      var dates = getCurrentWeekDays()
      data.forEach(sched=>{
        if(dates.includes(sched.Date)){
            scheds.push({
            clientID: sched.clientID,
            clientName : sched.clientName,
            petName : sched.petName,
            reason : sched.reason,
            date : sched.Date,
            })
        }
      })
      setMeds(scheds)
    })
    return subscribe
  },[])

  return (
    <>
        <Table columns={columns} dataSource={meds} />
    </>
  )
}