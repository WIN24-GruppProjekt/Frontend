import React from 'react'
const SignInButton = ({ onClick }) => {
    return (
        <button className="btn-box" type="button" onClick={onClick}>
            <div className="btn-standard">
                Sign In
            </div>
        </button>
    )
}

export default SignInButton