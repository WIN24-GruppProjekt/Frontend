import React from 'react'

const MoreInfoButton = () => {
    return (
        <button className="btn-box" onClick={() => setLoginOpen(true)}>
            <div className="btn-standard large">
                Mera Info
            </div>
        </button>
    )
}

export default MoreInfoButton