import React, {useEffect, useRef, useState} from 'react'
import { eventsApi, venuesApi } from '../../lib/api';

export default function CreateSessionModal({open, onClose, onCreate, trainerId}) {
    const dialogRef = React.useRef(null);
    const titleRef = React.useRef(null);

    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [locations, setLocations] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [ values, setValues ] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        locationId: '',
        roomId: '',
    })
    
    const [errors, setErrors] = useState({
        title: '',
        startTime: '',
        endTime: '',
        locationId: '',
        roomId: '',
    })
    

    useEffect(() => {
        if (!open) return
        setFormError(null);
        setSubmitting(false);
        setErrors({ title: '', startTime: '', endTime: '', locationId: '', roomId: ''})
        setValues(v => ({ ...v, title: '', description: '', startTime: '', endTime: '', locationId: '', roomId: '' }))
        setTimeout(() => titleRef.current?.focus(), 0);

        (async () => {
            try{
                const data = await venuesApi.get("/api/Locations");
                setLocations(Array.isArray(data) ? data : [])
            } catch(err) {
                console.error("Failed to fetch locations", err);
                setFormError("kunde inte hämta locations. Försök igen senare.")
            }
        }) ()
        const onKey = (e) => { if (e.key === "Escape") onClose?.()}
        document.addEventListener
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener("keydown", onKey)
    }, [open, onClose])

    useEffect( () => {
        if (!values.locationId) {
            setRooms([]);
            setValues(v => ({ ...v, roomId: ''}))
            return
        };
        (async () => {
            try {
                const data = await venuesApi.get(`/api/LocationRooms/${values.locationId}/rooms`)
                setRooms(Array.isArray(data) ? data : [])
                setValues(v => ({ ...v, roomId: ''}))
            } catch (err) {
                console.error("Failed to fetch rooms", err);
                setFormError("kunde inte hämta rooms. Försök igen senare.")
                setRooms([]);
            }
        })()
    }, [values.locationId]) 

    function validateAll(v){
        const next = { title: '', startTime: '', endTime: '', locationId: '', roomId: ''}
        if (!v.title) next.title = "Titel krävs"
        if (!v.startTime) next.startTime = "Starttid krävs"
        if (!v.endTime) next.endTime = "Sluttid krävs"
        if (v.startTime && v.endTime && new Date(v.endTime) <= new Date(v.startTime)) next.endTime = "Sluttid måste vara efter starttid"
        if (!v.locationId) next.locationId = "Plats krävs"
        if (!v.roomId) next.roomId = "Rum krävs"
        return next
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setValues(v => ({ ...v, [name]: value }))
    }

    const toIso = (locaDateTime) => {
        const d  = new Date(locaDateTime)
        return d.toISOString()
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError("");
        const next = validateAll(values);
        setErrors(next)
        const valid = Object.values(next).every(x => !x);
        if (!valid) return

        try{
            setSubmitting(true)
            const payload ={
                title: values.title.trim(),
                description: values.description.trim(),
                startTime: toIso(values.startTime),
                endTime: toIso(values.endTime),
                locationId: values.locationId,
                roomId: Number(values.roomId),
                trainerId: String(trainerId),
            }
            const created = await eventsApi.post("/api/Events", payload)
            onCreate?.(created)
            onClose?.()
        } catch (err) {
            const status = err?.response?.status ?? err?.status
            if (status === 401) setFormError("Du måste vara inloggad för att skapa pass.")
            else if (status === 400 || status === 422) setFormError('Ogiltiga fält. Kontrollera formuläret.')
            else setFormError('Kunde inte skapa pass just nu. Försök igen.')
            console.error('CreateSession error:', err)
        } finally {
            setSubmitting(false);
        }
    }

    if (!open) return null;

  return (
        <div className="cs-overlay" role="dialog" aria-modal="true" aria-labelledby="cs-title">
      <div className="cs-dialog" ref={dialogRef}>
        <header className="cs-header">
          <h2 id="cs-title">Skapa nytt pass</h2>
          <button type="button" className="cs-close" onClick={onClose} aria-label="Stäng">×</button>
        </header>

        {formError && <div role="alert" className="form-error">{formError}</div>}

        <form className="cs-form" onSubmit={handleSubmit} noValidate>
          <div className="cs-field">
            <label htmlFor="title">Titel</label>
            <input
              ref={titleRef}
              id="title" name="title" type="text" required
              value={values.title} onChange={handleChange}
              aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined}
              disabled={submitting}
              placeholder="Ex. HIIT 45 min"
            />
            {errors.title && <p id="title-error" className="form-error">{errors.title}</p>}
          </div>

          <div className="cs-field">
            <label htmlFor="description">Beskrivning</label>
            <textarea
              id="description" name="description" rows={3}
              value={values.description} onChange={handleChange}
              disabled={submitting}
              placeholder="Kort beskrivning av passet…"
            />
          </div>

          <div className="cs-row-2">
            <div className="cs-field">
              <label htmlFor="startTime">Starttid</label>
              <input
                id="startTime" name="startTime" type="datetime-local" required
                value={values.startTime} onChange={handleChange}
                aria-invalid={!!errors.startTime} aria-describedby={errors.startTime ? 'start-error' : undefined}
                disabled={submitting}
              />
              {errors.startTime && <p id="start-error" className="form-error">{errors.startTime}</p>}
            </div>

            <div className="cs-field">
              <label htmlFor="endTime">Sluttid</label>
              <input
                id="endTime" name="endTime" type="datetime-local" required
                value={values.endTime} onChange={handleChange}
                aria-invalid={!!errors.endTime} aria-describedby={errors.endTime ? 'end-error' : undefined}
                disabled={submitting}
              />
              {errors.endTime && <p id="end-error" className="form-error">{errors.endTime}</p>}
            </div>
          </div>

          <div className="cs-row-2">
            <div className="cs-field">
              <label htmlFor="locationId">Anläggning (Location)</label>
              <select
                id="locationId" name="locationId" required
                value={values.locationId} onChange={handleChange}
                aria-invalid={!!errors.locationId} aria-describedby={errors.locationId ? 'loc-error' : undefined}
                disabled={submitting}
              >
                <option value="">Välj anläggning…</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
              {errors.locationId && <p id="loc-error" className="form-error">{errors.locationId}</p>}
            </div>

            <div className="cs-field">
              <label htmlFor="roomId">Rum</label>
              <select
                id="roomId" name="roomId" required
                value={values.roomId} onChange={handleChange}
                aria-invalid={!!errors.roomId} aria-describedby={errors.roomId ? 'room-error' : undefined}
                disabled={submitting || !values.locationId}
              >
                <option value="">{values.locationId ? 'Välj rum…' : 'Välj anläggning först'}</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.roomName} (kap {room.roomCapacity})
                  </option>
                ))}
              </select>
              {errors.roomId && <p id="room-error" className="form-error">{errors.roomId}</p>}
            </div>
          </div>

          {/* trainerId sätts via props – inget fält i UI */}

          <div className="cs-actions">
            <button type="button" className="cs-cancel" onClick={onClose} disabled={submitting}>Avbryt</button>
            <button type="submit" className="cs-submit" disabled={submitting}>
              {submitting ? 'Skapar…' : 'Skapa pass'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
