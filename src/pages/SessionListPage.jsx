import React, {useEffect, useState} from 'react'
import SessionList from '../components/SessionList'
import LoginModal from '../components/modals/loginModal'
import RegisterModal from '../components/modals/RegisterModal'
import SignInButton from '../components/SignInButton'
import SignUpButton from '../components/SignUpButton'
import SignOutButton from '../components/SignOutButton'
import { authApi, setToken } from '../lib/api'
import { jwtDecode } from 'jwt-decode'

const SessionListPage = () => {
      const [loginOpen, setLoginOpen] = useState(false);
      const [registerOpen, setRegisterOpen] = useState(false);
      const [isAuthed, setIsAuthed] = useState(false);
      const [decodedToken, setDecodedToken] = useState(null);

      const hasToken = () => {//Lightweight check for token presence
        const token = (localStorage.getItem("authToken") || sessionStorage.getItem("authToken"));

        if (token){
            try {
              const tokenPayload = jwtDecode(token);
              setDecodedToken(tokenPayload);
              const exp = tokenPayload.exp;

              if (exp * 1000 > Date.now()) {
                return true; //still valid
              } else {
                //token has expired
                localStorage.removeItem("authToken");
                sessionStorage.removeItem("authToken");
                localStorage.removeItem("rememberLogin");
                alert("You have been logged out. Your session has expired.")
                return false;
              }
            } catch {
                // if token cant be decoded or is corrupted
                localStorage.removeItem("authToken");
                sessionStorage.removeItem("authToken");
                localStorage.removeItem("rememberLogin");
                alert("You have been logged out due to invalid session");
                return false;
            }
        }
      }


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
        <>
          <p>Hej, {decodedToken.FirstName}</p>
          <p>({decodedToken.email})</p>
          <SignOutButton />
        </>
      
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