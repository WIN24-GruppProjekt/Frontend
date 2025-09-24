import React, {useState} from 'react'
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
    <div>
        <h1 className='session-header'>Träningspass</h1>
        <SignInButton onClick={() => setLoginOpen(true)} />

            
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSubmit={handleLogin}
      />
        <SessionList />
    </div>
  )
}

export default SessionListPage