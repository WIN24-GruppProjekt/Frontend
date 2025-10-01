import React from 'react'
import submitEditProfile from '../js/Submits.js'

const Profile = ({ value, placeHolders, editing, errors, saving, onChange, onToggle, onSubmit }) => {

    return (
            <form className="profile-form" onSubmit={onSubmit}>
                <div className="profile-form-box">
                    <EditTableInput
                    id="firstName"
                    label="Förnamn"
                    name="firstName"
                    value={form.firstName}
                    placeholder={placeHolders.firstName || 'Förnamn'}
                    readonly={!editing.firstName}
                    onChange={onChange}
                    onToggle={() => onToggle('firstName')}
                    />

                    <EditTableInput
                    id="lastName"
                    label="Efternamn"
                    name="lastName"
                    value={form.lastName}
                    placeholder={placeHolders.lastName || 'Efternamn'}
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
                    placeholder={placeHolders.email || "namn@exempel.se"}
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
                    placeholder="Nytt Lösenord"
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
                    placeholder="Bekräfta Lösenord"
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
    )

}

export default Profile
