import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Auth from './pages/Auth';
import Home from './pages/Home';
import { AccountSettings } from './pages/AccountSettings';
import ProfileDetail from './pages/ProfileDetail';
import { RegistrarPortal } from './pages/RegistrarPortal';
import { getCurrentSession, getSessionData, getStudentById } from './utils/storage';
import { auth, isConfigured } from './utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  // Theme State
  const [theme, setTheme] = useState('dark');
  
  // Custom Navigation Router State
  // Format: { page: 'home' | 'auth' | 'registrar-portal' | 'profile-detail' | 'edit-profile', params: { id?: string } }
  const [route, setRoute] = useState({ page: 'home', params: {} });
  
  // Session Authentication State
  const [currentUser, setCurrentUser] = useState(null);


  // Sync session and theme on mount
  useEffect(() => {
    // 1. Session Setup
    let unsubscribe = () => {};
    
    if (isConfigured) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const sessionData = await getSessionData(firebaseUser);
            if (sessionData) {
              const student = await getStudentById(sessionData.studentId);
              setCurrentUser({
                ...sessionData,
                student
              });
            } else {
              setCurrentUser(null);
            }
          } catch (e) {
            console.error("Error setting session: ", e);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      });
    } else {
      setCurrentUser(getCurrentSession());
    }

    // 2. Theme Setup
    const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    return () => unsubscribe();
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
  const handleLoginSuccess = (userSession) => {
    if (isConfigured) {
      if (userSession) {
        setCurrentUser(userSession);
      }
    } else {
      setCurrentUser(getCurrentSession());
    }
  };

  const handleLogoutSuccess = () => {
    setCurrentUser(null);
  };

  // Sync avatar/name in navbar instantly when profile edits save
  const handleProfileUpdate = (updatedProfile) => {
    if (isConfigured) {
      if (currentUser && updatedProfile) {
        setCurrentUser({
          ...currentUser,
          student: updatedProfile
        });
      }
    } else {
      setCurrentUser(getCurrentSession());
    }
  };

  // Render active page component based on routing state
  const renderPage = () => {
    switch (route.page) {
      case 'home':
        return <Home navigateTo={navigateTo} currentUser={currentUser} />;
      case 'registrar-portal':
        return <RegistrarPortal navigateTo={navigateTo} currentUser={currentUser} />;
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
          <AccountSettings 
            currentUser={currentUser} 
            params={route.params}
            navigateTo={navigateTo} 
            onProfileUpdate={handleProfileUpdate}
            initialTab="profile"
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
      <footer className="footer ust-footer">
        <div className="container footer-grid">
          <div className="footer-col">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <img src="/ua-logo.png" alt="Logo" style={{ width: '30px', height: '30px' }} />
              University of Antique
            </h3>
            <p>Sibalom, Antique, 5713</p>
            <p>Philippines</p>
            <p>Phone: (036) 543-8571</p>
            <p>Email: info@antiquespride.edu.ph</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>About UA</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('programs-offered'); }}>Academics</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('directory'); }}>Admissions</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Research & Extension</a>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>University Library</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Alumni Relations</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Careers at UA</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Campus Map</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© {new Date().getFullYear()} University of Antique. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
