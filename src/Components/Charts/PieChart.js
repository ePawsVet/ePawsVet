import React, { useState, useEffect } from 'react'
import { Pie } from 'react-chartjs-2'
import { db } from '../../firebase'

const PieChart = () => {
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
            'Monday':0,
            'Tuesday':0,
            'Wednesday':0,
            'Thursday':0,
            'Friday':0,
            'Saturday':0,
            'Sunday':0
          }
          var days = {
            0:'Monday',
            1:'Tuesday',
            2:'Wednesday',
            3:'Thursday',
            4:'Friday',
            5:'Saturday',
            6:'Sunday'
          }
          data.forEach(evt => {
            lbls[days[new Date(evt.Date).getDay()-1]]++
          });
          setEvents(lbls)
      })
      return unsubscribe
    },[])

  return (
    evts ?
    <div>
      <Pie
        data={{
          labels: Object.keys(evts),
          datasets: [
            {
              label: '# of votes',
              data: Object.values(evts),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 206, 86, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        }}
        height={400}
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

export default PieChart