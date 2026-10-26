import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, MapPin } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-icon">
          <MapPin size={48} />
        </div>
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Destination Not Found</h1>
        <p className="not-found-desc">
          Looks like you've wandered off the map. This page doesn't exist or has been moved to a new destination.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
          <Link to="/packages" className="btn-secondary">
            <Compass size={18} />
            <span>Browse Packages</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
