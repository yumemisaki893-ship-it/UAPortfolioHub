import React from 'react';

export const OfficePromotion = ({ navigateTo, currentUser }) => {
  const handleExplorePortfolios = () => {
    navigateTo('directory', { major: 'Bachelor of Science in Office Administration' });
  };

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section className="hero" style={{ padding: '4rem 2rem 3rem', marginBottom: '3rem', textAlign: 'center' }}>
        <div className="hero-glow"></div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <span className="badge" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', borderColor: 'var(--primary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.2rem 0.6rem' }}>
            Academic Program Spotlight
          </span>
        </div>
        <h1 style={{ fontSize: '2.75rem', margin: '0 0 1rem', fontFamily: 'var(--font-family-heading)' }}>
          BS in <span>Office Administration</span>
        </h1>
        <p style={{ maxWidth: '750px', fontSize: '1.1rem', color: 'var(--text-secondary)', margin: '0 auto', lineHeight: '1.6' }}>
          Explore the Bachelor of Science in Office Administration (BSOA) program at the University of Antique—preparing the next generation of office professionals, administrative managers, and virtual systems operators.
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={handleExplorePortfolios}>
            Explore Office Admin Portfolios
          </button>
          <button className="btn btn-secondary" onClick={() => navigateTo('directory')}>
            Browse All Portfolios
          </button>
        </div>
      </section>

      {/* Program Core Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        
        {/* Core Course Topics Card */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifycontent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.35rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 700 }}>Curriculum & Major Topics</h2>
          </div>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            The BSOA curriculum blends advanced technical keyboarding, administrative software processing, and organizational management methodologies. Key areas of study include:
          </p>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
            <li>
              <strong>Administrative Office Management:</strong> Planning, organizing, and controlling office operations, resources, and facilities.
            </li>
            <li>
              <strong>Advanced Document Processing:</strong> Expert speeds in keyboarding, advanced formatting, spreadsheet models, and digital templates.
            </li>
            <li>
              <strong>Records & Information Management:</strong> Design and audit of secure physical and digital database filing frameworks.
            </li>
            <li>
              <strong>Business Communication:</strong> Report drafting, executive letters, presentation delivery, and virtual meeting coordination.
            </li>
            <li>
              <strong>Customer Relations Management:</strong> Excellence in client-facing communications and high-touch corporate services.
            </li>
            <li>
              <strong>Office Technology & Software:</strong> Practical mastery of enterprise productivity suites (Microsoft 365, Google Workspace, CRM tools).
            </li>
          </ul>
        </div>

        {/* Importance of Profession Card */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-glow)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifycontent: 'center', flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h2 style={{ fontSize: '1.35rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 700 }}>Importance as a Profession</h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              In the modern business landscape, Office Administrators are the <strong>essential structural backbone</strong> of any successful enterprise. They act as strategic coordinators, communication hubs, and digital system controllers.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              From streamlining operations and maintaining records safety to coordinating executive tasks, administrators possess the versatile skills needed to optimize business productivity and client satisfaction across diverse environments.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              As business environments become more decentralized and virtual, the demand for office managers who are proficient in digital tools, cloud databases, and hybrid collaboration continues to grow.
            </p>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-secondary)', borderLeft: '3px solid var(--primary)', borderRadius: 'var(--border-radius-sm)' }}>
            <span style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
              "Administrators transform organizational complexity into efficient daily workflows."
            </span>
          </div>
        </div>

      </div>

      {/* Career Opportunities */}
      <section className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--logo-gold-glow)', color: 'var(--logo-gold)', display: 'flex', alignItems: 'center', justifycontent: 'center', flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 700 }}>Career Pathways & Opportunities</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>Executive Assistant / Secretary</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              Direct assistant to executive suites, coordinating agendas, managing high-level relationships, and reviewing executive reports.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>Office Manager / Supervisor</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              Coordinates office operations, supervises support staff, oversees budget management, and streamlines office technology implementation.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>Records / Database Administrator</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              Manages structural document safety, digital directories database, classification architectures, and document life-cycles.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>Virtual Assistant & Remote Admin</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              Provides cloud administrative support, calendar management, and client communication services to global partners remotely.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>Customer Relations Lead</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              Leads communications at the front desk, client inquiries resolution, database registrations, and client reception facilities.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>Human Resources Assistant</span>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
              Coordinates employee documentation files, job recruitment agendas, new hire orientation schedules, and benefits logs.
            </p>
          </div>

        </div>
      </section>

      {/* Explore Section */}
      <div className="glass" style={{ padding: '2.5rem 2rem', borderRadius: 'var(--border-radius-lg)', textAlign: 'center', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.5rem', margin: 0, fontFamily: 'var(--font-family-heading)', fontWeight: 700 }}>
          Meet Our Office Administration Students
        </h3>
        <p style={{ maxWidth: '600px', fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
          Review the digital portfolios, capstone projects, curriculum vitae, and specialized tech skills of our current BSOA students.
        </p>
        <button 
          className="btn btn-primary" 
          onClick={handleExplorePortfolios}
          style={{ marginTop: '1rem', minHeight: '44px', padding: '0 2rem' }}
        >
          View Office Admin Portfolios
        </button>
      </div>
    </div>
  );
};
