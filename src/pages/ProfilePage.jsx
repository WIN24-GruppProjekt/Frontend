import React, { useEffect, useState, } from 'react'
import Profile from '../components/Profile.jsx'
import api, { getFirstNameFromToken, getLastNameFromToken, getEmailFromToken } from '../lib/api.js'

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
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        
        let active = true

        ;(async () => {
            try {
                const res = await api.Users.getMe()
                const data = res?.data ?? res
                const profile = {
                    firstName: data.firstName ?? getFirstNameFromToken() ?? '',
                    lastName: data.lastName ?? getLastNameFromToken() ??'',
                    email: data.email ?? getEmailFromToken() ?? '',
                }
                if (!active) return
                setPlaceholders(profile)
                setForm(f => ({...f, ...profile}))
            } catch {
                const fallback = {
                    firstName: getFirstNameFromToken() ?? '',
                    lastName: getLastNameFromToken() ?? '',
                    email: getEmailFromToken() ?? '',
                }
                if (!active) return
                setPlaceholders(fallback)
                setForm(f => ({...f, ...fallback}))
            } finally {
                if (!active) return
                setLoading(false)
            }
            })()
        return () => { active = false }
    }, [])

    const onChange = (e) => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const buildPatch = (current, original) => {
        const patch = {}
        for (const key of ['firstName', 'lastName', 'email']) {
            if ((current[key] ?? '') !== (original[key] ?? '')) {
                patch[key] = current[key] ?? ''
            }
        }
        if (current.newPassword && current.confirmPassword && current.newPassword === current.confirmPassword) {
            patch.newPassword = current.newPassword
        }
        return patch
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        if(form.newPassword || form.confirmPassword) {
            if(form.newPassword !== form.confirmPassword) {
                setError('Lösenorden matchar inte')
                return
            }
    }

    const patch = buildPatch(form, placeholders)
    if(Object.keys(patch).length === 0) {
        setSuccess('Inga ändringar att spara')
        return
    }

    setSaving(true)
    try {
        const res = await api.Users.updateMe(patch)
        const data = res?.data ?? res

        const merged = {
            firstName: updated.firstName ?? form.firstName,
            lastName: updated.lastName ?? form.lastName,
            email: updated.email ?? form.email,
        }
        setPlaceholders(merged)
        setForm(f => ({...f, ...merged, newPassword: '', confirmPassword: ''}))
        setSuccess('Profil uppdaterad')
    } catch (err) {
        setError(err?.message || 'Profilen kunde inte sparas')
    } finally {
        setSaving(false)
    }
    }

    if (loading) return <div>Laddar...</div>

    return (
        <div>
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