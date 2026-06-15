import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Directory from './pages/Directory';
import ProfileDetail from './pages/ProfileDetail';
import Auth from './pages/Auth';
import ProfileEditor from './pages/ProfileEditor';
import Home from './pages/Home';
import { getCurrentSession } from './utils/storage';

function App() {
  // Theme State
  const [theme, setTheme] = useState('dark');
  
  // Custom Navigation Router State
  // Format: { page: 'home' | 'directory' | 'profile-detail' | 'auth' | 'edit-profile', params: { id?: string } }
  const [route, setRoute] = useState({ page: 'home', params: {} });
  
  // Session Authentication State
  const [currentUser, setCurrentUser] = useState(null);

  // Sync session and theme on mount
  useEffect(() => {
    // 1. Session Setup
    setCurrentUser(getCurrentSession());

    // 2. Theme Setup
    const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Theme toggle action
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('portfolio_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Centralized Navigation function
  const navigateTo = (page, params = {}) => {
    if (!document.startViewTransition) {
      setRoute({ page, params });
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    
    document.startViewTransition(() => {
      setRoute({ page, params });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  };

  // Auth Callbacks
  const handleLoginSuccess = (user) => {
    setCurrentUser(getCurrentSession());
  };

  const handleLogoutSuccess = () => {
    setCurrentUser(null);
  };

  // Sync avatar/name in navbar instantly when profile edits save
  const handleProfileUpdate = () => {
    setCurrentUser(getCurrentSession());
  };

  // Render active page component based on routing state
  const renderPage = () => {
    switch (route.page) {
      case 'home':
        return <Home navigateTo={navigateTo} currentUser={currentUser} />;
      case 'directory':
        return <Directory navigateTo={navigateTo} currentUser={currentUser} />;
      case 'profile-detail':
        return (
          <ProfileDetail 
            params={route.params} 
            currentUser={currentUser} 
            navigateTo={navigateTo} 
            onLogoutSuccess={handleLogoutSuccess}
          />
        );
      case 'auth':
        return (
          <Auth 
            navigateTo={navigateTo} 
            onLoginSuccess={handleLoginSuccess} 
          />
        );
      case 'edit-profile':
        return (
          <ProfileEditor 
            currentUser={currentUser} 
            params={route.params}
            navigateTo={navigateTo} 
            onProfileUpdate={handleProfileUpdate} 
          />
        );
      default:
        return <Home navigateTo={navigateTo} currentUser={currentUser} />;
    }
  };

  return (
    <>
      {/* Sticky Navigation Bar */}
      <Navigation
        currentUser={currentUser}
        currentTheme={theme}
        onThemeToggle={toggleTheme}
        navigateTo={navigateTo}
        onLogoutSuccess={handleLogoutSuccess}
      />

      {/* Main Page Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div key={route.page} className="page-transition-wrapper">
          {renderPage()}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} PortfolioHub. Designed for student projects and connections.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
