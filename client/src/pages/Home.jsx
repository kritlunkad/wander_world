import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Shield, Award, ArrowRight } from 'lucide-react';
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
      setError(err.response?.data?.message || 'Could not connect to the Wander World backend API.');
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
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Curated Tourism Sprint — Day 2</span>
          </div>

          <h1 className="hero-title">
            Discover Earth’s Most <span className="text-gradient">Breathtaking Wonders</span>
          </h1>

          <p className="hero-subtitle">
            Handpicked itineraries, verified local guides, and seamless travel packages designed for life-changing adventures across every continent.
          </p>

          <div className="hero-actions">
            <Link to="/packages" className="btn-primary" id="hero-browse-btn">
              <span>Browse All Packages</span>
              <ArrowRight size={18} />
            </Link>
            <a href="#featured" className="btn-secondary" id="hero-featured-btn">
              <span>View Highlights</span>
            </a>
          </div>

          {/* Value Props / Highlights */}
          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-icon">
                <Compass size={24} />
              </div>
              <div className="highlight-content">
                <h3>Curated Itineraries</h3>
                <p>Every single day is thoughtfully designed by veteran regional tour directors.</p>
              </div>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon">
                <Shield size={24} />
              </div>
              <div className="highlight-content">
                <h3>Safe & Verified</h3>
                <p>Accommodations and local transport strictly vetted for comfort and security.</p>
              </div>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon">
                <Award size={24} />
              </div>
              <div className="highlight-content">
                <h3>All-Inclusive Value</h3>
                <p>Transparent pricing covering accommodations, transport, and guided activities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="container" id="featured" style={{ paddingBottom: '4rem' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Destinations</h2>
            <p className="section-subtitle">Top-rated vacation packages ready for your next escape</p>
          </div>
          <Link to="/packages" className="view-all-link" id="home-view-all-link">
            <span>Explore all {packages.length > 0 ? `(${packages.length})` : ''}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Fetching featured packages..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchFeaturedPackages} />
        ) : (
          <div className="packages-grid">
            {displayPackages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
