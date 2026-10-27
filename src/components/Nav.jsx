import { useState } from 'react';
import { NavLink } from 'react-router-dom';

/** Site navigation links, shared by the header and footer. */
export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/menu', label: 'Menu' },
  { to: '/booking', label: 'Reservations' },
  { to: '/order-online', label: 'Order Online' },
  { to: '/login', label: 'Login' },
];

/** Main navigation with a hamburger toggle on small screens. */
function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="nav" aria-label="Main navigation">
      <button
        type="button"
        className="nav__toggle"
        aria-expanded={isOpen}
        aria-controls="main-menu"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true">{isOpen ? '✕' : '☰'}</span>
      </button>
      <ul id="main-menu" className={`nav__list ${isOpen ? 'nav__list--open' : ''}`}>
        {NAV_LINKS.map(({ to, label }) => (
          <li key={to}>
            <NavLink to={to} end={to === '/'} onClick={() => setIsOpen(false)}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Nav;
