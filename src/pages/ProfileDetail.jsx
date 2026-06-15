import React, { useEffect, useState } from 'react';
import { getStudentById, deleteStudentProfileAndAccount, signOut } from '../utils/storage';
import { AvatarImage } from '../components/AvatarPicker';

export const ProfileDetail = ({ params, currentUser, navigateTo, onLogoutSuccess }) => {
  const [student, setStudent] = useState(null);
  const studentId = params?.id;

  // Lightbox Modal States
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (studentId) {
      setStudent(getStudentById(studentId));
    }
  }, [studentId]);

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
        <button className="btn btn-primary" onClick={() => navigateTo('directory')}>
          Back to Directory
        </button>
      </div>
    );
  }

  // Check if the current viewed page belongs to the logged-in student
  const isOwnProfile = currentUser && currentUser.studentId === student.id;
  const canEdit = isOwnProfile || (currentUser && currentUser.isAdmin);

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
          if (onLogoutSuccess) onLogoutSuccess();
          navigateTo('home');
        }
      }
    }
  };

  return (
    <div className="profile-detail-page" style={{ position: 'relative' }}>
      <div className="container" style={{ position: 'relative', height: 0, zIndex: 100 }}>
        <button 
          className="btn btn-secondary btn-sm" 
          style={{ 
            position: 'absolute', 
            top: '1.5rem', 
            left: '2rem', 
            minHeight: '34px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)'
          }}
          onClick={() => navigateTo('directory')}
        >
          ← Back to Directory
        </button>
      </div>

      {/* Full Width Cover Photo */}
      <div 
        style={{ 
          width: '100%', 
          aspectRatio: '21 / 9', 
          background: student.coverPhotoUrl ? `url(${student.coverPhotoUrl}) center/cover no-repeat` : 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)'
        }}
      ></div>

      <div className="container profile-detail" style={{ marginTop: '-80px' }}>

        {/* Owner / Admin Management Banner */}
        {canEdit && (
          <div 
            className="glass"
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
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.1rem', fontWeight: 600 }}>
                {currentUser?.isAdmin && currentUser.studentId !== student.id ? "Admin Management Panel" : "This is your public portfolio"}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {currentUser?.isAdmin && currentUser.studentId !== student.id 
                  ? "As an administrator, you have full permissions to edit or delete this student portfolio."
                  : "You can edit these details, upload cover/profile photos, add projects, and update tags at any time."
                }
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                className="btn btn-primary btn-sm" 
                style={{ minHeight: '32px' }}
                onClick={() => navigateTo('edit-profile', { id: student.id })}
              >
                Edit Portfolio
              </button>
              <button 
                className="btn btn-danger btn-sm" 
                style={{ minHeight: '32px' }}
                onClick={handleDeleteProfile}
              >
                Delete Portfolio
              </button>
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
            <div style={{ 
              width: '150px', 
              height: '150px', 
              flexShrink: 0, 
              borderRadius: '50%', 
              overflow: 'hidden',
              border: '6px solid var(--bg-card)',
              background: 'var(--bg-card)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              marginTop: '-50px'
            }}>
              <AvatarImage avatarId={student.avatarId} id={`detail-${student.id}`} />
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
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              About Me
            </h2>
            <p className="about-text">{student.aboutMe || "No detailed description written yet."}</p>
          </div>

          {/* Project Showcase Section */}
          <div className="profile-section glass">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Project Showreel
            </h2>
            {student.projects && student.projects.length > 0 ? (
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
            ) : (
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                No projects added to showcase yet. Check back soon!
              </p>
            )}
          </div>

          {/* Photo Gallery Section */}
          {student.photos && student.photos.length > 0 && (
            <div className="profile-section glass">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Photo Gallery
              </h2>
              <div className="gallery-grid">
                {student.photos.map((photo, idx) => (
                  <div 
                    key={photo.id || idx} 
                    className="gallery-item"
                    onClick={() => openLightbox(idx)}
                  >
                    <img src={photo.url} alt={photo.caption || `Gallery photo ${idx + 1}`} />
                    {photo.caption && (
                      <div className="gallery-caption-overlay">
                        <span>{photo.caption}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div>
          {/* Skills Section */}
          <div className="profile-section glass">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
    </div>
  </div>
  );
};
export default ProfileDetail;
