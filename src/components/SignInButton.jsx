import React from 'react'
const SignInButton = ({ onClick }) => {
    return (
        <button className="btn-box" type="button" onClick={onClick}>
            <div className="btn-standard large">
                Logga In
            </div>
        </button>
    )
}

export default SignInButton