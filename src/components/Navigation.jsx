import React, { useState, useEffect } from 'react';
import { signOut } from '../utils/storage';
import { AvatarImage } from './AvatarPicker';

export const Navigation = ({ currentUser, currentTheme, onThemeToggle, navigateTo, onLogoutSuccess }) => {
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const student = currentUser?.student || {};

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

  const handleMyProfile = () => {
    setFlyoutOpen(false);
    navigateTo('profile-detail', { id: currentUser.studentId });
  };

  return (
    <>
      {/* Top Bar for quick portals */}
      <div className="top-bar">
        <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Webmail</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Library</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Alumni</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Careers</a>
          {currentUser ? (
             <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Sign Out</a>
          ) : (
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('auth'); }} style={{ fontWeight: 'bold', color: 'var(--logo-gold)' }}>Sign In</a>
          )}
        </div>
      </div>

      <nav className="navbar glass ust-navbar">
        <div className="container navbar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <a href="#" className="navbar-logo" onClick={handleLogoClick} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src="/ua-logo.png" 
              alt="University of Antique Logo" 
              style={{ width: '45px', height: '45px', objectFit: 'contain' }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>University of Antique</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Transforming lives, building communities.</span>
            </div>
          </a>

          {/* Menu Items: Minimalist Hamburger Button (Flyout Trigger) */}
          <div className="navbar-menu" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {currentUser && (
              <div className="user-profile-btn" onClick={() => setFlyoutOpen(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden' }}>
                  <AvatarImage avatarId={student.avatarId || 'avatar-1'} id="nav-avatar" />
                </div>
              </div>
            )}
            <button 
              className="user-menu-btn hamburger-btn"
              onClick={() => setFlyoutOpen(true)}
              aria-label="Open Menu"
              style={{ width: '40px', height: '40px', justifyContent: 'center', padding: 0 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
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
              <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>Menu</span>
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
            {/* User Profile Info Card inside Flyout */}
            {currentUser && (
              <div className="flyout-user-info-card" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '1rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', textAlign: 'left' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', flexShrink: 0 }}>
                  <AvatarImage avatarId={student.avatarId || 'avatar-1'} id={`nav-avatar-${student.id || 'guest'}`} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="flyout-user-name" style={{ fontWeight: '700', fontSize: '0.9rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {student.name || currentUser.email}
                  </div>
                  <div className="flyout-user-email" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.email}
                  </div>
                </div>
              </div>
            )}

            <div className="flyout-nav-links" style={{ textAlign: 'left' }}>
              <a href="#" onClick={(e) => { e.preventDefault(); setFlyoutOpen(false); navigateTo('home'); }} className="flyout-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Home
              </a>
              
              <a href="#" onClick={(e) => { e.preventDefault(); setFlyoutOpen(false); navigateTo('programs-offered'); }} className="flyout-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
                Academics
              </a>

              <a href="#" onClick={(e) => { e.preventDefault(); setFlyoutOpen(false); navigateTo(currentUser ? 'directory' : 'auth'); }} className="flyout-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Admissions
              </a>
              
              {currentUser ? (
                 <>
                   {currentUser.isAdmin ? (
                     <>
                       <div 
                         style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--border-radius-sm)', margin: '0.5rem 0', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}
                       >
                         Registrar Staff Mode
                       </div>
                       <a href="#" onClick={(e) => { e.preventDefault(); setFlyoutOpen(false); navigateTo('office-admin'); }} className="flyout-link" style={{ color: 'var(--primary)', fontWeight: '600' }}>
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                           <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                           <line x1="9" y1="3" x2="9" y2="21" />
                           <line x1="15" y1="3" x2="15" y2="21" />
                           <line x1="3" y1="9" x2="21" y2="9" />
                           <line x1="3" y1="15" x2="21" y2="15" />
                         </svg>
                         Registrar Dashboard
                       </a>
                     </>
                   ) : (
                     <>
                       <a href="#" onClick={(e) => { e.preventDefault(); handleMyProfile(); }} className="flyout-link">
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                           <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                           <circle cx="12" cy="7" r="4" />
                         </svg>
                         My Record Profile
                       </a>
                       <a href="#" onClick={(e) => { e.preventDefault(); setFlyoutOpen(false); navigateTo('registrar-portal'); }} className="flyout-link" style={{ color: 'var(--primary)', fontWeight: '600' }}>
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                           <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                           <polyline points="14 2 14 8 20 8" />
                           <line x1="16" y1="13" x2="8" y2="13" />
                           <line x1="16" y1="17" x2="8" y2="17" />
                         </svg>
                         Registrar Portal
                       </a>
                     </>
                   )}
                   <a href="#" onClick={(e) => { e.preventDefault(); setFlyoutOpen(false); navigateTo('edit-profile'); }} className="flyout-link">
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                       <circle cx="12" cy="12" r="3" />
                       <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                     </svg>
                     Settings
                   </a>
                   <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="flyout-link" style={{ color: 'var(--danger)' }}>
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                       <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                     </svg>
                     Sign Out
                   </a>
                 </>
              ) : (
                <a href="#" onClick={(e) => { e.preventDefault(); setFlyoutOpen(false); navigateTo('auth'); }} className="flyout-link" style={{ color: 'var(--primary)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                  </svg>
                  Join / Sign In
                </a>
              )}
            </div>

            <hr className="flyout-divider" style={{ margin: '1.5rem 0' }} />

            <div className="flyout-section" style={{ textAlign: 'left' }}>
              <div className="flyout-section-title">Preference</div>
              <button 
                className="flyout-theme-btn" 
                onClick={() => { onThemeToggle(); }}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.85rem', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: 'var(--border-radius-md)', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s ease' }}
              >
                <span>{currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                <div className="theme-switch" role="switch" aria-checked={currentTheme === 'dark'}>
                  <div className="theme-switch-thumb">
                    {currentTheme === 'dark' ? (
                      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className="flyout-footer" style={{ textAlign: 'left' }}>
            <p>University of Antique</p>
            <span>Transforming lives, building sustainable communities.</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
