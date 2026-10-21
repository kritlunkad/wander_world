import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Compass, Sparkles, MapPin } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand-logo" id="nav-brand-logo">
          <div className="brand-icon-wrapper">
            <Compass size={22} />
          </div>
          <div className="brand-text">
            Wander<span>World</span>
          </div>
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                id="nav-link-home"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/packages"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                id="nav-link-packages"
              >
                Packages
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <Link to="/packages" className="nav-cta-btn" id="nav-explore-btn">
            <Sparkles size={16} />
            <span>Explore Tours</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
