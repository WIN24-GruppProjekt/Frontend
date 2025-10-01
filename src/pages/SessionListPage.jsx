import React, {useEffect, useState} from 'react'
import SessionList from '../components/SessionList'
import LoginModal from '../components/modals/loginModal'
import RegisterModal from '../components/modals/RegisterModal'
import SignInButton from '../components/SignInButton'
import SignUpButton from '../components/SignUpButton'
import SignOutButton from '../components/SignOutButton'
import { authApi, setToken, getToken } from '../lib/api'
import { jwtDecode } from 'jwt-decode'

const SessionListPage = () => {
      const [loginOpen, setLoginOpen] = useState(false);
      const [registerOpen, setRegisterOpen] = useState(false);
      const [isAuthed, setIsAuthed] = useState(false);
      const [decodedToken, setDecodedToken] = useState(null);

      /**
     * Checks if a valid token exists.
     * - Reads token from storage (via getToken).
     * - Decodes token and checks expiry.
     * - Optionally sets decoded payload in state.
     * - If expired or invalid, clears token.
     */
    function hasTokenAndIsValid(setDecodedToken) {
      const token = getToken()
      if (!token) return false

      try {
        const payload = jwtDecode(token)
        const expMs = (payload.exp ?? 0) * 1000

        if (expMs > Date.now()) {
          // Save decoded token in state for UI (optional)
          setDecodedToken?.(payload)
          return true
        }

        // Token expired → clear it
        setToken(null, false)
        return false
      } catch {
        // Token invalid → clear it
        setToken(null, false)
        return false
      }
    }

    useEffect(() => {
      const recompute = () => setIsAuthed(hasTokenAndIsValid(setDecodedToken))

      // Run check once on mount
      recompute()

      // Fires when localStorage changes (e.g. login in another tab)
      const onStorage = (e) => {
        if (e.key === 'authToken' || e.key === 'rememberLogin') recompute()
      }

      // Custom event dispatched by setToken() (covers both localStorage and sessionStorage)
      const onAuthChanged = () => recompute()

      // Re-check when user returns to the tab (in case token expired)
      const onVisibility = () => {
        if (document.visibilityState === 'visible') recompute()
      }

      window.addEventListener('storage', onStorage)
      window.addEventListener('auth:changed', onAuthChanged)
      document.addEventListener('visibilitychange', onVisibility)

      return () => {
        window.removeEventListener('storage', onStorage)
        window.removeEventListener('auth:changed', onAuthChanged)
        document.removeEventListener('visibilitychange', onVisibility)
      }
    }, [])

    // --- Legacy auth handling (before token sync fix) ---
      // This version checked localStorage/sessionStorage separately
      // and did not listen for the new "auth:changed" event.
      // It sometimes caused inconsistent login state between pages
      // (e.g. list page showing logged out while details page still
      // had access to a userId).
      //
      // Kept here temporarily for reference/rollback during testing.
      // Safe to delete once the new implementation proves stable.
      //
      // const hasToken = () => {//Lightweight check for token presence
      //   // Check if user chose to be remembered
      //   const rememberLogin = localStorage.getItem("rememberLogin");
        
      //   // If remember me was selected, check localStorage; otherwise check sessionStorage
      //   const token = rememberLogin ? localStorage.getItem("authToken") : sessionStorage.getItem("authToken");

      //   if (token){
      //       try {
      //         const tokenPayload = jwtDecode(token);
      //         setDecodedToken(tokenPayload);
      //         const exp = tokenPayload.exp;

      //         if (exp * 1000 > Date.now()) {
      //           return true; //still valid
      //         } else {
      //           //token has expired
      //           localStorage.removeItem("authToken");
      //           sessionStorage.removeItem("authToken");
      //           localStorage.removeItem("rememberLogin");
      //           alert("You have been logged out. Your session has expired.")
      //           return false;
      //         }
      //       } catch {
      //           // if token cant be decoded or is corrupted
      //           localStorage.removeItem("authToken");
      //           sessionStorage.removeItem("authToken");
      //           localStorage.removeItem("rememberLogin");
      //           alert("You have been logged out due to invalid session");
      //           return false;
      //       }
      //   }
      //   return false;
      // }

      // useEffect(() => {
      //   setIsAuthed(hasToken())

        
      //   const onStorage = (e) => {
      //     if (e.key === "authToken") setIsAuthed(hasToken())
      //   }
      //   window.addEventListener("storage", onStorage)
      //   return () => window.removeEventListener("storage", onStorage)
      // }, [])

    async function handleLogin({ email, password, remember }) {

    const data = await authApi.post('/api/Login', { email, password });
    if (!data?.token) throw new Error('Token saknas i svar.');

    setToken(data.token, remember);
    if (remember) localStorage.setItem('rememberLogin', '1');
    else localStorage.removeItem('rememberLogin');

    // Decode the token and set the decoded token state
    try {
      const tokenPayload = jwtDecode(data.token);
      setDecodedToken(tokenPayload);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }

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
          <p>Hej, {decodedToken?.FirstName || 'Användare'}</p>
          <p>({decodedToken?.email || 'No email'})</p>
          <SignOutButton redirectTo="/pass" />
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