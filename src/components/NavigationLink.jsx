import React from 'react'
import { NavLink } from 'react-router-dom'

const NavigationLink = ( {link} ) => {
  return (
  <li><NavLink className={({ isActive }) => `nav-link ${link.name.toLowerCase()}${isActive ? ' active' : ''}`} to={link.to}>{link.name}</NavLink></li>
  )
}

export default NavigationLink