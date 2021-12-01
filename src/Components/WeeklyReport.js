//import React from 'react'
import React, { useState, useEffect } from 'react';
import { Table } from "antd";
import "antd/dist/antd.css";
import { db } from '../firebase';
import moment from 'moment';
import $ from 'jquery'
import { Form, Col, Button, InputGroup } from 'react-bootstrap'
import { CSVLink } from "react-csv";
import { FaFileExport } from 'react-icons/fa';


export default function WeeklyReport() {
  const [meds, setMeds] = useState(null)
  const [filteredData, setFilteredData] = useState(null)
  const [csvData, setCsvData] = useState([])
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
  const getCurrentMonthDays = () => {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').date()

    const days = [];
    for (let i = 0; i <= endOfMonth - 1; i++) {
      days.push(moment(startOfMonth).add(i, 'days').format('L'));
    }
    console.log("month", days)
    return days;
  }
  useEffect(() => {
    const subscribe =
      db
        .collection('Appointments')
        .limit(100)
        .onSnapshot(querySnapshot => {
          const data = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMeds(data)
          var scheds = []
          let dates = moment().format('L')
          data.forEach(sched => {
            if (dates === sched.Date) {
              scheds.push({
                clientID: sched.clientID,
                clientName: sched.clientName,
                petName: sched.petName,
                reason: sched.reason,
                date: sched.Date,
              })
            }
          })
          setFilteredData(scheds)
          setCsvData(scheds)
        })
    return subscribe
  }, [])

  const refreshTable = () => {
    var frequency = $(".frequency").val()
    var scheds = []

    if (frequency === "Daily") {
      let dates = moment().format('L')
      meds.forEach(sched => {
        if (dates === sched.Date) {
          scheds.push({
            clientID: sched.clientID,
            clientName: sched.clientName,
            petName: sched.petName,
            reason: sched.reason,
            date: sched.Date,
          })
        }
      })
      setFilteredData(scheds)
    }
    else if (frequency === "Weekly") {
      let dates = getCurrentWeekDays()
      meds.forEach(sched => {
        if (dates.includes(sched.Date)) {
          scheds.push({
            clientID: sched.clientID,
            clientName: sched.clientName,
            petName: sched.petName,
            reason: sched.reason,
            date: sched.Date,
          })
        }
      })
      setFilteredData(scheds)
    }
    else if (frequency === "Monthly") {
      let dates = getCurrentMonthDays()
      meds.forEach(sched => {
        if (dates.includes(sched.Date)) {
          scheds.push({
            clientID: sched.clientID,
            clientName: sched.clientName,
            petName: sched.petName,
            reason: sched.reason,
            date: sched.Date,
          })
        }
      })
      setFilteredData(scheds)
    }
    setCsvData(scheds)
  }
  console.log(csvData)
  return (
    <>
      <Form.Group as={Col} controlId="formGridFrequency" className="formGridFrequency">
        <Form.Label>Filter by</Form.Label>
        <InputGroup className="mb-3">
          <select onChange={() => refreshTable()} className="frequency form-select">
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
          <Button disabled={csvData.length > 0 ? false : true}><CSVLink filename={$(".frequency").val() + "_Report"} data={csvData}><FaFileExport /> Export File</CSVLink></Button>
        </InputGroup>
      </Form.Group>
      <Table columns={columns} dataSource={filteredData} />
    </>
  )
}