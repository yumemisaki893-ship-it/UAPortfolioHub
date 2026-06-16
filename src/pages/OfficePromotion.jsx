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
            Bachelor of Science in <span className="hero-title-gradient">Office Administration (BSOAD)</span>
          </h1>
          
          <p className="hero-subtitle animate-slide-up-delay-1" style={{ margin: '0 auto 2.5rem' }}>
            Empowering the next generation of administrative managers, executive coordinators, and digital systems operators at the University of Antique.
          </p>
          
          <div className="hero-actions animate-slide-up-delay-2">
            <button 
              className="btn btn-primary btn-lg-premium btn-view-portfolio" 
              onClick={handleExplorePortfolios}
            >
              Explore BSOAD Portfolios
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
        <div className="vision-mission-grid animate-slide-up-delay-1" style={{ maxWidth: '1100px', margin: '0 auto 4rem' }}>
          
          {/* Core Course Topics Card */}
          <div className="glass statement-card" style={{ minHeight: 'auto' }}>
            <div className="statement-badge">Curriculum</div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 800, color: '#ffffff' }}>
              Curriculum & Major Topics
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.5rem', lineHeight: '1.6' }}>
              The BSOAD curriculum blends advanced technical skills, administrative software processing, and organizational management methodologies.
            </p>
            <ul className="objectives-list" style={{ marginTop: '0.5rem' }}>
              <li className="objective-item" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                <strong style={{ color: '#ffffff' }}>Administrative Office Management</strong> — Planning, organizing, and controlling office operations, resources, and facilities.
              </li>
              <li className="objective-item" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                <strong style={{ color: '#ffffff' }}>Advanced Document Processing</strong> — Expert speeds in keyboarding, advanced formatting, spreadsheet models, and digital templates.
              </li>
              <li className="objective-item" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                <strong style={{ color: '#ffffff' }}>Records & Information Management</strong> — Design and audit of secure physical and digital database filing frameworks.
              </li>
              <li className="objective-item" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                <strong style={{ color: '#ffffff' }}>Business Communication</strong> — Report drafting, executive letters, presentation delivery, and virtual meeting coordination.
              </li>
              <li className="objective-item" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                <strong style={{ color: '#ffffff' }}>Customer Relations Management</strong> — Excellence in client-facing communications and high-touch corporate services.
              </li>
              <li className="objective-item" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                <strong style={{ color: '#ffffff' }}>Office Technology & Software</strong> — Practical mastery of enterprise productivity suites (Microsoft 365, Google Workspace, CRM tools).
              </li>
            </ul>
          </div>

          {/* Importance of Profession Card */}
          <div className="glass statement-card" style={{ minHeight: 'auto' }}>
            <div className="statement-badge">Why It Matters</div>
            <h2 style={{ fontSize: '1.4rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 800, color: '#ffffff' }}>
              Importance as a Profession
            </h2>
            <p className="statement-text" style={{ fontSize: '0.975rem', lineHeight: '1.75', margin: 0 }}>
              In the modern business landscape, Office Administrators are the <strong>essential structural backbone</strong> of any successful enterprise. They act as strategic coordinators, communication hubs, and digital system controllers.
            </p>
            <p className="statement-text" style={{ fontSize: '0.975rem', lineHeight: '1.75', margin: 0 }}>
              From streamlining operations and maintaining records safety to coordinating executive tasks, administrators possess the versatile skills needed to optimize business productivity and client satisfaction across diverse environments.
            </p>
            <p className="statement-text" style={{ fontSize: '0.975rem', lineHeight: '1.75', margin: 0 }}>
              As business environments become more decentralized and virtual, the demand for office managers who are proficient in digital tools, cloud databases, and hybrid collaboration continues to grow.
            </p>
            
            <div style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.12)', borderLeft: '4px solid var(--logo-gold)', borderRadius: 'var(--border-radius-md)', backdropFilter: 'blur(5px)' }}>
              <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.9)', margin: 0, lineHeight: '1.5' }}>
                "Administrators transform organizational complexity into efficient daily workflows."
              </p>
            </div>
          </div>

        </div>

        {/* Career Opportunities */}
        <div className="goals-section animate-slide-up-delay-2" style={{ marginTop: 0, marginBottom: '4rem' }}>
          <h2>Career Pathways & Opportunities</h2>
          <div className="office-career-grid" style={{ maxWidth: '900px', margin: '0 auto' }}>
            
            <div className="glass statement-card" style={{ minHeight: 'auto', padding: '2rem' }}>
              <div className="statement-badge">Career</div>
              <h3 style={{ fontSize: '1.15rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 700, color: '#ffffff' }}>
                Executive Assistant
              </h3>
              <p className="statement-text" style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.55' }}>
                Direct assistant to executive suites, coordinating agendas, managing high-level relationships, and reviewing executive reports.
              </p>
            </div>

            <div className="glass statement-card" style={{ minHeight: 'auto', padding: '2rem' }}>
              <div className="statement-badge">Career</div>
              <h3 style={{ fontSize: '1.15rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 700, color: '#ffffff' }}>
                Office Manager / Supervisor
              </h3>
              <p className="statement-text" style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.55' }}>
                Coordinates office operations, supervises support staff, oversees budget management, and streamlines office technology implementation.
              </p>
            </div>

            <div className="glass statement-card" style={{ minHeight: 'auto', padding: '2rem' }}>
              <div className="statement-badge">Career</div>
              <h3 style={{ fontSize: '1.15rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 700, color: '#ffffff' }}>
                Records & Database Admin
              </h3>
              <p className="statement-text" style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.55' }}>
                Manages structural document safety, digital directories database, classification architectures, and document life-cycles.
              </p>
            </div>

            <div className="glass statement-card" style={{ minHeight: 'auto', padding: '2rem' }}>
              <div className="statement-badge">Career</div>
              <h3 style={{ fontSize: '1.15rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 700, color: '#ffffff' }}>
                Virtual Assistant / Remote Admin
              </h3>
              <p className="statement-text" style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.55' }}>
                Provides cloud administrative support, calendar management, and client communication services to global partners remotely.
              </p>
            </div>

            <div className="glass statement-card" style={{ minHeight: 'auto', padding: '2rem' }}>
              <div className="statement-badge">Career</div>
              <h3 style={{ fontSize: '1.15rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 700, color: '#ffffff' }}>
                Customer Relations Lead
              </h3>
              <p className="statement-text" style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.55' }}>
                Leads communications at the front desk, client inquiries resolution, database registrations, and client reception facilities.
              </p>
            </div>

            <div className="glass statement-card" style={{ minHeight: 'auto', padding: '2rem' }}>
              <div className="statement-badge">Career</div>
              <h3 style={{ fontSize: '1.15rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 700, color: '#ffffff' }}>
                Human Resources Assistant
              </h3>
              <p className="statement-text" style={{ fontSize: '0.9rem', margin: 0, lineHeight: '1.55' }}>
                Coordinates employee documentation files, job recruitment agendas, new hire orientation schedules, and benefits logs.
              </p>
            </div>

          </div>
        </div>

        {/* Explore Section */}
        <section className="glass statement-card animate-slide-up-delay-2" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', minHeight: 'auto' }}>
          <div className="statement-badge">Explore</div>
          <h2 style={{ fontSize: '1.6rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 800, color: '#ffffff' }}>
            Meet Our Office Administration Students
          </h2>
          <p className="statement-text" style={{ maxWidth: '640px', fontSize: '1rem', margin: 0, lineHeight: '1.6' }}>
            Review the digital portfolios, capstone projects, curriculum vitae, and specialized tech skills of our current BSOAD students.
          </p>
          <button 
            className="btn btn-primary btn-lg-premium" 
            onClick={handleExplorePortfolios}
            style={{ marginTop: '0.5rem', background: 'var(--logo-gold)', borderColor: 'var(--logo-gold)', color: '#000' }}
          >
            View BSOAD Portfolios
          </button>
        </section>

      </div>
    </div>
  );
};
