import React, { useEffect, useMemo, useState } from 'react'
import SessionCard from '../components/SessionCard'
import { ClipLoader } from 'react-spinners'
import DateRangeFilter from './DateRangeFilter'
import { eventsApi, parseJwt, getUserIdFromToken, getRolesFromToken } from '../lib/api';
import CreateSessionButton from '../components/CreateSessionButton'
import CreateSessionModal from '../components/modals/CreateSessionModal'

const SessionList = () => {
   const [sessions, setSessions] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const [createOpen, setCreateOpen] = useState(false)

  // auth/role-gating
  const trainerId = getUserIdFromToken()
  const roles = getRolesFromToken()
  const isInstructor = roles.map(r => String(r).toLowerCase()).includes('instructor')
  const canCreate = Boolean(trainerId && isInstructor)

  
 useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await eventsApi.get('/api/Events', { signal: ac.signal })
        setSessions(Array.isArray(data) ? data : [])
      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error(e)
          setError(e.message || 'Någonting gick fel')
          setSessions([])
        }
      } finally {
        setIsLoading(false)
      }
    })()
    return () => ac.abort()
  }, [])

  const getStartIso = (s) => s.starttime ?? s.startTime;

  const filtered = useMemo(() => {
    const startMs = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : -Infinity;
    const endMs   = dateTo   ? new Date(`${dateTo}T23:59:59.999`).getTime() : +Infinity;
    return sessions.filter((s) => {
      const iso = getStartIso(s);
      if (!iso) return false;
      const t = new Date(iso).getTime();
      return t >= startMs && t <= endMs;
    });
  }, [sessions, dateFrom, dateTo]);
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => new Date(getStartIso(a)) - new Date(getStartIso(b)));
  }, [filtered]);

  async function handleCreated(created) {
    if (created?.id) {
      setSessions(prev => [...prev, created])
    } else {
      try {
        const data = await eventsApi.get('/api/Events')
        setSessions(Array.isArray(data) ? data : [])
      } catch (e) {
        console.warn('Kunde inte refetcha efter skapande', e)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="spinner-container">
        <ClipLoader size={60} color="red"/>
        <p className="spinner-text">Laddar pass...</p>
      </div>
    );
  }

  if (error) {
    return (
      <section className="session-page" id="sessions">
        <p>Kunde inte hämta pass: {error}</p>
      </section>
    );
  }

  async function handleCreated(created) {
    if (created?.id) {
      setSessions(prev => [...prev, created])
    } else {
      try {
        const data = await eventsApi.get('/api/Events')
        setSessions(Array.isArray(data) ? data : [])
      } catch (e) {
        console.warn('Kunde inte refetcha efter skapande', e)
      }
    }
  }

  return (
    <>
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
      </section>
      <section className='session-card-container'>
      {sorted.length > 0
        ? sorted.map((session) => <SessionCard key={session.id} item={session} />)
        : <p>Inga pass tillgängliga för vald tidsperiod</p>}
        {canCreate && (
          <CreateSessionButton onClick={() => setCreateOpen(true)} />
        )}
      </section>
      {canCreate && (
        <CreateSessionModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreate={handleCreated}
          trainerId={trainerId}
        />
      )}
    </>
  )
}

export default SessionList
