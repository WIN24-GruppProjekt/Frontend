import React from 'react'

const SessionDetailsCard = ({ session }) => {
  if (!session) return null

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
    <section className="session-details-card">
      <h1>{session.title}</h1>
      <p>{session.description}</p>

      <p>{formatStart(session.startTime)}- {formatEnd(session.endTime)}</p>

      <p>
        {session.location}
        {session.locationRoom ? `, ${session.locationRoom}` : ''}
      </p>

      <ul>
        <li>Fri avbokning till 2 timmar före passet.</li>
        <li>Kom 10 min innan start</li>
        <li>Torka av utrustning efter passet</li>
      </ul>
      
      <div className='detail-buttons'>
        <button className='btn-box' type='button'>
            <div className="btn-standard large">
                Boka
            </div>
        </button>
        <button className='btn-box' type='button'>
            <div className="btn-standard large">
                Påminn mig
            </div>
        </button>
      </div>

    </section>
  )
}

export default SessionDetailsCard