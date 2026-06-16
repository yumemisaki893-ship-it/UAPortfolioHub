import React, { useEffect, useState } from 'react';
import { 
  getStudentById, 
  getStudentByIdSync,
  deleteStudentProfileAndAccount, 
  signOut,
  updateStudentProfile
} from '../utils/storage';
import { AvatarImage } from '../components/AvatarPicker';

export const ProfileDetail = ({ params, currentUser, navigateTo, onLogoutSuccess }) => {
  const studentId = params?.id;
  const initialStudent = getStudentByIdSync(studentId);
  const [student, setStudent] = useState(initialStudent);

  // Lightbox Modal States
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Image Viewer for profile picture / banner
  const [viewerImage, setViewerImage] = useState(null);
  const [viewerCaption, setViewerCaption] = useState('');

  // States for in-place About Me editing
  const [isEditingAboutMe, setIsEditingAboutMe] = useState(false);
  const [aboutMeText, setAboutMeText] = useState(initialStudent?.aboutMe || '');
  const [savingAboutMe, setSavingAboutMe] = useState(false);
  const [loading, setLoading] = useState(!student);
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    if (!studentId) return true;
    return localStorage.getItem(`portfolio_welcome_dismissed_${studentId}`) === 'true';
  });

  const loadAllData = async () => {
    if (studentId) {
      if (!student) {
        setLoading(true);
      }
      const profile = await getStudentById(studentId);
      setStudent(profile);
      if (profile) {
        if (!isEditingAboutMe) {
          setAboutMeText(profile.aboutMe || '');
        }
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [studentId, currentUser]);

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    if (!student?.photos) return;
    setPhotoIndex((prevIndex) => (prevIndex === 0 ? student.photos.length - 1 : prevIndex - 1));
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    if (!student?.photos) return;
    setPhotoIndex((prevIndex) => (prevIndex === student.photos.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevPhoto(e);
      if (e.key === 'ArrowRight') nextPhoto(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, student?.photos]);

  if (loading && !student) {
    return (
      <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '48px', height: '48px' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2>Portfolio Not Found</h2>
        <p style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
          The student profile you are looking for might have been removed or does not exist.
        </p>
        <button className="btn btn-primary" onClick={() => navigateTo('directory')} style={{ gap: '0.6rem' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Browse Portfolios
        </button>
      </div>
    );
  }

  // Check if the current viewed page belongs to the logged-in student
  const isOwnProfile = currentUser && currentUser.studentId === student.id;
  const canEdit = isOwnProfile || (currentUser && currentUser.isAdmin);

  const isNewAccount = (() => {
    if (!student.createdAt) return false;
    const createdDate = new Date(student.createdAt);
    const now = new Date();
    // 24 hours threshold
    return (now - createdDate) < 24 * 60 * 60 * 1000;
  })();

  const showWelcomeBanner = isOwnProfile && isNewAccount && !bannerDismissed;
  const isAdminPanel = currentUser?.isAdmin && currentUser.studentId !== student.id;
  const showManagementBanner = isAdminPanel || showWelcomeBanner;

  const handleDeleteProfile = async () => {
    const confirmMessage = currentUser?.isAdmin && currentUser.studentId !== student.id
      ? `WARNING: You are about to permanently delete ${student.name}'s portfolio and user account. This action cannot be undone. Do you wish to proceed?`
      : "Are you sure you want to permanently delete your portfolio profile and user account? This will sign you out and cannot be undone.";
      
    if (window.confirm(confirmMessage)) {
      if (window.confirm("FINAL CONFIRMATION: Are you absolutely certain you want to proceed?")) {
        await deleteStudentProfileAndAccount(student.id);
        
        if (currentUser?.isAdmin && currentUser.studentId !== student.id) {
          alert(`${student.name}'s portfolio was successfully deleted.`);
          navigateTo('directory');
        } else {
          await signOut();
          if (onLogoutSuccess) onLogoutSuccess();
          navigateTo('home');
        }
      }
    }
  };

  const handleInPlacePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const currentPhotos = student.photos || [];
    if (currentPhotos.length >= 50) {
      alert("Maximum of 50 photos allowed in your gallery album.");
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, JPEG, and PNG files are supported.");
      return;
    }

    if (file.size > 200 * 1024) {
      alert("File size exceeds 200KB limit. Please optimize your image size.");
      return;
    }

    const caption = window.prompt("Enter an optional caption for this photo:");
    if (caption === null) {
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const newPhoto = {
        id: `photo-${Date.now()}`,
        url: reader.result,
        caption: caption.trim()
      };
      const updatedPhotos = [...currentPhotos, newPhoto];

      try {
        await updateStudentProfile(student.id, { photos: updatedPhotos });
        setStudent({ ...student, photos: updatedPhotos });
      } catch (err) {
        alert(err.message || "Failed to upload photo.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleInPlaceEditCaption = async (photoId, currentCaption) => {
    const newCaption = window.prompt("Edit caption for this photo:", currentCaption);
    if (newCaption === null) return;

    const updatedPhotos = (student.photos || []).map(p => 
      p.id === photoId ? { ...p, caption: newCaption.trim() } : p
    );

    try {
      await updateStudentProfile(student.id, { photos: updatedPhotos });
      setStudent({ ...student, photos: updatedPhotos });
    } catch (err) {
      alert(err.message || "Failed to update caption.");
    }
  };

  const handleInPlaceRemovePhoto = async (photoId) => {
    if (window.confirm("Are you sure you want to remove this photo from your gallery?")) {
      const updatedPhotos = (student.photos || []).filter(p => p.id !== photoId);

      try {
        await updateStudentProfile(student.id, { photos: updatedPhotos });
        setStudent({ ...student, photos: updatedPhotos });
      } catch (err) {
        alert(err.message || "Failed to remove photo.");
      }
    }
  };

  const handleInPlaceCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, JPEG, and PNG files are supported.");
      return;
    }

    if (file.size > 300 * 1024) {
      alert("File size exceeds 300KB limit. Please optimize your cover photo size.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await updateStudentProfile(student.id, { coverPhotoUrl: reader.result });
        setStudent({ ...student, coverPhotoUrl: reader.result });
      } catch (err) {
        alert(err.message || "Failed to upload cover photo.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleInPlaceRemoveCover = async () => {
    if (window.confirm("Are you sure you want to remove your cover photo?")) {
      try {
        await updateStudentProfile(student.id, { coverPhotoUrl: '' });
        setStudent({ ...student, coverPhotoUrl: '' });
      } catch (err) {
        alert(err.message || "Failed to remove cover photo.");
      }
    }
  };

  const handleInPlaceAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, JPEG, and PNG files are supported.");
      return;
    }

    if (file.size > 300 * 1024) {
      alert("File size exceeds 300KB limit. Please optimize your profile photo size.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await updateStudentProfile(student.id, { avatarId: reader.result });
        setStudent({ ...student, avatarId: reader.result });
      } catch (err) {
        alert(err.message || "Failed to upload profile photo.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleInPlaceResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const extension = file.name.split('.').pop().toLowerCase();

    if (!validTypes.includes(file.type) && extension !== 'pdf' && extension !== 'docx') {
      alert('Please upload PDF or DOCX files only.');
      e.target.value = null;
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      alert(`File is too large (${Math.round(file.size / 1024)}KB). Maximum allowed is 1MB.`);
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const newResume = {
        name: file.name,
        dataUrl: reader.result,
        uploadedAt: new Date().toISOString()
      };
      try {
        await updateStudentProfile(student.id, { resume: newResume });
        setStudent({ ...student, resume: newResume });
      } catch (err) {
        alert(err.message || 'Failed to upload resume.');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handleInPlaceRemoveResume = async () => {
    if (window.confirm('Are you sure you want to remove your resume?')) {
      try {
        await updateStudentProfile(student.id, { resume: null });
        setStudent({ ...student, resume: null });
      } catch (err) {
        alert(err.message || 'Failed to remove resume.');
      }
    }
  };

  return (
    <div className="app-page-wrapper">
      <div className="profile-detail-page animate-fade-in" style={{ position: 'relative' }}>
        {/* Full Width Cover Photo */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div 
            style={{ 
              width: '100%', 
              aspectRatio: '21 / 9', 
              background: student.coverPhotoUrl 
                ? `url(${student.coverPhotoUrl}) center/cover no-repeat` 
                : 'linear-gradient(to bottom, var(--primary-glow), var(--accent-glow))',
              backdropFilter: student.coverPhotoUrl ? 'none' : 'blur(10px) saturate(120%)',
              WebkitBackdropFilter: student.coverPhotoUrl ? 'none' : 'blur(10px) saturate(120%)',
              borderBottom: '1px solid var(--border-color)',
              cursor: student.coverPhotoUrl ? 'pointer' : 'default',
              transition: 'filter 0.2s ease'
            }}
            onClick={() => { if (student.coverPhotoUrl) { setViewerImage(student.coverPhotoUrl); setViewerCaption('Cover Photo'); } }}
            onMouseEnter={(e) => { if (student.coverPhotoUrl) e.currentTarget.style.filter = 'brightness(0.85)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = ''; }}
            title={student.coverPhotoUrl ? 'Click to view full size' : ''}
          ></div>
        {canEdit && (
          <div style={{ position: 'absolute', right: '1.5rem', bottom: '1.5rem', zIndex: 10, display: 'flex', gap: '0.5rem' }}>
            <input 
              type="file" 
              id="inplace-cover-upload" 
              accept="image/png, image/jpeg, image/jpg" 
              style={{ display: 'none' }} 
              onChange={handleInPlaceCoverUpload} 
            />
            <label 
              htmlFor="inplace-cover-upload" 
              className="btn btn-secondary btn-sm" 
              style={{ 
                cursor: 'pointer', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: 'rgba(255, 255, 255, 0.85)',
                color: 'var(--text-primary)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-color)',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Update Cover
            </label>
            {student.coverPhotoUrl && (
              <button
                className="btn btn-danger btn-sm"
                style={{
                  minHeight: '32px',
                  minWidth: '32px',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255, 240, 240, 0.9)',
                  borderColor: 'var(--danger-border)',
                  color: 'var(--danger)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  padding: 0
                }}
                onClick={handleInPlaceRemoveCover}
                title="Remove Cover Photo"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="container profile-detail" style={{ marginTop: '-80px' }}>

        {/* Owner / Admin Management Banner */}
        {showManagementBanner && (
          <div 
            className="glass animate-fade-in"
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--border-radius-md)',
              borderLeft: '4px solid var(--accent)',
              background: 'var(--bg-secondary)',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              position: 'relative',
              zIndex: 20
            }}
          >
            <div style={{ textAlign: 'left', flex: 1 }}>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.1rem', fontWeight: 600 }}>
                {isAdminPanel ? "Admin Management Panel" : "This is your public portfolio"}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {isAdminPanel 
                  ? "As an administrator, you have full permissions to edit or delete this student portfolio."
                  : "You can edit these details, upload cover/profile photos, add projects, and update tags at any time."
                }
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button 
                  className="btn btn-primary btn-sm" 
                  style={{ minHeight: '32px' }}
                  onClick={() => navigateTo('edit-profile', { id: student.id })}
                >
                  Edit Portfolio
                </button>
                <button 
                  className="btn btn-secondary btn-sm" 
                  style={{ minHeight: '32px', marginLeft: '0.5rem' }}
                  onClick={() => navigateTo('edit-profile', { id: student.id })}
                >
                  Edit Profile Details
                </button>
              {isAdminPanel && (
                <button 
                  className="btn btn-danger btn-sm" 
                  style={{ minHeight: '32px' }}
                  onClick={handleDeleteProfile}
                >
                  Delete Portfolio
                </button>
              )}
              {showWelcomeBanner && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem(`portfolio_welcome_dismissed_${student.id}`, 'true');
                    setBannerDismissed(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '1.4rem',
                    padding: '0.15rem 0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color var(--transition-fast)'
                  }}
                  aria-label="Dismiss banner"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        )}

        {/* Header Info Card */}
        <div className="profile-header-card glass" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
          <div 
            style={{ 
              display: 'flex', 
              gap: '2rem', 
              alignItems: 'flex-start',
              position: 'relative', 
              zIndex: 10,
              flexWrap: 'wrap'
            }}
            className="profile-header-content"
          >
            {/* Circular avatar container overlapping cover photo */}
            <div 
              style={{ 
                width: '150px', 
                height: '150px', 
                flexShrink: 0, 
                borderRadius: '50%', 
                overflow: 'hidden',
                border: '6px solid var(--bg-card)',
                background: 'var(--bg-card)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginTop: '-50px',
                position: 'relative',
                cursor: student.avatarId ? 'pointer' : 'default'
              }}
              className="profile-avatar-container"
              onClick={() => { if (student.avatarId) { setViewerImage(student.avatarId); setViewerCaption(student.name + "'s Profile Photo"); } }}
              title={student.avatarId ? 'Click to view full size' : ''}
            >
              <AvatarImage avatarId={student.avatarId} id={`detail-${student.id}`} />
              {canEdit && (
                <>
                  <input 
                    type="file" 
                    id="inplace-avatar-upload" 
                    accept="image/png, image/jpeg, image/jpg" 
                    style={{ display: 'none' }} 
                    onChange={handleInPlaceAvatarUpload} 
                  />
                  <label 
                    htmlFor="inplace-avatar-upload"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      cursor: 'pointer',
                      gap: '4px'
                    }}
                    className="avatar-upload-overlay"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Change Photo</span>
                  </label>
                </>
              )}
            </div>
            
            <div className="profile-meta" style={{ flex: 1, paddingTop: '1rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.2rem', fontWeight: 700 }}>{student.name}</h1>
            <div className="major" style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>{student.major}</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', maxWidth: '680px' }}>{student.shortBio}</p>
            
            {/* Quick Contacts */}
            <div className="profile-contact-list" style={{ marginTop: '0.5rem' }}>
              {student.email && (
                <a href={`mailto:${student.email}`} className="contact-link" title="Send Email">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {student.email}
                </a>
              )}
              {student.github && (
                <a href={student.github} target="_blank" rel="noopener noreferrer" className="contact-link" title="GitHub Profile">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  GitHub
                </a>
              )}
              {student.linkedin && (
                <a href={student.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link" title="LinkedIn Profile">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  LinkedIn
                </a>
              )}
              {student.website && (
                <a href={student.website} target="_blank" rel="noopener noreferrer" className="contact-link" title="Personal Website">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Website
                </a>
              )}
              {student.facebook && (
                <a href={student.facebook} target="_blank" rel="noopener noreferrer" className="contact-link" title="Facebook Profile">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  Facebook
                </a>
              )}
              {student.instagram && (
                <a href={student.instagram} target="_blank" rel="noopener noreferrer" className="contact-link" title="Instagram Profile">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Instagram
                </a>
              )}
              {student.twitter && (
                <a href={student.twitter} target="_blank" rel="noopener noreferrer" className="contact-link" title="Twitter / X Profile">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                  Twitter / X
                </a>
              )}
              {student.contactNumber && (
                <a href={`tel:${student.contactNumber.replace(/[^\d+]/g, '')}`} className="contact-link" title="Contact Number">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {student.contactNumber}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Content Layout */}
      <div className="profile-layout">
        {/* Main Body Columns */}
        <div>
          {/* About Me Section */}
          <div className="profile-section glass">
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                About Me
              </div>
              {canEdit && !isEditingAboutMe && (
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setIsEditingAboutMe(true)}
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', minHeight: '28px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border-color)' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '11px', height: '11px' }}>
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit About Me
                </button>
              )}
            </h2>
            {isEditingAboutMe ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                <textarea
                  className="form-control"
                  rows="6"
                  style={{ width: '100%', resize: 'vertical', fontSize: '0.925rem', lineHeight: '1.5', padding: '0.75rem' }}
                  value={aboutMeText}
                  onChange={(e) => setAboutMeText(e.target.value)}
                  placeholder="Tell us about yourself..."
                  disabled={savingAboutMe}
                />
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setIsEditingAboutMe(false);
                      setAboutMeText(student.aboutMe || '');
                    }}
                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', minHeight: '32px' }}
                    disabled={savingAboutMe}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={async () => {
                      setSavingAboutMe(true);
                      try {
                        const updated = await updateStudentProfile(student.id, { aboutMe: aboutMeText });
                        setStudent(updated);
                        setIsEditingAboutMe(false);
                      } catch (error) {
                        console.error('Error saving about me:', error);
                        alert('Failed to save changes. Please try again.');
                      } finally {
                        setSavingAboutMe(false);
                      }
                    }}
                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', minHeight: '32px' }}
                    disabled={savingAboutMe}
                  >
                    {savingAboutMe ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="about-text" style={{ whiteSpace: 'pre-wrap' }}>{student.aboutMe || "No detailed description written yet."}</p>
            )}
          </div>

          {/* Educational Background Section */}
          {(student.education?.elementary?.school || student.education?.juniorHigh?.school || student.education?.seniorHigh?.school || student.education?.college?.school) && (
            <div className="profile-section glass">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
                Educational Background
              </h2>
              
              <div className="profile-timeline">
                {/* College */}
                {student.education?.college?.school && (
                  <div className="profile-timeline-item">
                    <div className="profile-timeline-date">
                      {student.education.college.years || "College"}
                    </div>
                    <div className="profile-timeline-title">
                      {student.education.college.school}
                    </div>
                    {student.education.college.degree && (
                      <div className="profile-timeline-subtitle">
                        {student.education.college.degree}
                      </div>
                    )}
                  </div>
                )}

                {/* Senior High School */}
                {student.education?.seniorHigh?.school && (
                  <div className="profile-timeline-item">
                    <div className="profile-timeline-date" style={{ color: 'var(--accent)' }}>
                      {student.education.seniorHigh.years || "High School (Senior High)"}
                    </div>
                    <div className="profile-timeline-title">
                      {student.education.seniorHigh.school}
                    </div>
                    {student.education.seniorHigh.strand && (
                      <div className="profile-timeline-subtitle">
                        Track / Strand: {student.education.seniorHigh.strand}
                      </div>
                    )}
                  </div>
                )}

                {/* Junior High School */}
                {student.education?.juniorHigh?.school && (
                  <div className="profile-timeline-item">
                    <div className="profile-timeline-date" style={{ color: 'var(--logo-gold)' }}>
                      {student.education.juniorHigh.years || "High School (Junior High)"}
                    </div>
                    <div className="profile-timeline-title">
                      {student.education.juniorHigh.school}
                    </div>
                  </div>
                )}

                {/* Elementary */}
                {student.education?.elementary?.school && (
                  <div className="profile-timeline-item">
                    <div className="profile-timeline-date" style={{ color: 'var(--text-muted)' }}>
                      {student.education.elementary.years || "Elementary School"}
                    </div>
                    <div className="profile-timeline-title">
                      {student.education.elementary.school}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Work Experience Section */}
          {student.experience && student.experience.length > 0 && (
            <div className="profile-section glass">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                Work Experience
              </h2>
              <div className="profile-timeline">
                {student.experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="profile-timeline-item">
                    <div className="profile-timeline-date">{exp.period}</div>
                    <div className="profile-timeline-title">{exp.title}</div>
                    <div className="profile-timeline-subtitle">{exp.company}</div>
                    {exp.description && (
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seminars & Trainings Section */}
          {student.seminars && student.seminars.length > 0 && (
            <div className="profile-section glass">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Seminars & Workshops
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {student.seminars.map((sem, idx) => (
                  <div key={sem.id || idx} className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.01)' }}>
                    <h3 style={{ fontSize: '1rem', margin: '0 0 0.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{sem.title}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                      Host: {sem.organizer} | <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{sem.date}</span>
                    </div>
                    {sem.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>{sem.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates Section */}
          {student.certificates && student.certificates.length > 0 && (
            <div className="profile-section glass">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
                Certifications & Achievements
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {student.certificates.map((cert, idx) => (
                  <div key={cert.id || idx} className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.01)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', margin: '0 0 0.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cert.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Issuer: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cert.issuer}</span> | <span style={{ color: 'var(--text-muted)' }}>{cert.date}</span>
                      </div>
                    </div>
                    {cert.url && (
                      <a 
                        href={cert.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '4px', minHeight: '30px', justifyContent: 'center', textDecoration: 'none', fontSize: '0.8rem' }}
                      >
                        View Credential ↗
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Skills Section */}
          <div className="profile-section glass">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px' }}>
                <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Specialized Skills
            </h2>
            {student.skills && student.skills.length > 0 ? (
              <div className="detail-skills-list">
                {student.skills.map((skill, index) => (
                  <span key={index} className="badge badge-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No skills listed.</p>
            )}
          </div>

          {/* CV / Resume Section (Default) */}
          <div className="profile-section glass">
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                CV / Resume
              </div>
              {canEdit && (
                <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="file"
                    id="inplace-resume-upload"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style={{ display: 'none' }}
                    onChange={handleInPlaceResumeUpload}
                  />
                  <label
                    htmlFor="inplace-resume-upload"
                    className="btn btn-secondary btn-sm"
                    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', minHeight: '30px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '11px', height: '11px' }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {student.resume ? 'Replace' : 'Upload'}
                  </label>
                  {student.resume && (
                    <button
                      className="btn btn-danger btn-sm"
                      style={{
                        minHeight: '30px',
                        minWidth: '30px',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        background: 'var(--danger-bg)',
                        borderColor: 'var(--danger-border)',
                        color: 'var(--danger)'
                      }}
                      onClick={handleInPlaceRemoveResume}
                      title="Remove Resume"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}>
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </h2>
            {student.resume ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.15rem', color: 'var(--text-primary)' }}>
                      {student.resume.name}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {student.resume.name.split('.').pop().toUpperCase()} Document
                    </p>
                  </div>
                  <a
                    href={student.resume.dataUrl}
                    download={student.resume.name}
                    className="btn btn-primary btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1.1rem',
                      textDecoration: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                  </a>
                </div>
              </div>
            ) : (
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                {canEdit ? 'Upload your CV or resume using the button above.' : 'No CV or resume uploaded yet.'}
              </p>
            )}
          </div>

          {/* Project Showcase Section */}
          {student.projects && student.projects.length > 0 && (
            <div className="profile-section glass">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                Project Showreel
              </h2>
              <div className="projects-grid">
                {student.projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="project-item">
                    <h3>
                      <span>{proj.title}</span>
                      {proj.link && (
                        <a 
                          href={proj.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm project-link"
                          style={{ minHeight: '32px', padding: '0 0.75rem', textDecoration: 'none' }}
                        >
                          View Project ↗
                        </a>
                      )}
                    </h3>
                    <p>{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photo Gallery Section */}
          {(((student.photos && student.photos.length > 0) || canEdit)) && (
            <div className="profile-section glass">
              <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Photo Gallery
                </div>
                {canEdit && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="file" 
                      id="inplace-photo-upload" 
                      accept="image/png, image/jpeg, image/jpg" 
                      style={{ display: 'none' }} 
                      onChange={handleInPlacePhotoUpload} 
                    />
                    <label 
                      htmlFor="inplace-photo-upload" 
                      className="btn btn-secondary btn-sm" 
                      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', minHeight: '30px', padding: '0.3rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '11px', height: '11px' }}>
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Upload Photo
                    </label>
                  </div>
                )}
              </h2>
              
              {student.photos && student.photos.length > 0 ? (
                <div className="gallery-grid">
                  {student.photos.map((photo, idx) => (
                    <div 
                      key={photo.id || idx} 
                      className="gallery-item"
                      onClick={() => openLightbox(idx)}
                      style={{ position: 'relative' }}
                    >
                      <img src={photo.url} alt={photo.caption || `Gallery photo ${idx + 1}`} />
                      {photo.caption && (
                        <div className="gallery-caption-overlay">
                          <span>{photo.caption}</span>
                        </div>
                      )}
                      
                      {canEdit && (
                        <div 
                          className="gallery-item-controls"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            display: 'flex',
                            gap: '0.35rem',
                            zIndex: 10,
                            opacity: 0,
                            transition: 'opacity var(--transition-fast)'
                          }}
                        >
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{
                              padding: '0.2rem',
                              minHeight: '26px',
                              minWidth: '26px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(255, 255, 255, 0.9)',
                              border: '1px solid var(--border-color)',
                              color: 'var(--text-primary)',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}
                            onClick={() => handleInPlaceEditCaption(photo.id, photo.caption)}
                            title="Edit Caption"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}>
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            style={{
                              padding: '0.2rem',
                              minHeight: '26px',
                              minWidth: '26px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(255, 240, 240, 0.9)',
                              borderColor: 'var(--danger-border)',
                              color: 'var(--danger)',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                            }}
                            onClick={() => handleInPlaceRemovePhoto(photo.id)}
                            title="Remove Photo"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}>
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  No photos in your gallery yet. Click "Upload Photo" to add some showcase images!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="profile-sidebar">
          {/* Contact Cards Sidebar */}
          <div className="profile-section glass">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Get In Touch
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <p style={{ fontSize: '0.85rem' }}>
                Interested in working together or discussing opportunities? Feel free to reach out.
              </p>
              <a 
                href={`mailto:${student.email}`} 
                className="btn btn-primary" 
                style={{ width: '100%', minHeight: '40px', textDecoration: 'none' }}
              >
                Send an Email
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && student.photos && student.photos[photoIndex] && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close Lightbox">
            &times;
          </button>
          
          {student.photos.length > 1 && (
            <>
              <button className="lightbox-prev" onClick={prevPhoto} aria-label="Previous Photo">
                &#10094;
              </button>
              <button className="lightbox-next" onClick={nextPhoto} aria-label="Next Photo">
                &#10095;
              </button>
            </>
          )}

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={student.photos[photoIndex].url} 
              alt={student.photos[photoIndex].caption || `Gallery view ${photoIndex + 1}`} 
              className="lightbox-image"
            />
            {student.photos[photoIndex].caption && (
              <div className="lightbox-caption">
                {student.photos[photoIndex].caption}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Viewer Modal for Profile Picture / Banner */}
      {viewerImage && (
        <div 
          className="lightbox-overlay" 
          onClick={() => { setViewerImage(null); setViewerCaption(''); }}
          style={{ zIndex: 10000 }}
        >
          <button 
            className="lightbox-close" 
            onClick={() => { setViewerImage(null); setViewerCaption(''); }} 
            aria-label="Close Viewer"
          >
            &times;
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={viewerImage} 
              alt={viewerCaption || 'Full size view'} 
              className="lightbox-image"
              style={{ borderRadius: '8px' }}
            />
            {viewerCaption && (
              <div className="lightbox-caption">
                {viewerCaption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
</div>
  );
};
export default ProfileDetail;
