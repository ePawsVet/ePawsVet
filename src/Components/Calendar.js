import React, {useState,useEffect} from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import { db } from '../firebase'
import moment from 'moment'
import { useAuth } from '../Contexts/AuthContext'

export default function Calendars({click=null}){
    const [evts,setEvents] = useState([])
    const {currentUser} = useAuth()
    
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
          console.log(data)
          data.forEach(dt=>{
            eventData.push({
              title : dt.clientName +" - " + dt.time +" - #" + dt.priority + " prio :: " + dt.reason,
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
    const getAddedDays = () =>{
      var someDate = new Date();
      var numberOfDaysToAdd = 2;
      someDate.setDate(someDate.getDate() + numberOfDaysToAdd)
      var dd = someDate.getDate();
      var mm = someDate.getMonth() + 1;
      var y = someDate.getFullYear();

      var someFormattedDate = y + '-' + mm + '-' + dd;
      return someFormattedDate
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