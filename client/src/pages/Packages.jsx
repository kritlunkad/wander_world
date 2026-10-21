import React, { useEffect, useState } from 'react';
import { Package, Search, Filter } from 'lucide-react';
import { getPackages } from '../services/packageService';
import PackageCard from '../components/packages/PackageCard';
import { LoadingState, ErrorState } from '../components/common/StatusStates';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPackages();
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
    fetchAllPackages();
  }, []);

  return (
    <div className="packages-page" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
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
            Showing <strong>{packages.length}</strong> available packages
          </div>
        </div>

        {/* Loading / Error / Grid States */}
        {loading ? (
          <LoadingState message="Loading available packages..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchAllPackages} />
        ) : packages.length === 0 ? (
          <div className="state-container">
            <h3 className="state-title">No packages found</h3>
            <p className="state-desc">Please ensure the database has been seeded with initial packages.</p>
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
