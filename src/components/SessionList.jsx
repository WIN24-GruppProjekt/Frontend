import React, { useEffect, useState } from 'react'
import SessionCard from '../components/SessionCard'

const SessionList = () => {

    const [sessions, setSessions] = useState([])
      const getSessions = async () => {
        
        //Swap out dummy data with fetched data from API
        const dummyData = [
          {
            id: 's1',
            title: 'Spin Class',
            description: 'Cardio workout on stationary bikes with interval training.',
            starttime: '2025-09-16 - 06:30',
            endtime: '2025-09-16 - 07:15',
            location: 'Cycling Studio',
            availiblespots: 4
          },
          {
            id: 's2',
            title: 'CrossFit Basics',
            description: 'Strength and conditioning class focusing on functional movements.',
            starttime: '2025-09-16 - 08:00',
            endtime: '2025-09-16 - 09:00',
            location: 'Main Gym Floor',
            availiblespots: 2
          },
          {
            id: 's3',
            title: 'Pilates Core',
            description: 'Mat-based pilates session focused on core strength and posture.',
            starttime: '2025-09-16 - 10:30',
            endtime: '2025-09-16 - 11:20',
            location: 'Studio B',
            availiblespots: 0
          },
          {
            id: 's4',
            title: 'Lunchtime Express Pump',
            description: 'Quick 40-minute barbell workout to build strength during lunch break.',
            starttime: '2025-09-16 - 12:15',
            endtime: '2025-09-16 - 12:55',
            location: 'Studio A',
            availiblespots: 7
          },
          {
            id: 's5',
            title: 'Evening Yoga Flow',
            description: 'Relaxing flow session to improve flexibility and reduce stress.',
            starttime: '2025-09-16 - 18:00',
            endtime: '2025-09-16 - 19:00',
            location: 'Studio C',
            availiblespots: 5
          },
          {
            id: 's6',
            title: 'Bootcamp Outdoors',
            description: 'High-intensity outdoor circuit with bodyweight and cardio drills.',
            starttime: '2025-09-16 - 19:30',
            endtime: '2025-09-16 - 20:15',
            location: 'Outdoor Training Area',
            availiblespots: 10
          }
        ]
    
        setSessions(dummyData)
      }
    
      useEffect(() => {
        getSessions()
      }, [])

  return (
    <section className="session-page" id="sessions">
        {sessions.length > 0 ? (sessions.map(session => <SessionCard key={session.id} item={session} />)) : (<p>No sessions available</p>)}
    </section>
  )
}

export default SessionList