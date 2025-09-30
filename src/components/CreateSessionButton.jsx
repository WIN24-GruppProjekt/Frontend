import React from 'react'

export default function CreateSessionButton({onClick}) {
  return (
    <div className='session-card session-add'>
        <button className='session-add-btn' 
        title='Lägg till nytt pass'
        type="button"
        onClick={onClick}>
          <i className="fa-solid fa-calendar-plus"></i>
        </button>
    </div>
  )
}
