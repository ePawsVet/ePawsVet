import React from 'react'
import "../Styles/CalendarIcons.css"

const CalendarIcons = ({ date = "" }) => {
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    return (
        <div className="date-icon-container">
            <div className="date-icon-header">{weekday[new Date(date).getDay()]} </div>
            <div className="date-icon-body">{new Date(date).getDate()}</div>
            <div className="date-icon-footer"> {month[new Date(date).getMonth()]}</div>
        </div>
    )
}

export default CalendarIcons
