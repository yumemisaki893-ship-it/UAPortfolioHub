import React, { useState, useEffect } from 'react';
import { getCourses, updateStudentProfile } from '../utils/storage';

export const RegistrarPortal = ({ currentUser, navigateTo, onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Registrar States from Student record
  const student = currentUser?.student || {};
  const regStatus = student.registrationStatus || 'Draft'; // Draft | Pending | Approved
  const enrolledIds = student.enrolledCourses || [];
  const transactions = student.transactions || [];

  // Local state for courses selection
  const [selectedCourseIds, setSelectedCourseIds] = useState(enrolledIds);
  const [payMethod, setPayMethod] = useState('GCash');
  const [cardNumber, setCardNumber] = useState('');
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const list = await getCourses();
      setCourses(list);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  // Update selections when enrolled changes
  useEffect(() => {
    setSelectedCourseIds(enrolledIds);
  }, [enrolledIds]);

  // Billing Calculations (Removed monetary details)
  const enrolledCoursesList = courses.filter(c => selectedCourseIds.includes(c.id || c.code));
  const totalUnits = enrolledCoursesList.reduce((sum, c) => sum + (c.units || 0), 0);

  const handleToggleCourse = (courseId) => {
    if (regStatus !== 'Draft') {
      alert("Registration is locked. You cannot add/remove courses once submitted or approved.");
      return;
    }
    
    if (selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds(selectedCourseIds.filter(id => id !== courseId));
    } else {
      const course = courses.find(c => (c.id || c.code) === courseId);
      const currentUnits = totalUnits + (course?.units || 0);
      if (currentUnits > 18) {
        alert("Maximum enrollment limit reached (18 credit units). Please drop a class first.");
        return;
      }
      setSelectedCourseIds([...selectedCourseIds, courseId]);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const updated = await updateStudentProfile(student.id, {
        enrolledCourses: selectedCourseIds
      });
      if (onProfileUpdate) onProfileUpdate(updated);
      alert("Draft enrollment saved successfully!");
    } catch (e) {
      alert(e.message || "Failed to save draft.");
    }
  };

  const handleSubmitRegistration = async () => {
    if (selectedCourseIds.length === 0) {
      alert("Please select at least one course before submitting.");
      return;
    }
    
    try {
      const updated = await updateStudentProfile(student.id, {
        enrolledCourses: selectedCourseIds,
        registrationStatus: 'Pending'
      });
      if (onProfileUpdate) onProfileUpdate(updated);
      alert("Registration submitted successfully! Waiting for registrar approval.");
      setActiveTab('summary');
    } catch (e) {
      alert(e.message || "Failed to submit registration.");
    }
  };

  const handleSimulatePayment = async (e) => {
    e.preventDefault();

    const newTx = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      amount: 0,
      method: payMethod,
      refNum: Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: 'SETTLED'
    };

    try {
      const updated = await updateStudentProfile(student.id, {
        transactions: [newTx, ...transactions],
        paymentStatus: 'Paid'
      });
      if (onProfileUpdate) onProfileUpdate(updated);
      
      setPaymentSuccessMsg(`Tuition settlement recorded successfully! Ref: ${newTx.refNum}`);
      setCardNumber('');
      setTimeout(() => {
        setPaymentSuccessMsg('');
        setShowPayModal(false);
      }, 3000);
    } catch (err) {
      alert("Failed to record payment.");
    }
  };

  const getStatusBadgeClass = () => {
    switch (regStatus) {
      case 'Approved': return 'badge-success';
      case 'Pending': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="app-page-wrapper" style={{ minHeight: 'calc(100vh - 120px)', padding: '2rem 1rem 5rem' }}>
      <div className="container" style={{ maxWidth: '1000px', width: '100%' }}>
        
        {/* Banner */}
        <section className="hero glass animate-fade-in" style={{ padding: '2.5rem 2rem', marginBottom: '2rem', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
          <div className="hero-glow"></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', borderColor: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.2rem 0.6rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                Student Portal
              </span>
              <h1 style={{ fontSize: '2.2rem', margin: '0 0 0.5rem', color: '#ffffff' }}>Registrar Portal</h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Manage course enrollment, check registration approval status, and process mock tuition payments.
              </p>
            </div>
            <div className="glass" style={{ padding: '0.75rem 1.25rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Registration Status</span>
              <span className={`badge ${getStatusBadgeClass()}`} style={{ fontSize: '1rem', marginTop: '0.25rem', padding: '0.3rem 0.8rem', borderRadius: '50px' }}>
                {regStatus === 'Approved' ? 'Enrolled & Approved' : regStatus === 'Pending' ? 'Pending Approval' : 'Draft Registration'}
              </span>
            </div>
          </div>
        </section>

        {/* Tab Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('summary')}
            className={`btn-tab ${activeTab === 'summary' ? 'active' : ''}`}
            style={{
              padding: '0.5rem 1.25rem',
              background: activeTab === 'summary' ? 'var(--primary-glow)' : 'transparent',
              color: activeTab === 'summary' ? 'var(--primary)' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: activeTab === 'summary' ? '2px solid var(--primary)' : 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease'
            }}
          >
            Status Summary
          </button>
          <button 
            onClick={() => setActiveTab('courses')}
            className={`btn-tab ${activeTab === 'courses' ? 'active' : ''}`}
            style={{
              padding: '0.5rem 1.25rem',
              background: activeTab === 'courses' ? 'var(--primary-glow)' : 'transparent',
              color: activeTab === 'courses' ? 'var(--primary)' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: activeTab === 'courses' ? '2px solid var(--primary)' : 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease'
            }}
          >
            Course Enrollment
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            className={`btn-tab ${activeTab === 'billing' ? 'active' : ''}`}
            style={{
              padding: '0.5rem 1.25rem',
              background: activeTab === 'billing' ? 'var(--primary-glow)' : 'transparent',
              color: activeTab === 'billing' ? 'var(--primary)' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: activeTab === 'billing' ? '2px solid var(--primary)' : 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease'
            }}
          >
            Billing & Accounts
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'summary' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)', textAlign: 'left' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Academic Details</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Student Name</span>
                  <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>{student.name}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Degree Program</span>
                  <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>{student.major || 'Undeclared'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Current Term</span>
                  <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>First Semester, 2026-2027</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>Total Credit Units</span>
                  <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>{totalUnits} Units</strong>
                </div>
              </div>

              {regStatus === 'Draft' ? (
                <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--border-radius-md)', border: '1px dashed var(--warning)', backgroundColor: 'var(--warning-bg)', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem', color: 'var(--warning)' }}>Draft Registration Warning</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Your course selections are currently stored as a draft. You must submit your registration below for approval by the Registrar Office to officially enroll.
                  </p>
                </div>
              ) : regStatus === 'Pending' ? (
                <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--accent)', backgroundColor: 'rgba(212, 175, 55, 0.05)', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem', color: 'var(--logo-gold)' }}>Under Review</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Your registration has been submitted and is currently being evaluated by the registrar staff. Course changes are locked.
                  </p>
                </div>
              ) : (
                <div className="glass" style={{ padding: '1.25rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--success)', backgroundColor: 'var(--success-bg)', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem', color: 'var(--success)' }}>Enrollment Active</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Congratulations! Your enrollment is officially approved and active. You are fully registered for this semester.
                  </p>
                </div>
              )}

              {/* Enrolled Courses Summary List */}
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#ffffff' }}>Registered Courses ({enrolledCoursesList.length})</h3>
              {enrolledCoursesList.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>No courses selected yet. Go to the "Course Enrollment" tab to add courses.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {enrolledCoursesList.map((course) => (
                    <div key={course.id || course.code} className="glass" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{course.code || course.id}</strong>
                        <span style={{ margin: '0 0.5rem', color: 'var(--text-secondary)' }}>|</span>
                        <span style={{ color: '#ffffff', fontSize: '0.95rem' }}>{course.title}</span>
                      </div>
                      <span className="badge" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.8rem' }}>
                        {course.units} Units
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {regStatus === 'Draft' && enrolledCoursesList.length > 0 && (
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={handleSubmitRegistration} 
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.8rem', fontWeight: 600 }}
                  >
                    Submit Registration for Approval
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="animate-fade-in">
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#ffffff' }}>Select Courses</h2>
                  <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Select courses up to 18 units limit. Current: <strong style={{ color: 'var(--primary)' }}>{totalUnits} / 18 units</strong>
                  </p>
                </div>
                {regStatus === 'Draft' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handleSaveDraft} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: 'var(--border-color)' }}>Save Draft</button>
                    <button onClick={handleSubmitRegistration} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Submit Registration</button>
                  </div>
                )}
              </div>

              {loading ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Loading available courses...</p>
              ) : courses.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No courses are currently available in the catalog.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  {courses.map((course) => {
                    const cId = course.id || course.code;
                    const isEnrolled = selectedCourseIds.includes(cId);
                    return (
                      <div 
                        key={cId} 
                        className={`glass course-list-item-block ${isEnrolled ? 'active-course' : ''}`}
                        style={{ 
                          padding: '1.25rem', 
                          borderRadius: 'var(--border-radius-md)', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          border: isEnrolled ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                          backgroundColor: isEnrolled ? 'rgba(74, 144, 226, 0.04)' : 'transparent',
                          transition: 'all 0.2s ease',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ flex: 1, marginRight: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                            <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>{course.code || course.id}</strong>
                            <span className="badge" style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent)', fontSize: '0.7rem' }}>{course.department}</span>
                          </div>
                          <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem', color: '#ffffff' }}>{course.title}</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <span><strong>Instructor:</strong> {course.instructor}</span>
                            <span><strong>Credits:</strong> {course.units} Units</span>
                            <span><strong>Academic Year:</strong> 2026-2027</span>
                          </div>
                        </div>

                        <div>
                          <button
                            onClick={() => handleToggleCourse(cId)}
                            className={`btn ${isEnrolled ? 'btn-danger' : 'btn-primary'}`}
                            disabled={regStatus !== 'Draft'}
                            style={{ 
                              padding: '0.5rem 1.25rem', 
                              fontSize: '0.85rem',
                              opacity: regStatus !== 'Draft' ? 0.6 : 1,
                              cursor: regStatus !== 'Draft' ? 'not-allowed' : 'pointer'
                            }}
                          >
                            {isEnrolled ? 'Drop' : 'Enroll'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            {/* Left Column: Account Statement */}
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)', textAlign: 'left' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', color: '#ffffff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Assessment Checklist</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '16px', height: '16px' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>Base Tuition Fee: <strong>Assessed</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '16px', height: '16px' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>Registration Fee: <strong>Assessed</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '16px', height: '16px' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>Miscellaneous Fee: <strong>Waived</strong></span>
                </div>
                
                <hr style={{ border: 0, borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Payment Status:</span>
                  <span 
                    className={`badge ${student.paymentStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`} 
                    style={{ fontSize: '0.95rem', padding: '0.3rem 0.8rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}
                  >
                    {student.paymentStatus === 'Paid' ? 'Paid / Settled' : 'Unpaid'}
                  </span>
                </div>
              </div>

              {student.paymentStatus !== 'Paid' ? (
                <button 
                  onClick={() => setShowPayModal(true)} 
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.8rem', fontWeight: 600 }}
                >
                  Settle Tuition Fees
                </button>
              ) : (
                <div className="glass" style={{ padding: '1rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--success)', backgroundColor: 'var(--success-bg)', textAlign: 'center', color: 'var(--success)', fontWeight: 'bold' }}>
                  Account Fully Settled. No outstanding balance.
                </div>
              )}
            </div>

            {/* Right Column: Transaction History */}
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)', textAlign: 'left' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', color: '#ffffff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Payment Transactions</h2>
              
              {transactions.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>No payments recorded yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {transactions.map((tx) => (
                    <div key={tx.id} className="glass" style={{ padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#ffffff', fontSize: '0.95rem' }}>{tx.method} Settlement</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tx.date} • Ref: {tx.refNum || tx.id}</span>
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

      </div>

      {/* Payment Modal */}
      {showPayModal && (
        <div className="modal-overlay animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, padding: '1rem' }}>
          <div className="glass modal-content animate-slide-up" style={{ padding: '2rem', width: '100%', maxWidth: '420px', borderRadius: 'var(--border-radius-lg)', position: 'relative', textAlign: 'left' }}>
            <button 
              className="btn-close" 
              onClick={() => { if (!paymentSuccessMsg) setShowPayModal(false); }}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              &times;
            </button>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: '#ffffff' }}>Tuition Settlement</h3>
            
            {paymentSuccessMsg ? (
              <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--success)', backgroundColor: 'var(--success-bg)', color: 'var(--success)', textAlign: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px', margin: '0 auto 0.75rem', display: 'block' }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {paymentSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSimulatePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Payment Method</label>
                  <select 
                    value={payMethod} 
                    onChange={(e) => setPayMethod(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--border-radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#ffffff' }}
                  >
                    <option value="GCash">GCash E-Wallet</option>
                    <option value="PayMaya">Maya E-Wallet</option>
                    <option value="Credit Card">Visa / Mastercard</option>
                    <option value="Bank Transfer">Direct Online Banking</option>
                  </select>
                </div>

                {payMethod === 'Credit Card' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Card Number</label>
                    <input 
                      type="text" 
                      required
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9-]/g, ''))}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--border-radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: '#ffffff' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    id="confirm-settlement" 
                    required 
                    style={{ marginTop: '0.2rem' }}
                  />
                  <label htmlFor="confirm-settlement" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    I confirm that I authorize the simulated settlement of all assessed tuition fees for this semester.
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button 
                    type="button" 
                    className="btn" 
                    onClick={() => setShowPayModal(false)}
                    style={{ flex: 1, borderColor: 'var(--border-color)' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Confirm Settlement
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default RegistrarPortal;
