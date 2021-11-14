import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { db } from '../../firebase'

export default function TableChart() {
    const [evts,setEvents] = useState(null)

    useEffect(()=>{
        const unsubscribe = 
            db
            .collection('Appointments')
            .orderBy("Date","desc")
            .limit(10)
            .onSnapshot(querySnapshot =>{
            const data = querySnapshot.docs.map(doc =>({
                ...doc.data(),
                id:doc.id,
            }));
            setEvents(data)
        })
        return unsubscribe
      },[])
  return (
    <>
        <h2 className="text-center">Recent Visits</h2>
        <div className="table-chart">
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Reason for Visiting</th>
                </tr>
            </thead>
            <tbody>
            {
                evts && evts.length > 0 ?
                evts.map((evt)=>
                    <tr key={evt.id}>
                        <td>{evt.Date}</td>
                        <td>{evt.clientName}</td>
                        <td>{evt.reason}</td>
                    </tr>
                ) : ""
            }
            </tbody>
        </Table>
        </div>
    </>
    )
}
