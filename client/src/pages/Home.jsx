import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { getPackages } from '../services/packageService';
import PackageCard from '../components/packages/PackageCard';
import { LoadingState, ErrorState } from '../components/common/StatusStates';

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPackages();
      if (res && res.data) {
        setPackages(res.data);
      }
    } catch (err) {
      console.error('Error fetching home packages:', err);
      setError(err.response?.data?.message || 'Could not connect to the Odyssey backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedPackages();
  }, []);

  const featuredList = packages.filter((pkg) => pkg.featured).slice(0, 3);
  const displayPackages = featuredList.length > 0 ? featuredList : packages.slice(0, 3);

  return (
    <div>
      {/* Aventra Editorial Hero Section */}
      <section className="aventra-hero">
        <div className="container">
          <div className="hero-editorial-wrap">
            {/* Left Column Text */}
            <div>
              <div className="hero-lead-kicker">Odyssey Travels & Expeditions</div>
              <h1 className="hero-main-heading">
                Curated journeys to Earth's most breathtaking sanctuaries.
              </h1>
              <p className="hero-description-text">
                Handcrafted multi-day itineraries, vetted local historians, and boutique accommodations designed for travellers seeking genuine depth over tourists.
              </p>

              <div className="hero-actions-row">
                <Link to="/packages" className="btn-black" style={{ padding: '0.85rem 1.85rem' }}>
                  <span>Discover Expeditions</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="btn-white" style={{ padding: '0.85rem 1.85rem' }}>
                  <span>Member Access</span>
                </Link>
              </div>

              {/* Stats Row */}
              <div className="hero-stats-row">
                <div className="hero-stat-item">
                  <h4>50K+</h4>
                  <p>Guests Hosted</p>
                </div>
                <div className="hero-stat-item">
                  <h4>4.9 / 5</h4>
                  <p>Independent Rating</p>
                </div>
                <div className="hero-stat-item">
                  <h4>100%</h4>
                  <p>Guaranteed Small Groups</p>
                </div>
              </div>
            </div>

            {/* Right Column Featured Visual Bento */}
            <div className="hero-bento-visual">
              <img
                src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80"
                alt="Greek Islands Aegean Coastline"
                className="hero-image-large"
              />
              <div className="hero-floating-card">
                <span className="tag-badge" style={{ marginBottom: '0.5rem', background: '#000', color: '#fff' }}>FEATURED EXPEDITION</span>
                <div className="hero-floating-title">Greek Islands Sailing Odyssey</div>
                <div className="hero-floating-subtitle">6 Days • From $1,980 / guest</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Expeditions Grid (Aventra Style) */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-canvas)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <span className="tag-badge" style={{ marginBottom: '0.5rem' }}>HIGHLIGHTS</span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                Featured Journeys of the Season
              </h2>
            </div>
            <Link to="/packages" className="btn-white" style={{ fontSize: '0.85rem' }}>
              <span>View All Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <LoadingState message="Curating top expeditions..." />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchFeaturedPackages} />
          ) : (
            <div className="packages-cards-grid" style={{ padding: 0 }}>
              {displayPackages.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Value Pillars / Brand Ethos */}
      <section style={{ padding: '5rem 0', background: '#ffffff', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem' }}>
            <span className="tag-badge" style={{ marginBottom: '0.75rem' }}>OUR PHILOSOPHY</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
              Why Travel With Odyssey
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              We curate small-group expeditions where logistics are seamless, connections are real, and every detail is intentional.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ border: '1px solid var(--border-light)', padding: '2rem', background: 'var(--bg-canvas)' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--color-black)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Compass size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Intimate Small Groups</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Every departure is capped strictly at 12 to 16 guests, granting personal access to boutique venues and private guides.
              </p>
            </div>

            <div style={{ border: '1px solid var(--border-light)', padding: '2rem', background: 'var(--bg-canvas)' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--color-black)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Transparent Inclusions</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                No surprise fees. Internal logistics, daily breakfasts, verified excursions, and park entrances are covered upfront.
              </p>
            </div>

            <div style={{ border: '1px solid var(--border-light)', padding: '2rem', background: 'var(--bg-canvas)' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--color-black)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Star size={20} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Boutique Stays Only</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                We avoid generic mega-resorts in favor of authentic heritage villas, design-forward lodges, and historic ryokans.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
