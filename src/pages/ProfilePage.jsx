import React, { useState, } from 'react'

const ProfilePage = () => {
    return (
        <div>
            <h1>Min Profil</h1>
            <div className="profile-box">
                <form className="profile-form">
                    <div className="profile-form-box">
                        <label htmlFor="firstName">Förnamn</label>
                        <input className=""></input>
                        <label htmlFor="lastName">Efternamn</label>
                        <input className=""></input>
                    </div>
                    <div className="profile-form-box">
                        <label htmlFor="changePassword">Byt Lösenord</label>
                        <input className=""></input>
                        <label htmlFor="firstName">Bekräfta Lösenord</label>
                        <input className=""></input>
                    </div>
                    <button className="btn-box" onClick="">
                        <div className="btn-standard large">OK</div>
                    </button>
                    <button className="btn-box grey" onClick="">
                        <div className="btn-standard large">Spara</div>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ProfilePage