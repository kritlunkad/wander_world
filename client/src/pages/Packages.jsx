import React, { useEffect, useState } from 'react';
import { Search, DollarSign, RotateCcw, SlidersHorizontal, MapPin } from 'lucide-react';
import { getPackages } from '../services/packageService';
import PackageCard from '../components/packages/PackageCard';
import { LoadingState, ErrorState } from '../components/common/StatusStates';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter input states
  const [destinationInput, setDestinationInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');

  // Applied query filters
  const [filters, setFilters] = useState({ destination: '', maxPrice: '' });

  const fetchFilteredPackages = async (activeFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (activeFilters.destination.trim()) {
        params.destination = activeFilters.destination.trim();
      }
      if (activeFilters.maxPrice) {
        params.maxPrice = activeFilters.maxPrice;
      }
      const res = await getPackages(params);
      if (res && res.data) {
        setPackages(res.data);
      }
    } catch (err) {
      console.error('Error fetching packages list:', err);
      setError(err.response?.data?.message || 'Unable to retrieve packages from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredPackages(filters);
  }, [filters]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters({
      destination: destinationInput,
      maxPrice: maxPriceInput,
    });
  };

  const handleResetFilters = () => {
    setDestinationInput('');
    setMaxPriceInput('');
    setFilters({ destination: '', maxPrice: '' });
  };

  const hasActiveFilters = Boolean(filters.destination || filters.maxPrice);

  return (
    <div>
      {/* Editorial Header Bar */}
      <section className="catalog-header-bar">
        <div className="container">
          <span className="tag-badge" style={{ marginBottom: '0.75rem' }}>CURATED ITINERARIES</span>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
            Journeys & Travel Packages
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '640px' }}>
            Explore immersive multi-day expeditions, handpicked lodgings, and authentic cultural journeys across the globe.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Aventra Sharp Filter Strip */}
        <form onSubmit={handleSearchSubmit} className="filter-strip-card">
          <div className="filter-inputs-group">
            {/* Destination Search */}
            <div className="filter-input-box">
              <MapPin size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search destination (e.g. Japan, Italy, Bali)..."
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
              />
            </div>

            {/* Max Budget Search */}
            <div className="filter-input-box">
              <DollarSign size={16} color="var(--text-muted)" />
              <input
                type="number"
                placeholder="Maximum budget (USD)..."
                min="0"
                step="100"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-black" style={{ padding: '0.65rem 1.4rem' }}>
              <Search size={15} />
              <span>Filter Results</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn-white"
                style={{ padding: '0.65rem 1.15rem' }}
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing <strong>{packages.length}</strong> {packages.length === 1 ? 'Expedition' : 'Expeditions'}
          </div>
        </form>

        {/* Content Body / States */}
        {loading ? (
          <LoadingState message="Fetching expeditions..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchFilteredPackages(filters)} />
        ) : packages.length === 0 ? (
          <div className="state-container" style={{ background: '#fff', border: '1px solid var(--border-light)', margin: '2rem 0' }}>
            <h3 className="state-title">No Journeys Match Your Criteria</h3>
            <p className="state-desc" style={{ marginBottom: '1.5rem' }}>
              We could not find any available itineraries matching your active destination or budget filter.
            </p>
            <button onClick={handleResetFilters} className="btn-black">
              View All Expeditions
            </button>
          </div>
        ) : (
          <div className="packages-cards-grid">
            {packages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;
