import { useState, useEffect } from 'react';
import { getStudents, updateStudentProfile, deleteStudentProfileAndAccount } from '../utils/storage';
import { AvatarImage } from '../components/AvatarPicker';

export const OfficeAdmin = ({ currentUser, navigateTo }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'analytics' | 'resumes'
  
  // Search & Filter state for Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');

  // Load students on mount and whenever updates happen
  const loadData = async () => {
    try {
      const list = await getStudents(true); // Force refresh to get latest
      setStudents(list);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Security redirect check
    const session = localStorage.getItem('student_portfolio_session');
    if (!session && !currentUser) {
      navigateTo('auth');
      return;
    }
    if (currentUser && !currentUser.isAdmin) {
      navigateTo('home');
      return;
    }

    if (currentUser && currentUser.isAdmin) {
      loadData();
    }
  }, [currentUser, navigateTo]);

  // Helper to resolve year level deterministically if not present
  const getYearLevel = (student) => {
    if (student.yearLevel) return student.yearLevel;
    // Stable deterministic year level fallback based on student ID hash
    const hash = student.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    return years[hash % 4];
  };

  // Actions handler
  const handleToggleVisibility = async (student) => {
    try {
      const nextPublicState = student.isPublic === false ? true : false;
      await updateStudentProfile(student.id, { isPublic: nextPublicState });
      // Update local state statefully to preserve UI scroll
      setStudents(prev => 
        prev.map(s => s.id === student.id ? { ...s, isPublic: nextPublicState } : s)
      );
    } catch (error) {
      console.error('Error toggling visibility:', error);
      alert('Failed to update visibility. Please try again.');
    }
  };

  const handleDeleteStudent = async (student) => {
    const confirmMsg = `WARNING: You are about to permanently delete ${student.name}'s portfolio and user account. This action cannot be undone.\n\nDo you want to proceed?`;
    if (window.confirm(confirmMsg)) {
      if (window.confirm(`FINAL CONFIRMATION: Are you absolutely certain you want to delete the account for ${student.name}?`)) {
        try {
          await deleteStudentProfileAndAccount(student.id);
          alert(`${student.name}'s account and portfolio were successfully deleted.`);
          loadData();
        } catch (error) {
          console.error('Error deleting student:', error);
          alert('Failed to delete student account. Please try again.');
        }
      }
    }
  };

  // Calculations for dashboard counters
  const totalCount = students.length;
  const publicCount = students.filter(s => s.isPublic !== false).length;
  const privateCount = totalCount - publicCount;
  const resumesCount = students.filter(s => s.resume && s.resume.dataUrl).length;

  // Extract majors for dropdown filter
  const uniqueMajors = Array.from(new Set(students.map(s => s.major).filter(Boolean)));

  // Filter & Search logic
  const filteredStudents = students.filter(student => {
    if (!student || student.id === '--stats--') return false;

    const name = student.name || '';
    const email = student.email || '';
    const shortBio = student.shortBio || '';
    const skills = student.skills || [];

    const matchesSearch = 
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortBio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skills.some(skill => skill && typeof skill === 'string' && skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMajor = selectedMajor === 'All' || student.major === selectedMajor;

    return matchesSearch && matchesMajor;
  });

  // Sort logic
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else if (sortBy === 'major-asc') {
      return (a.major || '').localeCompare(b.major || '');
    } else if (sortBy === 'year-asc') {
      return getYearLevel(a).localeCompare(getYearLevel(b));
    }
    return 0;
  });

  // Render loading state while checking currentUser
  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Verifying Administrator Credentials...</p>
      </div>
    );
  }

  // Analytics tab computations
  const getAnalyticsData = () => {
    // 1. Major distribution count
    const majorMap = {};
    students.forEach(s => {
      const m = s.major || 'Undeclared';
      majorMap[m] = (majorMap[m] || 0) + 1;
    });
    const majorList = Object.entries(majorMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

    // 2. Year Level count
    const yearMap = { '1st Year': 0, '2nd Year': 0, '3rd Year': 0, '4th Year': 0 };
    students.forEach(s => {
      const y = getYearLevel(s);
      yearMap[y] = (yearMap[y] || 0) + 1;
    });
    const yearList = Object.entries(yearMap).map(([name, count]) => ({ name, count }));

    return { majorList, yearList };
  };

  const { majorList, yearList } = getAnalyticsData();
  const maxMajorCount = majorList.length > 0 ? Math.max(...majorList.map(m => m.count)) : 1;
  const maxYearCount = yearList.length > 0 ? Math.max(...yearList.map(y => y.count)) : 1;

  // Filter students who have resumes
  const studentsWithResumes = students.filter(s => s.resume && s.resume.dataUrl);

  return (
    <div className="container admin-dashboard-container" style={{ paddingBottom: '5rem' }}>
      {/* Banner / Title Header */}
      <section className="hero" style={{ padding: '3rem 2rem 2.5rem', marginBottom: '2rem', textAlign: 'left' }}>
        <div className="hero-glow"></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <span className="badge" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', borderColor: 'var(--accent)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.2rem 0.6rem' }}>
            Office Console
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem' }}>Office of <span>Administration</span></h1>
        <p style={{ maxWidth: '650px', fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
          Manage student portfolios, evaluate system-wide statistics, toggle public discoverability, and review uploaded resumes.
        </p>
      </section>

      {/* Metrics Row */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card glass">
          <div className="admin-metric-icon" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="admin-metric-info">
            <span className="admin-metric-value">{totalCount}</span>
            <span className="admin-metric-label">Total Accounts</span>
          </div>
        </div>

        <div className="admin-metric-card glass">
          <div className="admin-metric-icon" style={{ background: 'var(--success-glow)', color: 'var(--success)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="admin-metric-info">
            <span className="admin-metric-value">{publicCount}</span>
            <span className="admin-metric-label">Public Portfolios</span>
          </div>
        </div>

        <div className="admin-metric-card glass">
          <div className="admin-metric-icon" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </div>
          <div className="admin-metric-info">
            <span className="admin-metric-value">{privateCount}</span>
            <span className="admin-metric-label">Private Portfolios</span>
          </div>
        </div>

        <div className="admin-metric-card glass">
          <div className="admin-metric-icon" style={{ background: 'var(--logo-gold-glow)', color: 'var(--logo-gold)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className="admin-metric-info">
            <span className="admin-metric-value">{resumesCount}</span>
            <span className="admin-metric-label">Resumes Uploaded</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="admin-tabs-nav glass" style={{ display: 'flex', gap: '0.5rem', padding: '0.4rem', borderRadius: 'var(--border-radius-md)', marginBottom: '2rem' }}>
        <button 
          className={`admin-tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
          onClick={() => setActiveTab('directory')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', marginRight: '6px' }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <rect x="16" y="3" width="6" height="18" rx="2" ry="2" />
          </svg>
          Student Directory
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', marginRight: '6px' }}>
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          System Analytics
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'resumes' ? 'active' : ''}`}
          onClick={() => setActiveTab('resumes')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', marginRight: '6px' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Resumes Queue
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '30px', height: '30px', border: '2px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <>
          {activeTab === 'directory' && (
            <div className="admin-tab-content-card glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius-lg)' }}>
              {/* Directory Filter Panel */}
              <div className="search-filter-section" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search by name, email, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '2.5rem', minHeight: '42px' }}
                  />
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label htmlFor="admin-major-select" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Major:</label>
                  <select
                    id="admin-major-select"
                    className="form-control"
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value)}
                    style={{ width: '180px', minHeight: '42px', padding: '0.4rem 0.8rem' }}
                  >
                    <option value="All">All Majors</option>
                    {uniqueMajors.map((m, i) => (
                      <option key={i} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label htmlFor="admin-sort-select" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Sort:</label>
                  <select
                    id="admin-sort-select"
                    className="form-control"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: '160px', minHeight: '42px', padding: '0.4rem 0.8rem' }}
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="major-asc">Major (A-Z)</option>
                    <option value="year-asc">Year Level</option>
                  </select>
                </div>
              </div>

              {/* Table Wrapper */}
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Avatar</th>
                      <th>Student Name</th>
                      <th>Email Address</th>
                      <th>Academic Major</th>
                      <th>Year Level</th>
                      <th>Visibility</th>
                      <th style={{ textAlign: 'center', width: '220px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStudents.length > 0 ? (
                      sortedStudents.map(student => {
                        const isPublic = student.isPublic !== false;
                        return (
                          <tr key={student.id}>
                            <td>
                              <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                                <AvatarImage avatarId={student.avatarId} id={`admin-table-${student.id}`} />
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{student.name}</div>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{student.email}</span>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{student.major}</span>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{getYearLevel(student)}</span>
                            </td>
                            <td>
                              <span className={`badge ${isPublic ? 'badge-primary' : ''}`} style={{ backgroundColor: isPublic ? 'var(--success-bg)' : 'var(--danger-bg)', color: isPublic ? 'var(--success)' : 'var(--danger)', borderColor: isPublic ? 'var(--success-border)' : 'var(--danger-border)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600 }}>
                                {isPublic ? 'Public' : 'Private'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                                <button 
                                  className="btn btn-secondary"
                                  onClick={() => handleToggleVisibility(student)}
                                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', minHeight: '32px' }}
                                  title={isPublic ? "Make Profile Private" : "Make Profile Public"}
                                >
                                  {isPublic ? 'Hide' : 'Publish'}
                                </button>
                                <button 
                                  className="btn btn-secondary"
                                  onClick={() => navigateTo('edit-profile', { id: student.id })}
                                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', minHeight: '32px' }}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="btn btn-danger"
                                  onClick={() => handleDeleteStudent(student)}
                                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', minHeight: '32px' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          No students matched your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="admin-analytics-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
              {/* Major Distribution Graph */}
              <div className="admin-tab-content-card glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius-lg)' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', color: 'var(--primary)' }}>
                    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                    <path d="M22 12A10 10 0 0 0 12 2v10z" />
                  </svg>
                  Major Enrollment Distribution
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {majorList.length > 0 ? (
                    majorList.map((item, index) => {
                      const pct = Math.round((item.count / totalCount) * 100);
                      const widthPct = Math.max(8, Math.round((item.count / maxMajorCount) * 100)); // Min 8% for text layout
                      
                      // Alternate accent colors for nice design aesthetics
                      const barColors = [
                        'linear-gradient(90deg, var(--primary) 0%, #3b82f6 100%)',
                        'linear-gradient(90deg, var(--accent) 0%, #ef4444 100%)',
                        'linear-gradient(90deg, var(--logo-gold) 0%, #fbbf24 100%)',
                        'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                        'linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)'
                      ];
                      const barColor = barColors[index % barColors.length];

                      return (
                        <div key={index} className="analytics-bar-item">
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                            <span style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }} title={item.name}>{item.name}</span>
                            <span style={{ color: 'var(--text-secondary)' }}>{item.count} ({pct}%)</span>
                          </div>
                          <div style={{ height: '18px', background: 'var(--border-color)', borderRadius: '9px', overflow: 'hidden', position: 'relative' }}>
                            <div 
                              style={{ 
                                height: '100%', 
                                width: `${widthPct}%`, 
                                background: barColor, 
                                borderRadius: '9px',
                                transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                              }} 
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No enrollment data available.
                    </div>
                  )}
                </div>
              </div>

              {/* Year Level Breakdown Graph */}
              <div className="admin-tab-content-card glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius-lg)' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', color: 'var(--accent)' }}>
                    <path d="M12 20v-6M6 20V10M18 20V4M12 4V2M6 8V6M18 10V8" />
                  </svg>
                  Academic Year Classification
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {yearList.map((item, index) => {
                    const pct = totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
                    const widthPct = totalCount > 0 ? Math.max(8, Math.round((item.count / maxYearCount) * 100)) : 0;
                    
                    const barColors = [
                      'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
                      'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                      'linear-gradient(90deg, #fbbf24 0%, #fcd34d 100%)',
                      'linear-gradient(90deg, #ef4444 0%, #f87171 100%)'
                    ];
                    const barColor = barColors[index % barColors.length];

                    return (
                      <div key={index} className="analytics-bar-item">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                          <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{item.count} {item.count === 1 ? 'Student' : 'Students'} ({pct}%)</span>
                        </div>
                        <div style={{ height: '18px', background: 'var(--border-color)', borderRadius: '9px', overflow: 'hidden', position: 'relative' }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              width: `${widthPct}%`, 
                              background: barColor, 
                              borderRadius: '9px',
                              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                            }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resumes' && (
            <div className="admin-tab-content-card glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius-lg)' }}>
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-md)' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Avatar</th>
                      <th>Student Name</th>
                      <th>Academic Major</th>
                      <th>CV Filename</th>
                      <th>Upload Date</th>
                      <th style={{ textAlign: 'center', width: '150px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsWithResumes.length > 0 ? (
                      studentsWithResumes.map(student => {
                        const resumeDate = student.resume.uploadedAt 
                          ? new Date(student.resume.uploadedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                          : 'N/A';
                        
                        return (
                          <tr key={student.id}>
                            <td>
                              <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                                <AvatarImage avatarId={student.avatarId} id={`admin-resume-table-${student.id}`} />
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{student.name}</div>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{student.major}</span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500 }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', flexShrink: 0 }}>
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '240px' }} title={student.resume.name}>
                                  {student.resume.name}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{resumeDate}</span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <a 
                                  href={student.resume.dataUrl} 
                                  download={student.resume.name || `${student.name}_CV.pdf`}
                                  className="btn btn-primary"
                                  style={{ 
                                    padding: '0.3rem 0.75rem', 
                                    fontSize: '0.75rem', 
                                    minHeight: '32px',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '4px',
                                    textDecoration: 'none'
                                  }}
                                >
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '12px', height: '12px' }}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                  </svg>
                                  Download
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          No students have uploaded their resumes yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
