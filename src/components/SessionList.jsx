import React, { useEffect, useState } from 'react'
import SessionCard from '../components/SessionCard'

const SessionList = () => {
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const getSessions = async () => {
      try {
        const res = await fetch('https://eventsservices-dzgbahf4cuasa3b3.swedencentral-01.azurewebsites.net/api/Events', { headers: { Accept: 'application/json' } })
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)

        const json = await res.json()

        setSessions(Array.isArray(json) ? json : [])
      } catch (e) {
        console.error(e)
        setError(e.message)
        setSessions([])
      }
    }

    getSessions()
  }, [])

  if (error) {
    return (
      <section className="session-page" id="sessions">
        <p>Kunde inte hämta pass: {error}</p>
      </section>
    )
  }

  return (
    <section className="session-page" id="sessions">
        {sessions.length > 0 ? (sessions.map(session => <SessionCard key={session.id} item={session} />)) : (<p>No sessions available</p>)}
    </section>
  )
}

export default SessionList