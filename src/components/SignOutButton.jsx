import React from 'react'
import { setToken } from '../lib/api';
import { useNavigate } from 'react-router-dom';

/**
 * SignOutButton
 * - Clears auth token and emits "auth:changed"
 * - Navigates to `redirectTo` (defaults to "/")
 * - Optionally uses history.replace (no back to the signed-in page)
 */
const SignOutButton = ({ redirectTo = '/', replace = true, onSignedOut }) => {

    const navigate = useNavigate()
    const handleSignOut = () => {
        setToken(null, false)         // clear token + remember flag + dispatch event
        onSignedOut?.()               // optional callback (e.g., toast)
        navigate(redirectTo, { replace })

        // --- Legacy SignOutButton implementation ---
        // This version manually cleared tokens from localStorage/sessionStorage
        // and forced a full page reload with window.location.reload().
        // It worked, but:
        //   - Did not clear the "rememberLogin" flag
        //   - Did not reset the in-memory _token
        //   - Did not dispatch the "auth:changed" event
        //   - Reloading the whole SPA was heavy and unnecessary
        //
        // Kept temporarily for reference/rollback during testing.
        // Safe to delete once the new SPA-style logout is fully verified.
        //
        // // Clear user session data (e.g., tokens, user info)
        // localStorage.removeItem('authToken');
        // sessionStorage.removeItem('authToken');

        // window.location.reload() // Reload the app to reflect signed-out state
    }

    return (
        <button className="btn-box" onClick={handleSignOut}>
            <div className="btn-standard large">
                Logga Ut
            </div>
        </button>
    )
}

export default SignOutButton