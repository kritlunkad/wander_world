import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, Star, ArrowRight } from 'lucide-react';

const PackageCard = ({ pkg }) => {
  if (!pkg) return null;

  return (
    <article className="package-card" id={`package-card-${pkg._id}`}>
      <div className="card-media">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="card-image"
          loading="lazy"
        />
        <div className="card-media-overlay" />
        
        {pkg.featured && (
          <span className="badge-featured">Featured</span>
        )}

        <div className="badge-rating">
          <Star size={14} fill="#fbbf24" stroke="none" />
          <span>{pkg.rating ? pkg.rating.toFixed(1) : '4.8'}</span>
        </div>
      </div>

      <div className="card-body">
        <div className="card-location">
          <MapPin size={15} />
          <span>{pkg.destination}</span>
        </div>

        <h3 className="card-title" title={pkg.title}>
          {pkg.title}
        </h3>

        <p className="card-description">
          {pkg.description}
        </p>

        <div className="card-meta">
          <div className="meta-item">
            <Clock size={15} />
            <span>{pkg.duration} Days</span>
          </div>
          <div className="meta-item">
            <Users size={15} />
            <span>Max {pkg.maxGroupSize || 12}</span>
          </div>
          {pkg.difficulty && (
            <div className="meta-item">
              <span>• {pkg.difficulty}</span>
            </div>
          )}
        </div>

        <div className="card-footer">
          <div className="price-box">
            <span className="price-label">Starting from</span>
            <div className="price-value">
              ${pkg.price?.toLocaleString()} <span>/ person</span>
            </div>
          </div>

          <Link
            to={`/packages/${pkg._id}`}
            className="card-action-btn"
            id={`view-detail-btn-${pkg._id}`}
          >
            <span>Explore</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PackageCard;
