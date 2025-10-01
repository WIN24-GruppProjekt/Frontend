import React, { useEffect, useState, } from 'react'
import Profile from '../components/Profile.jsx'

const ProfilePage = () => {

    const [placeHolders, setPlaceHolders] = useState({
        firstName: '',
        lastName: '',
        email: '',
    })

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        newPassword: '',
        confirmPassword: '',
    })

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {

    })

    if (loading) return <div>Laddar...</div>

    return (
        <div>
            <h1>Min Profil</h1>
            <div className="profile-box">
                <Profile
                    values={form}
                    placeHolders={placeHolders}
                    saving={saving}
                    onChange={onChange}
                    onSubmit={submitEditProfile}
                />
            </div>
        </div>
    )
}


export default ProfilePage