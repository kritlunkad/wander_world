import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import odysseyLogo from '../assets/odyssey-logo.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message || err.message || 'Login failed. Please verify your credentials.';
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
            Your next expedition starts here.
          </h1>
          <p className="auth-lead-paragraph">
            Sign in to unlock private itineraries, manage your reservations, and access confirmed departure dates.
          </p>

          {/* Social Auth Mock Buttons */}
          <div className="social-auth-list">
            <button
              type="button"
              className="social-button-item"
              onClick={() => setError('Direct social login integration active soon. Please use email & password.')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              className="social-button-item"
              onClick={() => setError('Direct social login integration active soon. Please use email & password.')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.59-.72.99-1.72.88-2.72-.85.03-1.88.57-2.49 1.28-.54.62-.99 1.63-.88 2.62.96.07 1.91-.46 2.49-1.18z" />
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="auth-divider-line">
            <span>or sign in with email</span>
          </div>

          {error && (
            <div className="alert-banner alert-banner-error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-interactive-form">
            <div className="form-field-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
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
                <label htmlFor="login-password">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-black"
              style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Don’t have an account?{' '}
            <Link to="/register" style={{ fontWeight: '700', color: 'var(--text-primary)', textDecoration: 'underline' }}>
              Create an account
            </Link>
          </div>

          {/* Social Proof Footer (Sunnymiles Style) */}
          <div className="social-proof-strip">
            <div style={{ display: 'flex' }}>
              <div style={{ width: '28px', height: '28px', background: '#e2e8f0', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700' }}>OD</div>
              <div style={{ width: '28px', height: '28px', background: '#cbd5e1', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '700', marginLeft: '-8px' }}>50K</div>
            </div>
            <div className="social-proof-text">
              <strong>50,000+ travelers</strong> have joined Odyssey expeditions.
            </div>
          </div>
        </div>

        {/* Right Media Column (Sunnymiles Destination Photo) */}
        <div className="auth-split-media">
          <img
            src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80"
            alt="Manarola Cinque Terre Italy"
          />
          <div className="media-pinned-overlay">
            <div className="media-location-tag">
              <MapPin size={16} />
              <span>Manarola, Cinque Terre Italy</span>
            </div>
            <div className="media-price-tag">
              From $1,420
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
