import React, { useEffect, useState } from 'react'
import Image from '../img/about.jpg'
import GymInstructorCard from '../components/GymInstructorCard'

const AboutPage = () => {
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchInstructors = async () => {
      try {
        setLoading(true)
        setError('')
        const apiUrl = import.meta.env.MODE === 'development'
          ? '/api/User/instructor/get'
          : 'https://accountservice-brcpcveraagah0cd.swedencentral-01.azurewebsites.net/api/User/instructor/get'
        const res = await fetch(apiUrl, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
        })
        if (!res.ok) throw new Error('Failed to load instructors')
        const data = await res.json()
        if (isMounted) setInstructors(Array.isArray(data) ? data : [])
      } catch (err) {
        if (err.name !== 'AbortError') setError('Kunde inte ladda instruktörer just nu.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchInstructors()
    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  return (
    <section>
      <h1 className='about-header'>Om oss</h1>
      <span className='about-text'>På Core Gym Club brinner vi för hälsa, styrka och gemenskap. Vårt mål är att skapa en miljö där alla – oavsett nivå – känner sig välkomna och inspirerade. Med moderna lokaler, engagerade instruktörer och ett brett utbud av träningspass hjälper vi dig att nå dina mål, bygga nya vanor och ha roligt på vägen.</span>
      <img src={Image} alt="Training session" className='about-image' />
      <section id='instructors' className="instructors-section">
        <h1>Våra instruktörer</h1>
        {loading && <p>Laddar instruktörer...</p>}
        {error && <p role="alert" className="instructors-error">{error}</p>}
        {!loading && !error && (
          <div className="instructors-grid">
            {instructors.map((instr, idx) => (
              <GymInstructorCard
                key={`${instr.firstName}-${instr.lastName}-${idx}`}
                firstName={instr.firstName}
                lastName={instr.lastName}
                photoUrl={instr.imgUrl}
              />
            ))}
          </div>
        )}
        
      </section>
    </section>
  )
}

export default AboutPage