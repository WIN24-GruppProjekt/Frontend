import React, {useEffect, useState} from 'react'
import SessionList from '../components/SessionList'
import LoginModal from '../components/modals/loginModal'
import RegisterModal from '../components/modals/RegisterModal'
import SignInButton from '../components/SignInButton'
import SignUpButton from '../components/SignUpButton'
import SignOutButton from '../components/SignOutButton'
import { authApi, setToken } from '../lib/api'

const SessionListPage = () => {
      const [loginOpen, setLoginOpen] = useState(false);
      const [registerOpen, setRegisterOpen] = useState(false);
      const [isAuthed, setIsAuthed] = useState(false);

      const hasToken = () => //Lightweight check for token presence
        !!(localStorage.getItem("authToken") || sessionStorage.getItem("authToken"))

      useEffect(() => {
        setIsAuthed(hasToken())

        
        const onStorage = (e) => {
          if (e.key === "authToken") setIsAuthed(hasToken())
        }
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
      }, [])


    async function handleLogin({ email, password, remember }) {



    const data = await authApi.post('/api/Login', { email, password });
    if (!data?.token) throw new Error('Token saknas i svar.');

    setToken(data.token);
    if (remember) localStorage.setItem('rememberLogin', '1');
    else localStorage.removeItem('rememberLogin');

    setIsAuthed(true);         
    setLoginOpen(false);
  }

  async function handleRegister({ firstName, lastName, email, phone, password }) {
      await authApi.post('/api/Register/customer', {
        firstName,
        lastName,
        email,
        phone,
        password,
      });
      setRegisterOpen(false);
    }
  

  return (
    <div>
        <h1 className='session-header'>Träningspass</h1>

      {isAuthed ? (
        <SignOutButton />
      ) : (
        <>
          <SignInButton onClick={() => setLoginOpen(true)} />
          <SignUpButton onClick={() => setRegisterOpen(true)} />
        </>
      )}

            
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSubmit={handleLogin}
      />

      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSubmit={handleRegister}
      />
      <SessionList />
    </div>
  )
}

export default SessionListPage