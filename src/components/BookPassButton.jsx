import React from 'react'

const BookPassButton = () => {
    return (
        <button className="btn-box" onClick={() => setLoginOpen(true)}>
            <div className="btn-standard large">
                Boka Pass
            </div>
        </button>
    )
}

export default BookPassButton