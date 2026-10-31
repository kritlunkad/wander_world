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
  Ticket
} from 'lucide-react';
import { getMyBookings } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { LoadingState, ErrorState } from '../components/common/StatusStates';
import { getDestinationHeroImage } from '../utils/destinationImages';

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
    return <LoadingState message="Retrieving your journey reservations..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchBookings} />;
  }

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--border-light)', marginBottom: '2.5rem' }}>
          <span className="tag-badge" style={{ marginBottom: '0.5rem' }}>MEMBER PORTAL</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            My Reserved Expeditions
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Confirmed departures, traveler rosters, and active bookings associated with <strong>{user?.email}</strong>.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="state-container" style={{ background: '#fff', border: '1px solid var(--border-light)', padding: '4rem 2rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Ticket size={24} color="var(--text-primary)" />
            </div>
            <h3 className="state-title">No Active Expeditions Booked</h3>
            <p className="state-desc" style={{ marginBottom: '1.5rem' }}>
              You haven't reserved any journeys yet. Explore our curated catalog of small group adventures.
            </p>
            <Link to="/packages" className="btn-black">
              Explore Available Expeditions
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {bookings.map((booking) => {
              // Normalize populated package object whether returned as booking.package or booking.packageId
              const pkg = booking.package || booking.packageId;
              const formattedDate = booking.travelDate
                ? new Date(booking.travelDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Date Pending';

              // Safely resolve the destination-authentic image
              const bookingThumb = getDestinationHeroImage(pkg);

              return (
                <div
                  key={booking._id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-light)',
                    display: 'grid',
                    gridTemplateColumns: '260px 1fr auto',
                    overflow: 'hidden',
                  }}
                >
                  {/* Photo Thumbnail */}
                  <div style={{ background: 'var(--bg-muted)', height: '100%', minHeight: '180px' }}>
                    <img
                      src={bookingThumb}
                      alt={pkg?.title || 'Expedition'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Booking Details */}
                  <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <span className="tag-badge tag-badge-emerald">CONFIRMED</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        BOOKING #{booking._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                      {pkg?.title || 'Private Itinerary Expedition'}
                    </h3>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={15} color="var(--text-primary)" />
                        <span>{pkg?.destination || 'Destination Verified'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={15} color="var(--text-primary)" />
                        <span>Departure: {formattedDate}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Users size={15} color="var(--text-primary)" />
                        <span>{booking.travelers} {booking.travelers === 1 ? 'Guest' : 'Guests'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total & Action */}
                  <div
                    style={{
                      padding: '1.5rem 2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      borderLeft: '1px solid var(--border-light)',
                      background: 'var(--bg-subtle)',
                      minWidth: '220px',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Total Reserved
                    </span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0 1rem' }}>
                      ${booking.totalPrice?.toLocaleString()}
                    </div>
                    {pkg?._id && (
                      <Link to={`/packages/${pkg._id}`} className="btn-black" style={{ padding: '0.55rem 1.15rem', fontSize: '0.8rem' }}>
                        <span>View Itinerary</span>
                        <ArrowRight size={14} />
                      </Link>
                    )}
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
