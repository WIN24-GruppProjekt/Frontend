import React, { useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { bookingsApi, venuesApi } from '../lib/api';

const SessionCard = ({item}) => {

  const [booked, setBooked] = useState(null);
  const [roomCapacity, setRoomCapacity] = useState(null);
  const [roomDetails, setRoomDetails] = useState();
  const [locationDetails, setLocationDetails] = useState();
  const [trainerDetails, setTrainerDetails] = useState();

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        // hämta antal bokade
        const participants = await bookingsApi.get(`/api/Bookings/event/${item.id}/participants`);

        // hämta rummet för kapacitet och namn
        const room = await venuesApi.get(`/api/LocationRooms/${item.roomId}`);
        const cap = room?.roomCapacity ?? 0;
        
        // hämta location namn
        let mainRoom = null;
        if (item.locationId) {
          mainRoom = await venuesApi.get(`/api/Locations/${item.locationId}`);
        }

        // hämta trainer namn
        let trainer = null;
        if (item.trainerId) {
          try {
            const authBaseUrl = import.meta.env.VITE_AUTH_API_BASE_URL || '';
            const response = await fetch(`${authBaseUrl}/api/User/instructor/${item.trainerId}`);
            if (response.ok) {
              const data = await response.json();
              trainer = data.result || data; // Handle both wrapped and unwrapped responses
            }
          } catch (err) {
            console.error('Failed to fetch trainer', err);
          }
        }

        if (active) {
          setBooked(participants);
          setRoomCapacity(cap);
          setRoomDetails(room);
          setLocationDetails(mainRoom);
          setTrainerDetails(trainer);
        }
      } catch (err) {
        console.error('Failed to fetch availability', err);
      }
    }

    load();
    return () => { active = false };
  }, [item.id, item.roomId, item.locationId, item.trainerId]);


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
      <span className='session-card-description'>{truncateText(item.description, 80)}</span>
      <div className='session-card-infobox'>
        <span className='session-card-time'>{formatStart(item.startTime)} - {formatEnd(item.endTime)}</span>
        <span className='session-card-location'>
          {locationDetails?.name}, {roomDetails?.roomName}
        </span>
        {trainerDetails && (
          <span className='session-card-trainer'>
            {trainerDetails?.firstName} {trainerDetails?.lastName}
          </span>
        )}
      </div>

      {booked !== null && roomCapacity !== null && ( // vänta på att båda laddas
        <span className='session-card-spots'>
          {booked}/{roomCapacity} platser bokade
        </span>
      )}
    </Link>
  )
}

export default SessionCard