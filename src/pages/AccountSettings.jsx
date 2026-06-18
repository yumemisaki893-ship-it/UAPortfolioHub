import { useState, useEffect } from 'react';
import { 
  getStudentById, 
  getStudentByIdSync, 
  updateStudentProfile,
  updateUserEmail, 
  updateUserPassword, 
  deleteStudentProfileAndAccount, 
  signOut 
} from '../utils/storage';
import { AvatarPicker, AvatarImage } from '../components/AvatarPicker';
import { ProjectManager } from '../components/ProjectManager';

export const AccountSettings = ({ currentUser, params, navigateTo, onProfileUpdate, initialTab = 'profile' }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'profile' | 'security'
  
  const targetStudentId = (currentUser?.isAdmin && params?.id) 
    ? params.id 
    : currentUser?.studentId;

  // Optimistic fast initialization from cache
  const initialProfile = (currentUser?.student && currentUser.student.id === targetStudentId)
    ? currentUser.student
    : getStudentByIdSync(targetStudentId);

  const [student, setStudent] = useState(initialProfile);
  
  // Profile Form states
  const [name, setName] = useState(initialProfile?.name || '');
  const [major, setMajor] = useState(initialProfile?.major || '');
  const [campus, setCampus] = useState(initialProfile?.campus || 'Sibalom (Main Campus)');
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

  // Educational Background states
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

  // Work Experience states
  const [experiences, setExperiences] = useState(initialProfile?.experience || []);
  const [expTitle, setExpTitle] = useState('');
  const [expCompany, setExpCompany] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Seminars & Trainings states
  const [seminars, setSeminars] = useState(initialProfile?.seminars || []);
  const [semTitle, setSemTitle] = useState('');
  const [semOrganizer, setSemOrganizer] = useState('');
  const [semDate, setSemDate] = useState('');
  const [semDesc, setSemDesc] = useState('');

  // Certificates states
  const [certificates, setCertificates] = useState(initialProfile?.certificates || []);
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certUrl, setCertUrl] = useState('');

  // Profile Save Status
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '' | 'saving' | 'saved' | 'error'
  // Extra validation error states
  const [websiteError, setWebsiteError] = useState('');
  const [linkedinError, setLinkedinError] = useState('');
  const [twitterError, setTwitterError] = useState('');
  const [contactError, setContactError] = useState('');

  // Set initialized to true once the profile is loaded and states are filled
  useEffect(() => {
    if (student) {
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [student]);

  // Account Security states
  const [newEmail, setNewEmail] = useState(initialProfile?.email || '');
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Load active tab prop
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const [isLoading, setIsLoading] = useState(!initialProfile);

  // Update loading state after profile load
  useEffect(() => {
    if (student) {
      setIsLoading(false);
    }
  }, [student]);

  // Load student profile details on mount or ID switch
  useEffect(() => {
    if (!currentUser) return;
    
    const loadProfile = async () => {
      let profile;
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
          campus: "Sibalom (Main Campus)",
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
        setNewEmail(profile.email || '');
        if (isStudentSwitched) {
          setName(profile.name || '');
          setMajor(profile.major || '');
          setCampus(profile.campus || 'Sibalom (Main Campus)');
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

  if (!currentUser || isLoading) {
    return (
      <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2>Loading Account Settings...</h2>
      </div>
    );
  }

  // Handle profile image uploads
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
      alert('Please upload JPEG, JPG, or PNG format images only.');
      return;
    }

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
        setAvatarId(reader.result);
      } else {
        setCoverPhotoUrl(reader.result);
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

  // Resume attachment
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

  const addSkill = (val) => {
    const cleanVal = val.trim().replace(/,$/, '');
    if (cleanVal && !skills.includes(cleanVal)) {
      setSkills([...skills, cleanVal]);
    }
  };

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

  // Auto-save settings changes
  useEffect(() => {
    if (!isInitialized || !student) return;

    // Check if anything has actually changed from baseline student profile
    const hasChanged = 
      name !== (student.name || '') ||
      major !== (student.major || '') ||
      avatarId !== (student.avatarId || 'avatar-1') ||
      coverPhotoUrl !== (student.coverPhotoUrl || '') ||
      shortBio !== (student.shortBio || '') ||
      aboutMe !== (student.aboutMe || '') ||
      JSON.stringify(skills) !== JSON.stringify(student.skills || []) ||
      github !== (student.github || '') ||
      linkedin !== (student.linkedin || '') ||
      website !== (student.website || '') ||
      facebook !== (student.facebook || '') ||
      instagram !== (student.instagram || '') ||
      twitter !== (student.twitter || '') ||
      contactNumber !== (student.contactNumber || '') ||
      JSON.stringify(projects) !== JSON.stringify(student.projects || []) ||
      JSON.stringify(photos) !== JSON.stringify(student.photos || []) ||
      isPublic !== (student.isPublic !== false) ||
      JSON.stringify(resume) !== JSON.stringify(student.resume || null) ||
      elemenSchool !== (student.education?.elementary?.school || '') ||
      elemenYears !== (student.education?.elementary?.years || '') ||
      jhsSchool !== (student.education?.juniorHigh?.school || '') ||
      jhsYears !== (student.education?.juniorHigh?.years || '') ||
      shsSchool !== (student.education?.seniorHigh?.school || '') ||
      shsStrand !== (student.education?.seniorHigh?.strand || '') ||
      shsYears !== (student.education?.seniorHigh?.years || '') ||
      collegeSchool !== (student.education?.college?.school || '') ||
      collegeDegree !== (student.education?.college?.degree || '') ||
      collegeYears !== (student.education?.college?.years || '') ||
      JSON.stringify(experiences) !== JSON.stringify(student.experience || []) ||
      JSON.stringify(seminars) !== JSON.stringify(student.seminars || []) ||
      JSON.stringify(certificates) !== JSON.stringify(student.certificates || []);

    if (!hasChanged) return;
    if (!name.trim()) return; // Don't auto-save if name is empty (required)

    setAutoSaveStatus('saving');
    
    const delayDebounceFn = setTimeout(async () => {
      // Validate URLs and phone numbers silently for auto-save
      const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;
      const linkedinRegex = /linkedin\.com\/in\//i;
      const twitterRegex = /twitter\.com\/|x\.com\//i;
      const phoneRegex = /^\+?\d{7,15}$/;

      if (website && !urlRegex.test(website)) {
        setAutoSaveStatus('error');
        return;
      }
      if (linkedin && !linkedinRegex.test(linkedin)) {
        setAutoSaveStatus('error');
        return;
      }
      if (twitter && !twitterRegex.test(twitter)) {
        setAutoSaveStatus('error');
        return;
      }
      if (contactNumber && !phoneRegex.test(contactNumber.replace(/[^\d+]/g, ''))) {
        setAutoSaveStatus('error');
        return;
      }

      try {
        const updatedProfile = await updateStudentProfile(student.id, {
          name,
          major,
          campus,
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

        setStudent(updatedProfile); // update baseline student object
        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(''), 3000);
      } catch (err) {
        console.error('Auto-save failed:', err);
        setAutoSaveStatus('error');
      }
    }, 1500);

    return () => clearTimeout(delayDebounceFn);
  }, [
    isInitialized,
    name,
    major,
    campus,
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
    elemenSchool,
    elemenYears,
    jhsSchool,
    jhsYears,
    shsSchool,
    shsStrand,
    shsYears,
    collegeSchool,
    collegeDegree,
    collegeYears,
    experiences,
    seminars,
    certificates,
    student
  ]);

  // Handle Edit Settings Profile Submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSaveSuccess(false);

    const form = e.currentTarget;
    // Reset extra validation errors
    setWebsiteError('');
    setLinkedinError('');
    setTwitterError('');
    setContactError('');

    // Basic HTML5 validation
    if (!form.checkValidity()) {
      return;
    }

    // Extra URL/phone validations
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;
    const linkedinRegex = /linkedin\.com\/in\//i;
    const twitterRegex = /twitter\.com\/|x\.com\//i;
    const phoneRegex = /^\+?\d{7,15}$/;

    if (website && !urlRegex.test(website)) {
      setWebsiteError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }
    if (linkedin && !linkedinRegex.test(linkedin)) {
      setLinkedinError('LinkedIn URL should contain "linkedin.com/in/".');
      return;
    }
    if (twitter && !twitterRegex.test(twitter)) {
      setTwitterError('Twitter URL should contain "twitter.com" or "x.com".');
      return;
    }
    if (contactNumber && !phoneRegex.test(contactNumber.replace(/[^\d+]/g, ''))) {
      setContactError('Enter a valid phone number (7-15 digits, optional leading +).');
      return;
    }

    try {
      const updatedProfile = await updateStudentProfile(student.id, {
        name,
        major,
        campus,
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        navigateTo('profile-detail', { id: student.id });
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update profile. Please check inputs.');
    }
  };

  // Handle Security Email Update
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

  // Handle Security Password Update
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

  // Delete profile
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
    <div className="app-page-wrapper">
      <div className="container editor-page animate-fade-in" style={{ paddingBottom: '4rem', paddingTop: '2.5rem' }}>
        
        {/* Title Header */}
        <div className="animate-slide-up" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>Account Settings</h1>
        </div>

        {/* Tabs Selector Navigation */}
        <div className="settings-tabs-container animate-slide-up-delay-1">
        <button 
          className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => navigateTo('edit-profile', params)}
        >
          Edit Profile Details
        </button>
        <button 
          className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => navigateTo('security-settings', params)}
        >
          Account Security & Credentials
        </button>
      </div>

      {saveSuccess && (
        <div className="auth-msg auth-msg-success" style={{ marginBottom: '2rem' }}>
          Portfolio updated successfully! Redirecting to your public profile page...
        </div>
      )}

      {errorMessage && (
        <div className="auth-msg auth-msg-error" style={{ marginBottom: '2rem' }}>
          Error: {errorMessage}
        </div>
      )}

      {/* Tab 1: Edit Profile Details Section */}
      {activeTab === 'profile' && (
        <form id="profile-edit-form" onSubmit={handleProfileSubmit} className="animate-slide-up-delay-2">
          <div className="editor-grid">
            
            {/* LEFT SIDEBAR: Avatar & Core Information */}
            <div className="editor-sidebar glass">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Profile Identity</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Choose a representative character profile image for the directory.
              </p>
              
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

              <AvatarPicker selectedId={avatarId} onSelect={setAvatarId} />

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
                />
                <span className="form-hint" style={{ marginTop: '0.4rem' }}>
                  To change email, navigate to the <strong>Account Security</strong> tab.
                </span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.25rem 0' }} />
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={isPublic} 
                    onChange={(e) => setIsPublic(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                  />
                  <span>Make Profile Public</span>
                </label>
                <span className="form-hint" style={{ marginTop: '0.5rem', display: 'block' }}>
                  If unchecked, your profile will be hidden from the public directory page. Only administrators can view it.
                </span>
              </div>
            </div>

            {/* RIGHT MAIN FORMS: Profile Details */}
            <div className="editor-main">
              
              {/* Cover Photo Backdrop Card */}
              <div className="editor-form-card glass">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Cover Photo Backdrop</h2>
                <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Upload a wide billboard image to display at the top of your profile header (JPEG or PNG, max 300KB).
                </p>

                {coverPhotoUrl && (
                  <div style={{ position: 'relative', width: '100%', height: '140px', overflow: 'hidden', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', marginBottom: '1rem' }}>
                    <img src={coverPhotoUrl} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      type="button" 
                      className="btn btn-danger btn-sm"
                      onClick={() => setCoverPhotoUrl('')}
                      style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', minHeight: '30px' }}
                    >
                      Delete
                    </button>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <input
                    type="file"
                    id="cover-upload"
                    accept="image/jpeg, image/jpg, image/png"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(e, 'cover')}
                  />
                  <label htmlFor="cover-upload" className="btn btn-secondary" style={{ cursor: 'pointer', width: '100%', textAlign: 'center' }}>
                    {coverPhotoUrl ? 'Replace Cover Image' : 'Upload Cover Image'}
                  </label>
                </div>
              </div>

              {/* Personal Details Card */}
              <div className="editor-form-card glass">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Personal Information</h2>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-name">Full Student Name</label>
                  <input
                    type="text"
                    id="edit-name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength="50"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-major">Academic Major / Course</label>
                  <input
                    list="majors-list"
                    id="edit-major"
                    className="form-control"
                    placeholder="Search or enter major"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    required
                  />
                  <datalist id="majors-list">
                    <option value="Bachelor of Science in Office Administration" />
                    <option value="Bachelor of Science in Information Technology" />
                    <option value="Bachelor of Science in Computer Science" />
                    <option value="Bachelor of Science in Business Administration" />
                    <option value="Bachelor of Science in Hospitality Management" />
                    <option value="Bachelor of Science in Civil Engineering" />
                    <option value="Bachelor of Science in Mechanical Engineering" />
                    <option value="Bachelor of Elementary Education" />
                    <option value="Bachelor of Secondary Education" />
                  </datalist>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-campus">University Campus</label>
                  <select
                    id="edit-campus"
                    className="form-control"
                    value={campus}
                    onChange={(e) => setCampus(e.target.value)}
                    required
                    style={{ minHeight: '44px' }}
                  >
                    <option value="Sibalom (Main Campus)">Sibalom (Main Campus)</option>
                    <option value="Hamtic Campus">Hamtic Campus</option>
                    <option value="Tibiao Campus">Tibiao Campus</option>
                    <option value="Caluya Campus">Caluya Campus</option>
                    <option value="Libertad Campus">Libertad Campus</option>
                  </select>
                </div>
 
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-shortbio">Short Professional Tagline / Bio</label>
                  <input
                    type="text"
                    id="edit-shortbio"
                    className="form-control"
                    placeholder="E.g., Aspiring Office Manager and Digital Coordinator"
                    value={shortBio}
                    onChange={(e) => setShortBio(e.target.value)}
                    maxLength="120"
                  />
                  <span className="form-hint" style={{ marginTop: '0.35rem' }}>Brief tagline displayed on search directories. Max 120 characters.</span>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="edit-aboutme">Detailed Biography / About Me</label>
                  <textarea
                    id="edit-aboutme"
                    className="form-control"
                    placeholder="Write a thorough summary highlighting your career goals, academic interests, or specialized background..."
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    maxLength="1200"
                    style={{ minHeight: '140px', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                  <span className="form-hint" style={{ marginTop: '0.35rem' }}>Detailed personal overview. Max 1200 characters.</span>
                </div>
              </div>

              {/* Educational Background Card */}
              <div className="editor-form-card glass">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Educational Attainment</h2>
                <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Specify the institutions and year periods for your academic progress.
                </p>

                {/* College Info */}
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--primary)' }}>College</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                    <label className="form-label">University / Institution Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="E.g. University of Antique"
                      value={collegeSchool}
                      onChange={(e) => setCollegeSchool(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Degree & Major Course</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="E.g. BS in Office Administration"
                      value={collegeDegree}
                      onChange={(e) => setCollegeDegree(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Year Attended (Period)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="E.g. 2022 - Present"
                      value={collegeYears}
                      onChange={(e) => setCollegeYears(e.target.value)}
                    />
                  </div>
                </div>

                {/* Senior High Info */}
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--primary)' }}>Senior High School</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                    <label className="form-label">School Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="E.g. Antique National School"
                      value={shsSchool}
                      onChange={(e) => setShsSchool(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Track / Strand</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="E.g. TVL - ICT / ABM"
                      value={shsStrand}
                      onChange={(e) => setShsStrand(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Year Attended (Period)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="E.g. 2020 - 2022"
                      value={shsYears}
                      onChange={(e) => setShsYears(e.target.value)}
                    />
                  </div>
                </div>

                {/* Junior High Info */}
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--primary)' }}>Junior High School</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                    <label className="form-label">School Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="E.g. Antique National School"
                      value={jhsSchool}
                      onChange={(e) => setJhsSchool(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                    <label className="form-label">Year Attended (Period)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="E.g. 2016 - 2020"
                      value={jhsYears}
                      onChange={(e) => setJhsYears(e.target.value)}
                    />
                  </div>
                </div>

                {/* Elementary Info */}
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', marginBottom: '1rem', textTransform: 'uppercase', color: 'var(--primary)' }}>Elementary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                    <label className="form-label">School Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="E.g. San Jose Elementary School"
                      value={elemenSchool}
                      onChange={(e) => setElemenSchool(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                    <label className="form-label">Year Attended (Period)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="E.g. 2010 - 2016"
                      value={elemenYears}
                      onChange={(e) => setElemenYears(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="editor-form-card glass">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Work & Internship History</h2>
                <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Add internships, OJT experiences, part-time jobs, or freelance work.
                </p>

                {experiences.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {experiences.map((exp, index) => (
                      <div 
                        key={index} 
                        className="glass" 
                        style={{ 
                          padding: '1.25rem', 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--border-radius-sm)'
                        }}
                      >
                        <div style={{ textAlign: 'left' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{exp.title}</h4>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginTop: '0.15rem' }}>{exp.company}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{exp.period}</div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{exp.description}</p>
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ alignSelf: 'flex-start', minHeight: '32px' }}
                          onClick={() => {
                            if (window.confirm("Remove this experience entry?")) {
                              setExperiences(experiences.filter((_, i) => i !== index));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Form to add a new experience */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Add Experience Entry</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Job Title / Position</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="E.g. Administrative Intern"
                        value={expTitle}
                        onChange={(e) => setExpTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Company / Office</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="E.g. Capitol Governor's Office"
                        value={expCompany}
                        onChange={(e) => setExpCompany(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                      <label className="form-label">Date Period</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="E.g. April 2025 - June 2025 (OJT)"
                        value={expPeriod}
                        onChange={(e) => setExpPeriod(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                      <label className="form-label">Job Description / Key Tasks</label>
                      <textarea
                        className="form-control"
                        placeholder="Detail your responsibilities, such as records encoding, file scheduling, and virtual calendar operations..."
                        value={expDesc}
                        onChange={(e) => setExpDesc(e.target.value)}
                        style={{ minHeight: '80px', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ alignSelf: 'flex-end', minHeight: '34px', padding: '0.5rem 1rem' }}
                    onClick={() => {
                      const newExp = {
                        title: expTitle,
                        company: expCompany,
                        period: expPeriod,
                        description: expDesc
                      };
                      setExperiences([...experiences, newExp]);
                      setExpTitle('');
                      setExpCompany('');
                      setExpPeriod('');
                      setExpDesc('');
                    }}
                    disabled={!expTitle.trim() || !expCompany.trim() || !expPeriod.trim()}
                  >
                    Add Experience Entry
                  </button>
                </div>
              </div>

              {/* Seminars & Trainings Section */}
              <div className="editor-form-card glass">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Seminars, Workshops & Trainings</h2>
                <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  List academic workshops, professional seminars, and certifications attended.
                </p>

                {seminars.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {seminars.map((sem, index) => (
                      <div 
                        key={index} 
                        className="glass" 
                        style={{ 
                          padding: '1.25rem', 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--border-radius-sm)'
                        }}
                      >
                        <div style={{ textAlign: 'left' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{sem.title}</h4>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginTop: '0.15rem' }}>{sem.organizer}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{sem.date}</div>
                          {sem.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{sem.description}</p>}
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ alignSelf: 'flex-start', minHeight: '32px' }}
                          onClick={() => {
                            if (window.confirm("Remove this entry?")) {
                              setSeminars(seminars.filter((_, i) => i !== index));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Add Seminar / Training</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Seminar Title / Theme</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="E.g. National Summit on Records Management"
                        value={semTitle}
                        onChange={(e) => setSemTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Host / Organizer</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="E.g. Association of Office Professionals"
                        value={semOrganizer}
                        onChange={(e) => setSemOrganizer(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                      <label className="form-label">Seminar Date / Period</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="E.g. October 14, 2025"
                        value={semDate}
                        onChange={(e) => setSemDate(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2', marginBottom: 0 }}>
                      <label className="form-label">Key Highlights / Learnings (Optional)</label>
                      <textarea
                        className="form-control"
                        placeholder="Briefly detail what you gained, certificates awarded, or topics covered..."
                        value={semDesc}
                        onChange={(e) => setExpDesc(e.target.value)}
                        style={{ minHeight: '80px', resize: 'vertical' }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ alignSelf: 'flex-end', minHeight: '34px', padding: '0.5rem 1rem' }}
                    onClick={() => {
                      const newSem = {
                        title: semTitle,
                        organizer: semOrganizer,
                        date: semDate,
                        description: semDesc
                      };
                      setSeminars([...seminars, newSem]);
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

              {/* Certificates Section */}
              <div className="editor-form-card glass">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Certificates & Licensures</h2>
                <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  List professional credentials, software certificates, or academic distinctions.
                </p>

                {certificates.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {certificates.map((cert, index) => (
                      <div 
                        key={index} 
                        className="glass" 
                        style={{ 
                          padding: '1.25rem', 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--border-radius-sm)'
                        }}
                      >
                        <div style={{ textAlign: 'left' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{cert.name}</h4>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginTop: '0.15rem' }}>{cert.issuer}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{cert.date}</div>
                          {cert.url && (
                            <a 
                              href={cert.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ display: 'inline-block', fontSize: '0.825rem', marginTop: '0.5rem' }}
                            >
                              Verify Credential Link
                            </a>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          style={{ alignSelf: 'flex-start', minHeight: '32px' }}
                          onClick={() => {
                            if (window.confirm("Remove this certificate?")) {
                              setCertificates(certificates.filter((_, i) => i !== index));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-md)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Add Certificate / Distinction</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Certificate Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="E.g. Civil Service Professional Eligibility"
                        value={certName}
                        onChange={(e) => setCertName(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Issuing Authority</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="E.g. Civil Service Commission"
                        value={certIssuer}
                        onChange={(e) => setCertIssuer(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Issue Date</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="E.g. November 2025"
                        value={certDate}
                        onChange={(e) => setCertDate(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Credential URL (Optional)</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://verify.credential.com/id"
                        value={certUrl}
                        onChange={(e) => setCertUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ alignSelf: 'flex-end', minHeight: '34px', padding: '0.5rem 1rem' }}
                    onClick={() => {
                      const newCert = {
                        name: certName,
                        issuer: certIssuer,
                        date: certDate,
                        url: certUrl
                      };
                      setCertificates([...certificates, newCert]);
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
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="edit-linkedin">LinkedIn Profile</label>
                    <input
                      type="text"
                      id="edit-linkedin"
                      className="form-control"
                      placeholder="https://linkedin.com/in/username"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                    />
                    {linkedinError && (
                      <span className="form-hint" style={{ color: 'var(--danger)', marginTop: '0.35rem' }}>{linkedinError}</span>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="edit-website">Personal Website</label>
                    <input
                      type="text"
                      id="edit-website"
                      className="form-control"
                      placeholder="https://yoursite.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                    {websiteError && (
                      <span className="form-hint" style={{ color: 'var(--danger)', marginTop: '0.35rem' }}>{websiteError}</span>
                    )}
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
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="edit-twitter">Twitter / X Profile</label>
                    <input
                      type="text"
                      id="edit-twitter"
                      className="form-control"
                      placeholder="https://twitter.com/username"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                    />
                    {twitterError && (
                      <span className="form-hint" style={{ color: 'var(--danger)', marginTop: '0.35rem' }}>{twitterError}</span>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="edit-contact">Contact Number</label>
                    <input
                      type="text"
                      id="edit-contact"
                      className="form-control"
                      placeholder="+1234567890"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                    {contactError && (
                      <span className="form-hint" style={{ color: 'var(--danger)', marginTop: '0.35rem' }}>{contactError}</span>
                    )}
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

              {/* Bottom Action: Status */}
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-end', marginBottom: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Auto-save Status Indicator */}
                {autoSaveStatus && (
                  <div 
                    style={{ 
                      fontSize: '0.85rem', 
                      color: autoSaveStatus === 'saving' 
                        ? 'var(--text-secondary)' 
                        : autoSaveStatus === 'saved' 
                          ? 'var(--success, #2EC4B6)' 
                          : 'var(--danger, #E71D36)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontWeight: 500,
                      marginRight: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {autoSaveStatus === 'saving' && (
                      <>
                        <svg className="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '14px', height: '14px', marginRight: '2px', animation: 'spin 1s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" strokeDasharray="30 10" />
                        </svg>
                        Saving changes...
                      </>
                    )}
                    {autoSaveStatus === 'saved' && (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: 'var(--success, #2EC4B6)' }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        All changes saved
                      </>
                    )}
                    {autoSaveStatus === 'error' && (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: 'var(--danger, #E71D36)' }}>
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Validation error (check inputs)
                      </>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

        </form>
      )}

      {/* Tab 2: Account Security Section */}
      {activeTab === 'security' && (
        <div className="animate-slide-up-delay-2" style={{ maxWidth: '640px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Email Settings Card */}
            <div className="editor-form-card glass animate-slide-up" style={{ padding: '2rem' }}>
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
            <div className="editor-form-card glass animate-slide-up-delay-1" style={{ padding: '2rem' }}>
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
            <div className="editor-form-card glass animate-slide-up-delay-2" style={{ borderLeft: '3px solid var(--danger)', padding: '2rem' }}>
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
      )}

    </div>
  </div>
  );
};

export default AccountSettings;
