//import React from 'react'
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import moment from 'moment';
import $ from 'jquery'
import { Form, Col, Button, Table, InputGroup } from 'react-bootstrap'
import ExportToExcel from 'react-html-table-to-excel'


export default function WeeklyReport({ page = "" }) {
  const [meds, setMeds] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [dateList, setDateList] = useState([moment().format('L')])
  const [evts, setEvents] = useState([])
  const [hrs, setHrs] = useState(0)

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
    return days;
  }

  useEffect(() => {
    const subscribe =
      db
        .collection(page === "Reports" ? "Appointments" : "Prescribed_Meds")
        .limit(100)
        .onSnapshot(querySnapshot => {
          const data = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMeds(data)
          let dates = [moment().format('L')]
          setData(dates,data)
        })
    return subscribe
  }, [])

  const refreshTable = () => {
    var frequency = $(".frequency").val()
    var dates = []

    if (frequency === "Daily") {
      dates = [moment().format('L')]
    }
    else if (frequency === "Weekly") {
      dates = getCurrentWeekDays()
    }
    else if (frequency === "Monthly") {
      dates = getCurrentMonthDays()
    }
    setData(dates)
  }

  const titleCase = (str) => {
    return str
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  const setData = (dates,fetchedData) => {
    var scheds = []
    fetchedData = meds.length > 0 ? meds : fetchedData;
    console.log(fetchedData)
    dates.sort(function (a, b) {
      return new Date(a) - new Date(b)
    });
    setDateList(dates)

    if (page === "Reports") {
      fetchedData.forEach(sched => {
        if (dates.includes(sched.Date)) {
          scheds.push({
            date: sched.Date,
            sched: sched.sched,
            duration: sched.span + "mins",
            clientName: sched.clientName,
            contactNo: sched.contactNo,
            address: sched.address,
            petName: sched.petName,
            reason: sched.reason,
          })
        }
      })

      db
        .collection('Appointments')
        .where("Date", '>=', dates[0])
        .where("Date", '<=', dates[dates.length - 1])
        .onSnapshot(querySnapshot => {
          const data = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          var lbls = {
            'injury': 0,
            'infection': 0,
            'fever': 0,
            'vaccination': 0,
            'checkup': 0,
            'grooming': 0,
            'surgery': 0
          }
          data.forEach(evt => {
            lbls[evt.reason]++
          });
          setEvents(lbls)
        })

      var mins = 0;
      var hours = 0;
      scheds.forEach(data => {
        mins += parseInt(data.duration.replace("mins", ""))
      })
      hours = mins / 60;
      setHrs(hours)
      setFilteredData(scheds)
    }
    else if (page === "Medicines") {
      fetchedData.forEach((sched) => {
        if (dates.includes(sched.date)) {
          scheds.push({
            date:sched.date,
            productID:sched.productID,
            productName:sched.productName,
            category:sched.category,
            stock:sched.stock,
            quantitySold:sched.quantitySold,
            stockAvailable:sched.stockAvailable,
            costPrice:sched.costPrice,
          })
        }
      })

      var total = 0;
      scheds.forEach(data => {
        total += data.quantitySold * data.costPrice
      })
      setHrs(total)
      setFilteredData(scheds)
    }
  }
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
          <Button onClick={() => { $(".export-btn").click() }} disabled={filteredData.length > 0 ? false : true}> Export to Excel</Button>
          <ExportToExcel className="btn btn-primary export-btn" table="data-table" filename={$(".frequency").val() + "_Report"} sheet="Sheet" buttonText="Export to excel" />
        </InputGroup>
      </Form.Group>
      <div className="ant-table-wrapper">
        <Table striped bordered hover id="data-table">
          <thead>
            <tr><td colSpan={8} style={{ textAlign: "Left", fontSize: "2rem", borderBottom: "none" }}>{page === "Reports" ? "EPAWS VETERINARY CLINIC" : "MEDICINE AND ESSENTIAL ITEMS "+ ($(".frequency").val() ? $(".frequency").val().toUpperCase(): "")+" REPORT"}</td></tr>
            <tr><td colSpan={8} style={{ textAlign: "Left" }}>{page === "Reports" ? $(".frequency").val() + " Appointment Schedule" : "EPAWS VETERINARY CLINIC"}</td></tr>
            <tr><td colSpan={8} style={{ textAlign: "Left" }}>Location : San Pablo City</td></tr>
            <tr><td colSpan={8} style={{ textAlign: "Left" }}>Date : {dateList.length > 0 ? dateList[0] + " to " + dateList[dateList.length - 1] : ""} </td></tr>
            <br />
          </thead>
          {
            page === "Reports" ?
              <>
                <tbody>
                  <tr className="report-table-header">
                    <th>Date</th>
                    <th>Schedule</th>
                    <th>Duration</th>
                    <th>Client Name</th>
                    <th>Contact No</th>
                    <th>Address</th>
                    <th>Pet Name</th>
                    <th>Reason</th>
                  </tr>
                  {filteredData && filteredData.length > 0 ?
                    filteredData.map((value, index) =>
                      <tr key={index}>
                        <td>{value.date}</td>
                        <td>{value.sched}</td>
                        <td>{value.duration}</td>
                        <td>{value.clientName}</td>
                        <td>{value.contactNo}</td>
                        <td>{value.address}</td>
                        <td>{value.petName}</td>
                        <td>{value.reason}</td>
                      </tr>
                    ) : <tr><td colSpan={8} style={{ textAlign: "center" }}>No Data</td></tr>
                  }

                  <tr>
                    <td colSpan={8}></td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center" }} colSpan={2}>Total Hours Work:</td>
                    <td colSpan={1}>{hrs} Hours</td>
                    <td colSpan={5} rowSpan={10}></td>
                  </tr>
                  <tr>
                    <td colSpan={3}></td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center" }} colSpan={3}>Number Of Reason Per Category</td>
                  </tr >
                  {evts ?
                    Object.keys(evts).map((key, index) =>
                      <tr key={index} style={{ textAlign: "center" }}>
                        <td colSpan={2}>{titleCase(key)}</td>
                        <td colSpan={1}>{evts[key]}</td>
                      </tr>
                    ) : <tr><td colSpan={8} style={{ textAlign: "center" }}>No Data</td></tr>
                  }
                </tbody>
              </>
              : // TBODY FOR MEDICINE
              <>
                <tbody>
                  <tr className="report-table-header">
                    <th>Date</th>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Quantity Sold</th>
                    <th>Stock Available</th>
                    <th>Cost Price</th>
                  </tr>
                  {filteredData && filteredData.length > 0 ?
                    filteredData.map((value, index) =>
                      <tr key={index}>
                        <td>{value.date}</td>
                        <td>{value.productID}</td>
                        <td>{value.productName}</td>
                        <td>{value.category}</td>
                        <td>{value.stock}</td>
                        <td>{value.quantitySold}</td>
                        <td>{value.stockAvailable}</td>
                        <td>{value.costPrice}</td>
                      </tr>
                    ) : <tr><td colSpan={8} style={{ textAlign: "center" }}>No Data</td></tr>
                  }
                  <tr>
                    <td colSpan={8}></td>
                  </tr>
                  <tr>
                    <td colSpan={7} style={{ textAlign: "right" }}>TOTAL</td>
                    <td colSpan={1}>Php.{hrs}</td>
                  </tr>
                </tbody>
              </>
          }
        </Table>
      </div>
    </>
  )
}