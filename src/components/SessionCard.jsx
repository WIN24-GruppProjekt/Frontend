import React from 'react'
import { Link } from 'react-router-dom'

const SessionCard = ({item}) => {

  const formatStart = (isoString) =>
    new Date(isoString).toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })

  const formatEnd = (isoString) =>
    new Date(isoString).toLocaleTimeString('sv-SE', {
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <Link to={`/bokning/pass/${item.id}`} className='session-card'>
        <h3 className='session-card-title'>{item.title}</h3>
        <span className='session-card-description'>{item.description}</span>
        <span className='session-card-time'>{formatStart(item.startTime)}- {formatEnd(item.endTime)}</span>
        <span className='session-card-location'>{item.location}, {item.locationRoom}</span>
        {/* <span className='session-card-spots'>Tillgängliga platser: {item.availiblespots}</span> */}
    </Link>
  )
}

export default SessionCard