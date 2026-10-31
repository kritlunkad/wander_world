import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, Star, ArrowRight } from 'lucide-react';
import { getDestinationHeroImage } from '../../utils/destinationImages';

const PackageCard = ({ pkg }) => {
  if (!pkg) return null;

  const cardImage = getDestinationHeroImage(pkg);

  return (
    <article className="aventra-card" id={`package-card-${pkg._id}`}>
      {/* Media with Badges */}
      <div className="card-img-wrapper">
        <img
          src={cardImage}
          alt={pkg.title}
          className="card-img-element"
          loading="lazy"
        />

        {pkg.featured && (
          <div className="card-badge-top-left">
            <span className="tag-badge tag-badge-dark">TOP SELLER</span>
          </div>
        )}

        <div className="card-badge-top-right">
          <Star size={13} fill="#f59e0b" stroke="#f59e0b" />
          <span>{pkg.rating ? pkg.rating.toFixed(1) : '4.9'}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="card-inner-body">
        {/* Destination & Meta */}
        <div className="card-meta-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-primary)' }}>
            <MapPin size={14} />
            <span>{pkg.destination}</span>
          </span>
          <span>•</span>
          <span>Trip Code: OD-{pkg._id?.slice(-4).toUpperCase() || 'AJJR'}</span>
        </div>

        <h3 className="card-heading-title" title={pkg.title}>
          <Link to={`/packages/${pkg._id}`}>{pkg.title}</Link>
        </h3>

        <p className="card-excerpt-text">
          {pkg.description}
        </p>

        {/* Specs Bar */}
        <div className="card-specs-bar">
          <div className="card-spec-item">
            <Clock size={14} />
            <span>{pkg.duration} Days</span>
          </div>
          <span>|</span>
          <div className="card-spec-item">
            <Users size={14} />
            <span>Max {pkg.maxGroupSize || 12}</span>
          </div>
          {pkg.difficulty && (
            <>
              <span>|</span>
              <div className="card-spec-item">
                <span>{pkg.difficulty}</span>
              </div>
            </>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="card-pricing-footer">
          <div className="price-display-group">
            <span className="price-subtext">From</span>
            <div className="price-strong-val">
              ${pkg.price?.toLocaleString()}
              <span className="price-currency-unit"> / person</span>
            </div>
          </div>

          <Link
            to={`/packages/${pkg._id}`}
            className="btn-black"
            style={{ padding: '0.55rem 1.15rem', fontSize: '0.8rem' }}
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
