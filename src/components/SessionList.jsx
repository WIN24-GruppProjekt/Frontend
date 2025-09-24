import React, { useEffect, useMemo, useState } from 'react'
import SessionCard from '../components/SessionCard'
import { ClipLoader } from 'react-spinners'
import DateRangeFilter from './DateRangeFilter'

const SessionList = () => {
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    const getSessions = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(
          'https://eventsservices-dzgbahf4cuasa3b3.swedencentral-01.azurewebsites.net/api/Events',
          { headers: { Accept: 'application/json' } }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
        const json = await res.json()
        setSessions(Array.isArray(json) ? json : [])
      } catch (e) {
        console.error(e)
        setError(e.message)
        setSessions([])
      } finally {
        setIsLoading(false)
      }
    }
    getSessions()
  }, [])

  const getStartIso = (s) => s.starttime ?? s.startTime

  // Filtrera på datumintervall (inkluderande, lokal tid)
  const filtered = useMemo(() => {
    const startMs = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : -Infinity
    const endMs   = dateTo   ? new Date(`${dateTo}T23:59:59.999`).getTime() : +Infinity
    return sessions.filter((s) => {
      const iso = getStartIso(s)
      if (!iso) return false
      const t = new Date(iso).getTime()
      return t >= startMs && t <= endMs
    })
  }, [sessions, dateFrom, dateTo])

  // Sortera stigande efter starttid
  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(getStartIso(a)) - new Date(getStartIso(b))
    )
  }, [filtered])

  if (isLoading) {
    return (
      <div className='spinner-container'>
        <ClipLoader size={60} />
        <p className='spinner-text'>Laddar pass...</p>
      </div>
    )
  }

  if (error) {
    return (
      <section className='session-page' id="sessions">
        <p>Kunde inte hämta pass: {error}</p>
      </section>
    )
  }

  return (
    <section className='session-page' id="sessions">
      <DateRangeFilter
        from={dateFrom}
        to={dateTo}
        onChange={({ from, to }) => { setDateFrom(from); setDateTo(to) }}
        totalCount={sessions.length}
        filteredCount={sorted.length}
        defaultOpen={false}
        // buttonText="Filter sessions by date" 
        // // buttonHideText="Hide filter" 
        // // className="custom-class" 
        // // showIcon={false}
      />

      {sorted.length > 0
        ? sorted.map((session) => <SessionCard key={session.id} item={session} />)
        : <p>Inga pass tillgängliga för vald tidsperiod</p>}
    </section>
  )
}

export default SessionList