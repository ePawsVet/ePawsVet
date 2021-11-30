import React, {useState,useEffect} from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import { db } from '../firebase'
import moment from 'moment'

import { useHistory } from 'react-router-dom'

export default function Calendars({click=null}){
    const [evts,setEvents] = useState([])
    const history = useHistory()

    //Navigate to schedule list
    function ViewList(){
      history.push("/schedule")
    }

    useEffect(()=>{
      const unsubscribe = 
          db
          .collection('Appointments')
          .where("status","!=","Cancelled")
          .orderBy("status")
          .orderBy("priority")
          .orderBy("time")
          .onSnapshot(querySnapshot =>{
          const data = querySnapshot.docs.map(doc =>({
              ...doc.data(),
              id:doc.id,
          }));
          var eventData=[]
          data.forEach(dt=>{
            eventData.push({
              title : dt.status + " : " + dt.reason + " - " + dt.sched,
              date : moment(new Date(dt.Date).toUTCString()).format("YYYY-MM-DD")
            })
          })
          setEvents(eventData)
      })
      return unsubscribe
    },[])

    const handleDateClick = (e) => {
        click(e.dateStr)
    }
    /*const handleEventClick = (e) => {
        console.log(e)
    }*/

    const headerToolbar = {
      right: 'custom1 today,prevYear,prev,next,nextYear'
    }
    const scheduleList = {
      custom1: {
        text: 'Schedule List',
        click: function () {
          ViewList()
        }
      }
    }
    return (
      <FullCalendar
        plugins={[ dayGridPlugin,interactionPlugin ]}
        initialView="dayGridMonth"
        events={evts}
        eventColor="#e27d60"
        eventOrder="Asc"
        height={800}
        headerToolbar ={headerToolbar}
        customButtons = {scheduleList}
        
        //eventClick={handleEventClick}
        dateClick={handleDateClick}
      />
    )
}