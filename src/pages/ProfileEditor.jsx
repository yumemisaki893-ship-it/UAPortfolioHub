import React, { useState, useEffect } from 'react';
import { getStudentById, getStudentByIdSync, updateStudentProfile } from '../utils/storage';
import { AvatarPicker, AvatarImage } from '../components/AvatarPicker';
import { ProjectManager } from '../components/ProjectManager';

export const ProfileEditor = ({ currentUser, params, navigateTo, onProfileUpdate }) => {
  const targetStudentId = (currentUser?.isAdmin && params?.id) 
    ? params.id 
    : currentUser?.studentId;

  // Optimistic fast initialization from cache
  const initialProfile = (currentUser?.student && currentUser.student.id === targetStudentId)
    ? currentUser.student
    : getStudentByIdSync(targetStudentId);

  const [student, setStudent] = useState(initialProfile);
  
  // Form states
  const [name, setName] = useState(initialProfile?.name || '');
  const [major, setMajor] = useState(initialProfile?.major || '');
  const [avatarId, setAvatarId] = useState(initialProfile?.avatarId || 'avatar-1');
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(initialProfile?.coverPhotoUrl || '');
  const [shortBio, setShortBio] = useState(initialProfile?.shortBio || '');
  const [aboutMe, setAboutMe] = useState(initialProfile?.aboutMe || '');
  const [skills, setSkills] = useState(initialProfile?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [github, setGithub] = useState(initialProfile?.github || '');
  const [linkedin, setLinkedin] = useState(initialProfile?.linkedin || '');
  const [website, setWebsite] = useState(initialProfile?.website || '');
  const [facebook, setFacebook] = useState(initialProfile?.facebook || '');
  const [instagram, setInstagram] = useState(initialProfile?.instagram || '');
  const [twitter, setTwitter] = useState(initialProfile?.twitter || '');
  const [contactNumber, setContactNumber] = useState(initialProfile?.contactNumber || '');
  const [projects, setProjects] = useState(initialProfile?.projects || []);
  const [photos, setPhotos] = useState(initialProfile?.photos || []);
  const [isPublic, setIsPublic] = useState(initialProfile?.isPublic !== false);
  const [resume, setResume] = useState(initialProfile?.resume || null);

  // New states: Educational Background
  const initialEdu = initialProfile?.education || {};
  const [elemenSchool, setElemenSchool] = useState(initialEdu.elementary?.school || '');
  const [elemenYears, setElemenYears] = useState(initialEdu.elementary?.years || '');
  const [jhsSchool, setJhsSchool] = useState(initialEdu.juniorHigh?.school || '');
  const [jhsYears, setJhsYears] = useState(initialEdu.juniorHigh?.years || '');
  const [shsSchool, setShsSchool] = useState(initialEdu.seniorHigh?.school || '');
  const [shsStrand, setShsStrand] = useState(initialEdu.seniorHigh?.strand || '');
  const [shsYears, setShsYears] = useState(initialEdu.seniorHigh?.years || '');
  const [collegeSchool, setCollegeSchool] = useState(initialEdu.college?.school || '');
  const [collegeDegree, setCollegeDegree] = useState(initialEdu.college?.degree || '');
  const [collegeYears, setCollegeYears] = useState(initialEdu.college?.years || '');

  // New states: Work Experience List
  const [experiences, setExperiences] = useState(initialProfile?.experience || []);
  // Inputs for adding new experience
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // New states: Seminars & Trainings List
  const [seminars, setSeminars] = useState(initialProfile?.seminars || []);
  // Inputs for adding new seminar
  const [semTitle, setSemTitle] = useState('');
  const [semOrganizer, setSemOrganizer] = useState('');
  const [semDate, setSemDate] = useState('');
  const [semDesc, setSemDesc] = useState('');

  // New states: Certificates List
  const [certificates, setCertificates] = useState(initialProfile?.certificates || []);
  // Inputs for adding new certificate
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certUrl, setCertUrl] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load student profile details on mount
  useEffect(() => {
    if (!currentUser) {
      navigateTo('auth');
      return;
    }
    
    const loadProfile = async () => {
      let profile = null;
      if (currentUser.student && currentUser.student.id === targetStudentId) {
        profile = currentUser.student;
      } else {
        profile = await getStudentById(targetStudentId);
      }
      
      if (!profile) {
        // Auto-recreate missing profile if deleted
        const namePart = currentUser.email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        profile = {
          id: targetStudentId,
          name: formattedName,
          major: "Undeclared",
          avatarId: `avatar-${Math.floor(Math.random() * 8) + 1}`,
          shortBio: "Welcome to my new student portfolio! Click edit to fill in details.",
          aboutMe: "I haven't written my bio yet. Stay tuned!",
          skills: [],
          email: currentUser.email,
          isPublic: true,
          github: "",
          linkedin: "",
          website: "",
          facebook: "",
          instagram: "",
          twitter: "",
          contactNumber: "",
          photos: [],
          projects: [],
          resume: null
        };
        await updateStudentProfile(targetStudentId, profile);
      }
      
      if (profile) {
        const isStudentSwitched = !student || student.id !== profile.id;
        setStudent(profile);
        if (isStudentSwitched) {
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

          const edu = profile.education || {};
          setElemenSchool(edu.elementary?.school || '');
          setElemenYears(edu.elementary?.years || '');
          setJhsSchool(edu.juniorHigh?.school || '');
          setJhsYears(edu.juniorHigh?.years || '');
          setShsSchool(edu.seniorHigh?.school || '');
          setShsStrand(edu.seniorHigh?.strand || '');
          setShsYears(edu.seniorHigh?.years || '');
          setCollegeSchool(edu.college?.school || '');
          setCollegeDegree(edu.college?.degree || '');
          setCollegeYears(edu.college?.years || '');

          setExperiences(profile.experience || []);
          setSeminars(profile.seminars || []);
          setCertificates(profile.certificates || []);
        }
      }
    };
    loadProfile();
  }, [currentUser, targetStudentId]);

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





  // Helper to add a skill from input value
  const addSkill = (val) => {
    const cleanVal = val.trim().replace(/,$/, '');
    if (cleanVal && !skills.includes(cleanVal)) {
      setSkills([...skills, cleanVal]);
    }
  };

  // Handle Skills Tag Adding (keyboard)
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
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
        resume,
        education: {
          elementary: { school: elemenSchool, years: elemenYears },
          juniorHigh: { school: jhsSchool, years: jhsYears },
          seniorHigh: { school: shsSchool, strand: shsStrand, years: shsYears },
          college: { school: collegeSchool, degree: collegeDegree, years: collegeYears }
        },
        experience: experiences,
        seminars: seminars,
        certificates: certificates
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
                    placeholder="e.g. Bachelor of Elementary Education"
                    required
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                  />
                  <datalist id="major-options">
                    <option value="Bachelor of Elementary Education" />
                    <option value="Bachelor of Secondary Education" />
                    <option value="Bachelor of Science in Agriculture" />
                    <option value="Bachelor of Science in Fisheries" />
                    <option value="Bachelor of Science in Forestry" />
                    <option value="Bachelor of Science in Information Technology" />
                    <option value="Bachelor of Science in Computer Science" />
                    <option value="Bachelor of Science in Business Administration" />
                    <option value="Bachelor of Science in Office Administration" />
                    <option value="Bachelor of Science in Hospitality Management" />
                    <option value="Bachelor of Science in Tourism Management" />
                    <option value="Bachelor of Science in Nursing" />
                    <option value="Bachelor of Science in Social Work" />
                    <option value="Bachelor of Science in Criminology" />
                    <option value="Bachelor of Arts in English" />
                    <option value="Bachelor of Arts in Filipino" />
                    <option value="Bachelor of Science in Environmental Science" />
                    <option value="Bachelor of Public Administration" />
                  </datalist>
                  <div className="form-error-msg">Please specify your major.</div>
                </div>
              </div>

              {/* Tagline Bio */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-tagline">Tagline Bio (Short Summary) *</label>
                <span className="form-hint" id="tagline-hint">A single sentence appearing on your directory card. E.g. aspiring teacher, agriculture enthusiast, future nurse</span>
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
                <span className="form-hint">Tell visitors about your background, interests, goals, and what you are passionate about.</span>
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

            {/* Educational Background Card */}
            <div className="editor-form-card glass">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Educational Background</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Fill in details about your academic progress across all stages.
              </p>

              {/* College */}
              <div style={{ borderBottom: '1px dashed var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>College / University</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="edu-college-school">School / University Name</label>
                    <input
                      type="text"
                      id="edu-college-school"
                      className="form-control"
                      placeholder="e.g. University of Antique"
                      value={collegeSchool}
                      onChange={(e) => setCollegeSchool(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ maxWidth: '180px' }}>
                    <label className="form-label" htmlFor="edu-college-years">Years / Period</label>
                    <input
                      type="text"
                      id="edu-college-years"
                      className="form-control"
                      placeholder="e.g. 2022 - Present"
                      value={collegeYears}
                      onChange={(e) => setCollegeYears(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label" htmlFor="edu-college-degree">Degree / Course Name</label>
                  <input
                    type="text"
                    id="edu-college-degree"
                    className="form-control"
                    placeholder="e.g. Bachelor of Science in Office Administration"
                    value={collegeDegree}
                    onChange={(e) => setCollegeDegree(e.target.value)}
                  />
                </div>
              </div>

              {/* Senior High School */}
              <div style={{ borderBottom: '1px dashed var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>High School (Senior High)</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="edu-shs-school">School Name</label>
                    <input
                      type="text"
                      id="edu-shs-school"
                      className="form-control"
                      placeholder="e.g. Antique National School"
                      value={shsSchool}
                      onChange={(e) => setShsSchool(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ maxWidth: '180px' }}>
                    <label className="form-label" htmlFor="edu-shs-years">Years / Period</label>
                    <input
                      type="text"
                      id="edu-shs-years"
                      className="form-control"
                      placeholder="e.g. 2020 - 2022"
                      value={shsYears}
                      onChange={(e) => setShsYears(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label" htmlFor="edu-shs-strand">Track / Strand</label>
                  <input
                    type="text"
                    id="edu-shs-strand"
                    className="form-control"
                    placeholder="e.g. TVL - Information and Communications Technology"
                    value={shsStrand}
                    onChange={(e) => setShsStrand(e.target.value)}
                  />
                </div>
              </div>

              {/* Junior High School */}
              <div style={{ borderBottom: '1px dashed var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>High School (Junior High)</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="edu-jhs-school">School Name</label>
                    <input
                      type="text"
                      id="edu-jhs-school"
                      className="form-control"
                      placeholder="e.g. Antique National School"
                      value={jhsSchool}
                      onChange={(e) => setJhsSchool(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ maxWidth: '180px' }}>
                    <label className="form-label" htmlFor="edu-jhs-years">Years / Period</label>
                    <input
                      type="text"
                      id="edu-jhs-years"
                      className="form-control"
                      placeholder="e.g. 2016 - 2020"
                      value={jhsYears}
                      onChange={(e) => setJhsYears(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Elementary */}
              <div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>Elementary School</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="edu-elem-school">School Name</label>
                    <input
                      type="text"
                      id="edu-elem-school"
                      className="form-control"
                      placeholder="e.g. San Jose Elementary School"
                      value={elemenSchool}
                      onChange={(e) => setElemenSchool(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ maxWidth: '180px' }}>
                    <label className="form-label" htmlFor="edu-elem-years">Years / Period</label>
                    <input
                      type="text"
                      id="edu-elem-years"
                      className="form-control"
                      placeholder="e.g. 2010 - 2016"
                      value={elemenSchool ? elemenYears : ''}
                      onChange={(e) => setElemenYears(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience Card */}
            <div className="editor-form-card glass">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Work Experience</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Add relevant internships, part-time jobs, or freelance project roles.
              </p>

              {/* List of existing experiences */}
              <div style={{ marginBottom: '1.5rem' }}>
                {experiences.length === 0 ? (
                  <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No work experiences added yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {experiences.map((exp, idx) => (
                      <div key={exp.id || idx} className="project-editor-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'left' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{exp.title}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>{exp.company} | <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{exp.period}</span></span>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{exp.description}</p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          style={{ minHeight: '28px', padding: '0 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => setExperiences(prev => prev.filter(item => item.id !== exp.id))}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Experience Panel */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Add Work Experience</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-exp-title">Job Title / Role *</label>
                    <input
                      type="text"
                      id="new-exp-title"
                      className="form-control"
                      placeholder="e.g. Intern Developer"
                      value={expTitle}
                      onChange={(e) => setExpTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-exp-company">Company / Organization *</label>
                    <input
                      type="text"
                      id="new-exp-company"
                      className="form-control"
                      placeholder="e.g. Tech Solutions Inc."
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label" htmlFor="new-exp-period">Period / Duration *</label>
                  <input
                    type="text"
                    id="new-exp-period"
                    className="form-control"
                    placeholder="e.g. Jun 2025 - Aug 2025 or 3 Months"
                    value={expPeriod}
                    onChange={(e) => setExpPeriod(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label" htmlFor="new-exp-desc">Description of Duties</label>
                  <textarea
                    id="new-exp-desc"
                    className="form-control"
                    placeholder="Briefly describe what you did or achieved in this role..."
                    rows="3"
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: '0.75rem' }}
                  onClick={() => {
                    if (!expTitle.trim() || !expCompany.trim() || !expPeriod.trim()) return;
                    setExperiences(prev => [...prev, {
                      id: `exp-${Date.now()}`,
                      title: expTitle.trim(),
                      company: expCompany.trim(),
                      period: expPeriod.trim(),
                      description: expDesc.trim()
                    }]);
                    setExpTitle('');
                    setExpCompany('');
                    setExpPeriod('');
                    setExpDesc('');
                  }}
                  disabled={!expTitle.trim() || !expCompany.trim() || !expPeriod.trim()}
                >
                  Add Experience
                </button>
              </div>
            </div>

            {/* Seminars & Trainings Card */}
            <div className="editor-form-card glass">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Seminars & Trainings</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Add academic seminars, workshops, bootcamps, or technology summits you attended.
              </p>

              {/* List of existing seminars */}
              <div style={{ marginBottom: '1.5rem' }}>
                {seminars.length === 0 ? (
                  <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No seminars added yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {seminars.map((sem, idx) => (
                      <div key={sem.id || idx} className="project-editor-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'left' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{sem.title}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>Organized by {sem.organizer} | <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{sem.date}</span></span>
                          {sem.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0', lineHeight: '1.4' }}>{sem.description}</p>}
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          style={{ minHeight: '28px', padding: '0 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => setSeminars(prev => prev.filter(item => item.id !== sem.id))}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Seminar Panel */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Add Seminar / Workshop</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-sem-title">Seminar / Topic Title *</label>
                    <input
                      type="text"
                      id="new-sem-title"
                      className="form-control"
                      placeholder="e.g. National IT Summit 2025"
                      value={semTitle}
                      onChange={(e) => setSemTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-sem-org">Organizer / Host *</label>
                    <input
                      type="text"
                      id="new-sem-org"
                      className="form-control"
                      placeholder="e.g. DICT Antique"
                      value={semOrganizer}
                      onChange={(e) => setSemOrganizer(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label" htmlFor="new-sem-date">Date Attended *</label>
                  <input
                    type="text"
                    id="new-sem-date"
                    className="form-control"
                    placeholder="e.g. October 15, 2025"
                    value={semDate}
                    onChange={(e) => setSemDate(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label" htmlFor="new-sem-desc">Short Description / Key Learnings</label>
                  <textarea
                    id="new-sem-desc"
                    className="form-control"
                    placeholder="What did you learn or earn in this training?"
                    rows="2"
                    value={semDesc}
                    onChange={(e) => setSemDesc(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: '0.75rem' }}
                  onClick={() => {
                    if (!semTitle.trim() || !semOrganizer.trim() || !semDate.trim()) return;
                    setSeminars(prev => [...prev, {
                      id: `sem-${Date.now()}`,
                      title: semTitle.trim(),
                      organizer: semOrganizer.trim(),
                      date: semDate.trim(),
                      description: semDesc.trim()
                    }]);
                    setSemTitle('');
                    setSemOrganizer('');
                    setSemDate('');
                    setSemDesc('');
                  }}
                  disabled={!semTitle.trim() || !semOrganizer.trim() || !semDate.trim()}
                >
                  Add Seminar
                </button>
              </div>
            </div>

            {/* Certificates Card */}
            <div className="editor-form-card glass">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Certificates & Credentials</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Add certifications, course achievements, or professional badges you have earned.
              </p>

              {/* List of existing certificates */}
              <div style={{ marginBottom: '1.5rem' }}>
                {certificates.length === 0 ? (
                  <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No certificates added yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {certificates.map((cert, idx) => (
                      <div key={cert.id || idx} className="project-editor-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'left' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{cert.name}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>Issued by {cert.issuer} | <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{cert.date}</span></span>
                          {cert.url && (
                            <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>
                              View Credential &rarr;
                            </a>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          style={{ minHeight: '28px', padding: '0 0.5rem', fontSize: '0.75rem' }}
                          onClick={() => setCertificates(prev => prev.filter(item => item.id !== cert.id))}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Certificate Panel */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Add Certification / Course Badge</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-cert-name">Certificate Name *</label>
                    <input
                      type="text"
                      id="new-cert-name"
                      className="form-control"
                      placeholder="e.g. AWS Certified Cloud Practitioner"
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="new-cert-issuer">Issuing Organization *</label>
                    <input
                      type="text"
                      id="new-cert-issuer"
                      className="form-control"
                      placeholder="e.g. Amazon Web Services"
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label" htmlFor="new-cert-date">Date Issued *</label>
                  <input
                    type="text"
                    id="new-cert-date"
                    className="form-control"
                    placeholder="e.g. January 2026"
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label className="form-label" htmlFor="new-cert-url">Credential URL (Link)</label>
                  <input
                    type="url"
                    id="new-cert-url"
                    className="form-control"
                    placeholder="https://credly.com/your-badge-url"
                    value={certUrl}
                    onChange={(e) => setCertUrl(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', marginTop: '0.75rem' }}
                  onClick={() => {
                    if (!certName.trim() || !certIssuer.trim() || !certDate.trim()) return;
                    setCertificates(prev => [...prev, {
                      id: `cert-${Date.now()}`,
                      name: certName.trim(),
                      issuer: certIssuer.trim(),
                      date: certDate.trim(),
                      url: certUrl.trim()
                    }]);
                    setCertName('');
                    setCertIssuer('');
                    setCertDate('');
                    setCertUrl('');
                  }}
                  disabled={!certName.trim() || !certIssuer.trim() || !certDate.trim()}
                >
                  Add Certificate
                </button>
              </div>
            </div>

            {/* Dynamic Skills Tags Card */}
            <div className="editor-form-card glass">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Skills & Tags</h2>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Add keyword tags representing your skills, expertise, certifications, or areas of interest.
              </p>

              <div className="form-group">
                <label className="form-label" htmlFor="skill-tag-input">Add Skills</label>
                <span className="form-hint" id="skills-hint">Type a skill (e.g. Leadership, Research, Public Speaking) and press <strong>Enter</strong> or comma to add.</span>
                
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
                    placeholder={skills.length === 0 ? "e.g. Leadership" : "Add more..."}
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    aria-describedby="skills-hint"
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm add-skill-btn"
                    onClick={() => { addSkill(skillInput); setSkillInput(''); }}
                    style={{ marginLeft: '0.5rem', minHeight: '34px' }}
                  >Add</button>
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
