import React, { useEffect, useState } from 'react';
import { Package, Search, DollarSign, RotateCcw } from 'lucide-react';
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
    <div className="packages-page" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '2rem' }}>
          <div>
            <div className="hero-badge" style={{ marginBottom: '0.75rem' }}>
              <Package size={14} />
              <span>Catalog & Itineraries</span>
            </div>
            <h1 className="section-title">Explore All Tour Packages</h1>
            <p className="section-subtitle">
              Browse authentic packages loaded with immersive day-by-day itineraries.
            </p>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Showing <strong>{packages.length}</strong> {packages.length === 1 ? 'package' : 'packages'}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="packages-filter-bar" style={{ marginBottom: '2.5rem' }}>
          <form onSubmit={handleSearchSubmit} className="filter-form">
            <div className="filter-input-group">
              <Search size={18} className="filter-icon" />
              <input
                type="text"
                className="filter-input"
                id="filter-destination"
                placeholder="Search by destination (e.g. Bali, Swiss, Japan)..."
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
              />
            </div>

            <div className="filter-input-group filter-price-group">
              <DollarSign size={18} className="filter-icon" />
              <input
                type="number"
                min="0"
                step="50"
                className="filter-input"
                id="filter-max-price"
                placeholder="Max price (USD)"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary filter-submit-btn" id="filter-submit-btn">
              <span>Apply Filters</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn-secondary filter-reset-btn"
                id="filter-reset-btn"
                title="Reset filters"
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            )}
          </form>

          {hasActiveFilters && (
            <div className="active-filter-tags">
              <span className="filter-tag-label">Active filters:</span>
              {filters.destination && (
                <span className="filter-tag">
                  Destination: <strong>"{filters.destination}"</strong>
                </span>
              )}
              {filters.maxPrice && (
                <span className="filter-tag">
                  Max Price: <strong>${Number(filters.maxPrice).toLocaleString()}</strong>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading / Error / Grid States */}
        {loading ? (
          <LoadingState message="Loading packages..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchFilteredPackages(filters)} />
        ) : packages.length === 0 ? (
          <div className="state-container">
            <h3 className="state-title">No matching packages found</h3>
            <p className="state-desc">
              {hasActiveFilters
                ? 'Try adjusting your destination keyword or increasing the maximum price.'
                : 'Please ensure the database has been seeded with packages.'}
            </p>
            {hasActiveFilters && (
              <button onClick={handleResetFilters} className="btn-secondary" style={{ marginTop: '1rem' }}>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="packages-grid">
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

