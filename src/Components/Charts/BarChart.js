import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import { db } from '../../firebase'

const BarChart = () => {
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
            'injury':0,
            'infection':0,
            'fever':0,
            'vaccination':0,
            'checkup':0,
            'grooming':0,
            'surgery':0
          }
          data.forEach(evt => {
            lbls[evt.reason]++
          });
          setEvents(lbls)
      })
      return unsubscribe
    },[])

  return (
    evts ?
    <div>
      <Bar
        data={{
          
          labels: Object.keys(evts),
          datasets: [
            {
              label: 'No. of Visits per Reason',
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
                'rgba(255, 206, 86, 1)',
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

export default BarChart