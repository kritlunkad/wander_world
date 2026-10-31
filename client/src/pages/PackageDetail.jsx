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
  Plane,
  Building2,
  Compass,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  LogIn
} from 'lucide-react';
import { getPackageById, getPackages } from '../services/packageService';
import { createBooking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { LoadingState, ErrorState } from '../components/common/StatusStates';
import PackageCard from '../components/packages/PackageCard';
import { getDestinationGallery, getDestinationHeroImage } from '../utils/destinationImages';

const PackageDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [pkg, setPkg] = useState(null);
  const [recommended, setRecommended] = useState([]);
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
      // Also fetch other packages for recommendations
      const allRes = await getPackages();
      if (allRes && allRes.data) {
        setRecommended(allRes.data.filter(p => p._id !== id).slice(0, 3));
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
      setBookingError('Please select a preferred departure date.');
      return;
    }

    if (travelers < 1) {
      setBookingError('Please specify at least 1 traveler.');
      return;
    }

    if (pkg.maxGroupSize && travelers > pkg.maxGroupSize) {
      setBookingError(`Maximum group capacity is limited to ${pkg.maxGroupSize} guests.`);
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
      setBookingError(err.response?.data?.message || 'Failed to submit booking reservation.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading itinerary and journey specs..." />;
  if (error || !pkg) return <ErrorState message={error || 'Package not found'} onRetry={fetchPackage} />;

  // Get authentic, destination-specific gallery photos and hero
  const sidePhotos = getDestinationGallery(pkg);
  const heroImage = getDestinationHeroImage(pkg);

  const includedItems = pkg.included
    ? (Array.isArray(pkg.included) ? pkg.included : pkg.included.split(',').map(s => s.trim()))
    : ['All luxury accommodations', 'Daily breakfasts & select regional feasts', 'Private air-conditioned transport', 'Expert local tour directors'];

  const excludedItems = pkg.excluded
    ? (Array.isArray(pkg.excluded) ? pkg.excluded : pkg.excluded.split(',').map(s => s.trim()))
    : ['International airfare to destination', 'Personal travel insurance', 'Optional solo excursions', 'Discretionary gratuities'];

  const totalCalculated = (pkg.price || 0) * Number(travelers);
  const tripCode = `OD-${pkg._id.slice(-4).toUpperCase()}`;

  return (
    <div className="detail-page-container">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/packages" className="btn-white" style={{ padding: '0.45rem 0.95rem', fontSize: '0.8rem', display: 'inline-flex' }}>
            <ArrowLeft size={14} />
            <span>Back to All Expeditions</span>
          </Link>
        </div>

        {/* Bento Gallery Grid (Strictly destination-specific photos) */}
        <section className="bento-gallery-container">
          <div className="bento-item-featured">
            <img src={heroImage} alt={pkg.title} />
          </div>
          <div className="bento-item-side">
            <img src={sidePhotos[0] || heroImage} alt={`${pkg.destination} scenery 1`} />
          </div>
          <div className="bento-item-side">
            <img src={sidePhotos[1] || heroImage} alt={`${pkg.destination} scenery 2`} />
          </div>
          <div className="bento-item-side">
            <img src={sidePhotos[2] || heroImage} alt={`${pkg.destination} scenery 3`} />
          </div>
          <div className="bento-item-side">
            <img src={sidePhotos[3] || heroImage} alt={`${pkg.destination} scenery 4`} />
          </div>
        </section>

        {/* Title & Tag Strip */}
        <div className="detail-meta-pills">
          <span className="tag-badge tag-badge-dark">CURATED EXPEDITION</span>
          <span className="tag-badge">TRIP CODE: {tripCode}</span>
          <span className="tag-badge tag-badge-emerald">CONFIRMED DEPARTURES</span>
        </div>

        <h1 className="detail-main-title">{pkg.title}</h1>
        <p className="detail-summary-lead">{pkg.description}</p>

        {/* Quick Spec Strip */}
        <div className="spec-summary-strip">
          <div className="spec-strip-node">
            <div className="spec-icon-frame"><Clock size={20} /></div>
            <div>
              <div className="spec-node-label">Duration</div>
              <div className="spec-node-value">{pkg.duration} Days</div>
            </div>
          </div>

          <div className="spec-strip-node">
            <div className="spec-icon-frame"><Users size={20} /></div>
            <div>
              <div className="spec-node-label">Group Size</div>
              <div className="spec-node-value">Max {pkg.maxGroupSize || 12} Guests</div>
            </div>
          </div>

          <div className="spec-strip-node">
            <div className="spec-icon-frame"><Compass size={20} /></div>
            <div>
              <div className="spec-node-label">Activity Rating</div>
              <div className="spec-node-value">{pkg.difficulty || 'Moderate'}</div>
            </div>
          </div>

          <div className="spec-strip-node">
            <div className="spec-icon-frame"><Building2 size={20} /></div>
            <div>
              <div className="spec-node-label">Accommodation</div>
              <div className="spec-node-value">Boutique Stays & Lodges</div>
            </div>
          </div>
        </div>

        {/* Main 2-Column Content Layout */}
        <div className="detail-content-layout">
          {/* Left Column (Editorial, Included, Itinerary) */}
          <div className="detail-left-column">
            {/* Trip Overview */}
            <div>
              <h2 className="section-block-title">Trip Overview</h2>
              <div className="overview-editorial-body">
                <p style={{ marginBottom: '1rem' }}>
                  Step off the conventional tourist track and immerse yourself in {pkg.destination}.
                  From handpicked boutique lodgings to private viewings led by certified regional historians,
                  this Odyssey expedition connects you with the cultural essence, local architecture, and dramatic landscapes
                  that define the country.
                </p>
                <p>
                  Every transport leg, accommodation stay, and curated regional dining experience is vetted for
                  comfort and uncompromising authenticity.
                </p>
              </div>
            </div>

            {/* What's Included & Excluded */}
            <div>
              <h2 className="section-block-title">What’s Included</h2>
              <div className="checklist-two-col">
                <div className="checklist-card">
                  <h4>Included Services</h4>
                  <ul className="checklist-items-list">
                    {includedItems.map((item, i) => (
                      <li key={i}>
                        <Check size={16} color="var(--color-black)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="checklist-card">
                  <h4>Not Included</h4>
                  <ul className="checklist-items-list">
                    {excludedItems.map((item, i) => (
                      <li key={i}>
                        <X size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Daily Itinerary */}
            <div>
              <h2 className="section-block-title">Day-by-Day Itinerary</h2>
              <div className="itinerary-timeline-list">
                {pkg.itinerary && pkg.itinerary.length > 0 ? (
                  pkg.itinerary.map((dayItem, idx) => (
                    <div key={idx} className="itinerary-day-card">
                      <div className="itinerary-day-header">
                        <span className="itinerary-day-badge">Day {dayItem.day || idx + 1}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Included: Breakfast, Guided Tour</span>
                      </div>
                      <h4 className="itinerary-day-title">{dayItem.title}</h4>
                      <p className="itinerary-day-desc">{dayItem.description}</p>
                    </div>
                  ))
                ) : (
                  Array.from({ length: Math.min(pkg.duration || 4, 5) }).map((_, idx) => (
                    <div key={idx} className="itinerary-day-card">
                      <div className="itinerary-day-header">
                        <span className="itinerary-day-badge">Day {idx + 1}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Guided Exploration</span>
                      </div>
                      <h4 className="itinerary-day-title">
                        {idx === 0 && `Arrival in ${pkg.destination} & Evening Welcome Dinner`}
                        {idx === 1 && `Historic Districts & Cultural Walking Tour`}
                        {idx === 2 && `Scenic Nature Excursion & Private Local Artisan Workshop`}
                        {idx === 3 && `Hidden Gems & Panoramic Mountain / Coastal Excursion`}
                        {idx >= 4 && `Leisure Morning, Farewell Reception & Departure`}
                      </h4>
                      <p className="itinerary-day-desc">
                        Enjoy curated exploration with your private tour guide, followed by dedicated free time to explore local cafes and historic markets at your own pace.
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget (Aventra Top Seller Style) */}
          <aside className="sticky-booking-widget">
            <span className="widget-top-seller-tag">TOP SELLER</span>
            <div className="widget-trip-duration">{pkg.duration} Days in {pkg.destination}</div>

            <div className="widget-price-hero">
              <span>${pkg.price?.toLocaleString()}</span>
              <span className="widget-strikethrough-price">${((pkg.price || 1000) * 1.25).toFixed(0)}</span>
            </div>

            <div className="widget-trip-code-row">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} /> Valid Departure: Daily
              </span>
              <span>Code: {tripCode}</span>
            </div>

            {/* 3 Quick Inclusions */}
            <div className="inclusions-quick-strip">
              <div className="quick-inclusion-node">
                <Plane size={18} />
                <span>Transfers</span>
              </div>
              <div className="quick-inclusion-node">
                <Building2 size={18} />
                <span>Hotels</span>
              </div>
              <div className="quick-inclusion-node">
                <Compass size={18} />
                <span>Expert Guides</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="alert-banner alert-banner-success" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                  <CheckCircle2 size={18} /> Reservation Confirmed!
                </div>
                <p style={{ marginTop: '0.35rem', fontSize: '0.85rem' }}>
                  Your spot for <strong>#{bookingSuccess._id?.slice(-6).toUpperCase()}</strong> has been reserved.
                </p>
                <Link to="/my-bookings" className="btn-black" style={{ marginTop: '1rem', width: '100%', fontSize: '0.85rem' }}>
                  View In My Bookings
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="booking-form-box">
                {bookingError && (
                  <div className="alert-banner alert-banner-error">
                    <AlertCircle size={16} />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="form-field-group">
                  <label htmlFor="travel-date">Departure Date</label>
                  <input
                    id="travel-date"
                    type="date"
                    min={tomorrow}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label htmlFor="travelers-count">Number of Travelers</label>
                  <select
                    id="travelers-count"
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                  >
                    {Array.from({ length: pkg.maxGroupSize || 8 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Traveler' : 'Travelers'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Total Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderTop: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Calculated Total:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    ${totalCalculated.toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn-black"
                  style={{ width: '100%', padding: '0.95rem' }}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    'Reserving Spot...'
                  ) : isAuthenticated ? (
                    'Book Now'
                  ) : (
                    'Sign In to Book'
                  )}
                </button>
              </form>
            )}
          </aside>
        </div>

        {/* Recommended for You Grid (Aventra bottom strip) */}
        {recommended.length > 0 && (
          <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <span className="tag-badge" style={{ marginBottom: '0.5rem' }}>EXPEDITIONS</span>
                <h2 className="section-block-title" style={{ marginBottom: 0 }}>Recommended For You</h2>
              </div>
              <Link to="/packages" className="btn-white" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                View All Expeditions
              </Link>
            </div>

            <div className="packages-cards-grid" style={{ padding: 0 }}>
              {recommended.map((item) => (
                <PackageCard key={item._id} pkg={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PackageDetail;
