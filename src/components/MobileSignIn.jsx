import React from 'react'

const MobileSignIn = () => {
    return (
        <button className="btn-box" onClick={() => setLoginOpen(true)}>
            <div className="btn-standard mobile">
                Logga In
            </div>
        </button>
    )
}

export default MobileSignIn