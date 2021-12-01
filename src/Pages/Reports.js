//import React from 'react'
import React, { useState,useEffect } from 'react';
import Navbars from "../Components/Navbars";
import {  Table } from "antd";
import "antd/dist/antd.css";
import { db } from '../firebase';
import WeeklyReport from '../Components/WeeklyReport';


export default function Reports() {
  const [meds,setMeds] = useState(null)
const columns = [
  {
    title: 'Pet Owner',
    dataIndex: 'name',
    key: 'name',
    render: text => <h6>{text}</h6>,
  },
  {
    title: 'Pet Name',
    dataIndex: 'pet',
    key: 'pet',
    render: text => <h6>{text}</h6>,
  },
  {
    title: 'Reason of Visit',
    dataIndex: 'reason',
    key: 'reason',
    filters: [
      {
        text: 'Checkup',
        value: 'checkup',
      },
      {
        text: 'Grooming',
        value: 'grooming',
      },
      {
        text: 'Injury',
        value: 'injury',
      },
      {
        text: 'Infection',
        value: 'infection',
      },
      {
        text: 'Fever',
        value: 'fever',
      },
      {
        text: 'Vaccination',
        value: 'vaccination',
      },
      {
        text: 'Surgery',
        value: 'surgery',
      }
    ],
    onFilter: (value, record) => record.reason.indexOf(value) === 0,
  },
  {
    title: 'Prescription',
    dataIndex: 'presc',
    key: 'presc',
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
  },
];

const expandable = { expandedRowRender: record => <p key={record.code}>{record.notes}</p> };

  useEffect(()=>{
    const subscribe =
    db
    .collection('Prescriptions')
    .limit(100)
    .onSnapshot(querySnapshot =>{
      const data = querySnapshot.docs.map(doc =>({
          ...doc.data(),
          id:doc.id,
      }));
      var Prescs = []
      data.forEach(pres=>{
        Prescs.push({
          code: pres.code,
          name : pres.name,
          pet : pres.pet,
          presc : pres.presc,
          notes : pres.notes,
          reason : pres.reason,
          duration : pres.duration+" "+pres.durationType,
        })
      })
      setMeds(Prescs)
    })
    return subscribe
  },[])
  return (
    <>
        <Navbars title="Reports"></Navbars>
        <h4 className="prescription-header">Prescriptions</h4>
        <Table {...expandable} columns={columns} dataSource={meds} />
        <h4 className="weekly-header"> Appointments Summary</h4>
        <WeeklyReport></WeeklyReport>
    </>
  )
}