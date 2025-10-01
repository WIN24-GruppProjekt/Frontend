import React, { useEffect, useState, } from 'react'
import submitEditProfile from '../js/Submits.js'

const ProfilePage = () => {

    const [placeHolders, setPlaceHolders] = useState({
        firstName: '',
        lastName: '',
    })

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        newPassword: '',
        confirmPassword: '',
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {


    return (
        <div>
            <h1>Min Profil</h1>
            <div className="profile-box">
                <form className="profile-form">

                    <div className="profile-form-box">
                        <div className="profile-form-container">
                            <label htmlFor="firstName">Förnamn</label>
                            <input className="profile-form-input"></input>
                        </div>
                        <div className="profile-form-container">
                            <label htmlFor="lastName">Efternamn</label>
                            <input className="profile-form-input"></input>
                        </div>
                    </div>

                    <div className="profile-form-box">
                        <div className="profile-form-container">
                            <label htmlFor="changePassword">Byt Lösenord</label>
                            <input className="profile-form-input"></input>
                        </div>
                        <div className="profile-form-container">
                            <label htmlFor="firstName">Bekräfta Lösenord</label>
                            <input className="profile-form-input"></input>
                        </div>
                    </div>

                    <button className="btn-box grey" onClick={(e) => submitEditProfile(e)}>
                        <div className="btn-standard large">Spara</div>
                    </button>
                    <button className="btn-box" onClick="">
                        <div className="btn-standard large">Min Pass</div>
                    </button>

                </form>
            </div>
        </div>
    )
})}


export default ProfilePage