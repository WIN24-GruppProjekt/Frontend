import React, { useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { bookingsApi, venuesApi } from '../lib/api';

const SessionCard = ({item}) => {

  const [booked, setBooked] = useState(null);
  const [roomCapacity, setRoomCapacity] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        // hämta antal bokade
        const participants = await bookingsApi.get(`/api/Bookings/event/${item.id}/participants`);

        // hämta rummet för kapacitet
        const room = await venuesApi.get(`/api/LocationRooms/${item.roomId}`);
        const cap = room?.roomCapacity ?? 0;

        if (active) {
          setBooked(participants);
          setRoomCapacity(cap); // FIX
        }
      } catch (err) {
        console.error('Failed to fetch availability', err);
      }
    }

    load();
    return () => { active = false };
  }, [item.id, item.roomId]);


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
    <Link to={`/pass/info/${item.id}`} className='session-card'>
      <h3 className='session-card-title'>{item.title}</h3>
      <span className='session-card-description'>{item.description}</span>
      <span className='session-card-time'>{formatStart(item.startTime)} - {formatEnd(item.endTime)}</span>
      <span className='session-card-location'>{item.location}, {item.locationRoom}</span>
      {booked !== null && roomCapacity !== null && ( // vänta på att båda laddas
        <span className='session-card-spots'>
          {booked}/{roomCapacity} platser bokade
        </span>
      )}
    </Link>
  )
}

export default SessionCard