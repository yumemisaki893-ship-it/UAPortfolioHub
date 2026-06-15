import React from 'react';
import { AvatarImage } from './AvatarPicker';

export const StudentCard = ({ student, currentUser, onClick, onDelete }) => {
  // Show up to 4 skills, and list a "+X more" badge if there are more
  const maxSkillsToShow = 4;
  const visibleSkills = student.skills ? student.skills.slice(0, maxSkillsToShow) : [];
  const extraSkillsCount = student.skills && student.skills.length > maxSkillsToShow 
    ? student.skills.length - maxSkillsToShow 
    : 0;

  return (
    <div className="student-card glass" onClick={onClick} style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '11px', height: '11px' }}>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete
        </button>
      )}
      <div 
        className="card-banner"
        style={{
          width: '100%',
          height: '90px',
          background: student.coverPhotoUrl ? `url(${student.coverPhotoUrl}) center/cover no-repeat` : 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)'
        }}
      />
      
      <div style={{ padding: '1.25rem' }}>
        <div className="card-header" style={{ marginTop: '-42px', alignItems: 'flex-end', marginBottom: '0.85rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            borderRadius: '50%', 
            overflow: 'hidden', 
            border: '4px solid var(--bg-card)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            background: 'var(--bg-card)'
          }}>
            <AvatarImage avatarId={student.avatarId} id={`card-${student.id}`} />
          </div>
          <div className="card-title-group" style={{ paddingBottom: '0.15rem' }}>
            <div className="card-name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {student.name}
              {student.isPublic === false && currentUser?.isAdmin && (
                <span 
                  className="badge" 
                  style={{ 
                    backgroundColor: 'var(--danger-bg)', 
                    color: 'var(--danger)', 
                    borderColor: 'var(--danger-border)', 
                    fontSize: '0.65rem', 
                    padding: '0.1rem 0.35rem', 
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    lineHeight: '1.2'
                  }}
                >
                  Private
                </span>
              )}
            </div>
            <div className="card-major">{student.major}</div>
          </div>
        </div>
        
        <p className="card-bio">{student.shortBio}</p>
        
        <div className="card-skills">
          {visibleSkills.map((skill, index) => (
            <span key={index} className="badge badge-primary">{skill}</span>
          ))}
          {extraSkillsCount > 0 && (
            <span className="badge">+{extraSkillsCount} more</span>
          )}
          {visibleSkills.length === 0 && (
            <span className="badge" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No skills added</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default StudentCard;
