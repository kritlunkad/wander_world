import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
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
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  LogIn
} from 'lucide-react';
import { getPackageById } from '../services/packageService';
import { createBooking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { LoadingState, ErrorState } from '../components/common/StatusStates';

const PackageDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Form State
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [travelDate, setTravelDate] = useState(tomorrow);
  const [travelers, setTravelers] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

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

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError(null);

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    if (!travelDate) {
      setBookingError('Please choose a valid travel date.');
      return;
    }

    if (travelers < 1) {
      setBookingError('At least 1 traveler is required.');
      return;
    }

    if (pkg.maxGroupSize && travelers > pkg.maxGroupSize) {
      setBookingError(`Maximum allowable travelers for this group tour is ${pkg.maxGroupSize}.`);
      return;
    }

    try {
      setBookingLoading(true);
      const res = await createBooking({
        packageId: pkg._id,
        travelDate,
        travelers: Number(travelers),
      });

      if (res && res.data) {
        setBookingSuccess(res.data);
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      const msg = err.response?.data?.message || 'Failed to place booking. Please try again.';
      setBookingError(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading package details..." />;
  }

  if (error || !pkg) {
    return <ErrorState message={error || 'Package not found'} onRetry={fetchPackage} />;
  }

  const totalPrice = (pkg.price || 0) * Number(travelers);

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

              <div className="detail-location">
                <MapPin size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                <span>{pkg.destination}</span>
              </div>
            </div>
          </div>

          <div className="detail-meta-strip">
            <div className="meta-strip-item">
              <Clock size={20} className="meta-icon" />
              <div>
                <span className="meta-label">Duration</span>
                <span className="meta-val">{pkg.duration} Days / {pkg.duration - 1 > 0 ? pkg.duration - 1 : 1} Nights</span>
              </div>
            </div>

            <div className="meta-strip-item">
              <Users size={20} className="meta-icon" />
              <div>
                <span className="meta-label">Group Capacity</span>
                <span className="meta-val">Up to {pkg.maxGroupSize || 12} People</span>
              </div>
            </div>

            <div className="meta-strip-item">
              <ShieldCheck size={20} className="meta-icon" />
              <div>
                <span className="meta-label">Guided Experience</span>
                <span className="meta-val">Certified Tour Experts</span>
              </div>
            </div>

            <div className="meta-strip-item">
              <Compass size={20} className="meta-icon" />
              <div>
                <span className="meta-label">Package Type</span>
                <span className="meta-val">All-Inclusive Land Tour</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="detail-content-layout">
          {/* Main Info Column */}
          <div className="detail-main-col">
            {/* Overview */}
            <section className="detail-section">
              <h2 className="section-title-sm">About This Adventure</h2>
              <p className="detail-description">{pkg.description}</p>
            </section>

            {/* Gallery (if available) */}
            {pkg.images && pkg.images.length > 0 && (
              <section className="detail-section">
                <h2 className="section-title-sm">Photo Gallery</h2>
                <div className="detail-gallery-grid">
                  {pkg.images.map((imgUrl, index) => (
                    <div key={index} className="gallery-img-wrap">
                      <img
                        src={imgUrl}
                        alt={`${pkg.title} snapshot ${index + 1}`}
                        className="gallery-thumb"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Itinerary */}
            <section className="detail-section">
              <h2 className="section-title-sm">Day-by-Day Itinerary</h2>
              {pkg.itinerary && pkg.itinerary.length > 0 ? (
                <div className="itinerary-timeline">
                  {pkg.itinerary.map((item, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-marker">
                        <span>{item.day || idx + 1}</span>
                      </div>
                      <div className="timeline-card">
                        <div className="timeline-header">
                          <span className="timeline-day-tag">Day {item.day || idx + 1}</span>
                          <h3 className="timeline-title">{item.title}</h3>
                        </div>
                        <p className="timeline-desc">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>
                  A detailed daily schedule will be provided upon reservation.
                </p>
              )}
            </section>

            {/* Inclusions & Exclusions */}
            <section className="detail-section">
              <h2 className="section-title-sm">
                What's Included & Excluded
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

              {/* Day 4 Booking Form */}
              {bookingSuccess ? (
                <div className="booking-success-box" id="booking-success-card">
                  <div className="booking-success-icon">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="booking-success-title">Booking Confirmed!</h3>
                  <p className="booking-success-subtitle">
                    Pack your bags! Your tour reservation has been registered.
                  </p>

                  <div className="booking-summary-receipt">
                    <div className="receipt-row">
                      <span>Travel Date:</span>
                      <strong>{new Date(bookingSuccess.travelDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</strong>
                    </div>
                    <div className="receipt-row">
                      <span>Travelers:</span>
                      <strong>{bookingSuccess.travelers} person(s)</strong>
                    </div>
                    <div className="receipt-row receipt-total">
                      <span>Total Paid:</span>
                      <strong>${bookingSuccess.totalPrice?.toLocaleString()} USD</strong>
                    </div>
                  </div>

                  <div className="booking-success-actions">
                    <Link to="/my-bookings" className="btn-view-bookings">
                      <span>View in My Bookings</span>
                      <ArrowRight size={16} />
                    </Link>
                    <button
                      type="button"
                      className="btn-book-another"
                      onClick={() => setBookingSuccess(null)}
                    >
                      Book Another Tour
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="booking-form" id="package-booking-form">
                  <div className="booking-form-header">
                    <Calendar size={18} style={{ color: 'var(--accent-cyan)' }} />
                    <h4>Reserve Your Departure</h4>
                  </div>

                  {bookingError && (
                    <div className="booking-error-banner" role="alert">
                      <AlertCircle size={16} />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  <div className="booking-field-group">
                    <label htmlFor="booking-travel-date" className="booking-field-label">
                      Select Travel Date
                    </label>
                    <div className="booking-input-wrap">
                      <input
                        id="booking-travel-date"
                        type="date"
                        className="booking-input"
                        min={tomorrow}
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="booking-field-group">
                    <label htmlFor="booking-travelers" className="booking-field-label">
                      Number of Travelers
                    </label>
                    <div className="booking-travelers-picker">
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => setTravelers((prev) => Math.max(1, prev - 1))}
                        disabled={travelers <= 1}
                      >
                        -
                      </button>
                      <input
                        id="booking-travelers"
                        type="number"
                        className="booking-counter-input"
                        min="1"
                        max={pkg.maxGroupSize || 12}
                        value={travelers}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (!isNaN(val)) {
                            setTravelers(Math.max(1, Math.min(val, pkg.maxGroupSize || 12)));
                          }
                        }}
                        required
                      />
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => setTravelers((prev) => Math.min(pkg.maxGroupSize || 12, prev + 1))}
                        disabled={travelers >= (pkg.maxGroupSize || 12)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Live Cost Breakdown */}
                  <div className="booking-cost-breakdown">
                    <div className="cost-row">
                      <span>${pkg.price?.toLocaleString()} × {travelers} traveler{travelers > 1 ? 's' : ''}</span>
                      <span>${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="cost-row cost-total">
                      <span>Total Price</span>
                      <span className="total-highlight">${totalPrice.toLocaleString()} USD</span>
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <button
                      type="submit"
                      className="btn-book-now"
                      id="book-now-submit-btn"
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? (
                        <>
                          <span className="spinner-small" />
                          <span>Securing Reservation...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          <span>Confirm & Book Now</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="unauthenticated-booking-box">
                      <Link
                        to="/login"
                        state={{ from: location }}
                        className="btn-book-now btn-login-to-book"
                        id="login-to-book-btn"
                      >
                        <LogIn size={18} />
                        <span>Log in to Book Tour</span>
                      </Link>
                      <p className="login-to-book-hint">
                        Quick reservation will save your date & travelers.
                      </p>
                    </div>
                  )}
                </form>
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
