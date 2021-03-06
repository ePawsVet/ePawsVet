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
  const [statuses, setStatuses] = useState([])
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
          setData(dates, data)
        })
    return subscribe
  }, [page])

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

  const setData = (dates, fetchedData = []) => {
    var status = $(".status").val()
    var scheds = []
    setEvents([])
    setStatuses([])

    fetchedData = meds.length > 0 ? meds : fetchedData;
    dates.sort(function (a, b) {
      return new Date(a) - new Date(b)
    });
    setDateList(dates)

    if (page === "Reports") {
      fetchedData.forEach(sched => {
        if (
          dates.includes(sched.Date) &&
          ((status.toLowerCase() !== "All" && sched.status.toLowerCase() === status.toLowerCase()) || $(".status").val() === "All")
        ) {
          scheds.push({
            date: sched.Date,
            sched: sched.sched,
            duration: sched.span + "mins",
            clientName: sched.clientName,
            contactNo: sched.contactNo,
            address: sched.address,
            petName: sched.petName,
            reason: sched.reason,
            status: sched.status,
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
          var stts = {
            'Pending': 0,
            'Approved': 0,
            'For Prescription': 0,
            'Completed': 0,
            'Cancelled': 0,
          }
          data.forEach(sched => {
            if (
              dates.includes(sched.Date) &&
              ((status.toLowerCase() !== "All" && sched.status.toLowerCase() === status.toLowerCase()) || $(".status").val() === "All")
            ) {
              lbls[sched.reason]++
              stts[sched.status]++
            }
          });
          setEvents(lbls)
          setStatuses(stts)
        })

      var mins = 0;
      var minutes = 0;
      var hours = 0;
      scheds.forEach(data => {
        mins += parseInt(data.duration.replace("mins", ""))
      })
      hours = Math.floor(mins / 60);
      minutes = mins % 60;
      setHrs(hours + (hours > 1 ? " hours " : " hour ") + (minutes > 0 ? minutes > 1 ? ("and " + minutes + " minutes") : ("and " + minutes + " minute") : ""))
      setFilteredData(scheds)
    }
    else if (page === "Medicines") {
      fetchedData.forEach((sched) => {
        if (dates.includes(sched.date)) {
          scheds.push({
            date: sched.date,
            productID: sched.productID,
            productName: sched.productName,
            category: sched.category,
            stock: sched.stock,
            quantitySold: sched.quantitySold,
            stockAvailable: sched.stockAvailable,
            costPrice: sched.costPrice,
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
        {page === "Reports" ? <Form.Label style={{ marginLeft: "185px" }}>Status</Form.Label> : null}
        <InputGroup className="mb-3">
          <select onChange={() => refreshTable()} className="frequency form-select">
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
          {page === "Reports" ?
            <select onChange={() => refreshTable()} className="status form-select">
              <option value="All">All</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="For Prescription">For Prescription</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            : null}
          <Button onClick={() => { $(".export-btn").click() }} disabled={filteredData.length > 0 ? false : true}> Export to Excel</Button>
          <ExportToExcel className="btn btn-primary export-btn" table="data-table" filename={$(".frequency").val() + "_Report"} sheet="Sheet" buttonText="Export to excel" />
        </InputGroup>
      </Form.Group>
      <div className="ant-table-wrapper">
        <Table striped bordered hover id="data-table">
          <thead>
            <tr><td colSpan={9} style={{ textAlign: "Left", fontSize: "2rem", borderBottom: "none" }}>{page === "Reports" ? "EPAWS VETERINARY CLINIC" : "MEDICINE AND ESSENTIAL ITEMS " + ($(".frequency").val() ? $(".frequency").val().toUpperCase() : "") + " REPORT"}</td></tr>
            <tr><td colSpan={9} style={{ textAlign: "Left" }}>{page === "Reports" ? $(".frequency").val() + " Appointment Schedule" : "EPAWS VETERINARY CLINIC"}</td></tr>
            <tr><td colSpan={9} style={{ textAlign: "Left" }}>Location : San Pablo City</td></tr>
            <tr><td colSpan={9} style={{ textAlign: "Left" }}>Date : {dateList.length > 0 ? dateList[0] + " to " + dateList[dateList.length - 1] : ""} </td></tr>
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
                    <th>Status</th>
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
                        <td>{value.status}</td>
                      </tr>
                    ) : <tr>
                      <td colSpan={9} style={{ textAlign: "center" }}>
                        <div class="ant-empty ant-empty-normal">
                          <div class="ant-empty-image">
                            <svg class="ant-empty-img-simple" width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
                              <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
                                <ellipse class="ant-empty-img-simple-ellipse" cx="32" cy="33" rx="32" ry="7"></ellipse>
                                <g class="ant-empty-img-simple-g" fill-rule="nonzero">
                                  <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                                  <path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" class="ant-empty-img-simple-path"></path>
                                </g>
                              </g>
                            </svg>
                          </div>
                          <div class="ant-empty-description">
                            No Data
                          </div>
                        </div>
                      </td>
                    </tr>
                  }

                  <tr>
                    <td colSpan={9}></td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center" }} colSpan={2}>Total Hours Work:</td>
                    <td colSpan={1}>{hrs}</td>
                  </tr>
                  <tr>
                    <td colSpan={10}></td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center" }} colSpan={3}>Number Of Reason Per Category</td>
                    <td colSpan={6} rowSpan={8}>
                      <div className="status-count-container">
                        <div class="grid-item">Count per Status</div>
                        {statuses ?
                          Object.keys(statuses).map((key, index) =>
                            <div key={index} class="grid-item">{titleCase(key) + " : " + statuses[key]}</div>
                          )
                          : <></>
                        }
                      </div>
                    </td>
                  </tr >
                  {evts ?
                    Object.keys(evts).map((key, index) =>
                      <tr key={index} style={{ textAlign: "center" }}>
                        <td colSpan={2}>{titleCase(key)}</td>
                        <td colSpan={1}>{evts[key]}</td>
                      </tr>
                    ) : <tr>
                      <td colSpan={9} style={{ textAlign: "center" }}>
                        <div class="ant-empty ant-empty-normal">
                          <div class="ant-empty-image">
                            <svg class="ant-empty-img-simple" width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
                              <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
                                <ellipse class="ant-empty-img-simple-ellipse" cx="32" cy="33" rx="32" ry="7"></ellipse>
                                <g class="ant-empty-img-simple-g" fill-rule="nonzero">
                                  <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                                  <path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" class="ant-empty-img-simple-path"></path>
                                </g>
                              </g>
                            </svg>
                          </div>
                          <div class="ant-empty-description">
                            No Data
                          </div>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </>
              : // TBODY FOR MEDICINE
              <>
                <tbody>
                  <tr className="report-table-header">
                    <th>Date</th>
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Type</th>
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
                    ) : <tr>
                      <td colSpan={8} style={{ textAlign: "center" }}>
                        <div class="ant-empty ant-empty-normal">
                          <div class="ant-empty-image">
                            <svg class="ant-empty-img-simple" width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
                              <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
                                <ellipse class="ant-empty-img-simple-ellipse" cx="32" cy="33" rx="32" ry="7"></ellipse>
                                <g class="ant-empty-img-simple-g" fill-rule="nonzero">
                                  <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                                  <path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" class="ant-empty-img-simple-path"></path>
                                </g>
                              </g>
                            </svg>
                          </div>
                          <div class="ant-empty-description">
                            No Data
                          </div>
                        </div>
                      </td>
                    </tr>
                  }
                  <tr>
                    <td colSpan={8}></td>
                  </tr>
                  <tr>
                    <td colSpan={7} style={{ textAlign: "right" }}>TOTAL</td>
                    <td colSpan={1}>Php {hrs.toFixed(2)}</td>
                  </tr>
                </tbody>
              </>
          }
        </Table>
      </div>
    </>
  )
}