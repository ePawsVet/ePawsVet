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
          .orderBy("timeFrom")
          .limit(100)
          .onSnapshot(querySnapshot =>{
          const data = querySnapshot.docs.map(doc =>({
              ...doc.data(),
              id:doc.id,
          }));
          console.log(data)
          var eventData=[]
          data.forEach(dt=>{
            eventData.push({
              title : new Date(dt.timeFrom.seconds * 1000).toLocaleTimeString() + " - " + new Date(dt.timeTo.seconds * 1000).toLocaleTimeString() + " : " + dt.reason,
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
        alert(e.event._def)
    }
    return (
      <FullCalendar
        plugins={[ dayGridPlugin,interactionPlugin ]}
        initialView="dayGridMonth"
        events={evts}
        eventColor="red"
        eventOrder="Asc"
        eventClick={handleEventClick}
        dateClick={handleDateClick}
      />
    )
}