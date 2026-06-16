import React, { useState, useEffect } from 'react';
import { signOut } from '../utils/storage';

export const Navigation = ({ currentUser, currentTheme, onThemeToggle, navigateTo, onLogoutSuccess }) => {
  const [flyoutOpen, setFlyoutOpen] = useState(false);

  useEffect(() => {
    if (!flyoutOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setFlyoutOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flyoutOpen]);

  const handleLogout = () => {
    signOut();
    setFlyoutOpen(false);
    onLogoutSuccess();
    navigateTo('home');
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setFlyoutOpen(false);
    navigateTo('home');
  };

  const handleProfileEdit = () => {
    setFlyoutOpen(false);
    navigateTo('edit-profile');
  };

  const handleMyProfile = () => {
    setFlyoutOpen(false);
    navigateTo('profile-detail', { id: currentUser.studentId });
  };

  return (
    <>
      <nav className="navbar glass">
        <div className="container navbar-container">
          {/* Logo with clean UA Logo Image */}
          <a href="#" className="navbar-logo" onClick={handleLogoClick} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img 
              src="/ua-logo.png" 
              alt="University of Antique Logo" 
              style={{ width: '34px', height: '34px', objectFit: 'contain' }} 
            />
            <span>PortfolioHub</span>
          </a>

          {/* Menu Items: Minimalist Hamburger Button */}
          <div className="navbar-menu">
            <button 
              className="user-menu-btn hamburger-btn"
              onClick={() => setFlyoutOpen(true)}
              aria-label="Open Menu"
              style={{ width: '36px', height: '36px', justifyContent: 'center', padding: 0 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Flyout Side Menu */}
      <div 
        className={`flyout-overlay ${flyoutOpen ? 'open' : ''}`} 
        onClick={() => setFlyoutOpen(false)}
      >
        <div className="flyout-menu glass" onClick={(e) => e.stopPropagation()}>
          <div className="flyout-header">
            <div className="navbar-logo" style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img 
                src="/ua-logo.png" 
                alt="University of Antique Logo" 
                style={{ width: '34px', height: '34px', objectFit: 'contain' }} 
              />
              <span>PortfolioHub</span>
            </div>
            <button 
              className="flyout-close" 
              onClick={() => setFlyoutOpen(false)}
              aria-label="Close Menu"
            >
              &times;
            </button>
          </div>

          <div className="flyout-content">
            <div className="flyout-nav-links">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setFlyoutOpen(false); navigateTo('home'); }}
                className="flyout-link"
              >
                Home
              </a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setFlyoutOpen(false); navigateTo(currentUser ? 'directory' : 'auth'); }}
                className="flyout-link"
              >
                Browse Portfolios
              </a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setFlyoutOpen(false); navigateTo('office-promotion'); }}
                className="flyout-link"
              >
                Bachelor of Science in Office Administration (BSOA)
              </a>
              
              {currentUser ? (
                <>
                  {currentUser.isAdmin ? (
                    <>
                      <div 
                        style={{ 
                          padding: '0.4rem 0.75rem', 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          color: 'var(--accent)', 
                          background: 'var(--danger-bg)', 
                          border: '1px solid var(--danger-border)',
                          borderRadius: 'var(--border-radius-sm)', 
                          marginBottom: '0.75rem', 
                          display: 'block',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          textAlign: 'center'
                        }}
                      >
                        Admin Maintenance Mode
                      </div>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); setFlyoutOpen(false); navigateTo('office-admin'); }}
                        className="flyout-link"
                        style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.75rem' }}
                      >
                        Office Administration
                      </a>
                    </>
                  ) : (
                    <>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleMyProfile(); }}
                        className="flyout-link"
                      >
                        My Profile
                      </a>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleProfileEdit(); }}
                        className="flyout-link"
                      >
                        Edit Settings
                      </a>
                    </>
                  )}
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setFlyoutOpen(false); navigateTo('security-settings'); }}
                    className="flyout-link"
                  >
                    Account Security
                  </a>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handleLogout(); }}
                    className="flyout-link"
                    style={{ color: 'var(--danger)' }}
                  >
                    Sign Out
                  </a>
                </>
              ) : (
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); setFlyoutOpen(false); navigateTo('auth'); }}
                  className="flyout-link"
                >
                  Join / Sign In
                </a>
              )}
            </div>

            <hr className="flyout-divider" />

            {/* Theme Selector inside Flyout */}
            <div className="flyout-section">
              <div className="flyout-section-title">Preference</div>
              <button 
                className="flyout-theme-btn" 
                onClick={() => { onThemeToggle(); }}
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: '0.5rem', 
                  minHeight: '40px',
                  padding: '0.5rem 0.75rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}
              >
                <span>{currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                <div className="theme-switch" role="switch" aria-checked={currentTheme === 'dark'}>
                  <div className="theme-switch-thumb">
                    {currentTheme === 'dark' ? (
                      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="flyout-footer">
            <p>University of Antique</p>
            <span>Transforming lives, building sustainable communities.</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default Navigation;
