import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand-logo">
              <div className="brand-icon-wrapper">
                <Compass size={20} />
              </div>
              <div className="brand-text">
                Wander<span>World</span>
              </div>
            </Link>
            <p>
              Curating extraordinary travel packages, unforgettable adventures, and authentic cultural journeys across the globe.
            </p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/packages">All Packages</Link></li>
              <li><a href="#featured">Featured Tours</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Destinations</h4>
            <ul className="footer-links">
              <li><Link to="/packages">Bali, Indonesia</Link></li>
              <li><Link to="/packages">Swiss Alps</Link></li>
              <li><Link to="/packages">Kyoto, Japan</Link></li>
              <li><Link to="/packages">Amalfi Coast</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <ul className="footer-links">
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Wander World. All rights reserved.</p>
          <p>Crafted with dedication for travel explorers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
