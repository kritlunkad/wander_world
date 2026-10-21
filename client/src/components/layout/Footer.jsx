import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Globe, Shield, Mail } from 'lucide-react';

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
            <h4>Quick Links</h4>
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
            <h4>Sprint Status</h4>
            <ul className="footer-links">
              <li><span style={{ color: '#38bdf8' }}>✓ Day 1: API & Database</span></li>
              <li><span style={{ color: '#10b981' }}>● Day 2: Client & Packages</span></li>
              <li><span style={{ color: '#64748b' }}>○ Day 3: Auth & Booking</span></li>
              <li><span style={{ color: '#64748b' }}>○ Day 4: Booking UI</span></li>
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
