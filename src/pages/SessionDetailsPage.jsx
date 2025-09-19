import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SessionDetailsCard from '../components/SessionDetailsCard'

const SessionDetailsPage = () => {
  const { id } = useParams()                 // 1) Hämta id från URL:en
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {

    const fetchSession = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `https://eventsservices-dzgbahf4cuasa3b3.swedencentral-01.azurewebsites.net/api/Events/${id}`
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        setSession(data.result ?? data)

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchSession()
  }, [id])

  if (loading) return <div>Laddar...</div>
  if (error)   return <div>Fel: {error}</div>
  if (!session) return <div>Inget pass hittades.</div>

  return <SessionDetailsCard session={session} />
}

export default SessionDetailsPage