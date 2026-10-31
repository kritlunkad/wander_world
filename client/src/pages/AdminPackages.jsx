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
  Image as ImageIcon
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
  included: 'Luxury boutique accommodation, Private transportation, Daily breakfasts, Certified historian tour guide',
  excluded: 'International flights, Personal travel insurance, Discretionary gratuities',
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
      setError(err.response?.data?.message || 'Failed to retrieve package catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackageList();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingPackageId(null);
    setFormData(initialFormState);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg) => {
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
      included: Array.isArray(pkg.included) ? pkg.included.join(', ') : pkg.included || '',
      excluded: Array.isArray(pkg.excluded) ? pkg.excluded.join(', ') : pkg.excluded || '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
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

    if (!formData.title || !formData.destination || !formData.description || !formData.price || !formData.duration || !formData.image) {
      setFormError('Please fill out all required fields.');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        maxGroupSize: Number(formData.maxGroupSize),
        included: formData.included.split(',').map((s) => s.trim()).filter(Boolean),
        excluded: formData.excluded.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingPackageId) {
        await updatePackage(editingPackageId, payload);
        setSuccessMessage('Package updated successfully.');
      } else {
        await createPackage(payload);
        setSuccessMessage('New journey expedition created.');
      }

      handleCloseModal();
      fetchPackageList();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Error saving package:', err);
      setFormError(err.response?.data?.message || 'Failed to persist package data.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deletePackage(id);
      setSuccessMessage('Expedition deleted.');
      fetchPackageList();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Error deleting package:', err);
      alert(err.response?.data?.message || 'Failed to delete package.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        {/* Header Bar */}
        <div className="admin-header-strip">
          <div>
            <span className="tag-badge" style={{ marginBottom: '0.5rem' }}>ADMINISTRATION</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>
              Manage Tour Expeditions
            </h1>
          </div>
          <button onClick={handleOpenCreateModal} className="btn-black">
            <Plus size={16} />
            <span>Add New Journey</span>
          </button>
        </div>

        {successMessage && (
          <div className="alert-banner alert-banner-success">
            <Check size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {loading ? (
          <LoadingState message="Loading catalog..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchPackageList} />
        ) : (
          <div className="clean-table-box">
            <table className="clean-table">
              <thead>
                <tr>
                  <th>Expedition</th>
                  <th>Destination</th>
                  <th>Duration</th>
                  <th>Group</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ color: 'var(--text-primary)', display: 'block' }}>{pkg.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{pkg._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td>{pkg.destination}</td>
                    <td>{pkg.duration} Days</td>
                    <td>Max {pkg.maxGroupSize || 12}</td>
                    <td><strong>${pkg.price?.toLocaleString()}</strong></td>
                    <td>
                      {pkg.featured ? (
                        <span className="tag-badge tag-badge-dark">TOP SELLER</span>
                      ) : (
                        <span className="tag-badge">STANDARD</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenEditModal(pkg)}
                          className="btn-white"
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                          title="Edit Journey"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${pkg.title}"?`)) {
                              handleDelete(pkg._id);
                            }
                          }}
                          className="btn-white"
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', color: 'var(--color-red)' }}
                          title="Delete Journey"
                          disabled={deletingId === pkg._id}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Window */}
        {isModalOpen && (
          <div className="modal-overlay-custom">
            <div className="modal-content-custom">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  {editingPackageId ? 'Edit Journey Details' : 'Create New Expedition'}
                </h3>
                <button onClick={handleCloseModal} style={{ padding: '0.25rem' }}>
                  <X size={20} />
                </button>
              </div>

              {formError && (
                <div className="alert-banner alert-banner-error">
                  <AlertTriangle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-field-group">
                  <label>Expedition Title *</label>
                  <input
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Japan Express: Osaka to Tokyo"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-field-group">
                    <label>Destination *</label>
                    <input
                      name="destination"
                      type="text"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="e.g. Kyoto, Japan"
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Price (USD) *</label>
                    <input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="1259"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-field-group">
                    <label>Duration (Days) *</label>
                    <input
                      name="duration"
                      type="number"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="9"
                      min="1"
                      required
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Max Group Size</label>
                    <input
                      name="maxGroupSize"
                      type="number"
                      value={formData.maxGroupSize}
                      onChange={handleInputChange}
                      placeholder="12"
                      min="1"
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Difficulty</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Challenging">Challenging</option>
                    </select>
                  </div>
                </div>

                <div className="form-field-group">
                  <label>Hero Image URL *</label>
                  <input
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/photo-..."
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label>Trip Description *</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detailed overview of the journey experience..."
                    style={{ border: '1px solid var(--border-light)', padding: '0.75rem', fontFamily: 'inherit', resize: 'vertical' }}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label>Included Services (Comma separated)</label>
                  <input
                    name="included"
                    type="text"
                    value={formData.included}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-field-group">
                  <label>Excluded Items (Comma separated)</label>
                  <input
                    name="excluded"
                    type="text"
                    value={formData.excluded}
                    onChange={handleInputChange}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="featured-pkg-chk"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <label htmlFor="featured-pkg-chk" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    Mark as Top Seller / Featured Expedition
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={handleCloseModal} className="btn-white">
                    Cancel
                  </button>
                  <button type="submit" className="btn-black" disabled={formSubmitting}>
                    {formSubmitting ? 'Saving...' : editingPackageId ? 'Update Expedition' : 'Publish Expedition'}
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
