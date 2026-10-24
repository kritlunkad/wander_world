import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertTriangle,
  Compass,
  DollarSign,
  Clock,
  Users,
  MapPin,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { getPackages, createPackage, updatePackage, deletePackage } from '../services/packageService';
import { LoadingState, ErrorState } from '../components/common/StatusStates';

const initialFormState = {
  title: '',
  destination: '',
  description: '',
  price: '',
  duration: '',
  maxGroupSize: 12,
  difficulty: 'Moderate',
  image: '',
  featured: false,
  included: 'Accommodation, Guided tours, Select meals, Local transportation',
  excluded: 'International flights, Personal travel insurance, Optional activities',
};

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Deletion confirmation State
  const [deletingId, setDeletingId] = useState(null);

  const fetchPackageList = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPackages();
      if (res && res.data) {
        setPackages(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin package list:', err);
      setError(err.response?.data?.message || 'Failed to load packages for administration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackageList();
  }, []);

  const openCreateModal = () => {
    setEditingPackageId(null);
    setFormData(initialFormState);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setEditingPackageId(pkg._id);
    setFormData({
      title: pkg.title || '',
      destination: pkg.destination || '',
      description: pkg.description || '',
      price: pkg.price || '',
      duration: pkg.duration || '',
      maxGroupSize: pkg.maxGroupSize || 12,
      difficulty: pkg.difficulty || 'Moderate',
      image: pkg.image || '',
      featured: Boolean(pkg.featured),
      included: Array.isArray(pkg.included) ? pkg.included.join(', ') : (pkg.included || ''),
      excluded: Array.isArray(pkg.excluded) ? pkg.excluded.join(', ') : (pkg.excluded || ''),
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (formSubmitting) return;
    setIsModalOpen(false);
    setEditingPackageId(null);
    setFormData(initialFormState);
    setFormError(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);

    try {
      // Parse payload
      const payload = {
        title: formData.title.trim(),
        destination: formData.destination.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        duration: Number(formData.duration),
        maxGroupSize: Number(formData.maxGroupSize) || 12,
        difficulty: formData.difficulty,
        image: formData.image.trim(),
        featured: Boolean(formData.featured),
        included: formData.included
          ? formData.included.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        excluded: formData.excluded
          ? formData.excluded.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (!payload.title || !payload.destination || !payload.description || !payload.image) {
        throw new Error('Please fill out all required fields (title, destination, description, cover image).');
      }

      if (isNaN(payload.price) || payload.price < 0) {
        throw new Error('Please enter a valid non-negative price.');
      }

      if (isNaN(payload.duration) || payload.duration < 1) {
        throw new Error('Duration must be at least 1 day.');
      }

      if (editingPackageId) {
        await updatePackage(editingPackageId, payload);
        setSuccessMessage('Package updated successfully!');
      } else {
        await createPackage(payload);
        setSuccessMessage('Package created successfully!');
      }

      closeModal();
      await fetchPackageList();

      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err) {
      console.error('Save package error:', err);
      setFormError(err.response?.data?.message || err.message || 'Failed to save package.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeletePackage = async (id) => {
    try {
      setDeletingId(id);
      await deletePackage(id);
      setPackages((prev) => prev.filter((p) => p._id !== id));
      setSuccessMessage('Package deleted successfully.');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (err) {
      console.error('Delete package error:', err);
      alert(err.response?.data?.message || 'Could not delete package.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Header Section */}
        <div className="section-header" style={{ marginBottom: '2rem' }}>
          <div>
            <div className="hero-badge" style={{ marginBottom: '0.75rem', background: 'rgba(244, 63, 94, 0.15)', borderColor: 'rgba(244, 63, 94, 0.35)', color: 'var(--accent-rose)' }}>
              <ShieldAlert size={14} />
              <span>Admin Management Portal</span>
            </div>
            <h1 className="section-title">Manage Tour Packages</h1>
            <p className="section-subtitle">
              Add new packages, update pricing & itineraries, or remove expired offerings.
            </p>
          </div>

          <button
            type="button"
            className="btn-primary"
            id="admin-create-package-btn"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            <span>Add New Package</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div
            className="admin-alert success"
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: 'var(--accent-emerald)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontWeight: 500,
            }}
          >
            <Check size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Table / Loading / Error */}
        {loading ? (
          <LoadingState message="Loading package records..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchPackageList} />
        ) : packages.length === 0 ? (
          <div className="state-container">
            <h3 className="state-title">No packages registered</h3>
            <p className="state-desc">Click "Add New Package" above to populate the catalog.</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Package Details</th>
                  <th>Destination</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg._id} id={`admin-pkg-row-${pkg._id}`}>
                    <td>
                      <div className="admin-pkg-cell">
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="admin-pkg-thumb"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=200&q=80';
                          }}
                        />
                        <div>
                          <div className="admin-pkg-title">{pkg.title}</div>
                          <div className="admin-pkg-meta">
                            Group: Max {pkg.maxGroupSize || 12} • {pkg.difficulty || 'Moderate'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={14} style={{ color: 'var(--accent-cyan)' }} />
                        <span>{pkg.destination}</span>
                      </div>
                    </td>
                    <td>{pkg.duration} Days</td>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        ${pkg.price?.toLocaleString()}
                      </strong>
                    </td>
                    <td>
                      {pkg.featured ? (
                        <span className="admin-status-badge featured">Featured</span>
                      ) : (
                        <span className="admin-status-badge standard">Standard</span>
                      )}
                    </td>
                    <td>
                      <div className="admin-actions-cell">
                        <button
                          type="button"
                          className="admin-action-btn edit"
                          onClick={() => openEditModal(pkg)}
                          id={`edit-pkg-btn-${pkg._id}`}
                          title="Edit package"
                        >
                          <Pencil size={15} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="admin-action-btn delete"
                          disabled={deletingId === pkg._id}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${pkg.title}"?`)) {
                              handleDeletePackage(pkg._id);
                            }
                          }}
                          id={`delete-pkg-btn-${pkg._id}`}
                          title="Delete package"
                        >
                          <Trash2 size={15} />
                          <span>{deletingId === pkg._id ? 'Deleting...' : 'Delete'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-card">
              <div className="admin-modal-header">
                <div>
                  <h2 className="admin-modal-title">
                    {editingPackageId ? 'Edit Tour Package' : 'Create New Package'}
                  </h2>
                  <p className="admin-modal-subtitle">
                    {editingPackageId
                      ? 'Modify existing pricing, destinations, or descriptions.'
                      : 'Fill in details to add a new vacation package to Wander World.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="admin-modal-close"
                  id="admin-modal-close-btn"
                >
                  <X size={20} />
                </button>
              </div>

              {formError && (
                <div
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(244, 63, 94, 0.15)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    color: 'var(--accent-rose)',
                    marginBottom: '1.25rem',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="admin-form">
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Package Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="e.g. Bali Tropical Paradise & Cultural Retreat"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Destination *</label>
                    <input
                      type="text"
                      name="destination"
                      required
                      placeholder="e.g. Bali, Indonesia"
                      value={formData.destination}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Trip Description *</label>
                  <textarea
                    name="description"
                    rows="3"
                    required
                    placeholder="Provide a compelling overview of what travelers will experience..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="admin-form-row three-col">
                  <div className="admin-form-group">
                    <label>Price (USD) *</label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      required
                      placeholder="1299"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Duration (Days) *</label>
                    <input
                      type="number"
                      name="duration"
                      min="1"
                      required
                      placeholder="7"
                      value={formData.duration}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Max Group Size</label>
                    <input
                      type="number"
                      name="maxGroupSize"
                      min="1"
                      placeholder="12"
                      value={formData.maxGroupSize}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Difficulty</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Challenging">Challenging</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Cover Image URL *</label>
                    <input
                      type="url"
                      name="image"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Included Amenities (Comma-separated)</label>
                  <input
                    type="text"
                    name="included"
                    placeholder="Accommodation, Guided tours, Select meals"
                    value={formData.included}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Excluded Items (Comma-separated)</label>
                  <input
                    type="text"
                    name="excluded"
                    placeholder="International flights, Personal travel insurance"
                    value={formData.excluded}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="admin-form-checkbox-row">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                    />
                    <span>Feature this tour on the homepage</span>
                  </label>
                </div>

                <div className="admin-modal-actions">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary"
                    disabled={formSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    id="admin-submit-package-btn"
                    disabled={formSubmitting}
                  >
                    {formSubmitting
                      ? 'Saving...'
                      : editingPackageId
                      ? 'Update Package'
                      : 'Create Package'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPackages;
