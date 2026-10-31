import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, AlertCircle, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import odysseyLogo from '../assets/odyssey-logo.svg';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-wrapper">
      <div className="auth-split-card">
        {/* Left Form Column (Sunnymiles Style) */}
        <div className="auth-split-form-col">
          <div className="auth-brand-logo-small">
            <img
              src={odysseyLogo}
              alt="Odyssey"
              style={{ height: '32px', width: 'auto' }}
            />
          </div>

          <h1 className="auth-main-headline">
            Begin your journey.
          </h1>
          <p className="auth-lead-paragraph">
            Sign up to unlock bespoke itineraries, save departure dates, and access member-only expedition rates.
          </p>

          {error && (
            <div className="alert-banner alert-banner-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-interactive-form">
            <div className="form-field-group">
              <label htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                type="text"
                placeholder="e.g. Eleanor Vance"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-field-group">
              <label htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="register-password">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="form-field-group">
              <label htmlFor="register-confirm-password">Confirm Password</label>
              <input
                id="register-confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-black"
              style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Creating Member Profile...' : 'Complete Registration'}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: '700', color: 'var(--text-primary)', textDecoration: 'underline' }}>
              Sign in instead
            </Link>
          </div>

          <div className="social-proof-strip">
            <div style={{ display: 'flex' }}>
              <div style={{ width: '28px', height: '28px', background: '#e2e8f0', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700' }}>OD</div>
              <div style={{ width: '28px', height: '28px', background: '#cbd5e1', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', marginLeft: '-8px' }}>50K</div>
            </div>
            <div className="social-proof-text">
              Join <strong>50,000+ conscious explorers</strong> exploring with Odyssey.
            </div>
          </div>
        </div>

        {/* Right Media Column */}
        <div className="auth-split-media">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
            alt="Scenic Mediterranean Coastline"
          />
          <div className="media-pinned-overlay">
            <div className="media-location-tag">
              <MapPin size={16} />
              <span>Amalfi Coast, Italy</span>
            </div>
            <div className="media-price-tag">
              From $1,750
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
