import React, { useEffect, useState, } from 'react'
import submitEditProfile from '../js/Submits.js'

const Profile = () => {

    return (
        <div className="profile-box">
            <form className="profile-form" onSubmit={onSubmit}>
                <div className="profile-form-box">
                    <EditTableInput
                    id="firstName"
                    label="Förnamn"
                    name="firstName"
                    value={form.firstName}
                    placerholder={placeHolders.firstName || 'Förnamn'}
                    readonly={!editing.firstName}
                    onChange={onChange}
                    onToggle={() => onToggle('firstName')}
                    />

                    <EditTableInput
                    id="lastName"
                    label="Efternamn"
                    name="lastName"
                    value={form.lastName}
                    placerholder={placeHolders.lastName || 'Efternamn'}
                    readonly={!editing.lastName}
                    onChange={onChange}
                    onToggle={() => onToggle('lastName')}
                    />
                </div>

                <div className="profile-form-box">
                    <EditTableInput
                    id="email"
                    label="E-post"
                    name="email"
                    value={form.email}
                    placerholder={placeHolders.email || "namn@exempel.se"}
                    readonly={!editing.email}
                    onChange={onChange}
                    onToggle={() => onToggle('email')}
                    />
                </div>

                <div className="profile-form-box">
                    <EditTableInput
                    id="newPassword"
                    label="Nytt Lösenord"
                    name="newPassword"
                    type="password"
                    value={form.newPassword}
                    placerholder="Nytt Lösenord"
                    readonly={!editing.newPassword}
                    onChange={onChange}
                    onToggle={() => onToggle('newPassword')}
                    error={errors.newPassword}
                    />

                    <EditTableInput
                    id="confirmPassword"
                    label="Bekräfta Lösenord"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    placerholder="Bekräfta Lösenord"
                    readonly={!editing.confirmPassword}
                    onChange={onChange}
                    onToggle={() => onToggle('confirmPassword')}
                    hidePencil
                    />
                </div>

                <button className="btn-box grey" onClick={(e) => submitEditProfile(e)}>
                    <div className="btn-standard large">Spara</div>
                </button>
                <button className="btn-box" onClick="">
                    <div className="btn-standard large">Min Pass</div>
                </button>

            </form>
        </div>
    )

}

export default Profile
