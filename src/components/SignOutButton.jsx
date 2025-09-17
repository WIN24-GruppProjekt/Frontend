import React from 'react'

const SignOutButton = () => {
    return (
        <button className="btn-box" onClick={() => setLoginOpen(true)}>
            <div className="btn-standard large">
                Logga Ut
            </div>
        </button>
    )
}

export default SignOutButton