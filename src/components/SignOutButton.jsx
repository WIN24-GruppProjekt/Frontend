import React from 'react'

const SignOutButton = () => {

    const handleSignOut = () => {
        // Clear user session data (e.g., tokens, user info)
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');

        window.location.reload() // Reload the app to reflect signed-out state
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