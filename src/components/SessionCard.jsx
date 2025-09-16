import React from 'react'
import { Link } from 'react-router-dom'

const SessionCard = ({item}) => {
  return (
    // Link wont go anywhere until details page is in place.
    <Link to={`/sessions/session-details/${item.id}`} className='session-card'>
        <h3 className='session-card-title'>{item.title}</h3>
        <span className='session-card-description'>{item.description}</span>
        <span className='session-card-time'>{item.starttime} - {item.endtime}</span>
        <span className='session-card-location'>{item.location}, {item.roomName}</span>
        <span className='session-card-spots'>Tillgängliga platser: {item.availiblespots}</span>
    </Link>
  )
}

export default SessionCard