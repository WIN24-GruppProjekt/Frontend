import React from 'react'
import SignInButton from '../components/SignInButton'
import SignOutButton from '../components/SignOutButton'
import MobileSignIn from '../components/MobileSignIn'
import MobileSignOut from '../components/MobileSignOut'

const ComponentsPage = () => {
  return (
    <div>
      <h1>Body from ComponentsPage.jsx</h1>
      <SignInButton />
      <SignOutButton />
      <MobileSignIn />
      <MobileSignOut />
    </div>
  )
}

export default ComponentsPage