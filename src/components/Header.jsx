  import React, {useState} from 'react'
  import { v4 as uuidv4 } from 'uuid';
  import NavigationLink from './NavigationLink';
  import CoreLogotype from '../img/core.png'
  import ThemeToggle from './ThemeToggle';

  const Header = () => {

    const [menuOpen, setMenuOpen] = useState(false)

      const [navLinks, setNavLinks] = useState([
          { id: uuidv4(), name: "Start", to: "/" },
          { id: uuidv4(), name: "Pass", to: "/pass" },
          { id: uuidv4(), name: "Om Oss", to: "/om" },
          { id: uuidv4(), name: "Min Profil", to: "/profil" },
          { id: uuidv4(), name: "Komponenter"  , to: "/komponenter" }
      ]);

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