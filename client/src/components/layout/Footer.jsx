import React from 'react';
import { Link } from 'react-router-dom';
import odysseyLogoWhite from '../../assets/odyssey-logo-white.svg';

const Footer = () => {
  return (
    <footer className="aventra-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <Link to="/" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
              <img
                src={odysseyLogoWhite}
                alt="Odyssey Travels & Expeditions"
                style={{ height: '42px', width: 'auto', display: 'block' }}
              />
            </Link>
            <p>
              Curating thoughtful, authentic expeditions and private journeys for conscious modern explorers around the globe.
            </p>
          </div>

          {/* Journeys */}
          <div className="footer-column">
            <h4>Expeditions</h4>
            <ul className="footer-column-links">
              <li><Link to="/packages">Classic Expeditions</Link></li>
              <li><Link to="/packages">Cultural Immersions</Link></li>
              <li><Link to="/packages">Alpine Hiking Tours</Link></li>
              <li><Link to="/packages">Coastal Escapes</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h4>Discover</h4>
            <ul className="footer-column-links">
              <li><Link to="/">Home Overview</Link></li>
              <li><Link to="/packages">Catalog & Itineraries</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
              <li><Link to="/login">Sign In / Register</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-column">
            <h4>Newsletter</h4>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
              Receive exclusive private travel notes, seasonal launches, and route inspirations.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="newsletter-subscribe-box">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Odyssey Travels & Expeditions Ltd. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
