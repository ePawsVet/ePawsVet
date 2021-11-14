import React, {useState,useEffect} from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import { db } from '../firebase'
import moment from 'moment'

export default function Calendars({click=null}){
    const [evts,setEvents] = useState([])
    
    useEffect(()=>{
      const unsubscribe = 
          db
          .collection('Appointments')
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
    const handleEventClick = (e) => {
        console.log(e)
    }
    return (
      <FullCalendar
        plugins={[ dayGridPlugin,interactionPlugin ]}
        initialView="dayGridMonth"
        events={evts}
        eventColor="#e27d60"
        eventOrder="Asc"
        //eventClick={handleEventClick}
        dateClick={handleDateClick}
      />
    )
}