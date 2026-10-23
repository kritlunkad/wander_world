import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Calendar,
  MapPin,
  Clock,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  Ticket,
  Receipt
} from 'lucide-react';
import { getMyBookings } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { LoadingState, ErrorState } from '../components/common/StatusStates';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyBookings();
      if (res && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Could not load your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <LoadingState message="Retrieving your bookings..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchBookings} />;
  }

  return (
    <div className="bookings-page">
      <div className="container">
        {/* Header */}
        <div className="bookings-page-header">
          <div className="bookings-title-group">
            <div className="bookings-icon-badge">
              <Ticket size={24} />
            </div>
            <div>
              <h1 className="bookings-title">My Bookings</h1>
              <p className="bookings-subtitle">
                Welcome back, {user?.name}! Here are your reserved adventures and past expeditions.
              </p>
            </div>
          </div>
          <Link to="/packages" className="bookings-explore-btn">
            <Sparkles size={16} />
            <span>Discover More Tours</span>
          </Link>
        </div>

        {/* Bookings List or Empty State */}
        {bookings.length === 0 ? (
          <div className="bookings-empty-state">
            <div className="empty-icon-wrap">
              <Compass size={48} />
            </div>
            <h2 className="empty-title">No Bookings Yet</h2>
            <p className="empty-desc">
              You haven't reserved any adventures yet. The world is full of wondrous places waiting to be explored!
            </p>
            <Link to="/packages" className="btn-primary" id="empty-state-explore-btn">
              <span>Browse Packages</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => {
              const pkg = booking.package || {};
              const travelDateFormatted = booking.travelDate
                ? new Date(booking.travelDate).toLocaleDateString(undefined, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Date not set';
              const bookedOnFormatted = booking.createdAt
                ? new Date(booking.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : null;

              return (
                <div key={booking._id} className="booking-item-card" id={`booking-card-${booking._id}`}>
                  <div className="booking-card-media">
                    <img
                      src={pkg.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'}
                      alt={pkg.title || 'Tour Destination'}
                      className="booking-card-img"
                    />
                    <div className="booking-status-tag confirmed">
                      <span className="status-dot" />
                      <span>{booking.status || 'Confirmed'}</span>
                    </div>
                  </div>

                  <div className="booking-card-body">
                    <div className="booking-card-top">
                      <div className="booking-destination-pill">
                        <MapPin size={14} />
                        <span>{pkg.destination || 'Worldwide'}</span>
                      </div>
                      {bookedOnFormatted && (
                        <span className="booking-booked-date">
                          Booked on {bookedOnFormatted}
                        </span>
                      )}
                    </div>

                    <h3 className="booking-pkg-title">
                      {pkg.title || 'Custom Adventure Tour'}
                    </h3>

                    <div className="booking-details-grid">
                      <div className="booking-detail-pill">
                        <Calendar size={16} className="detail-pill-icon" />
                        <div>
                          <span className="pill-label">Travel Date</span>
                          <span className="pill-value">{travelDateFormatted}</span>
                        </div>
                      </div>

                      <div className="booking-detail-pill">
                        <Users size={16} className="detail-pill-icon" />
                        <div>
                          <span className="pill-label">Travelers</span>
                          <span className="pill-value">{booking.travelers} Person{booking.travelers > 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      {pkg.duration && (
                        <div className="booking-detail-pill">
                          <Clock size={16} className="detail-pill-icon" />
                          <div>
                            <span className="pill-label">Duration</span>
                            <span className="pill-value">{pkg.duration} Days</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="booking-card-footer">
                      <div className="booking-price-summary">
                        <span className="price-summary-label">Total Amount Paid</span>
                        <div className="price-summary-val">
                          ${booking.totalPrice?.toLocaleString()} <span>USD</span>
                        </div>
                      </div>

                      <div className="booking-actions-group">
                        {pkg._id && (
                          <Link
                            to={`/packages/${pkg._id}`}
                            className="btn-view-pkg-link"
                          >
                            <span>View Tour Details</span>
                            <ArrowRight size={15} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
