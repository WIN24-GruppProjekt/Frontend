import React from 'react'
import Image from '../img/about.jpg'

const AboutPage = () => {
  return (
    <section>
      <h1 className='about-header'>Om oss</h1>
      <span className='about-text'>På Core Gym Club brinner vi för hälsa, styrka och gemenskap. Vårt mål är att skapa en miljö där alla – oavsett nivå – känner sig välkomna och inspirerade. Med moderna lokaler, engagerade instruktörer och ett brett utbud av träningspass hjälper vi dig att nå dina mål, bygga nya vanor och ha roligt på vägen.</span>
      <img src={Image} alt="Training session" className='about-image' />
      <section>
        <h1>This section is supposed to show the instructors of the Core Gym Club</h1>
      </section>
    </section>
  )
}

export default AboutPage