import React from 'react'
import InstructorPhoto from '../img/instructor-photo.png'

const getInitials = (firstName, lastName) => {
  const first = (firstName || '').trim()[0] || ''
  const last = (lastName || '').trim()[0] || ''
  return (first + last).toUpperCase()
}

const GymInstructorCard = ({ firstName, lastName, photoUrl }) => {
  const initials = getInitials(firstName, lastName)

  return (
    <div className="instructor-card">
      <div className="instructor-card__avatar" aria-label={`Profile image for ${firstName} ${lastName}`}>
        <img src={photoUrl || InstructorPhoto} alt={`${firstName} ${lastName}`} />
      </div>
      <div className="instructor-card__info">
        <h3 className="instructor-card__name">{firstName} {lastName}</h3>
        <p className="instructor-card__subtitle">Instruktör</p>
      </div>
    </div>
  )
}

export default GymInstructorCard

