import React from 'react'

const Profile = ({ values, placeholders, saving, onChange, onSubmit }) => {

    return (
            <form className="profile-form" onSubmit={onSubmit}>
                <div className="profile-form-box">
                    <div className="profile-form-container">
                        <label htmlFor="newPassword">Förnamn</label>
                        <input
                        id="firstName"
                        label="Förnamn"
                        name="firstName"
                        className="profile-form-input"
                        value={values.firstName}
                        placeholder={placeholders.firstName || 'Förnamn'}
                        onChange={onChange}
                        />
                    </div>
                
                    <div className="profile-form-container">
                        <label htmlFor="newPassword">Efternamn</label>
                        <input
                        id="lastName"
                        label="Efternamn"
                        name="lastName"
                        className="profile-form-input"
                        value={values.lastName}
                        placeholder={placeholders.lastName || 'Efternamn'}
                        onChange={onChange}
                        />
                    </div>
                </div>

                <div className="profile-form-box">
                    <div className="profile-form-container">
                    <label htmlFor="newPassword">E-post</label>
                        <input
                        id="email"
                        label="E-post"
                        name="email"
                        className="profile-form-input"
                        value={values.email}
                        placeholder={placeholders.email || "namn@exempel.se"}
                        onChange={onChange}
                        />
                    </div>
                </div>

                <div className="profile-form-box">
                    <div className="profile-form-container">
                        <label htmlFor="newPassword">Nytt Lösenord</label>
                        <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        className="profile-form-input"
                        value={values.newPassword}
                        placeholder="Nytt Lösenord"
                        onChange={onChange}
                        />
                    </div>

                    <div className="profile-form-container">
                        <label htmlFor="confirmPassword">Bekräfta Lösenord</label>
                        <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="profile-form-input"
                        value={values.confirmPassword}
                        placeholder="Bekräfta Lösenord"
                        onChange={onChange}
                        />
                    </div>
                </div>

                <button className="btn-box grey" type='submit' disabled={saving}>
                    <div className="btn-standard large">{saving ? "Sparar..." : "Spara"}</div>
                </button>
            </form>
    )

}

export default Profile
