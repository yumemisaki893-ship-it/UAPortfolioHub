import React, { useState, useEffect } from 'react';
import { getStudentById, updateStudentProfile } from '../utils/storage';
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
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [projects, setProjects] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [isPublic, setIsPublic] = useState(true);

  const [resume, setResume] = useState(null);
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');



  // Load student profile details on mount
  useEffect(() => {
    if (!currentUser) {
      navigateTo('auth');
      return;
    }
    
    const loadProfile = async () => {
      const targetStudentId = (currentUser.isAdmin && params?.id) 
        ? params.id 
        : currentUser.studentId;
        
      const profile = await getStudentById(targetStudentId);
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
        setFacebook(profile.facebook || '');
        setInstagram(profile.instagram || '');
        setTwitter(profile.twitter || '');
        setContactNumber(profile.contactNumber || '');
        setProjects(profile.projects || []);
        setPhotos(profile.photos || []);
        setIsPublic(profile.isPublic !== false);

        setResume(profile.resume || null);

      }
    };
    loadProfile();
  }, [currentUser]);

  if (!currentUser || !student) {
    return (
      <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2>Loading Profile Editor...</h2>
      </div>
    );
  }

  // Handle profile & cover photo uploads (Validates JPEG/PNG & limits Base64 sizes)
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type is JPEG/JPG/PNG
    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
      alert('Please upload JPEG, JPG, or PNG format images only.');
      return;
    }

    // Validate size (No limit for profile avatar, 300KB for cover to fit localStorage boundaries)
    if (type === 'cover') {
      const limit = 300 * 1024;
      if (file.size > limit) {
        alert(`The selected file is too large (${Math.round(file.size / 1024)}KB). Maximum allowed size is 300KB.`);
        return;
      }
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

    if (photos.length >= 50) {
      alert("Maximum of 50 photos allowed in your gallery album.");
      return;
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
      alert('Please upload JPEG, JPG, or PNG format images only.');
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

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(file.type) && extension !== 'pdf' && extension !== 'docx') {
      alert('Please upload PDF or DOCX files only.');
      return;
    }

    const limit = 1 * 1024 * 1024; // 1MB limit
    if (file.size > limit) {
      alert(`The selected file is too large (${Math.round(file.size / 1024)}KB). Maximum allowed size is 1MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setResume({
        name: file.name,
        dataUrl: reader.result,
        uploadedAt: new Date().toISOString()
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemoveResume = () => {
    if (window.confirm("Are you sure you want to remove your attached resume?")) {
      setResume(null);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSaveSuccess(false);

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      return;
    }

    try {
      const updatedProfile = await updateStudentProfile(student.id, {
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
        facebook,
        instagram,
        twitter,
        contactNumber,
        projects,
        photos,
        isPublic,

        resume
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
              <span className="form-hint">JPEG or PNG format, no size limit.</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/jpeg, image/jpg, image/png"
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
                Upload a custom JPEG or PNG banner photo for the top of your public portfolio view (Max 300KB).
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
                    accept="image/jpeg, image/jpg, image/png"
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
                Upload up to 50 showcase photos for your portfolio gallery (JPEG or PNG, max 200KB each).
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="file"
                  id="gallery-photo-upload"
                  accept="image/jpeg, image/jpg, image/png"
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                  disabled={photos.length >= 50}
                />
                <label 
                  htmlFor="gallery-photo-upload" 
                  className={`btn btn-secondary ${photos.length >= 50 ? 'disabled' : ''}`} 
                  style={{ 
                    cursor: photos.length >= 50 ? 'not-allowed' : 'pointer', 
                    width: '100%', 
                    textAlign: 'center',
                    opacity: photos.length >= 50 ? 0.5 : 1
                  }}
                >
                  Upload New Gallery Photo ({photos.length}/50)
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

              <div className="form-group">
                <label className="form-label" htmlFor="edit-facebook">Facebook Profile Link (URL)</label>
                <input
                  type="url"
                  id="edit-facebook"
                  className="form-control"
                  placeholder="https://facebook.com/username"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                />
                <div className="form-error-msg">Please enter a valid URL (including https://).</div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-instagram">Instagram Profile Link (URL)</label>
                <input
                  type="url"
                  id="edit-instagram"
                  className="form-control"
                  placeholder="https://instagram.com/username"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
                <div className="form-error-msg">Please enter a valid URL (including https://).</div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-twitter">Twitter / X Profile Link (URL)</label>
                <input
                  type="url"
                  id="edit-twitter"
                  className="form-control"
                  placeholder="https://x.com/username"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                />
                <div className="form-error-msg">Please enter a valid URL (including https://).</div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-contact">Contact Number / Mobile</label>
                <input
                  type="text"
                  id="edit-contact"
                  className="form-control"
                  placeholder="E.g., +63 912 345 6789"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Resume / CV Attachment Card */}
            <div className="editor-form-card glass">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Resume / CV Attachment</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Upload your latest CV or Resume (PDF or DOCX, max 1MB). It will be available for download on your public portfolio page.
              </p>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf, .docx, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  style={{ display: 'none' }}
                  onChange={handleResumeUpload}
                />
                
                {resume ? (
                  <div 
                    style={{ 
                      padding: '1rem', 
                      borderRadius: 'var(--border-radius-sm)', 
                      background: 'rgba(255, 255, 255, 0.04)', 
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', flexShrink: 0, color: 'var(--accent)' }}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {resume.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      style={{ minHeight: '30px', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      onClick={handleRemoveResume}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <label 
                      htmlFor="resume-upload" 
                      className="btn btn-secondary" 
                      style={{ cursor: 'pointer', width: '100%', textAlign: 'center' }}
                    >
                      Upload Resume / CV (PDF/DOCX)
                    </label>
                  </div>
                )}
              </div>
            </div>



            {/* Submit Action */}
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-end', marginBottom: '3rem', alignItems: 'center' }}>
              <button 
                type="button" 
                className="btn btn-secondary"
                style={{ marginRight: 'auto' }}
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
