import React, { useState, useEffect } from 'react';
import { StudentCard } from '../components/StudentCard';
import { getStudents, deleteStudentProfileAndAccount, getCourses } from '../utils/storage';

export const Directory = ({ navigateTo, currentUser, params }) => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState(params?.major || 'All');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Draft' | 'Pending' | 'Approved'
  const [sortBy, setSortBy] = useState('name-asc');
  const [loading, setLoading] = useState(true);

  // Load students and courses on mount
  useEffect(() => {
    if (!currentUser) {
      navigateTo('auth');
      return;
    }
    const loadData = async () => {
      setLoading(true);
      const sList = await getStudents();
      const cList = await getCourses();
      setStudents(sList);
      setCourses(cList);
      setLoading(false);
    };
    loadData();
  }, [currentUser]);

  // Sync selectedMajor if navigation params change
  useEffect(() => {
    if (params?.major) {
      setSelectedMajor(params.major);
    } else {
      setSelectedMajor('All');
    }
  }, [params]);

  const handleDelete = async (student) => {
    const confirmMessage = `WARNING: You are about to permanently delete ${student.name}'s registrar record and user account. This action cannot be undone. Do you wish to proceed?`;
    if (window.confirm(confirmMessage)) {
      if (window.confirm("FINAL CONFIRMATION: Are you absolutely certain you want to proceed?")) {
        await deleteStudentProfileAndAccount(student.id);
        alert(`${student.name}'s record was successfully deleted.`);
        const list = await getStudents();
        setStudents(list);
      }
    }
  };

  // Registrar statistics counters
  const totalCount = students.length;
  const approvedCount = students.filter(s => s.registrationStatus === 'Approved').length;
  const pendingCount = students.filter(s => s.registrationStatus === 'Pending').length;
  const draftCount = totalCount - approvedCount - pendingCount;

  // Extract unique majors for filter dropdown
  const uniqueMajors = Array.from(
    new Set(students.map(s => s.major).filter(Boolean))
  );

  // Filter and Search logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMajor = selectedMajor === 'All' || student.major === selectedMajor;
    
    const status = student.registrationStatus || 'Draft';
    const matchesStatus = statusFilter === 'All' || status === statusFilter;

    // Staff/Admins can see all records, students can only see public records OR their own record.
    const isVisible = 
      student.isPublic !== false || 
      currentUser?.isAdmin || 
      currentUser?.studentId === student.id;

    return matchesSearch && matchesMajor && matchesStatus && isVisible;
  });

  // Sort logic
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else if (sortBy === 'status-asc') {
      return (a.registrationStatus || 'Draft').localeCompare(b.registrationStatus || 'Draft');
    }
    return 0;
  });

  return (
    <div className="app-page-wrapper">
      <div className="container animate-fade-in" style={{ paddingBottom: '4rem', maxWidth: '1000px' }}>
        
        {/* Banner */}
        <section className="hero animate-slide-up" style={{ padding: '2.5rem 2rem', marginBottom: '2rem', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
          <div className="hero-glow"></div>
          <span className="badge" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', borderColor: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.2rem 0.6rem', marginBottom: '0.5rem', display: 'inline-block' }}>
            Registrar Directory
          </span>
          <h1 style={{ fontSize: '2.2rem', margin: '0 0 0.5rem', color: '#ffffff' }}>Student Enrollment Roster</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '750px' }}>
            Search and view official student registration records, active academic programs, and enrollment statistics across all semesters.
          </p>
        </section>

        {/* Registrar Stats bar */}
        <div 
          className="glass animate-slide-up-delay-1" 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            padding: '1.25rem',
            borderRadius: 'var(--border-radius-lg)',
            textAlign: 'center',
            marginBottom: '2rem',
            gap: '1rem',
            border: '1px solid var(--border-color)'
          }}
        >
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{totalCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Registered</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{approvedCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active / Enrolled</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--logo-gold)' }}>{pendingCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Review</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-muted)' }}>{draftCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Draft State</div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="search-filter-section glass animate-slide-up-delay-1" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <input
              type="search"
              className="form-control"
              placeholder="Search by student name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', minHeight: '42px' }}
            />
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px' }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>

          {/* Program filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '180px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Program:</label>
            <select
              className="form-control"
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              style={{ minHeight: '42px', padding: '0.5rem 1rem' }}
            >
              <option value="All">All Programs</option>
              {uniqueMajors.map((major, index) => (
                <option key={index} value={major}>{major}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '180px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Status:</label>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minHeight: '42px', padding: '0.5rem 1rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Enrolled / Approved</option>
            </select>
          </div>

          {/* Sort selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '180px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Sort By:</label>
            <select
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ minHeight: '42px', padding: '0.5rem 1rem' }}
            >
              <option value="name-asc">Alphabetical (A-Z)</option>
              <option value="name-desc">Alphabetical (Z-A)</option>
              <option value="status-asc">Enrollment Status</option>
            </select>
          </div>

        </div>

        {/* Student Cards Grid */}
        {loading ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Loading roster data...</p>
        ) : sortedStudents.length > 0 ? (
          <div className="student-grid animate-slide-up-delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {sortedStudents.map(student => (
              <StudentCard
                key={student.id}
                student={student}
                courses={courses}
                currentUser={currentUser}
                onClick={() => navigateTo('profile-detail', { id: student.id })}
                onDelete={() => handleDelete(student)}
              />
            ))}
          </div>
        ) : (
          <div 
            className="glass animate-slide-up-delay-2"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              borderRadius: 'var(--border-radius-lg)',
              border: '2px dashed var(--border-color)',
            }}
          >
            <div style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '48px', height: '48px', margin: '0 auto' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="15" />
                <line x1="15" y1="9" x2="9" y2="15" />
              </svg>
            </div>
            <h3>No Student Records Found</h3>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Try clearing your filters or selecting a different academic program.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Directory;
