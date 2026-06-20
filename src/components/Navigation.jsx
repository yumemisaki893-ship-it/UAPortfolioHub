import { useState, useEffect } from 'react';
import { signOut } from '../utils/storage';
import { AvatarImage } from './AvatarPicker';

export const Navigation = ({ currentUser, currentTheme, onThemeToggle, navigateTo, onLogoutSuccess, currentPage }) => {
  const [flyoutOpen, setFlyoutOpen] = useState(false);

  useEffect(() => {
    if (!flyoutOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setFlyoutOpen(false);
    };

    // Prevent body scroll when flyout is open
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
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

  const handleMyProfile = () => {
    setFlyoutOpen(false);
    navigateTo('profile-detail', { id: currentUser.studentId });
  };

  const handleNav = (page, params = {}) => {
    setFlyoutOpen(false);
    navigateTo(page, params);
  };

  const isActive = (page) => currentPage === page;

  return (
    <>
      <nav className="navbar glass">
        <div className="container navbar-container">
          {/* Logo */}
          <a href="#" className="navbar-logo" onClick={handleLogoClick} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img 
              src="/ua-logo.svg" 
              alt="University of Antique Logo" 
              style={{ width: '34px', height: '34px', objectFit: 'contain' }} 
            />
            <span>PortfolioHub</span>
          </a>

          {/* Right side: User avatar + Hamburger (Minimalist Navbar) */}
          <div className="navbar-menu">
            {/* User avatar (logged in only) - direct shortcut to profile or admin */}
            {currentUser && (
              <button 
                className="user-menu-btn"
                onClick={() => {
                  if (currentUser.isAdmin) {
                    navigateTo('office-admin');
                  } else {
                    navigateTo('profile-detail', { id: currentUser.studentId });
                  }
                }}
                aria-label={currentUser.isAdmin ? "Go to Admin Panel" : "Go to My Profile"}
                style={{ padding: '0.25rem', borderRadius: '50%', width: '36px', height: '36px', justifyContent: 'center' }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  textTransform: 'uppercase'
                }}>
                  {(currentUser.student?.name || currentUser.name || 'U').charAt(0).toUpperCase()}
                </div>
              </button>
            )}

            {/* Hamburger */}
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
        <div className="flyout-menu" onClick={(e) => e.stopPropagation()}>
          <div className="flyout-header">
            <div className="navbar-logo" style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img 
                src="/ua-logo.svg" 
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* User Info Section (when logged in) */}
          {currentUser && (
            <div className="flyout-user-section">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                display: 'flex'
              }}>
                <AvatarImage 
                  avatarId={currentUser.student?.avatarId || 'avatar-1'} 
                  id={`flyout-avatar-${currentUser.studentId || 'admin'}`} 
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flyout-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.student?.name || currentUser.name || 'User'}
                </div>
                <div className="flyout-user-email" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.email}
                </div>
              </div>
            </div>
          )}

          <div className="flyout-content">
            <div className="flyout-nav-links">
              {/* Home */}
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); handleNav('home'); }}
                className={`flyout-link ${isActive('home') ? 'active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flyout-link-icon">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Home
              </a>

              {/* Browse Portfolios */}
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); handleNav(currentUser ? 'directory' : 'auth'); }}
                className={`flyout-link ${isActive('directory') ? 'active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flyout-link-icon">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                Browse Portfolios
              </a>


              {/* BSOAD */}
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); handleNav('office-promotion'); }}
                className={`flyout-link ${isActive('office-promotion') ? 'active' : ''}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flyout-link-icon">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
                BSOAD Program
              </a>
              
              {currentUser ? (
                <>
                  {currentUser.isAdmin ? (
                    <>
                      <hr className="flyout-divider" />
                      <div 
                        style={{ 
                          padding: '0.4rem 0.75rem', 
                          fontSize: '0.7rem', 
                          fontWeight: 700, 
                          color: 'var(--accent)', 
                          background: 'var(--danger-bg)', 
                          border: '1px solid var(--danger-border)',
                          borderRadius: 'var(--border-radius-sm)', 
                          display: 'block',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          textAlign: 'center'
                        }}
                      >
                        Admin Panel
                      </div>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleNav('office-admin'); }}
                        className={`flyout-link ${isActive('office-admin') ? 'active' : ''}`}
                        style={{ color: 'var(--primary)', fontWeight: '600' }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flyout-link-icon">
                          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Office Administration
                      </a>
                    </>
                  ) : (
                    <>
                      <hr className="flyout-divider" />
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); handleMyProfile(); }}
                        className={`flyout-link ${isActive('profile-detail') ? 'active' : ''}`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flyout-link-icon">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        My Profile
                      </a>
                    </>
                  )}

                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handleNav('edit-profile'); }}
                    className={`flyout-link ${isActive('edit-profile') ? 'active' : ''}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flyout-link-icon">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Settings
                  </a>

                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handleLogout(); }}
                    className="flyout-link"
                    style={{ color: 'var(--danger)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flyout-link-icon">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </a>
                </>
              ) : (
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleNav('auth'); }}
                  className="flyout-link"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flyout-link-icon">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
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
