import React, {useState} from 'react'
import ThemeToggle from '../components/ThemeToggle'
import SessionList from '../components/SessionList'
import LoginModal from '../components/modals/loginModal'
import SignInButton from '../components/SignInButton'

const SessionListPage = () => {
    const [loginOpen, setLoginOpen] = useState(false);
      async function handleLogin({ email, password, remember }) {

      if (remember) localStorage.setItem('rememberLogin', '1');
      setLoginOpen(false);
  }

  return (
    <div className='centerscreen'>
        <h1> Body from SessionListPage.jsx</h1>
        <SignInButton onClick={() => setLoginOpen(true)} />

            
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSubmit={handleLogin}
      />
        <ThemeToggle />
        <SessionList />
    </div>
  )
}

export default SessionListPage