import React from 'react'

const getInitials = (firstName, lastName) => {
  const first = (firstName || '').trim()[0] || ''
  const last = (lastName || '').trim()[0] || ''
  return (first + last).toUpperCase()
}

const GymInstructorCard = ({ firstName, lastName, imgUrl }) => {
  const initials = getInitials(firstName, lastName)
  const imgPath = `/avatars/${imgUrl ?? 'instructor-photo.png'}`

  return (
    <div className="instructor-card">
      <div className="instructor-card__avatar" aria-label={`Profile image for ${firstName} ${lastName}`}>
        <img src={imgPath} alt={`${firstName} ${lastName}`} onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = '/avatars/instructor-photo.png'
        }}/>
      </div>
      <div className="instructor-card__info">
        <h3 className="instructor-card__name">{firstName} {lastName}</h3>
        <p className="instructor-card__subtitle">Instruktör</p>
      </div>
    </div>
  )
}

export default GymInstructorCard