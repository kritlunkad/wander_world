import React from 'react';
import { RefreshCw } from 'lucide-react';

export const LoadingState = ({ message = 'Loading adventures...' }) => {
  return (
    <div className="state-container" id="loading-state">
      <div className="spinner"></div>
      <h3 className="state-title">{message}</h3>
      <p className="state-desc">Fetching the latest curated packages from our servers.</p>
    </div>
  );
};

export const ErrorState = ({ message = 'Failed to load packages.', onRetry }) => {
  return (
    <div className="state-container" id="error-state">
      <div className="error-icon-box">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 className="state-title">Something went wrong</h3>
      <p className="state-desc">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary" id="retry-btn">
          <RefreshCw size={18} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
