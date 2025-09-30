import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

const PortalLayout = () => {
  return (
      <div className='portal-wrapper'>
        <Header />
        <main className='animate__animated animate__fadeInLeft'>
            <Outlet />
        </main>
        <Footer />
    </div>
  )
}

export default PortalLayout