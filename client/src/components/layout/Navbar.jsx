import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, CalendarCheck, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import odysseyLogo from '../../assets/odyssey-logo.svg';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="aventra-header">
      <div className="container nav-container">
        {/* Brand / Odyssey Logo */}
        <Link to="/" className="nav-brand" id="nav-brand-logo" onClick={closeMenu} style={{ textDecoration: 'none' }}>
          <img
            src={odysseyLogo}
            alt="Odyssey Travels & Expeditions"
            style={{ height: '38px', width: 'auto', display: 'block' }}
          />
        </Link>

        {/* Center Nav Links */}
        <nav>
          <ul className="nav-links-center">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                id="nav-link-home"
              >
                Discover
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/packages"
                className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                id="nav-link-packages"
              >
                Journeys & Expeditions
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink
                  to="/my-bookings"
                  className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                  id="nav-link-my-bookings"
                >
                  <CalendarCheck size={15} style={{ display: 'inline', marginRight: '5px' }} />
                  My Bookings
                </NavLink>
              </li>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <li>
                <NavLink
                  to="/admin/packages"
                  className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}
                  id="nav-link-admin-packages"
                  style={{ color: 'var(--color-black)', fontWeight: '700' }}
                >
                  <ShieldAlert size={15} style={{ display: 'inline', marginRight: '5px' }} />
                  Manage Packages
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Right CTA / Auth Actions */}
        <div className="nav-actions-right">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="user-badge-nav">
                <User size={15} />
                <span>{user?.name || user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-white"
                id="logout-btn"
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                title="Log out"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn-white" style={{ padding: '0.55rem 1.15rem' }}>
                <LogIn size={15} />
                <span>Sign In</span>
              </Link>
              <Link to="/packages" className="btn-black" style={{ padding: '0.55rem 1.25rem' }}>
                <span>Book a trip</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
