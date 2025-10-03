  import React, { useEffect, useState} from 'react'
  import { v4 as uuidv4 } from 'uuid';
  import NavigationLink from './NavigationLink';
  import CoreLogotype from '../img/core.png'
  import ThemeToggle from './ThemeToggle';
  import { getToken } from '../lib/api';

  const Header = () => {
    const [token, setToken] = useState(() => getToken());
    const isAuthed = !!token;
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
      const onAuthChanged = () => setToken(getToken());
      window.addEventListener("auth:changed", onAuthChanged);
      return () => window.removeEventListener("auth:changed", onAuthChanged);
    }, []);

    const navLinks = [
      { id: uuidv4(), name: "Start", to: "/" },
      { id: uuidv4(), name: "Pass", to: "/pass" },
      { id: uuidv4(), name: "Om Oss", to: "/om" },
      ...(isAuthed ? [{id: uuidv4(), name: "Min Profil", to: "/profil"}] : [])
    ]

    return (
      <header>
          <div className='head-logo animate__animated animate__flip'>
            <img src={CoreLogotype} alt="Core" />
          </div>
          <nav className='navbar'>
              <ul className="links">
                {navLinks.map(link => (
                  <NavigationLink key={link.id} link={link} />
                ))}
            </ul>
          </nav>
        
        <button 
          className="menu-toggle" 
          onClick={() => setMenuOpen(prev => !prev)} /* togglar true -> false varje tryck på knappen */
        >
          {menuOpen ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-bars"></i>}
        </button>

        <nav className='navbar mobile'>
          <ul className={`links mobile ${menuOpen ? 'is-open' : ''}`}>
            {navLinks.map(link => (
              <NavigationLink key={link.id} link={link} />
            ))}
          </ul>
        </nav>
      </header>
    )
  }

  export default Header