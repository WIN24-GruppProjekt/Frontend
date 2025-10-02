import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

import {
  Bookings,
  Notifications,
  bookingsApi,
  venuesApi,
  getToken,
  getUserIdFromToken,
  getEmailFromToken,
  getFirstNameFromToken,
} from '../lib/api'

const SessionDetailsCard = ({ session }) => {
  if (!session) return null

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [sendEmailClientSide] = useState(true) // set to false when backend sends confirmations automatically

  // Availability
  const [booked, setBooked] = useState(null)
  const [roomCapacity, setRoomCapacity] = useState(null)

  // Auth snapshot for this render
  const userId = getUserIdFromToken()
  const isAuthed = !!userId

  // Keep “Boka” clickable when not authed to show the login message
  const canBook = useMemo(() => !!session?.id && !loading, [session?.id, loading])

  // Helpers
  const formatStart = (isoString) =>
    new Date(isoString).toLocaleString('sv-SE', {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    })
  const formatEnd = (isoString) =>
    new Date(isoString).toLocaleTimeString('sv-SE', {
      hour: '2-digit', minute: '2-digit',
    })

  // Email payload fields
  const userEmail = getEmailFromToken()
  const firstName = getFirstNameFromToken()

  // Event fields
  const eventId = session.id
  const eventLocation = [session?.location, session?.locationRoom].filter(Boolean).join(', ')
  const eventTimeStr = `${formatStart(session.startTime)} - ${formatEnd(session.endTime)}`
  const eventName = session?.title || ''
  const trainerName =
    session?.trainerName ||
    [session?.trainer?.firstName, session?.trainer?.lastName].filter(Boolean).join(' ') ||
    session?.trainer?.name ||
    ''

  // Load participants + capacity
  const loadAvailability = useCallback(async () => {
    const participants = await bookingsApi.get(`/api/Bookings/event/${session.id}/participants`)
    const room = await venuesApi.get(`/api/LocationRooms/${session.roomId}`)
    setBooked(participants)
    setRoomCapacity(room?.roomCapacity ?? 0)
  }, [session.id, session.roomId])

  useEffect(() => {
    loadAvailability().catch(err => console.error('Kunde inte hämta tillgänglighet', err))
  }, [loadAvailability])

  // Readable guard for “full”
  function isSessionFull() {
    return booked !== null && roomCapacity !== null && booked >= roomCapacity
  }

  async function resolveBookingIdOnce({ userId, eventId }) {
    try {
      const list = await Bookings.byUser(userId)
      const arr = Array.isArray(list) ? list : []
      const match =
        arr
          .filter(b => b?.eventId === eventId || b?.event?.id === eventId)
          .sort((a, b) => {
            const at = new Date(a?.createdAt || a?.created_at || 0).getTime()
            const bt = new Date(b?.createdAt || b?.created_at || 0).getTime()
            return bt - at
          })[0]
      return (match?.id ?? match?.bookingId ?? '') + '' || ''
    } catch {
      return ''
    }
  }

  async function handleBook() {
    // Auth guards
    const token = getToken()
    if (!token) { setMessage('Du måste vara inloggad för att boka.'); return }
    if (!isAuthed) { setMessage('Kunde inte läsa ut ditt användar-ID.'); return }

    // Capacity guard (UX)
    if (isSessionFull()) { setMessage('Passet är fullt.'); return }

    setLoading(true)
    setMessage(null)

    const idempotencyKey = crypto.randomUUID()
    const body = { eventId, userId } // if backend reads userId from JWT, { eventId } is enough

    try {
      const result = await Bookings.create(body, {
        headers: { 'Idempotency-Key': idempotencyKey }
      })

      // Prefer server-provided id; otherwise resolve once from /user bookings
      let bookingId = result?.id ?? result?.bookingId ?? ''
      if (!bookingId) bookingId = await resolveBookingIdOnce({ userId, eventId })

      setMessage('Bokningen är klar! Ett bekräftelsemail skickas strax.')

      if (sendEmailClientSide && bookingId) {
        await Notifications.bookingEmailConfirmation({
          email: userEmail || '',
          firstName: firstName || '',
          bookingId,
          eventLocation: eventLocation || '',
          eventTime: eventTimeStr || '',
          eventName: eventName || '',
          trainerName: trainerName || ''
        })
      }
    } catch (e) {
      const text = String(e?.message || e)
      if (/already/i.test(text) || /redan/i.test(text)) setMessage('Du har redan bokat detta pass.')
      else if (/full/i.test(text) || /fullt/i.test(text)) setMessage('Passet är fullt.')
      else if (/401|auth|unauth/i.test(text)) setMessage('Inloggning krävs.')
      else setMessage('Kunde inte boka just nu. Försök igen om en stund.')
    } finally {
      setLoading(false)
      // Refresh availability after any attempt
      loadAvailability().catch(() => {})
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

      {/* Availability */}
      {booked !== null && roomCapacity !== null && (
        <p>{booked}/{roomCapacity} platser bokade</p>
      )}

      <ul>
        <li>Fri avbokning till 2 timmar före passet.</li>
        <li>Kom 10 min innan start.</li>
        <li>Torka av utrustning efter passet.</li>
      </ul>

      <button
        className={`btn-box ${(!isAuthed || isSessionFull()) ? 'btn-disabled' : ''}`}
        type='button'
        onClick={handleBook}
        disabled={!canBook || isSessionFull()}
        aria-disabled={!canBook || isSessionFull()}
        aria-busy={loading ? 'true' : 'false'}
        title={
          !isAuthed
            ? 'Logga in för att kunna boka'
            : isSessionFull()
              ? 'Passet är fullbokat'
              : undefined
        }
      >
        <div className="btn-standard large">
          {isSessionFull() ? 'Fullbokat' : 'Boka'}
        </div>
      </button>

      {message && isAuthed && (
        <div className="toast info" role="status" aria-live="polite">{message}</div>
      )}

      {!isAuthed && (
        <p className="text-muted" role="note">Logga in för att kunna boka.</p>
      )}
    </section>
  )
}

export default SessionDetailsCard