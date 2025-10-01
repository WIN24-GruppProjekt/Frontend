import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  Bookings,
  Notifications,
  getToken,
  getUserIdFromToken,
  getEmailFromToken,
  getFirstNameFromToken,
} from '../lib/api'

const SessionDetailsCard = ({ session }) => {
  if (!session) return null

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [sendEmailClientSide] = useState(true) // keep true only while backend does NOT send emails automatically

  // Cache auth state for this render (avoid calling token helpers multiple times)
  const userId = getUserIdFromToken()
  const isAuthed = !!userId

  // Compute once; keep “Book” clickable for non-authed users to show the login message
  const canBook = useMemo(() => !!session?.id && !loading, [session?.id, loading])

  // Date formatting helpers
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

  // Email payload fields
  const userEmail = getEmailFromToken()
  const firstName = getFirstNameFromToken()

  const eventId = session.id
  const eventLocation = [session?.location, session?.locationRoom].filter(Boolean).join(', ')
  const eventTimeStr = `${formatStart(session.startTime)} - ${formatEnd(session.endTime)}`
  const eventName = session?.title || ''
  const trainerName =
    session?.trainerName ||
    [session?.trainer?.firstName, session?.trainer?.lastName].filter(Boolean).join(' ') ||
    session?.trainer?.name ||
    ''

  /**
   * Resolve bookingId after create.
   * Your POST /Bookings returns { success: true } without the id, so we fetch user's bookings
   * and pick the newest booking for this event. Small retry covers write/read lag.
   */
  async function resolveBookingId({ userId, eventId, attempts = 3, delayMs = 400 }) {
    for (let i = 0; i < attempts; i++) {
      try {
        const list = await Bookings.byUser(userId)
        const arr = Array.isArray(list) ? list : []
        const matches = arr.filter(b => b?.eventId === eventId || b?.event?.id === eventId)
        if (matches.length > 0) {
          const candidate = matches
            .sort((a, b) => {
              const at = new Date(a?.createdAt || a?.created_at || 0).getTime()
              const bt = new Date(b?.createdAt || b?.created_at || 0).getTime()
              return bt - at
            })[0]
          const id = candidate?.id ?? candidate?.bookingId ?? ''
          if (id) return String(id)
        }
      } catch {
        // ignore and retry
      }
      await new Promise(r => setTimeout(r, delayMs))
    }
    return ''
  }

  async function handleBook() {
    // Guard: user must be logged in
    const token = getToken()
    if (!token) {
      setMessage('Du måste vara inloggad för att boka.')
      return
    }
    if (!isAuthed) {
      setMessage('Kunde inte läsa ut ditt användar-ID.')
      return
    }

    const idempotencyKey = crypto.randomUUID()
    const body = { eventId, userId } // if backend reads userId from JWT, you can send only { eventId }

    setLoading(true)
    setMessage(null)

    try {
      const result = await Bookings.create(body, {
        headers: { 'Idempotency-Key': idempotencyKey }
      })

      // Try to pick bookingId directly if server ever adds it; otherwise resolve via byUser()
      let bookingId = result?.id ?? result?.bookingId ?? ''
      if (!bookingId) bookingId = await resolveBookingId({ userId, eventId })

      setMessage('Bokningen är klar! Ett bekräftelsemail skickas strax.')

      if (sendEmailClientSide && bookingId) {
        const dto = {
          email: userEmail || '',
          firstName: firstName || '',
          bookingId,
          eventLocation: eventLocation || '',
          eventTime: eventTimeStr || '',
          eventName: eventName || '',
          trainerName: trainerName || ''
        }
        await Notifications.bookingEmailConfirmation(dto)
      }
    } catch (e) {
      const text = String(e?.message || e)
      if (/already/i.test(text) || /redan/i.test(text)) setMessage('Du har redan bokat detta pass.')
      else if (/full/i.test(text) || /fullt/i.test(text)) setMessage('Passet är fullt.')
      else if (/401|auth|unauth/i.test(text)) setMessage('Inloggning krävs.')
      else setMessage('Kunde inte boka just nu. Försök igen om en stund.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="session-details-card">
      <Link className='btn-back' to={"/pass"} aria-label="Tillbaka">
        <i className="fa-solid fa-arrow-left" />
      </Link>

      <h1>{session.title}</h1>
      <p>{session.description}</p>
      <p>{formatStart(session.startTime)} - {formatEnd(session.endTime)}</p>
      <p>
        {session.location}
        {session.locationRoom ? `, ${session.locationRoom}` : ''}
      </p>

      <ul>
        <li>Fri avbokning till 2 timmar före passet.</li>
        <li>Kom 10 min innan start.</li>
        <li>Torka av utrustning efter passet.</li>
      </ul>

      <button
        className={`btn-box ${!isAuthed ? 'btn-disabled' : ''}`}
        type='button'
        onClick={handleBook}
        disabled={!canBook}                      // keep clickable when not authed → shows login message
        aria-disabled={!canBook}
        aria-busy={loading ? 'true' : 'false'}
        title={!isAuthed ? 'Logga in för att kunna boka' : undefined}
      >
        <div className="btn-standard large">Boka</div>
      </button>

      {/* Show booking/status messages only when logged in */}
      {message && isAuthed && (
        <div className="toast info" role="status" aria-live="polite">{message}</div>
      )}

      {/* Hint for non-logged-in users */}
      {!isAuthed && (
        <p className="text-muted" role="note">Logga in för att kunna boka.</p>
      )}
    </section>
  )
}

export default SessionDetailsCard