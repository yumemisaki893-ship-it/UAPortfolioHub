import React, { useState } from 'react';

const colleges = [
  {
    id: 'technology',
    name: 'College of Technology & Computer Studies',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '22px', height: '22px' }}>
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    programs: [
      {
        code: 'BSCS',
        title: 'Bachelor of Science in Computer Science',
        duration: '4 Years',
        description: 'Focuses on the concepts and theories, algorithmic foundations, and new developments in computing. It prepares students to design and create algorithmically complex software and write code for systems, graphics, and artificial intelligence.',
        requirements: [
          'High School Report Card (Form 138) / Transcript of Records',
          'Good Moral Character Certificate',
          'PSA Birth Certificate',
          'General Average of 85% or higher',
          'Passing rate in UA College Admission Test'
        ],
        curriculum: [
          'Year 1: Introduction to Computing, Computer Programming 1 & 2, Discrete Structure 1',
          'Year 2: Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems',
          'Year 3: Software Engineering, Operating Systems, Web Development, Automata Theory',
          'Year 4: Artificial Intelligence, Thesis 1 & 2, Practicum/Internship (480 hours)'
        ]
      },
      {
        code: 'BSIT',
        title: 'Bachelor of Science in Information Technology',
        duration: '4 Years',
        description: 'Prepares students to be IT professionals, well-versed in IT planning, development, installation, operation, and maintenance. Covers network administration, systems analysis, cyber security, and database design.',
        requirements: [
          'High School Report Card (Form 138) / Transcript of Records',
          'Good Moral Character Certificate',
          'PSA Birth Certificate',
          'General Average of 80% or higher',
          'Passing rate in UA College Admission Test'
        ],
        curriculum: [
          'Year 1: IT Fundamentals, Computer Programming 1 & 2, Networking 1',
          'Year 2: Database Systems, Web Systems & Technologies, Networking 2',
          'Year 3: Systems Integration & Architecture, Information Assurance & Security, Web Dev 2',
          'Year 4: IT Capstone Project 1 & 2, System Administration, Internship (480 hours)'
        ]
      }
    ]
  },
  {
    id: 'business',
    name: 'College of Business & Management',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '22px', height: '22px' }}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        <rect x="12" y="11" width="8" height="6" rx="1" ry="1" />
      </svg>
    ),
    programs: [
      {
        code: 'BSBA',
        title: 'Bachelor of Science in Business Administration',
        duration: '4 Years',
        description: 'Equips students with analytical and operational skills needed for career paths in business management, marketing, financial analysis, and entrepreneurship. Emphasizes strategic planning and corporate governance.',
        requirements: [
          'High School Report Card (Form 138)',
          'Good Moral Character Certificate',
          'PSA Birth Certificate',
          'UA Admission Test Results'
        ],
        curriculum: [
          'Year 1: Principles of Management, Microeconomics, Basic Accounting',
          'Year 2: Human Resource Management, Marketing Principles, Business Law',
          'Year 3: Financial Management, Operations Management, International Business',
          'Year 4: Strategic Management, Business Research, Corporate Practicum'
        ]
      }
    ]
  },
  {
    id: 'engineering',
    name: 'College of Engineering',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '22px', height: '22px' }}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    programs: [
      {
        code: 'BSEE',
        title: 'Bachelor of Science in Electrical Engineering',
        duration: '4 Years',
        description: 'Focuses on the generation, transmission, distribution, and utilization of electrical energy, as well as design of electrical machinery, control systems, and electronics.',
        requirements: [
          'High School Report Card (Form 138) - STEM Strand preferred',
          'General Average of 85% or higher in Math and Science subjects',
          'Good Moral Character Certificate',
          'PSA Birth Certificate',
          'UA College Admission Test passing score'
        ],
        curriculum: [
          'Year 1: Calculus 1 & 2, Chemistry for Engineers, Engineering Drawing',
          'Year 2: Physics for Engineers, Circuits 1 & 2, Electronic Devices & Circuits',
          'Year 3: Electrical Machines, Control Systems, Power System Analysis',
          'Year 4: Electrical Systems Design, Capstone Design Project, Internship'
        ]
      }
    ]
  },
  {
    id: 'education',
    name: 'College of Teacher Education',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '22px', height: '22px' }}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    programs: [
      {
        code: 'BEED',
        title: 'Bachelor of Elementary Education',
        duration: '4 Years',
        description: 'Designed to prepare educators for teaching in kindergarten and elementary levels. Integrates child development psychology, classroom management techniques, and curriculum development.',
        requirements: [
          'High School Report Card (Form 138)',
          'Good Moral Character Certificate',
          'PSA Birth Certificate',
          'Passing score in UA Admission Test & Interview'
        ],
        curriculum: [
          'Year 1: Child & Adolescent Development, Teaching Profession, General Education subjects',
          'Year 2: Facilitating Learner-Centered Teaching, Educational Technology, Curriculum Development',
          'Year 3: Teaching Science & Math in Elementary, Literacy Instruction, Assessment of Learning',
          'Year 4: Field Study 1 & 2, Practice Teaching / Internship in partner schools'
        ]
      }
    ]
  },
  {
    id: 'maritime',
    name: 'College of Maritime Education',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '22px', height: '22px' }}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    programs: [
      {
        code: 'BSMARE',
        title: 'Bachelor of Science in Marine Engineering',
        duration: '4 Years',
        description: 'Develops student competency in marine engineering, shipboard operations, maintenance, propulsion, and auxiliary machinery systems. Certified under STCW standards.',
        requirements: [
          'High School Report Card (Form 138)',
          'Complete Medical Clearance (Physical, Eyesight, Hearing)',
          'Drug Test Certificate',
          'Good Moral Character Certificate',
          'PSA Birth Certificate'
        ],
        curriculum: [
          'Year 1: Intro to Marine Engineering, Marine Drawing, Physics for Marine Engineers',
          'Year 2: Auxiliary Machinery, Marine Electricity, Electro-Technology',
          'Year 3: Marine Propulsion, Shipboard Control Systems, Engine Watchkeeping',
          'Year 4: Apprenticeship/Shipboard Training (1 Year Onboard)'
        ]
      }
    ]
  }
];

