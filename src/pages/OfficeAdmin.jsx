import React, { useState, useEffect } from 'react';
import { getStudents, updateStudentProfile, deleteStudentProfileAndAccount, getCourses, saveCourse, deleteCourse } from '../utils/storage';
import { AvatarImage } from '../components/AvatarPicker';

export const OfficeAdmin = ({ currentUser, navigateTo }) => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('registrations'); // 'registrations' | 'courses' | 'billing-reports'
  
  // Search & Filter state for registrations
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Draft' | 'Pending' | 'Approved'

  // Course Management states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({ code: '', title: '', units: 3, department: 'Computer Science', instructor: '', capacity: 40, feePerUnit: 150 });
  const [courseFormError, setCourseFormError] = useState('');

  // Payment Recording states
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Load students & courses on mount and updates
  const loadData = async () => {
    try {
      const sList = await getStudents(true);
      const cList = await getCourses();
      setStudents(sList);
      setCourses(cList);
    } catch (error) {
      console.error('Error loading registrar data:', error);
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

  // Actions handler
  const handleApproveRegistration = async (student) => {
    try {
      const updated = await updateStudentProfile(student.id, { registrationStatus: 'Approved' });
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, registrationStatus: 'Approved' } : s));
      alert(`Registration approved for ${student.name}. Status set to Enrolled.`);
    } catch (e) {
      alert("Failed to approve registration.");
    }
  };

  const handleResetRegistration = async (student) => {
    try {
      const updated = await updateStudentProfile(student.id, { registrationStatus: 'Draft' });
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, registrationStatus: 'Draft' } : s));
      alert(`Registration status reset to Draft for ${student.name}.`);
    } catch (e) {
      alert("Failed to reset status.");
    }
  };

  const handleDeleteStudent = async (student) => {
    const confirmMsg = `WARNING: You are about to permanently delete ${student.name}'s registrar record and user account. This action cannot be undone.\n\nDo you want to proceed?`;
    if (window.confirm(confirmMsg)) {
      if (window.confirm(`FINAL CONFIRMATION: Are you absolutely certain you want to delete the account for ${student.name}?`)) {
        try {
          await deleteStudentProfileAndAccount(student.id);
          alert(`${student.name}'s account and records were successfully deleted.`);
          loadData();
        } catch (error) {
          console.error('Error deleting student:', error);
          alert('Failed to delete student. Please try again.');
        }
      }
    }
  };

  // Course CRUD handlers
  const handleOpenAddCourse = () => {
    setIsEditingCourse(false);
    setCourseForm({ code: '', title: '', units: 3, department: 'Computer Science', instructor: '', capacity: 40, feePerUnit: 150 });
    setCourseFormError('');
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (course) => {
    setIsEditingCourse(true);
    setCourseForm({ ...course });
    setCourseFormError('');
    setShowCourseModal(true);
  };

  const handleSaveCourseForm = async (e) => {
    e.preventDefault();
    setCourseFormError('');

    if (!courseForm.code.trim()) {
      setCourseFormError('Course code is required.');
      return;
    }
    if (!courseForm.title.trim()) {
      setCourseFormError('Course title is required.');
      return;
    }

    try {
      const codeUpper = courseForm.code.trim().toUpperCase();
      const payload = {
        ...courseForm,
        code: codeUpper,
        units: parseInt(courseForm.units),
        capacity: parseInt(courseForm.capacity),
        feePerUnit: parseFloat(courseForm.feePerUnit)
      };

      await saveCourse(payload);
      alert(isEditingCourse ? 'Course updated successfully.' : 'Course added successfully.');
      setShowCourseModal(false);
      loadData();
    } catch (err) {
      setCourseFormError(err.message || 'Failed to save course.');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm(`Are you sure you want to delete course ${courseId}? This cannot be undone.`)) {
      try {
        await deleteCourse(courseId);
        alert(`Course ${courseId} deleted successfully.`);
        loadData();
      } catch (err) {
        alert("Failed to delete course.");
      }
    }
  };

  // Tuition settlement recorders
  const handleRecordSettlement = async (student) => {
    if (window.confirm(`Are you sure you want to mark ${student.name}'s tuition as Settled / Paid?`)) {
      const newTx = {
        id: `TX-MAN-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        amount: 0,
        method: 'Cash (Manual)',
        refNum: `REF-M-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        status: 'SETTLED'
      };

      const currentTxs = student.transactions || [];
      try {
        await updateStudentProfile(student.id, {
          transactions: [newTx, ...currentTxs],
          paymentStatus: 'Paid'
        });
        alert(`Tuition marked as Settled for ${student.name}.`);
        loadData();
      } catch (err) {
        alert("Failed to update settlement status.");
      }
    }
  };

  const handleResetSettlement = async (student) => {
    if (window.confirm(`Are you sure you want to mark ${student.name}'s tuition as Unpaid?`)) {
      try {
        await updateStudentProfile(student.id, {
          paymentStatus: 'Unpaid'
        });
        alert(`Tuition marked as Unpaid for ${student.name}.`);
        loadData();
      } catch (err) {
        alert("Failed to update settlement status.");
      }
    }
  };

  // Calculations & Analytics metrics
  const pendingCount = students.filter(s => s.registrationStatus === 'Pending').length;
  const approvedCount = students.filter(s => s.registrationStatus === 'Approved').length;
  const totalCount = students.length;

  const baseFee = 500;
  const pricePerUnit = 150;

  // Global Financial Totals (No monetary figures)
  const paidCount = students.filter(s => s.paymentStatus === 'Paid').length;
  const unpaidCount = students.filter(s => s.paymentStatus !== 'Paid').length;
  const settlementRate = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;

  // Extract unique majors
  const uniqueMajors = Array.from(new Set(students.map(s => s.major).filter(Boolean)));

  // Filter student directory/registration list
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesMajor = selectedMajor === 'All' || student.major === selectedMajor;
    
    const status = student.registrationStatus || 'Draft';
    const matchesStatus = statusFilter === 'All' || status === statusFilter;

    return matchesSearch && matchesMajor && matchesStatus;
  });

  // Sort logic
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    if (sortBy === 'status-asc') return (a.registrationStatus || 'Draft').localeCompare(b.registrationStatus || 'Draft');
    return 0;
  });

  // Get student financials individually
  const getStudentBillingDetails = (student) => {
    const enrolledIds = student.enrolledCourses || [];
    const studentEnrolledCourses = courses.filter(c => enrolledIds.includes(c.id || c.code));
    const totalUnits = studentEnrolledCourses.reduce((sum, c) => sum + (c.units || 0), 0);
    const assessed = baseFee + (totalUnits * pricePerUnit);
    const paid = (student.transactions || []).reduce((sum, tx) => sum + tx.amount, 0);
    const balance = Math.max(0, assessed - paid);
    return { totalUnits, assessed, paid, balance };
  };

  // Compile all transactions for recent transactions view
  const allTransactions = students.flatMap(s => 
    (s.transactions || []).map(tx => ({ ...tx, studentName: s.name, studentId: s.id }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="app-page-wrapper animate-fade-in" style={{ minHeight: 'calc(100vh - 120px)', padding: '2rem 1rem 5rem' }}>
      <div className="container" style={{ maxWidth: '1100px', width: '100%' }}>
        
        {/* Banner */}
        <section className="hero glass" style={{ padding: '2.5rem 2rem', marginBottom: '2rem', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
          <div className="hero-glow"></div>
          <span className="badge" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--accent)', borderColor: 'var(--accent)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.25rem 0.6rem', marginBottom: '0.5rem', display: 'inline-block' }}>
            Registrar Console
          </span>
          <h1 style={{ fontSize: '2.3rem', margin: '0 0 0.5rem', color: '#ffffff' }}>Registrar Dashboard</h1>
          <p style={{ maxWidth: '700px', fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
            Review pending student registrations, manage the master course catalog, track tuition assessments, and log manual payments.
          </p>
        </section>

        {/* Metrics Overview Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '22px', height: '22px' }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block' }}>Pending Approvals</span>
              <strong style={{ fontSize: '1.3rem', color: '#ffffff' }}>{pendingCount}</strong>
            </div>
          </div>

          <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', background: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71', display: 'flex' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '22px', height: '22px' }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block' }}>Approved Enrollment</span>
              <strong style={{ fontSize: '1.3rem', color: '#ffffff' }}>{approvedCount} / {totalCount}</strong>
            </div>
          </div>

          <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', background: 'var(--logo-gold-glow)', color: 'var(--logo-gold)', display: 'flex' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '22px', height: '22px' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block' }}>Paid Students</span>
              <strong style={{ fontSize: '1.3rem', color: '#ffffff' }}>{paidCount} / {totalCount}</strong>
            </div>
          </div>

          <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--border-radius-md)', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', background: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71', display: 'flex' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '22px', height: '22px' }}>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block' }}>Settlement Rate</span>
              <strong style={{ fontSize: '1.3rem', color: '#ffffff' }}>{settlementRate}%</strong>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="admin-tabs-nav glass animate-fade-in" style={{ display: 'flex', gap: '0.5rem', padding: '0.4rem', borderRadius: 'var(--border-radius-md)', marginBottom: '2rem' }}>
          <button 
            className={`admin-tab-btn ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', marginRight: '6px' }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Registrations Board
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', marginRight: '6px' }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Course Catalog
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'billing-reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('billing-reports')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px', height: '16px', marginRight: '6px' }}>
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Financials & Payments
          </button>
        </div>

        {/* Tab Contents */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '30px', height: '30px', border: '2px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <>
            {activeTab === 'registrations' && (
              <div className="admin-tab-content-card glass animate-fade-in" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius-lg)' }}>
                
                {/* Search & Filter Controls */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: '2.5rem', minHeight: '40px' }}
                    />
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}>
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '180px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Program:</label>
                    <select
                      className="form-control"
                      value={selectedMajor}
                      onChange={(e) => setSelectedMajor(e.target.value)}
                      style={{ minHeight: '40px' }}
                    >
                      <option value="All">All Programs</option>
                      {uniqueMajors.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '180px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Status:</label>
                    <select
                      className="form-control"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{ minHeight: '40px' }}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Draft">Draft</option>
                      <option value="Pending">Pending Approval</option>
                      <option value="Approved">Approved / Enrolled</option>
                    </select>
                  </div>
                </div>

                {/* Table View */}
                {sortedStudents.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', padding: '2rem 0' }}>No student registration records match the criteria.</p>
                ) : (
                  <div className="table-responsive" style={{ overflowX: 'auto' }}>
                    <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          <th style={{ padding: '0.75rem 1rem' }}>Student Name</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Major / Program</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Credits</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Payment Status</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedStudents.map(student => {
                          const status = student.registrationStatus || 'Draft';
                          const billing = getStudentBillingDetails(student);
                          return (
                            <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.92rem', color: '#ffffff' }}>
                              <td style={{ padding: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <AvatarImage avatarId={student.avatarId} style={{ width: '32px', height: '32px' }} />
                                  <div>
                                    <div style={{ fontWeight: '600' }}>{student.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{student.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{student.major}</td>
                              <td style={{ padding: '1rem' }}>
                                <span className={`badge ${status === 'Approved' ? 'badge-success' : status === 'Pending' ? 'badge-warning' : 'badge-secondary'}`} style={{ fontSize: '0.75rem' }}>
                                  {status}
                                </span>
                              </td>
                              <td style={{ padding: '1rem', fontWeight: 600 }}>{billing.totalUnits} Units</td>
                              <td style={{ padding: '1rem' }}>
                                <span className={`badge ${student.paymentStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                                  {student.paymentStatus === 'Paid' ? 'Paid / Settled' : 'Unpaid'}
                                </span>
                              </td>
                              <td style={{ padding: '1rem', textAlign: 'right' }}>
                                <div style={{ display: 'inline-flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                  {status === 'Pending' && (
                                    <button 
                                      onClick={() => handleApproveRegistration(student)} 
                                      className="btn btn-success" 
                                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {status !== 'Draft' && (
                                    <button 
                                      onClick={() => handleResetRegistration(student)} 
                                      className="btn" 
                                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderColor: 'var(--border-color)' }}
                                    >
                                      Reset Draft
                                    </button>
                                  )}
                                  {student.paymentStatus !== 'Paid' ? (
                                    <button 
                                      onClick={() => handleRecordSettlement(student)} 
                                      className="btn btn-success" 
                                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                    >
                                      Settle
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={() => handleResetSettlement(student)} 
                                      className="btn" 
                                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderColor: 'var(--border-color)' }}
                                    >
                                      Unpay
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleDeleteStudent(student)} 
                                    className="btn btn-danger" 
                                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="admin-tab-content-card glass animate-fade-in" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <h2 style={{ fontSize: '1.3rem', margin: 0, color: '#ffffff' }}>Active Course Catalog</h2>
                  <button onClick={handleOpenAddCourse} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>+ Add New Course</button>
                </div>

                {courses.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', padding: '2rem 0' }}>No courses exist in the catalog.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    {courses.map((course) => (
                      <div 
                        key={course.id || course.code} 
                        className="glass" 
                        style={{ padding: '1.25rem', borderRadius: 'var(--border-radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>{course.code || course.id}</strong>
                            <span className="badge" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', fontSize: '0.7rem' }}>{course.department}</span>
                          </div>
                          <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem', color: '#ffffff' }}>{course.title}</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <span><strong>Instructor:</strong> {course.instructor}</span>
                            <span><strong>Credits:</strong> {course.units} Units</span>
                            <span><strong>Capacity:</strong> {course.capacity} Students</span>
                            <span><strong>Fee per credit:</strong> ${course.feePerUnit || pricePerUnit}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                          <button 
                            onClick={() => handleOpenEditCourse(course)} 
                            className="btn" 
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderColor: 'var(--border-color)' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteCourse(course.id || course.code)} 
                            className="btn btn-danger" 
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'billing-reports' && (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                
                {/* Financial Summary */}
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)', textAlign: 'left' }}>
                  <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: '#ffffff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Financials & Payments Report</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Students</span>
                      <strong style={{ fontSize: '1.5rem', color: '#ffffff', display: 'block', marginTop: '0.25rem' }}>{totalCount}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Paid Students</span>
                      <strong style={{ fontSize: '1.5rem', color: 'var(--success)', display: 'block', marginTop: '0.25rem' }}>{paidCount}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Unpaid Students</span>
                      <strong style={{ fontSize: '1.5rem', color: 'var(--danger)', display: 'block', marginTop: '0.25rem' }}>{unpaidCount}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tuition Settlement Rate</span>
                      <strong style={{ fontSize: '1.5rem', color: 'var(--primary)', display: 'block', marginTop: '0.25rem' }}>
                        {settlementRate}%
                      </strong>
                    </div>
                  </div>
                </div>

                {/* System Transactions Queue */}
                <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)', textAlign: 'left' }}>
                  <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: '#ffffff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Recent System Payments</h2>
                  
                  {allTransactions.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No student transactions found in system.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
                      {allTransactions.map((tx) => (
                        <div key={tx.id} className="glass" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{tx.studentName}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>
                              {tx.date} • {tx.method} • Ref: {tx.refNum || tx.id}
                            </span>
                          </div>
                          <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                            Settled
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="modal-overlay animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, padding: '1rem' }}>
          <div className="glass modal-content animate-slide-up" style={{ padding: '2rem', width: '100%', maxWidth: '450px', borderRadius: 'var(--border-radius-lg)', position: 'relative', textAlign: 'left' }}>
            <button 
              className="btn-close" 
              onClick={() => setShowCourseModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              &times;
            </button>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: '#ffffff' }}>
              {isEditingCourse ? 'Edit Course Details' : 'Add Master Course'}
            </h3>
            
            {courseFormError && (
              <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{courseFormError}</div>
            )}

            <form onSubmit={handleSaveCourseForm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Course Code</label>
                  <input 
                    type="text" 
                    required
                    disabled={isEditingCourse}
                    placeholder="E.g. CS-101"
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--border-radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#ffffff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Credit Units</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    max="6"
                    value={courseForm.units}
                    onChange={(e) => setCourseForm({ ...courseForm, units: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--border-radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#ffffff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Course Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="E.g. Intro to Programming"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--border-radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#ffffff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Department</label>
                  <select 
                    value={courseForm.department}
                    onChange={(e) => setCourseForm({ ...courseForm, department: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--border-radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#ffffff' }}
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Office Administration">Office Administration</option>
                    <option value="Humanities">Humanities</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Capacity</label>
                  <input 
                    type="number" 
                    required
                    min="5"
                    max="100"
                    value={courseForm.capacity}
                    onChange={(e) => setCourseForm({ ...courseForm, capacity: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--border-radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#ffffff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Instructor</label>
                  <input 
                    type="text" 
                    required
                    placeholder="E.g. Dr. Jane Smith"
                    value={courseForm.instructor}
                    onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--border-radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#ffffff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Fee per credit ($)</label>
                  <input 
                    type="number" 
                    required
                    min="50"
                    value={courseForm.feePerUnit}
                    onChange={(e) => setCourseForm({ ...courseForm, feePerUnit: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--border-radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#ffffff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={() => setShowCourseModal(false)}
                  style={{ flex: 1, borderColor: 'var(--border-color)' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Recorder Modal Removed */}

    </div>
  );
};
