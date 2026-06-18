
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
          background: student.coverPhotoUrl ? `url(${student.coverPhotoUrl}) center/cover no-repeat` : 'linear-gradient(135deg, var(--primary-glow) 0%, var(--accent-glow) 100%)',
          borderBottom: '1px solid var(--border-color)'
        }}
      />
      
      <div style={{ padding: '1.25rem' }}>
        <div className="card-header" style={{ marginTop: '-42px', alignItems: 'flex-end', marginBottom: '0.85rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            flexShrink: 0,
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
            <div className="card-major" style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              <span>{student.major}</span>
              {student.campus && (
                <>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ fontSize: '0.725rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{student.campus.replace(' Campus', '').replace(' (Main Campus)', '')}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <p className="card-bio">{student.shortBio}</p>
        
        <div className="card-skills" style={{ marginBottom: student.email || student.github || student.linkedin || student.website || student.facebook || student.instagram || student.twitter || student.contactNumber ? '0.5rem' : '0' }}>
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

        {/* Social / Contact logo widgets */}
        {(student.email || student.github || student.linkedin || student.website || student.facebook || student.instagram || student.twitter || student.contactNumber) && (
          <div className="social-widgets-row" style={{ display: 'flex', gap: '0.45rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
            {student.email && (
              <a 
                href={`mailto:${student.email}`}
                className="social-widget-btn email"
                title={`Email: ${student.email}`}
                onClick={(e) => e.stopPropagation()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            )}
            {student.github && (
              <a 
                href={student.github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-widget-btn github"
                title="GitHub Profile"
                onClick={(e) => e.stopPropagation()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            )}
            {student.linkedin && (
              <a 
                href={student.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-widget-btn linkedin"
                title="LinkedIn Profile"
                onClick={(e) => e.stopPropagation()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            )}
            {student.website && (
              <a 
                href={student.website}
                target="_blank"
                rel="noopener noreferrer"
                className="social-widget-btn website"
                title="Personal Website"
                onClick={(e) => e.stopPropagation()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </a>
            )}
            {student.facebook && (
              <a 
                href={student.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-widget-btn facebook"
                title="Facebook Profile"
                onClick={(e) => e.stopPropagation()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            )}
            {student.instagram && (
              <a 
                href={student.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-widget-btn instagram"
                title="Instagram Profile"
                onClick={(e) => e.stopPropagation()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            )}
            {student.twitter && (
              <a 
                href={student.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="social-widget-btn twitter"
                title="Twitter / X Profile"
                onClick={(e) => e.stopPropagation()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
            )}
            {student.contactNumber && (
              <a 
                href={`tel:${student.contactNumber.replace(/[^\d+]/g, '')}`}
                className="social-widget-btn phone"
                title={`Call: ${student.contactNumber}`}
                onClick={(e) => e.stopPropagation()}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px' }}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default StudentCard;
