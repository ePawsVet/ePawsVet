import React, { useState } from 'react';
import Navbars from "../Components/Navbars";
import Calendar from 'react-calendar';

export default function Appointments() {
  const [date, setDate] = useState(new Date());
  const [dateRange, setDateRange] = useState([]);

  const onChange = (newDate) => {
    setDate(newDate)
  }
  const getAppointmentsPerDay = () => {
    
    setDateRange([new Date("08/01/2021"),new Date("08/02/2021"),new Date("08/03/2021")])
    console.log(date)
  }
  return (
    <>
    <Navbars title="Appointments"></Navbars>
    <Calendar
        onChange={onChange}
        value={[new Date(2017, 0, 1), new Date(2017, 0, 4)]}
        setDateRange={dateRange}
        onClickDay={getAppointmentsPerDay}
      />
    </>
  )
}
