import React from 'react'
import SignInButton from '../components/SignInButton'
import SignOutButton from '../components/SignOutButton'
import MobileSignIn from '../components/MobileSignIn'
import MobileSignOut from '../components/MobileSignOut'
import SessionCardButtons from '../components/SessionCardButtons'
import InstructorEmil from '../img/instructor-emil.jpg'
import InstructorHans from '../img/instructor-hans.jpg'

const ComponentsPage = () => {
  return (
    <div>
      <h1>Body from ComponentsPage</h1>
      <SignInButton />
      <SignOutButton />
      <MobileSignIn />
      <MobileSignOut />
      <SessionCardButtons />
      <img src={InstructorEmil} alt="Emil" style={{ height: '100px', width: '100px', borderRadius: '50%', objectFit: 'cover' }}/>
      <img src={InstructorHans} alt="Hans" style={{ height: '100px', width: '100px', borderRadius: '50%', objectFit: 'cover' }}/>
    </div>
  )
}

export default ComponentsPage