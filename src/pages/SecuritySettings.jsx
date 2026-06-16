import React, { useState, useEffect } from 'react';
import { getStudentById, updateUserEmail, updateUserPassword, deleteStudentProfileAndAccount, signOut } from '../utils/storage';

export const SecuritySettings = ({ currentUser, navigateTo, onProfileUpdate }) => {
  const [student, setStudent] = useState(null);
  
  // Account Security States
  const [newEmail, setNewEmail] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Load student profile details on mount
  useEffect(() => {
    if (!currentUser) {
      navigateTo('auth');
      return;
    }
    
    const loadProfile = async () => {
      const profile = await getStudentById(currentUser.studentId);
      if (profile) {
        setStudent(profile);
        setNewEmail(profile.email || '');
      }
    };
    loadProfile();
  }, [currentUser]);

  if (!currentUser || !student) {
    return (
      <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2>Loading Security Settings...</h2>
      </div>
    );
  }

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess(false);

    if (!newEmail.trim()) {
      setEmailError('Email is required.');
      return;
    }

    try {
      await updateUserEmail(student.id, newEmail);
      setEmailSuccess(true);
      if (onProfileUpdate) {
        onProfileUpdate({ ...student, email: newEmail });
      }
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (err) {
      setEmailError(err.message || 'Failed to update email.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    // Password complexity check: 8+ chars, 1 uppercase, 1 number, 1 special
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError('Password must be at least 8 characters and contain 1 uppercase letter, 1 number, and 1 special character.');
      return;
    }

    try {
      await updateUserPassword(student.id, currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    }
  };

  const handleDeleteProfile = async () => {
    const confirmMessage = "Are you sure you want to permanently delete your portfolio profile and user account? This will sign you out and cannot be undone.";

    if (window.confirm(confirmMessage)) {
      if (window.confirm("FINAL CONFIRMATION: Are you absolutely certain you want to proceed?")) {
        try {
          await deleteStudentProfileAndAccount(student.id);
          await signOut();
          if (onProfileUpdate) {
            onProfileUpdate();
          }
          navigateTo('home');
        } catch (err) {
          alert(err.message || 'Failed to delete portfolio and account.');
        }
      }
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '4rem', position: 'relative' }}>
      
      {/* Premium Back Button */}
      <div style={{ position: 'relative', height: 0, zIndex: 100 }}>
        <button 
          className="btn-back-directory" 
          onClick={() => navigateTo('profile-detail', { id: student.id })}
          style={{ top: '1.5rem', left: 0 }}
          aria-label="Back to Profile"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Profile
        </button>
      </div>

      <div style={{ paddingTop: '6rem', maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: 800 }}>Account Security</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
          Manage your registered credentials, change your email address, and update your security credentials.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Email Settings Card */}
          <div className="editor-form-card glass" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: 'var(--primary)' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Email Address
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Change the email address associated with your portfolio profile.
            </p>

            <form onSubmit={handleUpdateEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="sec-new-email">New Email Address</label>
                <input
                  type="email"
                  id="sec-new-email"
                  className="form-control"
                  placeholder="new-email@university.edu"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>

              {emailSuccess && (
                <div style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>✓</span> Email address updated successfully!
                </div>
              )}
              
              {emailError && (
                <div style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>❌</span> {emailError}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ alignSelf: 'flex-start', minHeight: '38px', padding: '0.5rem 1.25rem' }}
              >
                Update Email Address
              </button>
            </form>
          </div>

          {/* Password Settings Card */}
          <div className="editor-form-card glass" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: 'var(--accent)' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Change Password
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Provide your current password and specify a strong new security password.
            </p>

            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="sec-curr-pass">Current Password</label>
                <input
                  type="password"
                  id="sec-curr-pass"
                  className="form-control"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="sec-new-pass">New Password</label>
                <input
                  type="password"
                  id="sec-new-pass"
                  className="form-control"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <span className="form-hint" style={{ marginTop: '0.4rem' }}>
                  Must be at least 8 characters, with 1 uppercase, 1 number, and 1 special symbol.
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="sec-conf-pass">Confirm New Password</label>
                <input
                  type="password"
                  id="sec-conf-pass"
                  className="form-control"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {passwordSuccess && (
                <div style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>✓</span> Password updated successfully!
                </div>
              )}

              {passwordError && (
                <div style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>❌</span> {passwordError}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ alignSelf: 'flex-start', minHeight: '38px', padding: '0.5rem 1.25rem' }}
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Danger Zone: Delete Portfolio & Account */}
          <div className="editor-form-card glass" style={{ borderLeft: '3px solid var(--danger)', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: 'var(--danger)' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Danger Zone: Delete Portfolio & Account
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Permanently delete your entire student portfolio profile and registered user account. This operation is irreversible and will immediately sign you out.
            </p>

            <button 
              type="button" 
              className="btn btn-danger" 
              style={{ minHeight: '38px', padding: '0.5rem 1.25rem' }}
              onClick={handleDeleteProfile}
            >
              Delete Portfolio & Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
export default SecuritySettings;
