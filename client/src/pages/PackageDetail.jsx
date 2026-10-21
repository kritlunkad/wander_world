import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Users,
  Star,
  Check,
  X,
  Calendar,
  ArrowLeft,
  ShieldCheck,
  Compass,
  AlertCircle
} from 'lucide-react';
import { getPackageById } from '../services/packageService';
import { LoadingState, ErrorState } from '../components/common/StatusStates';

const PackageDetail = () => {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookNotice, setShowBookNotice] = useState(false);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPackageById(id);
      if (res && res.data) {
        setPkg(res.data);
      }
    } catch (err) {
      console.error('Error fetching package detail:', err);
      setError(err.response?.data?.message || 'Package details could not be retrieved.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackage();
    window.scrollTo(0, 0);
  }, [id]);

  const handleBookNowClick = () => {
    setShowBookNotice(true);
  };

  if (loading) {
    return <LoadingState message="Loading package details..." />;
  }

  if (error || !pkg) {
    return <ErrorState message={error || 'Package not found'} onRetry={fetchPackage} />;
  }

  return (
    <div className="detail-page">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <Link to="/packages" className="detail-back-link" id="detail-back-btn">
          <ArrowLeft size={18} />
          <span>Back to Packages</span>
        </Link>

        {/* Hero Card */}
        <div className="detail-hero-card">
          <div className="detail-banner">
            <img
              src={pkg.image}
              alt={pkg.title}
              className="detail-banner-img"
            />
            <div className="detail-banner-gradient" />
            <div className="detail-banner-content">
              <div className="detail-badge-group">
                {pkg.featured && <span className="badge-featured">Featured Tour</span>}
                <div className="badge-rating">
                  <Star size={14} fill="#fbbf24" stroke="none" />
                  <span>{pkg.rating?.toFixed(1) || '4.8'}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({pkg.reviewsCount || 0} reviews)</span>
                </div>
                {pkg.difficulty && (
                  <span
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: 'var(--accent-cyan)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    Level: {pkg.difficulty}
                  </span>
                )}
              </div>

              <h1 className="detail-title">{pkg.title}</h1>

              <div className="detail-destination">
                <MapPin size={20} />
                <span>{pkg.destination}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Details + Sticky Sidebar */}
        <div className="detail-grid">
          <div className="detail-main">
            {/* Overview */}
            <section className="detail-section">
              <h2 className="detail-section-title">
                <Compass size={22} />
                <span>Trip Overview</span>
              </h2>
              <p className="detail-description-text">{pkg.description}</p>
            </section>

            {/* Day-by-Day Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <section className="detail-section">
                <h2 className="detail-section-title">
                  <Calendar size={22} />
                  <span>Daily Itinerary ({pkg.itinerary.length} Days)</span>
                </h2>
                <div className="timeline">
                  {pkg.itinerary.map((item) => (
                    <div className="timeline-item" key={item._id || item.day}>
                      <div className="timeline-dot" />
                      <div className="timeline-header">
                        <span className="timeline-day">Day {item.day}</span>
                        <h4 className="timeline-title">{item.title}</h4>
                      </div>
                      <p className="timeline-desc">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Inclusions & Exclusions */}
            <section className="detail-section">
              <h2 className="detail-section-title">
                <ShieldCheck size={22} />
                <span>What's Included & Excluded</span>
              </h2>

              <div className="inclusions-grid">
                <div>
                  <h4 style={{ color: 'var(--accent-emerald)', marginBottom: '1rem', fontWeight: 700 }}>
                    Included in Package
                  </h4>
                  <ul className="inclusion-list">
                    {pkg.included && pkg.included.length > 0 ? (
                      pkg.included.map((inc, i) => (
                        <li key={i} className="inclusion-item included">
                          <Check size={18} />
                          <span>{inc}</span>
                        </li>
                      ))
                    ) : (
                      <li className="inclusion-item">Standard guided services</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 style={{ color: 'var(--accent-rose)', marginBottom: '1rem', fontWeight: 700 }}>
                    Excluded
                  </h4>
                  <ul className="inclusion-list">
                    {pkg.excluded && pkg.excluded.length > 0 ? (
                      pkg.excluded.map((exc, i) => (
                        <li key={i} className="inclusion-item excluded">
                          <X size={18} />
                          <span>{exc}</span>
                        </li>
                      ))
                    ) : (
                      <li className="inclusion-item">Personal expenses & extra flights</li>
                    )}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Booking Sidebar */}
          <aside className="detail-sidebar">
            <div className="booking-card">
              <div className="booking-price-header">
                <span className="price-label">Price per person</span>
                <div className="booking-price-large">
                  ${pkg.price?.toLocaleString()} <span>USD</span>
                </div>
              </div>

              <div className="booking-features-list">
                <div className="booking-feature-row">
                  <div className="booking-feature-label">
                    <Clock size={16} />
                    <span>Duration</span>
                  </div>
                  <span className="booking-feature-value">{pkg.duration} Days</span>
                </div>

                <div className="booking-feature-row">
                  <div className="booking-feature-label">
                    <Users size={16} />
                    <span>Max Group Size</span>
                  </div>
                  <span className="booking-feature-value">{pkg.maxGroupSize || 12} People</span>
                </div>

                <div className="booking-feature-row">
                  <div className="booking-feature-label">
                    <MapPin size={16} />
                    <span>Destination</span>
                  </div>
                  <span className="booking-feature-value">{pkg.destination}</span>
                </div>
              </div>

              {/* Day 2 Unwired "Book Now" Button */}
              <button
                type="button"
                className="btn-book-now"
                id="book-now-btn"
                onClick={handleBookNowClick}
              >
                <span>Book Now</span>
              </button>

              {showBookNotice && (
                <div className="unwired-notice" id="unwired-notice-banner">
                  <AlertCircle size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                  Booking functionality will be activated on <strong>Day 3 & Day 4</strong> with Authentication & Checkout!
                </div>
              )}

              <p className="booking-note">
                🔒 Instant reservation lock with 100% money-back guarantee before cancellation cutoff.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
