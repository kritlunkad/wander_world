import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, LogIn, LogOut, User, CalendarCheck, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand-logo" id="nav-brand-logo" onClick={closeMenu}>
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
                end
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
            {isAuthenticated && (
              <li>
                <NavLink
                  to="/my-bookings"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  id="nav-link-my-bookings"
                >
                  <CalendarCheck size={16} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
                  My Bookings
                </NavLink>
              </li>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <li>
                <NavLink
                  to="/admin/packages"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  id="nav-link-admin-packages"
                  style={{ color: 'var(--accent-cyan)' }}
                >
                  Manage Packages
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="nav-user-group">
              <div className="nav-user-badge" title={`Signed in as ${user?.email || user?.name}`}>
                <div className="nav-user-avatar">
                  <User size={15} />
                </div>
                <span className="nav-user-name">{user?.name?.split(' ')[0] || 'User'}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="nav-logout-btn"
                id="nav-logout-btn"
                title="Log Out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="nav-login-link" id="nav-login-btn">
                <LogIn size={16} />
                <span>Log In</span>
              </Link>
              <Link to="/register" className="nav-signup-btn" id="nav-register-btn">
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          <Link to="/packages" className="nav-cta-btn nav-cta-desktop" id="nav-explore-btn">
            <Sparkles size={16} />
            <span>Explore Tours</span>
          </Link>

          <button
            type="button"
            className="hamburger-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <NavLink to="/" end className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Home</NavLink>
            <NavLink to="/packages" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>Packages</NavLink>
            {isAuthenticated && (
              <NavLink to="/my-bookings" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>My Bookings</NavLink>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <NavLink to="/admin/packages" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu} style={{ color: 'var(--accent-cyan)' }}>Manage Packages</NavLink>
            )}

            <div className="mobile-menu-divider" />

            {isAuthenticated ? (
              <button type="button" onClick={handleLogout} className="mobile-nav-link mobile-logout">
                <LogOut size={16} />
                <span>Logout ({user?.name?.split(' ')[0]})</span>
              </button>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-link" onClick={closeMenu}>
                  <LogIn size={16} />
                  <span>Log In</span>
                </Link>
                <Link to="/register" className="mobile-nav-link mobile-signup" onClick={closeMenu}>
                  <span>Sign Up Free</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
