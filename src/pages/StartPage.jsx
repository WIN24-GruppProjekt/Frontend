import React from 'react'
import { Link } from 'react-router-dom'
import Logotype from '../img/logo.png'


const StartPage = () => {
  return (
    <main className="landing-container" aria-labelledby="welcome-heading">
      <div className="logo-container animate__animated animate__flip">
        <img src={Logotype} alt="Core Gym Club" className="landing-logo" />
      </div>

      <section className="text-container animate__animated animate__fadeInLeft">
        <h1 id="welcome-heading" className="welcome-header">Välkommen till Core Gym Club</h1>
        <p>
        Vi är din ultimata destination för styrka, uthållighet och transformation. Här
        bygger vi inte bara muskler, vi bygger drömmar, disciplin och en livsstil som
        varar.
        </p>
        <div className="links-container">
          <Link to="/pass" className="btn primary">Utforska Bokningar</Link>
          <p className="login-text">
          Ny hos oss? Läs mer om hur du kommer igång och vad som ingår i vårt medlemsskap.
          <br />
          <Link to="/om" className="link">Läs mer</Link>
          </p>
        </div>
      </section>


      <aside className="explore-container animate__animated animate__fadeInRight">
        <p className="explore-text">
        Fortfarande osäker?
        <br />
        Inga problem. Fitness är en <strong>resa</strong>, inte en destination.
        <br />
        Bläddra bland våra grupp-pass, workshops och öppna gymtider.
        <br />
        <Link to="/om" className="browse-link">Klicka här</Link>
        </p>
      </aside>

</main>
  )
}

export default StartPage