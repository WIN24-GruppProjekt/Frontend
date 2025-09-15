import React from 'react'
import ThemeToggle from '../components/ThemeToggle'
import SessionList from '../components/SessionList'

const SessionListPage = () => {
  return (
    <div className='centerscreen'>
        <h1>
            Body from SessionListPage.jsx
        </h1>
        <ThemeToggle />
        <SessionList />
    </div>
  )
}

export default SessionListPage