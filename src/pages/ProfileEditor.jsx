import React, { useState, useEffect } from 'react';
import { getStudentById, updateStudentProfile, deleteStudentProfileAndAccount, signOut, updateUserEmail, updateUserPassword } from '../utils/storage';
import { AvatarPicker, AvatarImage } from '../components/AvatarPicker';
import { ProjectManager } from '../components/ProjectManager';

export const ProfileEditor = ({ currentUser, params, navigateTo, onProfileUpdate }) => {
  const [student, setStudent] = useState(null);
  
  // Form states
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [avatarId, setAvatarId] = useState('avatar-1');
  const [coverPhotoUrl, setCoverPhotoUrl] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [projects, setProjects] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    
    const targetStudentId = (currentUser.isAdmin && params?.id) 
      ? params.id 
      : currentUser.studentId;
      
    const profile = getStudentById(targetStudentId);
    if (profile) {
      setStudent(profile);
      setName(profile.name || '');
      setMajor(profile.major || '');
      setAvatarId(profile.avatarId || 'avatar-1');
      setCoverPhotoUrl(profile.coverPhotoUrl || '');
      setShortBio(profile.shortBio || '');
      setAboutMe(profile.aboutMe || '');
      setSkills(profile.skills || []);
      setGithub(profile.github || '');
      setLinkedin(profile.linkedin || '');
      setWebsite(profile.website || '');
      setProjects(profile.projects || []);
      setPhotos(profile.photos || []);
      setIsPublic(profile.isPublic !== false);
      setNewEmail(profile.email || '');
    }
  }, [currentUser]);

  if (!currentUser || !student) {
    return (
      <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2>Loading Profile Editor...</h2>
      </div>
    );
  }

  // Handle profile & cover photo uploads (Validates JPEG & limits Base64 sizes)
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type is JPEG/JPG
    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      alert('Please upload JPEG or JPG format images only.');
      return;
    }

    // Validate size (150KB for profile, 300KB for cover to fit localStorage boundaries)
    const limit = type === 'avatar' ? 150 * 1024 : 300 * 1024;
    if (file.size > limit) {
      alert(`The selected file is too large (${Math.round(file.size / 1024)}KB). Maximum allowed size is ${type === 'avatar' ? '150KB' : '300KB'}.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'avatar') {
        setAvatarId(reader.result); // Overwrites avatarId with Base64 URL
      } else {
        setCoverPhotoUrl(reader.result); // Sets coverPhotoUrl with Base64 URL
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Photo Gallery Uploads
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (photos.length >= 6) {
      alert("Maximum of 6 photos allowed in your gallery album.");
      return;
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      alert('Please upload JPEG or JPG format images only.');
      return;
    }

    const limit = 200 * 1024; // 200KB limit
    if (file.size > limit) {
      alert(`The selected file is too large (${Math.round(file.size / 1024)}KB). Maximum allowed size is 200KB.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhoto = {
        id: `photo-${Date.now()}`,
        url: reader.result,
        caption: ''
      };
      setPhotos([...photos, newPhoto]);
    };
    reader.readAsDataURL(file);
    
    // reset input
    e.target.value = null;
  };

  const handlePhotoCaptionChange = (id, newCaption) => {
    setPhotos(photos.map(p => p.id === id ? { ...p, caption: newCaption } : p));
  };

  const handleRemovePhoto = (id) => {
    if (window.confirm("Are you sure you want to remove this photo from your album?")) {
      setPhotos(photos.filter(p => p.id !== id));
    }
  };

  const handleDeleteProfile = () => {
    const confirmMessage = currentUser?.isAdmin && currentUser.studentId !== student.id
      ? `WARNING: You are about to permanently delete ${student.name}'s portfolio and user account. This action cannot be undone. Do you wish to proceed?`
      : "Are you sure you want to permanently delete your portfolio profile and user account? This will sign you out and cannot be undone.";

    if (window.confirm(confirmMessage)) {
      if (window.confirm("FINAL CONFIRMATION: Are you absolutely certain you want to proceed?")) {
        deleteStudentProfileAndAccount(student.id);
        
        if (currentUser?.isAdmin && currentUser.studentId !== student.id) {
          alert(`${student.name}'s portfolio was successfully deleted.`);
          navigateTo('directory');
        } else {
          signOut();
          onProfileUpdate(); // Triggers session refresh in App.jsx
          navigateTo('home');
        }
      }
    }
  };

  const handleUpdateEmail = (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess(false);

    if (!newEmail.trim()) {
      setEmailError('Email is required.');
      return;
    }

    try {
      updateUserEmail(student.id, newEmail);
      setEmailSuccess(true);
      onProfileUpdate(); // Sync navbar email instantly
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (err) {
      setEmailError(err.message || 'Failed to update email.');
    }
  };

  const handleUpdatePassword = (e) => {
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
      updateUserPassword(student.id, currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    }
  };

  // Handle Skills Tag Adding
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = skillInput.trim().replace(/,$/, '');
      if (val && !skills.includes(val)) {
        setSkills([...skills, val]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Handle Save
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSaveSuccess(false);

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      return;
    }

    try {
      const updatedProfile = updateStudentProfile(student.id, {
        name,
        major,
        avatarId,
        coverPhotoUrl,
        shortBio,
        aboutMe,
        skills,
        github,
        linkedin,
        website,
        projects,
        photos,
        isPublic
      });

      onProfileUpdate(updatedProfile);
      setSaveSuccess(true);
      
      // Auto scroll to top to see success banner
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // After 1.5 seconds, redirect user back to their detailed public portfolio view
      setTimeout(() => {
        navigateTo('profile-detail', { id: student.id });
      }, 1500);

    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile. Please check inputs.');
    }
  };

  return (
    <div className="container editor-page">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ marginBottom: 0 }}>Portfolio Creator / Editor</h1>
        <button 
          type="button" 
          className="btn btn-secondary btn-sm"
          onClick={() => navigateTo('profile-detail', { id: student.id })}
        >
          View Public Profile
        </button>
      </div>

      {saveSuccess && (
        <div 
          className="glass"
          style={{
            padding: '1rem',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            color: 'var(--accent)',
            fontWeight: 600,
            marginBottom: '2rem',
            textAlign: 'center'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Portfolio updated successfully! Redirecting to your public profile page...
        </div>
      )}

      {errorMessage && (
        <div 
          className="glass"
          style={{
            padding: '1rem',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            color: 'var(--danger)',
            fontWeight: 600,
            marginBottom: '2rem',
            textAlign: 'center'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          Error: {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="editor-grid">
          
          {/* LEFT SIDEBAR: Avatar & Core Information */}
          <div className="editor-sidebar glass">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Profile Identity</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Choose a representative character profile image for the directory.
            </p>
            
            {/* Profile Picture Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span className="form-label" style={{ marginBottom: '0.5rem', alignSelf: 'flex-start' }}>Profile Picture Preview</span>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                borderRadius: '50%', 
                overflow: 'hidden', 
                border: '4px solid var(--border-color)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                background: 'var(--bg-secondary)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <AvatarImage avatarId={avatarId} id="editor-preview" />
              </div>
            </div>

            {/* Visual Avatar selector component */}
            <AvatarPicker selectedId={avatarId} onSelect={setAvatarId} />

            {/* Custom File Upload for Avatar */}
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.25rem 0' }} />
            <div className="form-group">
              <label className="form-label">Or Custom Photo</label>
              <span className="form-hint">JPEG format only, max 150KB.</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/jpeg, image/jpg"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageUpload(e, 'avatar')}
                />
                <label htmlFor="profile-upload" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', width: '100%', minHeight: '34px', textAlign: 'center' }}>
                  Upload Custom Image
                </label>

                {avatarId.startsWith('data:image/') && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    style={{ minHeight: '32px' }}
                    onClick={() => setAvatarId('avatar-1')}
                  >
                    Reset to Avatar Icon
                  </button>
                )}
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.25rem 0' }} />
            <div className="form-group">
              <label className="form-label">Account Email (Read-Only)</label>
              <input
                type="text"
                className="form-control"
                value={student.email}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              <span className="form-hint">Your email is tied directly to your account.</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.25rem 0' }} />
            <div className="form-group">
              <label className="form-label">Profile Visibility</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Make profile public</span>
                </label>
              </div>
              <span className="form-hint" style={{ marginTop: '0.5rem' }}>
                If unchecked, your profile will be hidden from the directory.
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Profile Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Cover Photo Branding Card */}
            <div className="editor-form-card glass">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Profile Banner</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Upload a custom JPEG banner photo for the top of your public portfolio view (Max 300KB).
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <span className="form-label" style={{ marginBottom: '-0.5rem' }}>Banner Preview (21:9 Aspect Ratio)</span>
                {coverPhotoUrl ? (
                  <div 
                    style={{ 
                      width: '100%', 
                      aspectRatio: '21 / 9', 
                      borderRadius: 'var(--border-radius-sm)', 
                      background: `url(${coverPhotoUrl}) center/cover no-repeat`,
                      border: '1px solid var(--border-color)' 
                    }}
                  ></div>
                ) : (
                  <div 
                    style={{ 
                      width: '100%', 
                      aspectRatio: '21 / 9', 
                      borderRadius: 'var(--border-radius-sm)', 
                      background: 'var(--bg-secondary)', 
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    No banner photo uploaded
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="file"
                    id="cover-upload"
                    accept="image/jpeg, image/jpg"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(e, 'cover')}
                  />
                  <label htmlFor="cover-upload" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', flex: 1, minHeight: '34px', textAlign: 'center' }}>
                    Upload Banner Image
                  </label>

                  {coverPhotoUrl && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      style={{ minHeight: '34px' }}
                      onClick={() => setCoverPhotoUrl('')}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* General Information Card */}
            <div className="editor-form-card glass">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Student Details</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Fill in your primary academic credentials and description.
              </p>

              {/* Name and Major row */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-name">Full Name *</label>
                  <input
                    type="text"
                    id="edit-name"
                    className="form-control"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <div className="form-error-msg">Name is required.</div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-major">Academic Major *</label>
                  <input
                    list="major-options"
                    id="edit-major"
                    className="form-control"
                    placeholder="e.g. Computer Science"
                    required
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                  />
                  <datalist id="major-options">
                    <option value="Computer Science" />
                    <option value="Product Design" />
                    <option value="Data Science" />
                    <option value="Robotics Engineering" />
                    <option value="Information Technology" />
                    <option value="Business Analytics" />
                    <option value="Mechanical Engineering" />
                    <option value="Electrical Engineering" />
                    <option value="Digital Media" />
                  </datalist>
                  <div className="form-error-msg">Please specify your major.</div>
                </div>
              </div>

              {/* Tagline Bio */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-tagline">Tagline Bio (Short Summary) *</label>
                <span className="form-hint" id="tagline-hint">A single sentence appearing on your directory card. E.g. fullstack dev, IoT tinkerer</span>
                <input
                  type="text"
                  id="edit-tagline"
                  className="form-control"
                  required
                  maxLength="120"
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                  aria-describedby="tagline-hint"
                />
                <div className="form-error-msg">Short tagline is required (max 120 chars).</div>
              </div>

              {/* Detailed About Me */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-aboutme">About Me (Full Story) *</label>
                <span className="form-hint">Tell visitors about your background, interests, and what you are learning.</span>
                <textarea
                  id="edit-aboutme"
                  className="form-control"
                  required
                  rows="5"
                  style={{ resize: 'vertical' }}
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                />
                <div className="form-error-msg">About Me description is required.</div>
              </div>
            </div>

            {/* Dynamic Skills Tags Card */}
            <div className="editor-form-card glass">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Skills & Tags</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Add keyword tags representing your programming languages, design tools, or libraries.
              </p>

              <div className="form-group">
                <label className="form-label" htmlFor="skill-tag-input">Add Skills</label>
                <span className="form-hint" id="skills-hint">Type a skill (e.g. React, Figma, Python) and press <strong>Enter</strong> or comma to add.</span>
                
                <div className="tags-input-container">
                  {skills.map((skill, index) => (
                    <span key={index} className="tag-badge">
                      {skill}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => handleRemoveSkill(skill)}
                        aria-label={`Remove skill ${skill}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    id="skill-tag-input"
                    className="tags-input-field"
                    placeholder={skills.length === 0 ? "e.g. JavaScript" : "Add more..."}
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    aria-describedby="skills-hint"
                  />
                </div>
              </div>
            </div>

            {/* Project Manager Sub-Component */}
            <ProjectManager projects={projects} onChange={setProjects} />

            {/* Photo Gallery Album Card */}
            <div className="editor-form-card glass">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Photo Gallery Album</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Upload up to 6 showcase photos for your portfolio gallery (JPEG only, max 200KB each).
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="file"
                  id="gallery-photo-upload"
                  accept="image/jpeg, image/jpg"
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                  disabled={photos.length >= 6}
                />
                <label 
                  htmlFor="gallery-photo-upload" 
                  className={`btn btn-secondary ${photos.length >= 6 ? 'disabled' : ''}`} 
                  style={{ 
                    cursor: photos.length >= 6 ? 'not-allowed' : 'pointer', 
                    width: '100%', 
                    textAlign: 'center',
                    opacity: photos.length >= 6 ? 0.5 : 1
                  }}
                >
                  Upload New Gallery Photo ({photos.length}/6)
                </label>
              </div>

              {photos.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {photos.map((photo, index) => (
                    <div 
                      key={photo.id} 
                      className="glass" 
                      style={{ 
                        padding: '1rem', 
                        display: 'flex', 
                        gap: '1rem', 
                        alignItems: 'center',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)'
                      }}
                    >
                      <img 
                        src={photo.url} 
                        alt={`Preview ${index + 1}`} 
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          objectFit: 'cover', 
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--border-radius-sm)'
                        }} 
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Caption</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Describe this photo..."
                          value={photo.caption}
                          onChange={(e) => handlePhotoCaptionChange(photo.id, e.target.value)}
                          maxLength="100"
                          style={{ minHeight: '34px', padding: '0.4rem 0.75rem' }}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemovePhoto(photo.id)}
                        style={{ alignSelf: 'flex-end', minHeight: '34px' }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Connections Card */}
            <div className="editor-form-card glass">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Contact Links</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Add your social profile URLs so recruiters and peers can contact you.
              </p>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-github">GitHub Profile Link (URL)</label>
                <input
                  type="url"
                  id="edit-github"
                  className="form-control"
                  placeholder="https://github.com/username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
                <div className="form-error-msg">Please enter a valid URL (including https://).</div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-linkedin">LinkedIn Profile Link (URL)</label>
                <input
                  type="url"
                  id="edit-linkedin"
                  className="form-control"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
                <div className="form-error-msg">Please enter a valid URL (including https://).</div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-website">Personal Website Link (URL)</label>
                <input
                  type="url"
                  id="edit-website"
                  className="form-control"
                  placeholder="https://yourwebsite.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <div className="form-error-msg">Please enter a valid URL (including https://).</div>
              </div>
            </div>

            {/* Account Security Card (Only visible to the profile owner) */}
            {currentUser && currentUser.studentId === student.id && (
              <div className="editor-form-card glass">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Account Security Settings</h2>
                <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Manage your account credentials and login details.
                </p>

                {/* Change Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="sec-new-email">Change Email Address</label>
                    <input
                      type="email"
                      id="sec-new-email"
                      className="form-control"
                      placeholder="new-email@university.edu"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                  {emailSuccess && (
                    <div style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>
                      ✓ Email address updated successfully!
                    </div>
                  )}
                  {emailError && (
                    <div style={{ color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600 }}>
                      ❌ {emailError}
                    </div>
                  )}
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm" 
                    style={{ alignSelf: 'flex-start', minHeight: '34px' }}
                    onClick={handleUpdateEmail}
                  >
                    Update Email Address
                  </button>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

                {/* Change Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="sec-curr-pass">Current Password</label>
                    <input
                      type="password"
                      id="sec-curr-pass"
                      className="form-control"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
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
                    />
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
                    />
                  </div>
                  {passwordSuccess && (
                    <div style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>
                      ✓ Password updated successfully!
                    </div>
                  )}
                  {passwordError && (
                    <div style={{ color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600 }}>
                      ❌ {passwordError}
                    </div>
                  )}
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-sm" 
                    style={{ alignSelf: 'flex-start', minHeight: '34px' }}
                    onClick={handleUpdatePassword}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-end', marginBottom: '3rem', alignItems: 'center' }}>
              <button 
                type="button" 
                className="btn btn-danger" 
                style={{ marginRight: 'auto' }}
                onClick={handleDeleteProfile}
              >
                Delete Portfolio & Account
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigateTo('profile-detail', { id: student.id })}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Portfolio Profile
              </button>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
};
export default ProfileEditor;
