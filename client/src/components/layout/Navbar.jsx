import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, Sparkles, LogIn, LogOut, User, CalendarCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
