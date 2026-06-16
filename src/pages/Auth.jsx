import React, { useState } from 'react';
import { signIn, signUp, resetUserPasswordByEmail, signInWithGoogle } from '../utils/storage';
import { isConfigured } from '../utils/firebase';

export const Auth = ({ navigateTo, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot Password States
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [newForgotPass, setNewForgotPass] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);

  const handleSendForgotCode = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess(false);

    if (!forgotEmail.trim()) {
      setForgotError('Please enter your email address.');
      return;
    }

    if (isConfigured) {
      try {
        await resetUserPasswordByEmail(forgotEmail, "");
        setForgotSuccess(true);
        alert(`A password reset link has been sent to your email address: ${forgotEmail}. Please check your inbox.`);
        setTimeout(() => {
          setShowForgot(false);
          setForgotSuccess(false);
          setForgotEmail('');
        }, 2000);
      } catch (err) {
        setForgotError(err.message || 'Failed to send reset email.');
      }
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setForgotStep(2);
    alert(`DEMO BANNER: A password reset verification code was sent to ${forgotEmail}.\n\nYour 6-digit verification code is: ${code}`);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    
    if (forgotCode !== sentCode) {
      setForgotError('Invalid verification code. Please check the alert code.');
      return;
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}/;
    if (!passwordRegex.test(newForgotPass)) {
      setForgotError('Password must be at least 8 characters and contain 1 uppercase letter, 1 number, and 1 special character.');
      return;
    }

    try {
      await resetUserPasswordByEmail(forgotEmail, newForgotPass);
      setForgotSuccess(true);
      setTimeout(() => {
        setShowForgot(false);
        setForgotSuccess(false);
        setForgotEmail('');
        setForgotCode('');
        setSentCode('');
        setNewForgotPass('');
        setForgotStep(1);
      }, 2000);
    } catch (err) {
      setForgotError(err.message || 'Failed to reset password.');
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Check validity of form controls
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      return;
    }

    try {
      if (isLogin) {
        const session = await signIn(email, password);
        onLoginSuccess(session.user);
        navigateTo('directory');
      } else {
        const session = await signUp(name, email, password);
        onLoginSuccess(session.user);
        // Navigate straight to profile creator/editor page for newly registered students!
        navigateTo('edit-profile');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    try {
      const session = await signInWithGoogle();
      onLoginSuccess(session.user);
      if (session.student && session.student.major !== 'Undeclared') {
        navigateTo('directory');
      } else {
        navigateTo('edit-profile');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Google authentication failed.');
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-centered-wrapper animate-fade-in">
        <div 
          className="auth-logo-wrapper" 
          onClick={() => navigateTo('home')} 
        >
          <img 
            src="/ua-logo.png" 
            alt="University of Antique Logo" 
            className="auth-logo-img animate-slide-up"
          />
          <span className="auth-logo-title animate-slide-up-delay-1">PortfolioHub</span>
        </div>

        <div className="auth-card animate-slide-up-delay-1">
          <div className="auth-header">
            <h1>{isLogin ? 'Welcome back!' : "Let's get started!"}</h1>
            <p className="auth-subtitle">
              {isLogin ? (
                <>
                  Don't have an profile?{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); handleToggleMode(); }}>
                    Sign up
                  </a>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); handleToggleMode(); }}>
                    Log in
                  </a>
                </>
              )}
            </p>
          </div>

          {errorMessage && (
            <div className="auth-msg auth-msg-error">
              {errorMessage}
            </div>
          )}

          {isConfigured && (
            <div className="auth-sso-group">
              <button className="auth-btn-sso" onClick={handleGoogleSignIn}>
                <svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24c0-1.55-.15-3.24-.47-4.75H24v9.03h12.75c-.53 2.87-2.14 5.3-4.54 6.92l7.12 5.52C43.5 36.42 46.5 30.76 46.5 24z"/><path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.12-5.52c-1.97 1.32-4.59 2.13-8.77 2.13-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Continue with Google
              </button>
              
              <button className="auth-btn-sso" type="button" onClick={() => alert('SSO login flow initiated.')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', marginRight: '4px' }}>
                  <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-1.8-3-4-3-2.87 0-5 2.2-5 5 0 .34.04.68.12 1A4.5 4.5 0 0 0 2 18.5c0 2.49 2.01 4.5 4.5 4.5h11z" />
                </svg>
                Continue with SSO
              </button>

              {isLogin && (
                <button className="auth-btn-sso" type="button" onClick={async () => {
                  setEmail('admin@university.edu');
                  setPassword('Admin123!');
                  setErrorMessage('');
                  try {
                    const session = await signIn('admin@university.edu', 'Admin123!');
                    onLoginSuccess(session.user);
                    navigateTo('directory');
                  } catch (err) {
                    setErrorMessage(err.message);
                  }
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', marginRight: '4px' }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Log in with SSO (Admin)
                </button>
              )}

              <div className="auth-divider">
                <span>or</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="auth-input-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength="50"
                />
              </div>
            )}

            <div className="auth-input-group">
              <input
                type="email"
                placeholder="Student email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="auth-input-group">
              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  minLength={8}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round"/><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-btn-primary"
              disabled={!email || !password || password.length < 8}
            >
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          {isLogin && (
            <div className="auth-forgot-link-wrapper">
              <a href="#" onClick={(e) => { e.preventDefault(); setShowForgot(true); setForgotStep(1); setForgotError(''); }}>
                Forgot Password?
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="auth-bottom-help">
        <a href="#" onClick={(e) => { e.preventDefault(); alert("Need help? Please contact support@university.edu"); }}>
          Need help?
        </a>
      </div>

      {/* Forgot Password Overlay Modal */}
      {showForgot && (
        <div className="auth-modal-overlay" onClick={() => setShowForgot(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <h2>Reset Password</h2>
              <p>{forgotStep === 1 ? 'Enter your email address to receive a verification code.' : 'Enter the verification code and your new password.'}</p>
            </div>

            {forgotError && <div className="auth-msg auth-msg-error">{forgotError}</div>}
            {forgotSuccess && <div className="auth-msg auth-msg-success">Password reset successful!</div>}

            {forgotStep === 1 ? (
              <form onSubmit={handleSendForgotCode}>
                <div className="auth-input-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                <div className="auth-modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForgot(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ minHeight: '40px' }}>Send Code</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="auth-input-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Verification Code</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    required
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value)}
                  />
                </div>
                <div className="auth-input-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    required
                    value={newForgotPass}
                    onChange={(e) => setNewForgotPass(e.target.value)}
                  />
                </div>
                <div className="auth-modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setForgotStep(1)}>Back</button>
                  <button type="submit" className="btn btn-primary" style={{ minHeight: '40px' }}>Reset Password</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default Auth;
