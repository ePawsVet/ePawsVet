import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { db } from '../../firebase'


const LineChart = () => {
  const [evts,setEvents] = useState(null)


  useEffect(()=>{
      const unsubscribe = 
          db
          .collection('Appointments')
          .onSnapshot(querySnapshot =>{
          const data = querySnapshot.docs.map(doc =>({
              ...doc.data(),
              id:doc.id,
          }));
          var lbls = {
            'January':0,
            'February':0,
            'March':0,
            'April':0,
            'May':0,
            'June':0,
            'July':0,
            'August':0,
            'September':0,
            'October':0,
            'November':0,
            'December':0
          }
          var days = {
            0:'January',
            1:'February',
            2:'March',
            3:'April',
            4:'May',
            5:'June',
            6:'July',
            7:'August',
            8:'September',
            9:'October',
            10:'November',
            11:'December'
          }
          data.forEach(evt => {
            lbls[days[new Date(evt.Date).getMonth()]]++
          });
          setEvents(lbls)
      })
      return unsubscribe
    },[])
  return (
    evts ?
    <div>
      <Line
        data={{
          labels: Object.keys(evts),
          datasets: [
            {
              label: 'No. of Visits per Month',
              data: Object.values(evts),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        }}
        height={500}
        width={600}
        options={{
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          legend: {
            labels: {
              fontSize: 25,
            },
          },
        }}
      />
    </div> : ""
  )
}

export default LineChart