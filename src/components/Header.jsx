import React, {useState} from 'react'
import { v4 as uuidv4 } from 'uuid';
import NavigationLink from './NavigationLink';
import CoreLogotype from '../img/core.png'
import ThemeToggle from './ThemeToggle';

const Header = () => {

    const [navLinks, setNavLinks] = useState([
        { id: uuidv4(), name: "Start", to: "/" },
        { id: uuidv4(), name: "Bokning", to: "/bokning" },
        { id: uuidv4(), name: "Om Oss", to: "/om" },
        { id: uuidv4(), name: "Komponenter"  , to: "/komponenter" }
    ]);

  return (
    <header>
        <div className='head-logo'>
          <img src="../src/img/core.png" alt="Core" />
          <img src={CoreLogotype} alt="Core" />
        </div>
        <span className='logotype'>Core Gym Club</span>
        <nav className='navbar'>
            <ul className="links">
              {navLinks.map(link => (
                <NavigationLink key={link.id} link={link} />
              ))}
          </ul>
        </nav>
        <ThemeToggle />
    </header>
  )
}

export default Header