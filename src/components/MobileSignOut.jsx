import React from 'react'

const MobileSignOut = () => {
    return (
        <button className="btn-box" onClick={() => setLoginOpen(true)}>
            <div className="btn-standard mobile">
                Logga Ut
            </div>
        </button>
    )
}

export default MobileSignOut