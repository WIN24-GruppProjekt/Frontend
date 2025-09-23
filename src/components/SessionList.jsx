import React, { useEffect, useState } from 'react'
import SessionCard from '../components/SessionCard'
import { ClipLoader } from 'react-spinners'
import { eventsApi } from '../lib/api';
const SessionList = () => {
  const [sessions, setSessions] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const ac = new AbortController();

    const getSessions = async () => { // Fetches session data from the API
      try {
        setIsLoading(true);
        setError(null);

        const data = await eventsApi.get('/api/Events', { signal: ac.signal });

        setSessions(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name === 'AbortError') return; // Ignore abort errors
        console.error(e);
        setError(e.message || 'Någonting gick fel');
        setSessions([]);
      } finally {
        setIsLoading(false);
      }
    };

    getSessions();
    return () => ac.abort();
  }, []);
  if (isLoading) {
    return (
        <div className='spinner-container'>
          <ClipLoader color="#3498db" size={60} />
          <p className='spinner-text'>Laddar pass...</p>
        </div>
      
    )
  }
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