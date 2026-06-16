import React from 'react';
import { AvatarImage } from './AvatarPicker';

export const StudentCard = ({ student, courses = [], currentUser, onClick, onDelete }) => {
  const status = student.registrationStatus || 'Draft';
  
  // Calculate academic units and tuition details
  const enrolledIds = student.enrolledCourses || [];
  const enrolledCoursesList = (courses || []).filter(c => enrolledIds.includes(c.id || c.code));
  const totalUnits = enrolledCoursesList.reduce((sum, c) => sum + (c.units || 0), 0);
  
  const baseFee = 500;
  const pricePerUnit = 150;
  const totalAssessed = baseFee + (totalUnits * pricePerUnit);
  const totalPaid = (student.transactions || []).reduce((sum, tx) => sum + tx.amount, 0);
  const balance = Math.max(0, totalAssessed - totalPaid);

  const getYearLevel = () => {
    if (student.yearLevel) return student.yearLevel;
    const hash = student.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    return years[hash % 4];
  };

  const getStatusBadgeClass = () => {
    switch (status) {
      case 'Approved': return 'badge-success';
      case 'Pending': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  return (
    <div 
      className="student-card glass" 
      onClick={onClick} 
      style={{ 
        padding: 0, 
        overflow: 'hidden', 
        position: 'relative', 
        cursor: 'pointer',
        textAlign: 'left',
        border: '1px solid var(--border-color)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Delete Record action for Staff */}
      {currentUser?.isAdmin && (
        <button
          className="btn btn-danger"
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            padding: '0.25rem 0.5rem',
            fontSize: '0.7rem',
            borderRadius: 'var(--border-radius-sm)',
            minHeight: '26px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            borderColor: 'rgba(255,255,255,0.1)'
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) onDelete();
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '11px', height: '11px' }}>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete
        </button>
      )}

      {/* Decorative header gradient */}
      <div 
        className="card-banner"
        style={{
          width: '100%',
          height: '75px',
          background: 'linear-gradient(135deg, var(--primary-glow) 0%, var(--accent-glow) 100%)',
          borderBottom: '1px solid var(--border-color)',
          opacity: 0.8
        }}
      />
      
      <div style={{ padding: '1.25rem' }}>
        {/* Avatar and Name */}
        <div className="card-header" style={{ marginTop: '-42px', alignItems: 'flex-end', marginBottom: '1rem', display: 'flex', gap: '0.75rem' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            overflow: 'hidden', 
            border: '4px solid var(--bg-card)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            background: 'var(--bg-card)',
            flexShrink: 0
          }}>
            <AvatarImage avatarId={student.avatarId} id={`card-${student.id}`} />
          </div>
          <div className="card-title-group" style={{ paddingBottom: '0.1rem', flex: 1, minWidth: 0 }}>
            <div className="card-name" style={{ fontWeight: '700', fontSize: '1.05rem', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {student.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {getYearLevel()} • {student.email}
            </div>
          </div>
        </div>

        {/* Academic Program */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>Degree Program</span>
          <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 500 }}>{student.major || 'Undeclared'}</span>
        </div>
        
        {/* Registrar assessment grids */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>Registration Status</span>
            <span className={`badge ${getStatusBadgeClass()}`} style={{ fontSize: '0.75rem', marginTop: '0.2rem', padding: '0.2rem 0.5rem' }}>
              {status === 'Approved' ? 'Enrolled' : status === 'Pending' ? 'Pending Approval' : 'Draft'}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>Enrolled Credits</span>
            <strong style={{ fontSize: '0.9rem', color: '#ffffff', display: 'block', marginTop: '0.2rem' }}>{totalUnits} Units</strong>
          </div>
        </div>

        {/* Billing assessment info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>Total Assessed Fees</span>
            <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 500 }}>${totalAssessed.toFixed(2)}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>Outstanding Balance</span>
            <strong style={{ fontSize: '0.85rem', color: balance > 0 ? 'var(--logo-gold)' : 'var(--success)' }}>
              ${balance.toFixed(2)}
            </strong>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentCard;
