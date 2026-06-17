import { useState, useEffect } from 'react';
import { StudentCard } from '../components/StudentCard';
import { getStudents, deleteStudentProfileAndAccount } from '../utils/storage';

export const Directory = ({ navigateTo, currentUser, params }) => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState(params?.major || 'All');
  const [selectedCampus, setSelectedCampus] = useState(params?.campus || 'All');
  const [sortBy, setSortBy] = useState('name-asc');

  // Load students on mount
  useEffect(() => {
    if (!currentUser) {
      navigateTo('auth');
      return;
    }
    const loadData = async () => {
      const list = await getStudents();
      setStudents(list);
    };
    loadData();
  }, [currentUser]);

  // Sync selectedMajor and selectedCampus if navigation params change
  useEffect(() => {
    if (params?.major) {
      setSelectedMajor(params.major);
    } else {
      setSelectedMajor('All');
    }
    if (params?.campus) {
      setSelectedCampus(params.campus);
    } else {
      setSelectedCampus('All');
    }
  }, [params]);

  const handleDelete = async (student) => {
    const confirmMessage = `WARNING: You are about to permanently delete ${student.name}'s portfolio and user account. This action cannot be undone. Do you wish to proceed?`;
    if (window.confirm(confirmMessage)) {
      if (window.confirm("FINAL CONFIRMATION: Are you absolutely certain you want to proceed?")) {
        await deleteStudentProfileAndAccount(student.id);
        alert(`${student.name}'s portfolio was successfully deleted.`);
        const list = await getStudents();
        setStudents(list);
      }
    }
  };

  // Calculate statistics dynamically
  const totalStudents = students.length;
  const totalProjects = students.reduce((acc, curr) => acc + (curr.projects?.length || 0), 0);
  const uniqueSkills = Array.from(
    new Set(students.flatMap(s => s.skills || []))
  ).length;

  // Extract unique majors for filter dropdown
  const uniqueMajors = Array.from(
    new Set(students.map(s => s.major).filter(Boolean))
  );

  // Extract unique campuses for filter dropdown
  const uniqueCampuses = Array.from(
    new Set(students.map(s => s.campus || 'Sibalom (Main Campus)').filter(Boolean))
  );

  // Filter and Search logic
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.shortBio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMajor = selectedMajor === 'All' || student.major === selectedMajor;
    const matchesCampus = selectedCampus === 'All' || 
      student.campus === selectedCampus || 
      (!student.campus && selectedCampus === 'Sibalom (Main Campus)');
    const isVisible = student.isPublic !== false || !!currentUser?.isAdmin;

    return matchesSearch && matchesMajor && matchesCampus && isVisible;
  });

  // Sort logic
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else if (sortBy === 'projects-count') {
      return (b.projects?.length || 0) - (a.projects?.length || 0);
    } else if (sortBy === 'skills-count') {
      return (b.skills?.length || 0) - (a.skills?.length || 0);
    }
    return 0;
  });

  return (
    <div className="app-page-wrapper">
      <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
        {/* Hero Section */}
        <section className="hero animate-slide-up">
          <div className="hero-glow"></div>
          <h1>Meet the Next Gen of <span className='text-gradient-animated'>Innovators</span></h1>
          <p>
            Discover and connect with talented university students showcasing their technical projects, creative portfolios, and specialized skills.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            {!currentUser ? (
              <button className="btn btn-primary btn-view-portfolio" onClick={() => navigateTo('auth')}>
                Create Your Portfolio
              </button>
            ) : currentUser.isAdmin ? (
              <button 
                className="btn btn-primary btn-view-portfolio" 
                style={{ cursor: 'default' }}
                onClick={(e) => e.preventDefault()}
              >
                Logged in as Admin
              </button>
            ) : (
              <button 
                className="btn btn-primary btn-view-portfolio" 
                onClick={() => navigateTo('profile-detail', { id: currentUser.studentId })}
              >
                View My Portfolio
              </button>
            )}
          </div>
        </section>

        {/* Dynamic Statistics Bar */}
        <div 
          className="glass animate-slide-up-delay-1" 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            padding: '1.5rem',
            borderRadius: 'var(--border-radius-lg)',
            textAlign: 'center',
            marginBottom: '3rem',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{totalStudents}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Portfolios</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent)' }}>{totalProjects}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Projects Showcased</div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--logo-gold)' }}>{uniqueSkills}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Unique Skills</div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="search-filter-section glass animate-slide-up-delay-1">
          {/* Search Field */}
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="search"
              className="form-control"
              placeholder="Search by name, bio, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', minHeight: '44px' }}
            />
            <span 
              style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                pointerEvents: 'none'
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>

          {/* Campus Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="campus-select" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              Campus:
            </label>
            <select
              id="campus-select"
              className="form-control"
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              style={{ width: '180px', minHeight: '44px', padding: '0.5rem 1rem' }}
            >
              <option value="All">All Campuses</option>
              {uniqueCampuses.map((campus, index) => (
                <option key={index} value={campus}>{campus}</option>
              ))}
            </select>
          </div>

          {/* Major Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="major-select" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              Major:
            </label>
            <select
              id="major-select"
              className="form-control"
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              style={{ width: '180px', minHeight: '44px', padding: '0.5rem 1rem' }}
            >
              <option value="All">All Majors</option>
              {uniqueMajors.map((major, index) => (
                <option key={index} value={major}>{major}</option>
              ))}
            </select>
          </div>

          {/* Sort Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="sort-select" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              Sort By:
            </label>
            <select
              id="sort-select"
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: '180px', minHeight: '44px', padding: '0.5rem 1rem' }}
            >
              <option value="name-asc">Alphabetical (A-Z)</option>
              <option value="name-desc">Alphabetical (Z-A)</option>
              <option value="projects-count">Most Projects</option>
              <option value="skills-count">Most Skills</option>
            </select>
          </div>
        </div>

        {/* Student Cards Grid */}
        {sortedStudents.length > 0 ? (
          <div className="student-grid animate-slide-up-delay-2">
            {sortedStudents.map(student => (
              <StudentCard
                key={student.id}
                student={student}
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '48px', height: '48px' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="15" />
                <line x1="15" y1="9" x2="9" y2="15" />
              </svg>
            </div>
            <h3>No Student Portfolios Found</h3>
            <p style={{ marginTop: '0.5rem' }}>Try clearing your search queries or selecting a different major filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Directory;
