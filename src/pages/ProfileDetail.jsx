import { useEffect, useState, useRef } from 'react';
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
  const [zoom, setZoom] = useState(1);
  const [theaterMode, setTheaterMode] = useState(false);
  const lightboxRef = useRef(null);
  const draggedRef = useRef(false);

  // Image Viewer for profile picture / banner
  const [viewerImage, setViewerImage] = useState(null);
  const [viewerCaption, setViewerCaption] = useState('');
  const [viewerIsAvatar, setViewerIsAvatar] = useState(false);

  // Drag-to-Pan States
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ left: 0, top: 0 });


  // States for in-place About Me editing
  const [isEditingAboutMe, setIsEditingAboutMe] = useState(false);
  const [aboutMeText, setAboutMeText] = useState(initialStudent?.aboutMe || '');
  const [savingAboutMe, setSavingAboutMe] = useState(false);

  // States for unified Header & Contacts editing
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [headerName, setHeaderName] = useState(initialStudent?.name || '');
  const [headerMajor, setHeaderMajor] = useState(initialStudent?.major || '');
  const [headerCampus, setHeaderCampus] = useState(initialStudent?.campus || 'Sibalom (Main Campus)');
  const [headerBio, setHeaderBio] = useState(initialStudent?.shortBio || '');
  const [headerEmail, setHeaderEmail] = useState(initialStudent?.email || '');
  const [headerPhone, setHeaderPhone] = useState(initialStudent?.contactNumber || '');
  const [headerGithub, setHeaderGithub] = useState(initialStudent?.github || '');
  const [headerLinkedin, setHeaderLinkedin] = useState(initialStudent?.linkedin || '');
  const [headerWebsite, setHeaderWebsite] = useState(initialStudent?.website || '');
  const [headerFacebook, setHeaderFacebook] = useState(initialStudent?.facebook || '');
  const [headerInstagram, setHeaderInstagram] = useState(initialStudent?.instagram || '');
  const [headerTwitter, setHeaderTwitter] = useState(initialStudent?.twitter || '');

  // States for Educational Background editing
  const [isEditingEdu, setIsEditingEdu] = useState(false);
  const [eduColSchool, setEduColSchool] = useState(initialStudent?.education?.college?.school || '');
  const [eduColDegree, setEduColDegree] = useState(initialStudent?.education?.college?.degree || '');
  const [eduColYears, setEduColYears] = useState(initialStudent?.education?.college?.years || '');
  const [eduShsSchool, setEduShsSchool] = useState(initialStudent?.education?.seniorHigh?.school || '');
  const [eduShsStrand, setEduShsStrand] = useState(initialStudent?.education?.seniorHigh?.strand || '');
  const [eduShsYears, setEduShsYears] = useState(initialStudent?.education?.seniorHigh?.years || '');
  const [eduJhsSchool, setEduJhsSchool] = useState(initialStudent?.education?.juniorHigh?.school || '');
  const [eduJhsYears, setEduJhsYears] = useState(initialStudent?.education?.juniorHigh?.years || '');
  const [eduElemSchool, setEduElemSchool] = useState(initialStudent?.education?.elementary?.school || '');
  const [eduElemYears, setEduElemYears] = useState(initialStudent?.education?.elementary?.years || '');

  // States for Work Experience, Seminars, Certificates, Skills, Projects
  const [isEditingExp, setIsEditingExp] = useState(false);
  const [expList, setExpList] = useState(initialStudent?.experience || []);
  
  const [isEditingSem, setIsEditingSem] = useState(false);
  const [semList, setSemList] = useState(initialStudent?.seminars || []);

  const [isEditingCert, setIsEditingCert] = useState(false);
  const [certList, setCertList] = useState(initialStudent?.certificates || []);

  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [skillsList, setSkillsList] = useState(initialStudent?.skills || []);
  const [skillsInput, setSkillsInput] = useState('');

  const [isEditingProjects, setIsEditingProjects] = useState(false);
  const [projList, setProjList] = useState(initialStudent?.projects || []);

  // Temporary input states for adding items in-place
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpPeriod, setNewExpPeriod] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');

  const [newSemTitle, setNewSemTitle] = useState('');
  const [newSemOrganizer, setNewSemOrganizer] = useState('');
  const [newSemDate, setNewSemDate] = useState('');
  const [newSemDesc, setNewSemDesc] = useState('');

  const [newCertName, setNewCertName] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertDate, setNewCertDate] = useState('');
  const [newCertUrl, setNewCertUrl] = useState('');

  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjLink, setNewProjLink] = useState('');

  // Sync state values when student data loads or updates
  useEffect(() => {
    if (student) {
      setHeaderName(student.name || '');
      setHeaderMajor(student.major || '');
      setHeaderCampus(student.campus || 'Sibalom (Main Campus)');
      setHeaderBio(student.shortBio || '');
      setHeaderEmail(student.email || '');
      setHeaderPhone(student.contactNumber || '');
      setHeaderGithub(student.github || '');
      setHeaderLinkedin(student.linkedin || '');
      setHeaderWebsite(student.website || '');
      setHeaderFacebook(student.facebook || '');
      setHeaderInstagram(student.instagram || '');
      setHeaderTwitter(student.twitter || '');

      setEduColSchool(student.education?.college?.school || '');
      setEduColDegree(student.education?.college?.degree || '');
      setEduColYears(student.education?.college?.years || '');
      setEduShsSchool(student.education?.seniorHigh?.school || '');
      setEduShsStrand(student.education?.seniorHigh?.strand || '');
      setEduShsYears(student.education?.seniorHigh?.years || '');
      setEduJhsSchool(student.education?.juniorHigh?.school || '');
      setEduJhsYears(student.education?.juniorHigh?.years || '');
      setEduElemSchool(student.education?.elementary?.school || '');
      setEduElemYears(student.education?.elementary?.years || '');

      setExpList(student.experience || []);
      setSemList(student.seminars || []);
      setCertList(student.certificates || []);
      setSkillsList(student.skills || []);
      setProjList(student.projects || []);
    }
  }, [student]);
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
    setZoom(1);
    setTheaterMode(false);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoom(1);
    setTheaterMode(false);
  };

  const prevPhoto = (e) => {
    e?.stopPropagation();
    if (!student?.photos) return;
    setZoom(1);
    setPhotoIndex((prevIndex) => (prevIndex === 0 ? student.photos.length - 1 : prevIndex - 1));
  };

  const nextPhoto = (e) => {
    e?.stopPropagation();
    if (!student?.photos) return;
    setZoom(1);
    setPhotoIndex((prevIndex) => (prevIndex === student.photos.length - 1 ? 0 : prevIndex + 1));
  };

  const zoomIn = (e) => {
    e?.stopPropagation();
    setZoom(prev => {
      const nextZoom = Math.min(prev + 0.25, 3);
      if (lightboxOpen && nextZoom > 1) {
        setTheaterMode(true);
      }
      return nextZoom;
    });
  };

  const zoomOut = (e) => {
    e?.stopPropagation();
    setZoom(prev => {
      const nextZoom = Math.max(prev - 0.25, 0.5);
      if (lightboxOpen && nextZoom <= 1) {
        setTheaterMode(false);
      }
      return nextZoom;
    });
  };

  const resetZoom = (e) => {
    e?.stopPropagation();
    setZoom(1);
    if (lightboxOpen) {
      setTheaterMode(false);
    }
  };

  const handleWheel = (e) => {
    // Zoom only when holding Ctrl or Meta key (e.g. pinch-zooming on trackpads or Ctrl+scroll wheel)
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn(e);
      else if (e.deltaY > 0) zoomOut(e);
    }
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    draggedRef.current = false;
    setDragStart({ x: e.clientX, y: e.clientY });
    setScrollStart({
      left: e.currentTarget.scrollLeft,
      top: e.currentTarget.scrollTop
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return;
    e.preventDefault(); // prevent native image dragging
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      draggedRef.current = true;
    }
    e.currentTarget.scrollLeft = scrollStart.left - dx;
    e.currentTarget.scrollTop = scrollStart.top - dy;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) setIsDragging(false);
  };

  const handleViewportClick = (e) => {
    if (draggedRef.current) {
      e.stopPropagation();
      draggedRef.current = false;
    }
  };

  const toggleFullscreen = (e) => {
    e?.stopPropagation();
    if (!lightboxRef.current) return;
    if (!document.fullscreenElement) {
      lightboxRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleInPlaceRemovePhotoInsideLightbox = async (photoId) => {
    if (window.confirm("Are you sure you want to remove this photo from your gallery?")) {
      const updatedPhotos = (student.photos || []).filter(p => p.id !== photoId);
      try {
        await updateStudentProfile(student.id, { photos: updatedPhotos });
        setStudent({ ...student, photos: updatedPhotos });
        if (updatedPhotos.length === 0) {
          closeLightbox();
        } else {
          setPhotoIndex(prev => Math.min(prev, updatedPhotos.length - 1));
          setZoom(1);
        }
      } catch (err) {
        alert(err.message || "Failed to remove photo.");
      }
    }
  };

  const handleThumbnailClick = (index) => {
    setPhotoIndex(index);
    setZoom(1);
  };

  const openImageViewer = (imageUrl, caption, isAvatar = false) => {
    setViewerImage(imageUrl);
    setViewerCaption(caption);
    setViewerIsAvatar(isAvatar);
    setZoom(1);
  };

  const handleDownloadImage = async (e, url, defaultFilename) => {
    e?.stopPropagation();
    
    // Check if it's a built-in vector avatar SVG in the viewer
    if (viewerIsAvatar && url && !url.startsWith('data:image/')) {
      try {
        const svgElement = document.querySelector('.lightbox-image-wrapper svg');
        if (svgElement) {
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(svgElement);
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const blobUrl = URL.createObjectURL(svgBlob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = defaultFilename || 'avatar.svg';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
          return;
        }
      } catch (err) {
        console.error('Error exporting SVG avatar:', err);
      }
    }

    // Default download logic for normal URLs and data URLs
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = defaultFilename || 'portfolio-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (lightboxOpen || viewerImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) closeLightbox();
        if (viewerImage) {
          setViewerImage(null);
          setViewerCaption('');
          setZoom(1);
        }
      }
      if (lightboxOpen && student?.photos) {
        if (e.key === 'ArrowLeft') prevPhoto(e);
        if (e.key === 'ArrowRight') nextPhoto(e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, viewerImage, student?.photos]);

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
            onClick={() => { if (student.coverPhotoUrl) { openImageViewer(student.coverPhotoUrl, 'Cover Photo'); } }}
            onMouseEnter={(e) => { if (student.coverPhotoUrl) e.currentTarget.style.filter = 'brightness(0.85)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = ''; }}
            title={student.coverPhotoUrl ? 'Click to view full size' : ''}
          ></div>
        {canEdit && (
          <div className="cover-edit-actions">
            <input 
              type="file" 
              id="inplace-cover-upload" 
              accept="image/png, image/jpeg, image/jpg" 
              style={{ display: 'none' }} 
              onChange={handleInPlaceCoverUpload} 
            />
            <label htmlFor="inplace-cover-upload">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Update Cover
            </label>
            {student.coverPhotoUrl && (
              <button
                className="cover-remove-btn"
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
                  Profile Editor
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
        <div className="profile-header-card glass" style={{ padding: '2rem', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
          {/* Circular avatar container overlapping cover photo */}
          <div className="profile-avatar-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '150px', flexShrink: 0 }}>
            <div
              style={{
                width: '150px',
                height: '150px',
                flexShrink: 0,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '6px solid var(--bg-card)',
                background: 'transparent',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                marginTop: '-60px',
                position: 'relative',
                cursor: student.avatarId ? 'pointer' : 'default',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              className="profile-avatar-container"
              onClick={() => { if (student.avatarId) { openImageViewer(student.avatarId, student.name + "'s Profile Photo", true); } }}
              title={student.avatarId ? 'Click to view full size' : ''}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.025)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
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
                      background: 'rgba(0, 0, 0, 0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      opacity: 0,
                      transition: 'opacity 0.25s ease',
                      cursor: 'pointer',
                      gap: '4px',
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
          </div>
          
          {/* Column 2: Meta Info */}
          <div className="profile-meta" style={{ flex: 1, paddingTop: '0.5rem', paddingLeft: '0.5rem' }}>
            {isEditingHeader ? (
              <div 
                className="glass animate-fade-in"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1rem', 
                  padding: '1.5rem', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(244, 180, 0, 0.25)', 
                  background: 'rgba(255, 255, 255, 0.02)',
                  width: '100%' 
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Full Name</label>
                    <input className="form-control" type="text" value={headerName} onChange={(e) => setHeaderName(e.target.value)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', borderRadius: '8px' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Major / Department</label>
                    <input className="form-control" type="text" value={headerMajor} onChange={(e) => setHeaderMajor(e.target.value)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', borderRadius: '8px' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Campus</label>
                    <select 
                      className="form-control" 
                      value={headerCampus} 
                      onChange={(e) => setHeaderCampus(e.target.value)} 
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', borderRadius: '8px', minHeight: '38px' }}
                    >
                      <option value="Sibalom (Main Campus)">Sibalom (Main Campus)</option>
                      <option value="Hamtic Campus">Hamtic Campus</option>
                      <option value="Tibiao Campus">Tibiao Campus</option>
                      <option value="Caluya Campus">Caluya Campus</option>
                      <option value="Libertad Campus">Libertad Campus</option>
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Short Biography</label>
                  <input className="form-control" type="text" value={headerBio} onChange={(e) => setHeaderBio(e.target.value)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', borderRadius: '8px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Email Address</label>
                    <input className="form-control" type="email" value={headerEmail} onChange={(e) => setHeaderEmail(e.target.value)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', borderRadius: '8px' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Contact Number</label>
                    <input className="form-control" type="text" value={headerPhone} onChange={(e) => setHeaderPhone(e.target.value)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', borderRadius: '8px' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>GitHub URL</label>
                    <input className="form-control" type="text" placeholder="https://github.com/..." value={headerGithub} onChange={(e) => setHeaderGithub(e.target.value)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', borderRadius: '8px' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>LinkedIn URL</label>
                    <input className="form-control" type="text" placeholder="https://linkedin.com/in/..." value={headerLinkedin} onChange={(e) => setHeaderLinkedin(e.target.value)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', borderRadius: '8px' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Personal Website</label>
                    <input className="form-control" type="text" placeholder="https://..." value={headerWebsite} onChange={(e) => setHeaderWebsite(e.target.value)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', borderRadius: '8px' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Facebook URL</label>
                    <input className="form-control" type="text" placeholder="https://facebook.com/..." value={headerFacebook} onChange={(e) => setHeaderFacebook(e.target.value)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', borderRadius: '8px' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Instagram URL</label>
                    <input className="form-control" type="text" placeholder="https://instagram.com/..." value={headerInstagram} onChange={(e) => setHeaderInstagram(e.target.value)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', borderRadius: '8px' }} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Twitter / X URL</label>
                    <input className="form-control" type="text" placeholder="https://x.com/..." value={headerTwitter} onChange={(e) => setHeaderTwitter(e.target.value)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', borderRadius: '8px' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  
                  <button className="btn btn-primary btn-sm" onClick={async () => {
                    if (!headerName.trim()) { alert('Name is required'); return; }
                    try {
                      const updated = await updateStudentProfile(student.id, {
                        name: headerName,
                        major: headerMajor,
                        campus: headerCampus,
                        shortBio: headerBio,
                        email: headerEmail,
                        contactNumber: headerPhone,
                        github: headerGithub,
                        linkedin: headerLinkedin,
                        website: headerWebsite,
                        facebook: headerFacebook,
                        instagram: headerInstagram,
                        twitter: headerTwitter
                      });
                      setStudent(updated);
                      setIsEditingHeader(false);
                    } catch (e) {
                      alert('Failed to save header info: ' + e.message);
                    }
                  }} style={{ padding: '0.4rem 1rem', minHeight: '32px', borderRadius: '20px' }}>Save Changes</button>
                </div>
              </div>
            ) : (
              <>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {student.name}
                  {canEdit && (
                    <button 
                      onClick={() => setIsEditingHeader(true)}
                      style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center' }}
                      title="Edit Header Info"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  )}
                </h1>
                
                {/* Sleek Major/Department & Campus Badges */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span 
                    className="profile-major-badge"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '20px',
                      background: 'rgba(244, 180, 0, 0.1)',
                      border: '1px solid rgba(244, 180, 0, 0.3)',
                      color: 'var(--logo-gold, #F4B400)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}>
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                    {student.major}
                  </span>

                  <span 
                    className="profile-campus-badge"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '20px',
                      background: 'rgba(14, 27, 132, 0.1)',
                      border: '1px solid rgba(14, 27, 132, 0.3)',
                      color: 'var(--primary, #0e1b84)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      letterSpacing: '0.01em'
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {student.campus || 'Sibalom (Main Campus)'}
                  </span>
                </div>

                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', maxWidth: '720px', lineHeight: '1.5' }}>
                  {student.shortBio}
                </p>
                
                {/* Quick Contacts & Socials */}
                <div className="profile-contact-list">
                  {student.email && (
                    <a href={`mailto:${student.email}`} className="contact-link-pill" title={`Email: ${student.email}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      {student.email}
                    </a>
                  )}
                  {student.contactNumber && (
                    <a href={`tel:${student.contactNumber.replace(/[^\d+]/g, '')}`} className="contact-link-pill" title={`Call: ${student.contactNumber}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {student.contactNumber}
                    </a>
                  )}
                  {student.github && (
                    <a href={student.github} target="_blank" rel="noopener noreferrer" className="contact-link-pill circular" title="GitHub Profile">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                    </a>
                  )}
                  {student.linkedin && (
                    <a href={student.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link-pill circular" title="LinkedIn Profile">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  )}
                  {student.website && (
                    <a href={student.website} target="_blank" rel="noopener noreferrer" className="contact-link-pill circular" title="Personal Website">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </a>
                  )}
                  {student.facebook && (
                    <a href={student.facebook} target="_blank" rel="noopener noreferrer" className="contact-link-pill circular" title="Facebook Profile">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                  )}
                  {student.instagram && (
                    <a href={student.instagram} target="_blank" rel="noopener noreferrer" className="contact-link-pill circular" title="Instagram Profile">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>
                  )}
                  {student.twitter && (
                    <a href={student.twitter} target="_blank" rel="noopener noreferrer" className="contact-link-pill circular" title="Twitter / X Profile">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                      </svg>
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {canEdit && !isEditingHeader && (
            <div className="profile-header-actions" style={{ alignSelf: 'center', display: 'flex', flexShrink: 0 }}>
              <button 
                className="btn btn-primary btn-sm" 
                onClick={() => navigateTo('edit-profile', { id: student.id })}
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  whiteSpace: 'nowrap',
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.85rem',
                  borderRadius: '30px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px var(--logo-gold-glow)'
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '14px', height: '14px' }}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </button>
            </div>
          )}
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
          {((student.education?.elementary?.school || student.education?.juniorHigh?.school || student.education?.seniorHigh?.school || student.education?.college?.school) || canEdit) && (
            <div className="profile-section glass">
              {isEditingEdu ? (
                <>
                  <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                      </svg>
                      Educational Background
                    </div>
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* College */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>College</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
                        <input className="form-control" type="text" placeholder="School Name" value={eduColSchool} onChange={(e) => setEduColSchool(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }} />
                        <input className="form-control" type="text" placeholder="Degree / Course" value={eduColDegree} onChange={(e) => setEduColDegree(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }} />
                        <input className="form-control" type="text" placeholder="Years (e.g., 2022 - Present)" value={eduColYears} onChange={(e) => setEduColYears(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }} />
                      </div>
                    </div>
                    {/* SHS */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>Senior High School</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
                        <input className="form-control" type="text" placeholder="School Name" value={eduShsSchool} onChange={(e) => setEduShsSchool(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }} />
                        <input className="form-control" type="text" placeholder="Track / Strand" value={eduShsStrand} onChange={(e) => setEduShsStrand(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }} />
                        <input className="form-control" type="text" placeholder="Years (e.g., 2020 - 2022)" value={eduShsYears} onChange={(e) => setEduShsYears(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }} />
                      </div>
                    </div>
                    {/* JHS */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>Junior High School</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                        <input className="form-control" type="text" placeholder="School Name" value={eduJhsSchool} onChange={(e) => setEduJhsSchool(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }} />
                        <input className="form-control" type="text" placeholder="Years (e.g., 2016 - 2020)" value={eduJhsYears} onChange={(e) => setEduJhsYears(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }} />
                      </div>
                    </div>
                    {/* Elem */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>Elementary School</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                        <input className="form-control" type="text" placeholder="School Name" value={eduElemSchool} onChange={(e) => setEduElemSchool(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }} />
                        <input className="form-control" type="text" placeholder="Years (e.g., 2010 - 2016)" value={eduElemYears} onChange={(e) => setEduElemYears(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.875rem' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => { setIsEditingEdu(false); }} style={{ padding: '0.3rem 0.8rem', minHeight: '32px' }}>Cancel</button>
                      <button className="btn btn-primary btn-sm" onClick={async () => {
                        try {
                          const updated = await updateStudentProfile(student.id, {
                            name: headerName,
                            major: headerMajor,
                            campus: headerCampus,
                            shortBio: headerBio,
                            email: headerEmail,
                            contactNumber: headerPhone,
                            github: headerGithub,
                            linkedin: headerLinkedin,
                            website: headerWebsite,
                            education: {
                              elementary: { school: eduElemSchool, years: eduElemYears },
                              juniorHigh: { school: eduJhsSchool, years: eduJhsYears },
                              seniorHigh: { school: eduShsSchool, strand: eduShsStrand, years: eduShsYears },
                              college: { school: eduColSchool, degree: eduColDegree, years: eduColYears }
                            }
                          });
                          setStudent(updated);
                          setIsEditingEdu(false);
                        } catch (e) {
                          alert('Failed to save education: ' + e.message);
                        }
                      }} style={{ padding: '0.3rem 0.8rem', minHeight: '32px' }}>Save Changes</button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                      </svg>
                      Educational Background
                    </div>
                    {canEdit && (
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => setIsEditingEdu(true)}
                        style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', minHeight: '28px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border-color)' }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '11px', height: '11px' }}>
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit Education
                      </button>
                    )}
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

                    {!(student.education?.elementary?.school || student.education?.juniorHigh?.school || student.education?.seniorHigh?.school || student.education?.college?.school) && (
                      <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', margin: 0 }}>No education background added yet.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Work Experience Section */}
          {((student.experience && student.experience.length > 0) || canEdit) && (
            <div className="profile-section glass">
              <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  Work Experience
                </div>
                {canEdit && !isEditingExp && (
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setIsEditingExp(true)}
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', minHeight: '28px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border-color)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '11px', height: '11px' }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Experience
                  </button>
                )}
              </h2>

              {isEditingExp ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {expList.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {expList.map((exp, index) => (
                        <div key={exp.id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{exp.title}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>{exp.company} | <span style={{ color: 'var(--text-muted)' }}>{exp.period}</span></div>
                            {exp.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', margin: 0 }}>{exp.description}</p>}
                          </div>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            style={{ minHeight: '28px', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => setExpList(expList.filter((_, i) => i !== index))}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Add Experience Entry</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Job Title / Position</label>
                        <input className="form-control" type="text" placeholder="E.g. Administrative Intern" value={newExpTitle} onChange={(e) => setNewExpTitle(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Company / Office</label>
                        <input className="form-control" type="text" placeholder="E.g. Capitol Governor's Office" value={newExpCompany} onChange={(e) => setNewExpCompany(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                      </div>
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Date Period</label>
                      <input className="form-control" type="text" placeholder="E.g. April 2025 - June 2025 (OJT)" value={newExpPeriod} onChange={(e) => setNewExpPeriod(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Job Description / Key Tasks</label>
                      <textarea className="form-control" placeholder="Detail your responsibilities..." value={newExpDesc} onChange={(e) => setNewExpDesc(e.target.value)} style={{ minHeight: '60px', padding: '0.4rem 0.6rem', fontSize: '0.8rem', resize: 'vertical' }} />
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ alignSelf: 'flex-end', minHeight: '28px', padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => {
                        const newExp = {
                          id: `exp-${Date.now()}`,
                          title: newExpTitle,
                          company: newExpCompany,
                          period: newExpPeriod,
                          description: newExpDesc
                        };
                        setExpList([...expList, newExp]);
                        setNewExpTitle('');
                        setNewExpCompany('');
                        setNewExpPeriod('');
                        setNewExpDesc('');
                      }}
                      disabled={!newExpTitle.trim() || !newExpCompany.trim() || !newExpPeriod.trim()}
                    >
                      Add Entry
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setIsEditingExp(false); setExpList(student.experience || []); }} style={{ padding: '0.3rem 0.8rem', minHeight: '32px' }}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={async () => {
                      try {
                        const updated = await updateStudentProfile(student.id, { experience: expList });
                        setStudent(updated);
                        setIsEditingExp(false);
                      } catch (e) {
                        alert('Failed to save experience: ' + e.message);
                      }
                    }} style={{ padding: '0.3rem 0.8rem', minHeight: '32px' }}>Save Changes</button>
                  </div>
                </div>
              ) : (
                <div className="profile-timeline">
                  {student.experience && student.experience.length > 0 ? (
                    student.experience.map((exp, idx) => (
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
                    ))
                  ) : (
                    <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', margin: 0 }}>No work experience added yet.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Seminars & Workshops Section */}
          {((student.seminars && student.seminars.length > 0) || canEdit) && (
            <div className="profile-section glass">
              <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Seminars & Workshops
                </div>
                {canEdit && !isEditingSem && (
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setIsEditingSem(true)}
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', minHeight: '28px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border-color)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '11px', height: '11px' }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Seminars
                  </button>
                )}
              </h2>

              {isEditingSem ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {semList.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {semList.map((sem, index) => (
                        <div key={sem.id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{sem.title}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>Host: {sem.organizer} | <span style={{ color: 'var(--text-muted)' }}>{sem.date}</span></div>
                            {sem.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', margin: 0 }}>{sem.description}</p>}
                          </div>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            style={{ minHeight: '28px', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => setSemList(semList.filter((_, i) => i !== index))}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Add Seminar / Workshop</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Seminar Title</label>
                        <input className="form-control" type="text" placeholder="E.g. National Summit on Records" value={newSemTitle} onChange={(e) => setNewSemTitle(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Host / Organizer</label>
                        <input className="form-control" type="text" placeholder="E.g. Association of Office Professionals" value={newSemOrganizer} onChange={(e) => setNewSemOrganizer(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                      </div>
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Date / Period</label>
                      <input className="form-control" type="text" placeholder="E.g. October 14, 2025" value={newSemDate} onChange={(e) => setNewSemDate(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Key Highlights (Optional)</label>
                      <textarea className="form-control" placeholder="Briefly detail what you gained..." value={newSemDesc} onChange={(e) => setNewSemDesc(e.target.value)} style={{ minHeight: '60px', padding: '0.4rem 0.6rem', fontSize: '0.8rem', resize: 'vertical' }} />
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ alignSelf: 'flex-end', minHeight: '28px', padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => {
                        const newSem = {
                          id: `sem-${Date.now()}`,
                          title: newSemTitle,
                          organizer: newSemOrganizer,
                          date: newSemDate,
                          description: newSemDesc
                        };
                        setSemList([...semList, newSem]);
                        setNewSemTitle('');
                        setNewSemOrganizer('');
                        setNewSemDate('');
                        setNewSemDesc('');
                      }}
                      disabled={!newSemTitle.trim() || !newSemOrganizer.trim() || !newSemDate.trim()}
                    >
                      Add Seminar
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setIsEditingSem(false); setSemList(student.seminars || []); }} style={{ padding: '0.3rem 0.8rem', minHeight: '32px' }}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={async () => {
                      try {
                        const updated = await updateStudentProfile(student.id, { seminars: semList });
                        setStudent(updated);
                        setIsEditingSem(false);
                      } catch (e) {
                        alert('Failed to save seminars: ' + e.message);
                      }
                    }} style={{ padding: '0.3rem 0.8rem', minHeight: '32px' }}>Save Changes</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {student.seminars && student.seminars.length > 0 ? (
                    student.seminars.map((sem, idx) => (
                      <div key={sem.id || idx} className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.01)' }}>
                        <h3 style={{ fontSize: '1rem', margin: '0 0 0.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{sem.title}</h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                          Host: {sem.organizer} | <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{sem.date}</span>
                        </div>
                        {sem.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>{sem.description}</p>}
                      </div>
                    ))
                  ) : (
                    <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', margin: 0 }}>No seminars or workshops added yet.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Certificates Section */}
          {((student.certificates && student.certificates.length > 0) || canEdit) && (
            <div className="profile-section glass">
              <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                  Certifications & Achievements
                </div>
                {canEdit && !isEditingCert && (
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setIsEditingCert(true)}
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', minHeight: '28px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border-color)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '11px', height: '11px' }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Certificates
                  </button>
                )}
              </h2>

              {isEditingCert ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {certList.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {certList.map((cert, index) => (
                        <div key={cert.id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cert.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>Issuer: {cert.issuer} | <span style={{ color: 'var(--text-muted)' }}>{cert.date}</span></div>
                            {cert.url && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{cert.url}</div>}
                          </div>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            style={{ minHeight: '28px', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => setCertList(certList.filter((_, i) => i !== index))}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Add Certificate / Distinction</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Certificate Name</label>
                        <input className="form-control" type="text" placeholder="E.g. Civil Service Eligibility" value={newCertName} onChange={(e) => setNewCertName(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Issuing Authority</label>
                        <input className="form-control" type="text" placeholder="E.g. Civil Service Commission" value={newCertIssuer} onChange={(e) => setNewCertIssuer(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Issue Date</label>
                        <input className="form-control" type="text" placeholder="E.g. November 2025" value={newCertDate} onChange={(e) => setNewCertDate(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Credential URL (Optional)</label>
                        <input className="form-control" type="url" placeholder="https://..." value={newCertUrl} onChange={(e) => setNewCertUrl(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ alignSelf: 'flex-end', minHeight: '28px', padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => {
                        const newCert = {
                          id: `cert-${Date.now()}`,
                          name: newCertName,
                          issuer: newCertIssuer,
                          date: newCertDate,
                          url: newCertUrl
                        };
                        setCertList([...certList, newCert]);
                        setNewCertName('');
                        setNewCertIssuer('');
                        setNewCertDate('');
                        setNewCertUrl('');
                      }}
                      disabled={!newCertName.trim() || !newCertIssuer.trim() || !newCertDate.trim()}
                    >
                      Add Certificate
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setIsEditingCert(false); setCertList(student.certificates || []); }} style={{ padding: '0.3rem 0.8rem', minHeight: '32px' }}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={async () => {
                      try {
                        const updated = await updateStudentProfile(student.id, { certificates: certList });
                        setStudent(updated);
                        setIsEditingCert(false);
                      } catch (e) {
                        alert('Failed to save certificates: ' + e.message);
                      }
                    }} style={{ padding: '0.3rem 0.8rem', minHeight: '32px' }}>Save Changes</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {student.certificates && student.certificates.length > 0 ? (
                    student.certificates.map((cert, idx) => (
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
                    ))
                  ) : (
                    <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', margin: 0 }}>No certifications added yet.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Skills Section */}
          {((student.skills && student.skills.length > 0) || canEdit) && (
            <div className="profile-section glass">
              <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px' }}>
                    <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Specialized Skills
                </div>
                {canEdit && !isEditingSkills && (
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setIsEditingSkills(true)}
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', minHeight: '28px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border-color)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '11px', height: '11px' }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Skills
                  </button>
                )}
              </h2>

              {isEditingSkills ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    {skillsList.map((skill, index) => (
                      <span key={index} className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                        {skill}
                        <button
                          type="button"
                          onClick={() => setSkillsList(skillsList.filter(s => s !== skill))}
                          style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: '1.1rem', lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Type a skill and press Enter..."
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const val = skillsInput.trim().replace(/,$/, '');
                          if (val && !skillsList.includes(val)) {
                            setSkillsList([...skillsList, val]);
                          }
                          setSkillsInput('');
                        }
                      }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', padding: '0.2rem 0.5rem', fontSize: '0.8rem', flex: 1, minWidth: '120px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setIsEditingSkills(false); setSkillsList(student.skills || []); }} style={{ padding: '0.3rem 0.8rem', minHeight: '32px' }}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={async () => {
                      try {
                        const updated = await updateStudentProfile(student.id, { skills: skillsList });
                        setStudent(updated);
                        setIsEditingSkills(false);
                      } catch (e) {
                        alert('Failed to save skills: ' + e.message);
                      }
                    }} style={{ padding: '0.3rem 0.8rem', minHeight: '32px' }}>Save Changes</button>
                  </div>
                </div>
              ) : (
                <div className="detail-skills-list">
                  {student.skills && student.skills.length > 0 ? (
                    student.skills.map((skill, index) => (
                      <span key={index} className="badge badge-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', margin: 0 }}>No skills added yet.</p>
                  )}
                </div>
              )}
            </div>
          )}

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
          {((student.projects && student.projects.length > 0) || canEdit) && (
            <div className="profile-section glass">
              <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  Project Showreel
                </div>
                {canEdit && !isEditingProjects && (
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setIsEditingProjects(true)}
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', minHeight: '28px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border-color)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '11px', height: '11px' }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit Projects
                  </button>
                )}
              </h2>

              {isEditingProjects ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {projList.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {projList.map((proj, index) => (
                        <div key={proj.id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{proj.title}</div>
                            {proj.link && <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.15rem' }}>{proj.link}</div>}
                            {proj.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', margin: 0 }}>{proj.description}</p>}
                          </div>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            style={{ minHeight: '28px', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => setProjList(projList.filter((_, i) => i !== index))}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>Add New Project</h4>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Project Title *</label>
                      <input className="form-control" type="text" placeholder="e.g. Smart Irrigation System" value={newProjTitle} onChange={(e) => setNewProjTitle(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Project Description</label>
                      <textarea className="form-control" placeholder="Briefly explain what you built..." value={newProjDesc} onChange={(e) => setNewProjDesc(e.target.value)} style={{ minHeight: '60px', padding: '0.4rem 0.6rem', fontSize: '0.8rem', resize: 'vertical' }} />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Project Link (URL)</label>
                      <input className="form-control" type="url" placeholder="https://github.com/..." value={newProjLink} onChange={(e) => setNewProjLink(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} />
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ alignSelf: 'flex-end', minHeight: '28px', padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => {
                        const newProj = {
                          id: `proj-${Date.now()}`,
                          title: newProjTitle,
                          description: newProjDesc,
                          link: newProjLink
                        };
                        setProjList([...projList, newProj]);
                        setNewProjTitle('');
                        setNewProjDesc('');
                        setNewProjLink('');
                      }}
                      disabled={!newProjTitle.trim()}
                    >
                      Add Project
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setIsEditingProjects(false); setProjList(student.projects || []); }} style={{ padding: '0.3rem 0.8rem', minHeight: '32px' }}>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={async () => {
                      try {
                        const updated = await updateStudentProfile(student.id, { projects: projList });
                        setStudent(updated);
                        setIsEditingProjects(false);
                      } catch (e) {
                        alert('Failed to save projects: ' + e.message);
                      }
                    }} style={{ padding: '0.3rem 0.8rem', minHeight: '32px' }}>Save Changes</button>
                  </div>
                </div>
              ) : (
                <div className="projects-grid">
                  {student.projects && student.projects.length > 0 ? (
                    student.projects.map((proj, idx) => (
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
                    ))
                  ) : (
                    <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', margin: 0 }}>No projects added yet.</p>
                  )}
                </div>
              )}
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
        <div ref={lightboxRef} className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-split-container" onClick={(e) => e.stopPropagation()}>
            
            {/* Left: Media Panel */}
            <div className="lightbox-media-panel" onClick={closeLightbox}>
              {/* Media Controls floating at the top */}
              <div className="lightbox-media-toolbar" onClick={(e) => e.stopPropagation()}>
                <button className="toolbar-btn" onClick={zoomOut} title="Zoom Out">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                <button className="toolbar-btn" onClick={zoomIn} title="Zoom In">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <button className="toolbar-btn" onClick={resetZoom} title="Reset Zoom">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </button>
                <button className="toolbar-btn" onClick={(e) => handleDownloadImage(e, student.photos[photoIndex].url, `photo-${student.photos[photoIndex].id}.jpg`)} title="Download Image">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
                <button className="toolbar-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                </button>
                <button className="toolbar-btn close" onClick={closeLightbox} title="Close Lightbox" style={{ background: '#ef4444', borderColor: '#ef4444' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Prev Button */}
              {student.photos.length > 1 && (
                <button className="lightbox-nav-btn prev" onClick={(e) => { e.stopPropagation(); prevPhoto(); }} aria-label="Previous Photo">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}>
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
              )}

              {/* Image Viewport */}
              <div 
                className="lightbox-image-viewport"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onClick={handleViewportClick}
              >
                <div 
                  className="lightbox-image-wrapper" 
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: zoom === 1 ? '100%' : 'auto',
                    height: zoom === 1 ? '100%' : 'auto',
                    margin: zoom > 1 ? '0' : 'auto'
                  }}
                >
                  <img 
                    src={student.photos[photoIndex].url} 
                    alt={student.photos[photoIndex].caption || `Gallery view ${photoIndex + 1}`} 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (draggedRef.current) {
                        draggedRef.current = false;
                        return;
                      }
                      const nextZoom = zoom === 1 ? 1.5 : 1;
                      setZoom(nextZoom);
                      setTheaterMode(nextZoom > 1);
                    }}
                    style={{ 
                      maxWidth: zoom === 1 ? '100%' : 'none', 
                      maxHeight: zoom === 1 ? '85vh' : 'none',
                      width: zoom === 1 ? 'auto' : `${zoom * 100}%`,
                      height: zoom === 1 ? 'auto' : 'auto',
                      objectFit: 'contain',
                      transition: 'width 0.2s ease, max-width 0.2s ease, max-height 0.2s ease',
                      cursor: zoom <= 1 ? 'zoom-in' : (isDragging ? 'grabbing' : 'grab')
                    }}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
              </div>

              {/* Next Button */}
              {student.photos.length > 1 && (
                <button className="lightbox-nav-btn next" onClick={(e) => { e.stopPropagation(); nextPhoto(); }} aria-label="Next Photo">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </div>

            {/* Right: Info Sidebar Panel */}
            {!theaterMode && (
              <div className="lightbox-info-panel">
              <div className="lightbox-info-header">
                <div className="lightbox-uploader-info">
                  <div className="lightbox-uploader-avatar">
                    <AvatarImage avatarId={student.avatarId || 'avatar-1'} id="lightbox-sidebar-avatar" />
                  </div>
                  <div className="lightbox-uploader-details">
                    <div className="uploader-name">{student.name}</div>
                    <div className="uploader-meta">{student.program || 'Student'}</div>
                  </div>
                </div>
                <button className="sidebar-close-btn" onClick={closeLightbox} title="Close Lightbox">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="lightbox-info-body">
                <div className="lightbox-counter-badge">
                  Image {photoIndex + 1} of {student.photos.length}
                </div>

                <div className="lightbox-caption-section">
                  <h3>Description</h3>
                  <p className="lightbox-caption-text">
                    {student.photos[photoIndex].caption || <em style={{ opacity: 0.6 }}>No description provided.</em>}
                  </p>
                </div>

                {canEdit && (
                  <div className="lightbox-owner-actions">
                    <button className="sidebar-action-btn edit-btn" onClick={() => handleInPlaceEditCaption(student.photos[photoIndex].id, student.photos[photoIndex].caption)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: '16px', height: '16px' }}>
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit Caption
                    </button>
                    <button className="sidebar-action-btn delete-btn" onClick={() => handleInPlaceRemovePhotoInsideLightbox(student.photos[photoIndex].id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: '16px', height: '16px' }}>
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Delete Photo
                    </button>
                  </div>
                )}
              </div>

              {student.photos.length > 1 && (
                <div className="lightbox-info-footer">
                  <div className="footer-title">All Photos ({student.photos.length})</div>
                  <div className="lightbox-sidebar-thumbnails">
                    {student.photos.map((photo, idx) => (
                      <div 
                        key={photo.id || idx}
                        className={`sidebar-thumbnail-item ${idx === photoIndex ? 'active' : ''}`}
                        onClick={() => handleThumbnailClick(idx)}
                      >
                        <img src={photo.url} alt="" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            )}

          </div>
        </div>
      )}

      {/* Image Viewer Modal for Profile Picture / Banner */}
      {viewerImage && (
        <div ref={lightboxRef} className="lightbox-overlay" onClick={() => { setViewerImage(null); setViewerCaption(''); }}>
          <div className="lightbox-media-panel" onClick={() => { setViewerImage(null); setViewerCaption(''); }} style={{ width: '100%', height: '100%' }}>
            
            {/* Toolbar floating at the top */}
            <div className="lightbox-media-toolbar" onClick={(e) => e.stopPropagation()}>
              <span className="zoom-level" style={{ marginRight: '0.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {viewerCaption || 'Viewer'}
              </span>
              <button className="toolbar-btn" onClick={zoomOut} title="Zoom Out">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span className="zoom-level">{Math.round(zoom * 100)}%</span>
              <button className="toolbar-btn" onClick={zoomIn} title="Zoom In">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <button className="toolbar-btn" onClick={resetZoom} title="Reset Zoom">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </button>
              <button 
                className="toolbar-btn" 
                onClick={(e) => handleDownloadImage(e, viewerImage, viewerIsAvatar ? (viewerImage.startsWith('data:image/') ? 'profile-photo.jpg' : 'avatar.svg') : 'profile-banner.jpg')} 
                title="Download Image"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
              <button className="toolbar-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
              </button>
              <button className="toolbar-btn close" onClick={() => { setViewerImage(null); setViewerCaption(''); }} title="Close Viewer" style={{ background: '#ef4444', borderColor: '#ef4444' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div 
              className="lightbox-image-viewport"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onClick={handleViewportClick}
            >
              <div 
                className="lightbox-image-wrapper" 
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: zoom === 1 ? '100%' : 'auto',
                  height: zoom === 1 ? '100%' : 'auto',
                  margin: zoom > 1 ? '0' : 'auto'
                }}
              >
                {viewerIsAvatar ? (
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (draggedRef.current) {
                        draggedRef.current = false;
                        return;
                      }
                      setZoom(prev => prev === 1 ? 1.5 : 1);
                    }}
                    onDragStart={(e) => e.preventDefault()}
                    style={{ 
                      width: zoom === 1 ? '280px' : `${280 * zoom}px`, 
                      height: zoom === 1 ? '280px' : `${280 * zoom}px`, 
                      background: 'var(--bg-card)', 
                      borderRadius: 'var(--border-radius-lg)', 
                      border: '6px solid rgba(255,255,255,0.1)', 
                      overflow: 'hidden', 
                      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                      transition: 'width 0.2s ease, height 0.2s ease',
                      cursor: zoom <= 1 ? 'zoom-in' : (isDragging ? 'grabbing' : 'grab')
                    }}
                  >
                    <AvatarImage 
                      avatarId={viewerImage} 
                      id="viewer-avatar-display" 
                      style={{ borderRadius: 'inherit' }} 
                    />
                  </div>
                ) : (
                  <img 
                    src={viewerImage} 
                    alt={viewerCaption || 'Full size view'} 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (draggedRef.current) {
                        draggedRef.current = false;
                        return;
                      }
                      setZoom(prev => prev === 1 ? 1.5 : 1);
                    }}
                    style={{ 
                      maxWidth: zoom === 1 ? '100%' : 'none', 
                      maxHeight: zoom === 1 ? '85vh' : 'none',
                      width: zoom === 1 ? 'auto' : `${zoom * 100}%`,
                      height: zoom === 1 ? 'auto' : 'auto',
                      objectFit: 'contain',
                      transition: 'width 0.2s ease, max-width 0.2s ease, max-height 0.2s ease',
                      cursor: zoom <= 1 ? 'zoom-in' : (isDragging ? 'grabbing' : 'grab')
                    }}
                    onDragStart={(e) => e.preventDefault()}
                  />
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  </div>
</div>
  );
};
export default ProfileDetail;
