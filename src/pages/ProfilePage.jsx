import React, { useEffect, useState, } from 'react'
import Profile from '../components/Profile.jsx'
import submitEditProfile from '../js/Submits.js'

const ProfilePage = () => {

    const [placeholders, setPlaceholders] = useState({
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
        // ska bytas ut mot riktig data.
        const data = {firstName: "Fredrik", lastName: "von Ahn", email: "fredrik@vonahn.com", }
        setPlaceholders(data)
        setForm(f => ({...f, ...data}))
        setLoading(false)

    }, [])

    const onChange = (e) => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            submitEditProfile(form)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div>Laddar...</div>

    return (
        <div>
            <h1>Min Profil</h1>
            <div className="profile-box">
                <Profile
                    values={form}
                    placeholders={placeholders}
                    saving={saving}
                    onChange={onChange}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    )
}


export default ProfilePage