export const ProgramsOffered = ({ navigateTo }) => {
  const [activeCollege, setActiveCollege] = useState('technology');
  const [expandedProgram, setExpandedProgram] = useState(null);

  const toggleProgram = (code) => {
    if (expandedProgram === code) {
      setExpandedProgram(null);
    } else {
      setExpandedProgram(code);
    }
  };

  const selectedCollege = colleges.find(c => c.id === activeCollege) || colleges[0];

  return (
    <div className="app-page-wrapper animate-fade-in" style={{ minHeight: 'calc(100vh - 120px)', padding: '2rem 1rem 5rem' }}>
      <div className="container" style={{ maxWidth: '900px', width: '100%' }}>
        
        {/* Page Banner */}
        <section className="hero glass" style={{ padding: '2.5rem 2rem', marginBottom: '2rem', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
          <div className="hero-glow"></div>
          <span className="badge" style={{ backgroundColor: 'var(--logo-gold-glow)', color: 'var(--logo-gold)', borderColor: 'var(--logo-gold)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.2rem 0.6rem', marginBottom: '0.5rem', display: 'inline-block' }}>
            Academic Catalog
          </span>
          <h1 style={{ fontSize: '2.2rem', margin: '0 0 0.5rem', color: '#ffffff' }}>Offered Academic Programs</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Browse through the degree programs and college curriculum guides offered by the University of Antique.
          </p>
        </section>

        {/* Tab Controls for Colleges */}
        <div 
          className="glass" 
          style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            padding: '0.5rem', 
            borderRadius: 'var(--border-radius-md)', 
            marginBottom: '2rem', 
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          {colleges.map(college => (
            <button
              key={college.id}
              onClick={() => {
                setActiveCollege(college.id);
                setExpandedProgram(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1rem',
                border: 'none',
                background: activeCollege === college.id ? 'var(--primary)' : 'transparent',
                color: activeCollege === college.id ? '#ffffff' : 'var(--text-secondary)',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.85rem',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              {college.icon}
              {college.name.replace('College of ', '')}
            </button>
          ))}
        </div>

        {/* College Programs List */}
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {selectedCollege.icon}
            {selectedCollege.name}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selectedCollege.programs.map(program => {
              const isExpanded = expandedProgram === program.code;
              return (
                <div 
                  key={program.code} 
                  className="glass" 
                  style={{ 
                    borderRadius: 'var(--border-radius-lg)', 
                    overflow: 'hidden',
                    border: isExpanded ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {/* Accordion Trigger */}
                  <div 
                    onClick={() => toggleProgram(program.code)}
                    style={{ 
                      padding: '1.25rem 1.5rem', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      background: isExpanded ? 'rgba(255, 255, 255, 0.01)' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <span className="badge" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', borderColor: 'var(--primary)', fontSize: '0.75rem', marginRight: '0.75rem' }}>
                        {program.code}
                      </span>
                      <strong style={{ fontSize: '1.05rem', color: '#ffffff' }}>{program.title}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.75rem' }}>
                        • {program.duration}
                      </span>
                    </div>
                    <div style={{ display: 'flex', color: 'var(--text-secondary)', transition: 'transform 0.25s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '16px', height: '16px' }}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div 
                      style={{ 
                        padding: '1.5rem', 
                        borderTop: '1px solid var(--border-color)', 
                        background: 'rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                      }}
                    >
                      {/* Description */}
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600, marginBottom: '0.35rem' }}>Program Overview</span>
                        <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                          {program.description}
                        </p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {/* Admission Requirements */}
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Admission Requirements</span>
                          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {program.requirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Curriculum Overview */}
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Curriculum Overview</span>
                          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {program.curriculum.map((curr, i) => (
                              <li key={i}>{curr}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to action */}
        <section className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)', marginTop: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#ffffff', margin: 0 }}>Ready to enroll in University of Antique?</h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '500px', lineHeight: '1.5' }}>
            Register or sign in to your registrar portal account to submit your draft curriculum enrollment for evaluation.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button 
              onClick={() => navigateTo('auth')} 
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.5rem', fontWeight: '600' }}
            >
              Sign In to Register
            </button>
            <button 
              onClick={() => navigateTo('home')} 
              className="btn"
              style={{ padding: '0.6rem 1.5rem', borderColor: 'var(--border-color)' }}
            >
              Back to Home
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ProgramsOffered;
