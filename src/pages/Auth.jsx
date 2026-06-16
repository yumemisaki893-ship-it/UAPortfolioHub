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
    <div className="auth-split-container">
      <div className="auth-left-panel">
        <div 
          className="auth-logo-header" 
          onClick={() => navigateTo('home')} 
          style={{ cursor: 'pointer' }}
        >
          <img src="/ua-logo.png" alt="University of Antique Logo" className="auth-logo-img" />
          <span className="auth-logo-text">UA Portfolio Hub</span>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h1>{isLogin ? 'Welcome Back' : 'Create Student Account'}</h1>
            <p>{isLogin ? 'Sign in to manage your student portfolio showcase' : 'Register to build and customize your personal portfolio'}</p>
          </div>

          {errorMessage && (
            <div 
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--border-radius-sm)',
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                color: 'var(--danger)',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}
            >
              ❌ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate={false}>
            {/* Full Name Input (Sign Up Only) */}
            {!isLogin && (
              <div className="form-group">
                <label className="form-label" htmlFor="register-name">Full Name</label>
                <input
                  type="text"
                  id="register-name"
                  className="form-control"
                  placeholder="E.g., Jane Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  maxLength="50"
                />
                <div className="form-error-msg">Please enter your full name.</div>
              </div>
            )}

            {/* Email Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">Email Address</label>
              <span className="form-hint" id="email-hint">Format: student@gmail.com</span>
              <input
                type="email"
                id="auth-email"
                className="form-control"
                placeholder="you@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                aria-describedby="email-hint"
              />
              <div className="form-error-msg">❌ Please enter a valid email address.</div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">Password</label>
              
              {/* Show password rules list above input for Sign-up only */}
              {!isLogin && (
                <ul className="password-rules" id="password-rules">
                  <li>🔑 Password Complexity Requirements:</li>
                  <li>• At least 8 characters</li>
                  <li>• One uppercase letter (A-Z)</li>
                  <li>• One numeric digit (0-9)</li>
                  <li>• One special character (e.g. !, @, #, $, %)</li>
                </ul>
              )}

              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="auth-password"
                  className="form-control"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  minLength={8}
                  // Regex validation for complexity: 8+ chars, 1 uppercase, 1 number, 1 special char
                  pattern={isLogin ? undefined : "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W_]).{8,}"}
                  aria-describedby={!isLogin ? "password-rules" : undefined}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    /* Eye Off Icon */
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    /* Eye Icon */
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
              <div className="form-error-msg">
                ❌ Password {isLogin ? 'is required.' : 'must be at least 8 characters and include 1 uppercase letter, 1 number, and 1 special character.'}
              </div>
              {isLogin && (
                <div style={{ textAlign: 'right', marginTop: '0.35rem' }}>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setShowForgot(true); setForgotStep(1); setForgotError(''); }} 
                    style={{ fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    Forgot Password?
                  </a>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {/* OR separator for Google */}
          {isConfigured && (
            <div style={{ margin: '1.25rem 0 0.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-color)', margin: 0 }} />
                <span style={{ padding: '0 0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or Continue With</span>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-color)', margin: 0 }} />
              </div>
              
              <button
                type="button"
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  fontWeight: 600,
                  minHeight: '40px',
                  background: 'rgba(255,255,255,0.02)',
                  borderColor: 'var(--border-color)'
                }}
                onClick={handleGoogleSignIn}
              >
                <svg viewBox="0 0 48 48" style={{ width: '15px', height: '15px', display: 'block' }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.5 24c0-1.55-.15-3.24-.47-4.75H24v9.03h12.75c-.53 2.87-2.14 5.3-4.54 6.92l7.12 5.52C43.5 36.42 46.5 30.76 46.5 24z"/>
                  <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.12-5.52c-1.97 1.32-4.59 2.13-8.77 2.13-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Sign in with Google
              </button>
            </div>
          )}

          {isLogin && (
            <div style={{ margin: '1.25rem 0 0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-color)', margin: 0 }} />
                <span style={{ padding: '0 0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or Special Access</span>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-color)', margin: 0 }} />
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ 
                  width: '100%', 
                  borderColor: 'var(--danger-border)', 
                  color: 'var(--danger)',
                  background: 'var(--danger-bg)',
                  fontWeight: 600,
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onClick={async () => {
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
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Login as Administrator
              </button>
            </div>
          )}

          {/* Toggle Mode Link */}
          <div className="auth-toggle">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); handleToggleMode(); }}>
                  Create one here
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); handleToggleMode(); }}>
                  Sign in here
                </a>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="auth-right-panel">
        <div className="auth-right-overlay" />
        <div className="auth-showcase-content">
          <h2 className="auth-showcase-title">One Hub to Showcase Your Achievements</h2>
          <p className="auth-showcase-subtitle">
            Publish your academic portfolios, display your engineering and art projects, and connect with career opportunities at the University of Antique.
          </p>
          <div className="auth-showcase-preview">
            <img 
              src="/portfolio_hub_showcase.png" 
              alt="Student Dashboard Showcase" 
              className="auth-showcase-img" 
            />
          </div>
        </div>
      </div>

      {/* Forgot Password Overlay Modal */}
      {showForgot && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setShowForgot(false)}
        >
          <div 
            className="auth-card glass"
            style={{ 
              width: '100%', 
              maxWidth: '420px', 
              margin: 0,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              border: '1px solid var(--border-color)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="auth-header" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>Reset Password</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {forgotStep === 1 ? 'Enter your email address to receive a verification code.' : 'Enter the verification code and your new password.'}
              </p>
            </div>

            {forgotError && (
              <div style={{ padding: '0.6rem 0.85rem', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger)', borderRadius: 'var(--border-radius-sm)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
                ❌ {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div style={{ padding: '0.6rem 0.85rem', background: 'var(--success-bg)', border: '1px solid var(--success-border)', color: 'var(--accent)', borderRadius: 'var(--border-radius-sm)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
                ✓ Password reset successful! Closing...
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleSendForgotCode}>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="student@gmail.com"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => setShowForgot(false)}
                    style={{ minHeight: '34px' }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ minHeight: '34px' }}>
                    Send Code
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Verification Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter 6-digit code"
                    required
                    value={forgotCode}
                    onChange={(e) => setForgotCode(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    required
                    value={newForgotPass}
                    onChange={(e) => setNewForgotPass(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => setForgotStep(1)}
                    style={{ minHeight: '34px' }}
                  >
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm" style={{ minHeight: '34px' }}>
                    Reset Password
                  </button>
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
