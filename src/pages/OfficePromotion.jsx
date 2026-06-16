import React from 'react';

export const OfficePromotion = ({ navigateTo, currentUser }) => {
  const handleExplorePortfolios = () => {
    navigateTo('directory', { major: 'Bachelor of Science in Office Administration' });
  };

  return (
    <div className="office-promo-container">
      <div className="office-content-wrapper container">
        
        {/* Hero Section */}
        <section className="office-hero animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <span className="badge-promo" style={{ marginBottom: 0 }}>
              Academic Program Spotlight
            </span>
          </div>
          
          <h1 className="office-hero-title animate-slide-up">
            BS in <span className="hero-title-gradient">Office Administration</span>
          </h1>
          
          <p className="hero-subtitle animate-slide-up-delay-1" style={{ margin: '0 auto 2.5rem' }}>
            Empowering the next generation of administrative managers, executive coordinators, and digital systems operators at the University of Antique.
          </p>
          
          <div className="hero-actions animate-slide-up-delay-2">
            <button 
              className="btn btn-primary btn-lg-premium btn-view-portfolio" 
              onClick={handleExplorePortfolios}
            >
              Explore BSOA Portfolios
            </button>
            <button 
              className="btn btn-secondary btn-lg-premium" 
              onClick={() => navigateTo('directory')}
            >
              Browse All Portfolios
            </button>
          </div>
        </section>

        {/* Program Core Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          
          {/* Core Course Topics Card */}
          <div className="office-card animate-slide-up-delay-1">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
              <div className="office-icon-box" style={{ background: 'var(--primary-glow)', color: 'var(--primary)', marginBottom: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '22px', height: '22px' }}>
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h2 style={{ fontSize: '1.4rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 800 }}>
                Curriculum & Major Topics
              </h2>
            </div>
            
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: '1.6' }}>
              The BSOA curriculum blends advanced technical skills, administrative software processing, and organizational management methodologies. Key areas of study include:
            </p>
            
            <ul className="office-list">
              <li className="office-list-item">
                <span className="office-list-bullet">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '14px', height: '14px' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Administrative Office Management:</strong> Planning, organizing, and controlling office operations, resources, and facilities.
                </div>
              </li>
              <li className="office-list-item">
                <span className="office-list-bullet">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '14px', height: '14px' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Advanced Document Processing:</strong> Expert speeds in keyboarding, advanced formatting, spreadsheet models, and digital templates.
                </div>
              </li>
              <li className="office-list-item">
                <span className="office-list-bullet">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '14px', height: '14px' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Records & Information Management:</strong> Design and audit of secure physical and digital database filing frameworks.
                </div>
              </li>
              <li className="office-list-item">
                <span className="office-list-bullet">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '14px', height: '14px' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Business Communication:</strong> Report drafting, executive letters, presentation delivery, and virtual meeting coordination.
                </div>
              </li>
              <li className="office-list-item">
                <span className="office-list-bullet">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '14px', height: '14px' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Customer Relations Management:</strong> Excellence in client-facing communications and high-touch corporate services.
                </div>
              </li>
              <li className="office-list-item">
                <span className="office-list-bullet">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '14px', height: '14px' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Office Technology & Software:</strong> Practical mastery of enterprise productivity suites (Microsoft 365, Google Workspace, CRM tools).
                </div>
              </li>
            </ul>
          </div>

          {/* Importance of Profession Card */}
          <div className="office-card animate-slide-up-delay-2" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
                <div className="office-icon-box" style={{ background: 'var(--accent-glow)', color: 'var(--accent)', marginBottom: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '22px', height: '22px' }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h2 style={{ fontSize: '1.4rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 800 }}>
                  Importance as a Profession
                </h2>
              </div>
              
              <p style={{ fontSize: '0.975rem', color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: '1.5rem' }}>
                In the modern business landscape, Office Administrators are the <strong>essential structural backbone</strong> of any successful enterprise. They act as strategic coordinators, communication hubs, and digital system controllers.
              </p>
              
              <p style={{ fontSize: '0.975rem', color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: '1.5rem' }}>
                From streamlining operations and maintaining records safety to coordinating executive tasks, administrators possess the versatile skills needed to optimize business productivity and client satisfaction across diverse environments.
              </p>
              
              <p style={{ fontSize: '0.975rem', color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
                As business environments become more decentralized and virtual, the demand for office managers who are proficient in digital tools, cloud databases, and hybrid collaboration continues to grow.
              </p>
            </div>

            <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: 'var(--bg-secondary)', borderLeft: '4px solid var(--primary)', borderRadius: 'var(--border-radius-md)', backdropFilter: 'blur(5px)' }}>
              <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                "Administrators transform organizational complexity into efficient daily workflows."
              </p>
            </div>
          </div>

        </div>

        {/* Career Opportunities */}
        <section className="office-card animate-slide-up-delay-2" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2.5rem' }}>
            <div className="office-icon-box" style={{ background: 'var(--logo-gold-glow)', color: 'var(--logo-gold)', marginBottom: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '22px', height: '22px' }}>
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.6rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 800 }}>
              Career Pathways & Opportunities
            </h2>
          </div>

          <div className="office-career-grid">
            
            <div className="office-card office-career-card">
              <h3 className="office-career-title">Executive Assistant</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                Direct assistant to executive suites, coordinating agendas, managing high-level relationships, and reviewing executive reports.
              </p>
            </div>

            <div className="office-card office-career-card accent-gold">
              <h3 className="office-career-title">Office Manager / Supervisor</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                Coordinates office operations, supervises support staff, oversees budget management, and streamlines office technology implementation.
              </p>
            </div>

            <div className="office-card office-career-card accent-red">
              <h3 className="office-career-title">Records & Database Admin</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                Manages structural document safety, digital directories database, classification architectures, and document life-cycles.
              </p>
            </div>

            <div className="office-card office-career-card accent-gold">
              <h3 className="office-career-title">Virtual Assistant / Remote Admin</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                Provides cloud administrative support, calendar management, and client communication services to global partners remotely.
              </p>
            </div>

            <div className="office-card office-career-card accent-red">
              <h3 className="office-career-title">Customer Relations Lead</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                Leads communications at the front desk, client inquiries resolution, database registrations, and client reception facilities.
              </p>
            </div>

            <div className="office-card office-career-card">
              <h3 className="office-career-title">Human Resources Assistant</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                Coordinates employee documentation files, job recruitment agendas, new hire orientation schedules, and benefits logs.
              </p>
            </div>

          </div>
        </section>

        {/* Explore Section */}
        <section className="office-card office-cta-panel animate-slide-up-delay-2">
          <h2 style={{ fontSize: '1.6rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 800 }}>
            Meet Our Office Administration Students
          </h2>
          <p style={{ maxWidth: '640px', fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
            Review the digital portfolios, capstone projects, curriculum vitae, and specialized tech skills of our current BSOA students.
          </p>
          <button 
            className="btn btn-primary btn-lg-premium" 
            onClick={handleExplorePortfolios}
            style={{ marginTop: '0.5rem' }}
          >
            View BSOA Portfolios
          </button>
        </section>

      </div>
    </div>
  );
};
