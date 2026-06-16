import React, { useState } from 'react';

const goalsData = [
  {
    id: 1,
    title: "GOAL 1 (ACADEMICS)",
    summary: "Deliver quality instruction responsive to the needs of the local communities while conforming to international standards",
    objectives: [
      "Objective 1.1. To offer updated curricular offerings enhanced by the relevance of its niches in order to meet local and global demands",
      "Objective 1.2. To improve faculty and academic staff profile and equip them with competence in instruction, research, and extension considering the prescribed national and international standards",
      "Objective 1.3. To provide students with adequate modern physical and instructional facilities, varied resources, and quality-assured instructional materials for effective learning",
      "Objective 1.4. To establish effective learning systems utilized by 100% of students and faculty and various modes of learning delivery adaptive to the changing landscape of higher education",
      "Objective 1.5. To increase and maintain the level of accreditation status in all programs",
      "Objective 1.6. To implement effective operation of support units to academics through responsive student welfare and development"
    ]
  },
  {
    id: 2,
    title: "GOAL 2 (RESEARCH)",
    summary: "Produce relevant, innovative, interdisciplinary, and interdisciplinary researches",
    objectives: [
      "Objective 2.1. To strengthen research endeavors in relation to the three niches of the University, and Futures Thinking",
      "Objective 2.2. To increase the number of quality researches completed",
      "Objective 2.3. To increase participation of faculty members and staff in the University research endeavors",
      "Objective 2.4. To provide human resources, modern facilities, and quality research services",
      "Objective 2.5. To increase IP registration of research outputs, and facilitate knowledge and technology transfer arrangements",
      "Objective 2.6. To increase presentations, research citations, and publications in local, peer-reviewed, and international refereed journals"
    ]
  },
  {
    id: 3,
    title: "GOAL 3 (EXTENSION)",
    summary: "Implement collaborative, sustainable, and research-based extension and training services",
    objectives: [
      "Objective 3.1. To strengthen national and international linkages engaged in extension services for community building",
      "Objective 3.2. To provide appropriate extension services to address the needs of the community",
      "Objective 3.3. To ensure the sustainability of the implemented extension programs and projects",
      "Objective 3.4. To widen the dissemination of extension outputs",
      "Objective 3.5. To provide human resources, modern facilities, and quality extension services",
      "Objective 3.6. To enhance the capability and involvement of faculty and staff in the provision of extension services and community engagement"
    ]
  },
  {
    id: 4,
    title: "GOAL 4 (RESOURCE GENERATION)",
    summary: "Develop and enhance viable and sustainable resource-generating activities",
    objectives: [
      "Objective 4.1. To formulate and implement viable investment plan",
      "Objective 4.2. To increase income generated from established projects/centers",
      "Objective 4.3. To increase utilization of the University’s facilities/assets",
      "Objective 4.4. To intensify collaboration with other agencies and organizations"
    ]
  },
  {
    id: 5,
    title: "GOAL 5 (GOVERNANCE)",
    summary: "Enhance good governance and efficient administrative services",
    objectives: [
      "Objective 5.1. To reinforce good governance and effective and efficient operations in the university",
      "Objective 5.2. To build safe, secure, gender responsive, sustainable environment, and student friendly campuses"
    ]
  }
];

export const Home = ({ navigateTo, currentUser }) => {
  const [activeLang, setActiveLang] = useState('en'); // 'en' | 'fil' | 'kr'
  const [activeGoal, setActiveGoal] = useState(null);

  const student = currentUser?.student || {};

  return (
    <div className="home-container" style={{ paddingBottom: '5rem' }}>
      
      {/* Institutional Hero Banner */}
      <section className="home-hero" style={{ padding: '4rem 1rem 3.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-glow" style={{ opacity: 0.15 }}></div>
        <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <img 
            src="/ua-logo.png" 
            alt="University of Antique Logo" 
            style={{ width: '80px', height: '80px', marginBottom: '1.25rem', objectFit: 'contain' }}
            className="animate-fade-in"
          />

          <h1 className="hero-title animate-slide-up" style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#ffffff' }}>
            Office of the University Registrar
          </h1>
          <p className="hero-subtitle animate-slide-up-delay-1" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', margin: '0 0 2rem', maxWidth: '650px' }}>
            Official student enrollment gateway, registration management center, and academic record directory for the University of Antique.
          </p>

          {/* Quick Actions Panel */}
          <div className="glass animate-slide-up-delay-2" style={{ padding: '1.5rem 2rem', borderRadius: 'var(--border-radius-lg)', width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: '1px solid var(--border-color)' }}>
            {currentUser ? (
              currentUser.isAdmin ? (
                // Staff Quick Actions
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    Logged in as <strong style={{ color: 'var(--accent)' }}>Registrar Officer</strong>. Settle enrollment queues and evaluate course catalogs.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                      className="btn btn-primary btn-lg-premium"
                      onClick={() => navigateTo('office-admin')}
                    >
                      Open Registrar Dashboard
                    </button>
                    <button 
                      className="btn btn-secondary btn-lg-premium"
                      onClick={() => navigateTo('directory')}
                    >
                      View Student Roster
                    </button>
                  </div>
                </div>
              ) : (
                // Student Quick Actions
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    Welcome back, <strong style={{ color: 'var(--primary)' }}>{student.name || currentUser.email}</strong>. View your current enrollment status and statements.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                      className="btn btn-primary btn-lg-premium"
                      onClick={() => navigateTo('registrar-portal')}
                    >
                      Go to Registrar Portal
                    </button>
                    <button 
                      className="btn btn-secondary btn-lg-premium"
                      onClick={() => navigateTo('directory')}
                    >
                      Browse Student Roster
                    </button>
                  </div>
                </div>
              )
            ) : (
              // Guest Quick Actions
              <div style={{ width: '100%', textAlign: 'center' }}>
                <p style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  Sign in with your university credentials to register classes, check outstanding balances, and access academic charts.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-primary btn-lg-premium"
                    onClick={() => navigateTo('auth')}
                  >
                    Sign In to Portal
                  </button>
                  <button 
                    className="btn btn-secondary btn-lg-premium"
                    onClick={() => navigateTo('auth')}
                  >
                    Register New Account
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Roster Information, Fees and Announcements Grid */}
      <section style={{ padding: '0 1rem 3rem' }}>
        <div className="container" style={{ maxWidth: '950px' }}>
          
          {/* Announcements Alert Card */}
          <div className="glass animate-fade-in" style={{ padding: '1.25rem 1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--primary)', backgroundColor: 'var(--primary-glow)', display: 'flex', gap: '1rem', alignItems: 'flex-start', textAlign: 'left', marginBottom: '2rem' }}>
            <div style={{ color: 'var(--primary)', padding: '0.2rem', display: 'flex' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '24px', height: '24px' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <strong style={{ color: '#ffffff', fontSize: '1rem', display: 'block', marginBottom: '0.25rem' }}>Registrar Announcement: AY 2026-2027 Enrollment Open</strong>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Online enrollment and class registration for the First Semester of Academic Year 2026-2027 is active. Registration closes on June 30, 2026. Please complete your registration requests and settle invoice balances before the deadline.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            
            {/* Academic Calendar Card */}
            <div className="glass" style={{ padding: '1.5rem 1.75rem', borderRadius: 'var(--border-radius-lg)', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#ffffff' }}>Academic Calendar</h2>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                <li style={{ borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 600, display: 'block' }}>June 15 – June 30, 2026</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Semestral Registration & Enrollment Period</span>
                </li>
                <li style={{ borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 600, display: 'block' }}>August 3, 2026</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Official Start of Classes</span>
                </li>
                <li style={{ borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 600, display: 'block' }}>October 5 – October 9, 2026</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Midterm Examination Week</span>
                </li>
                <li>
                  <span style={{ color: 'var(--primary)', fontWeight: 600, display: 'block' }}>December 7 – December 11, 2026</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Final Semester Examination Week</span>
                </li>
              </ul>
            </div>

            {/* Tuition Fees Structure */}
            <div className="glass" style={{ padding: '1.5rem 1.75rem', borderRadius: 'var(--border-radius-lg)', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--logo-gold)" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#ffffff' }}>Tuition & Fees Schedule</h2>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1rem' }}>
                Tuition fee assessments are calculated automatically based on enrolled units plus the base registration charge.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Base Registration Fee</span>
                  <strong style={{ color: '#ffffff' }}>$500.00 / sem</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Tuition (Per Unit/Credit)</span>
                  <strong style={{ color: '#ffffff' }}>$150.00 / unit</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Miscellaneous Fees</span>
                  <strong style={{ color: '#ffffff' }}>$0.00 (Waived)</strong>
                </div>
                <div style={{ padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                  * Maximum allowable units for regular semesters is capped at 18 credit hours.
                </div>
              </div>
            </div>

          </div>

          {/* Vision and Mission Accordion Chart */}
          <div className="goals-section" style={{ marginTop: '4rem' }}>
            
            {/* Lang Selector inside Vision card */}
            <div className="section-header" style={{ marginBottom: '1.5rem' }}>
              <div className="lang-selector">
                <div className="lang-slider"></div>
                <button className={`lang-tab ${activeLang === 'en' ? 'active' : ''}`} onClick={() => setActiveLang('en')}>English</button>
                <button className={`lang-tab ${activeLang === 'fil' ? 'active' : ''}`} onClick={() => setActiveLang('fil')}>Filipino</button>
                <button className={`lang-tab ${activeLang === 'kr' ? 'active' : ''}`} onClick={() => setActiveLang('kr')}>Kinaray-a</button>
              </div>
            </div>

            {/* Mandate Panel */}
            <div className="glass statement-card mandates-card animate-fade-in" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <div className="statement-badge">Mandate</div>
              <p className="statement-text mandates-text" style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                {activeLang === 'en' && "The University shall primarily provide advanced education, higher technological, professional instruction and training in the fields of education, agriculture, forestry, fishery, maritime education, ecology, engineering, philosophy, information and communications technology, letters, arts and sciences, nursing, medicine and other relevant fields of study. It shall also undertake research and extension services in support of the socioeconomic development of Antique, and provide progressive leadership in its areas of specialization."}
                {activeLang === 'fil' && "Pangunahing magbibigay ang Unibersidad ng mas mataas na edukasyon, mas mataas na teknolohikal, propesyonal na pagtuturo at pagsasanay sa mga larangan ng edukasyon, agrikultura, paggugubat, pangingisda, edukasyong maritima, ekolohiya, inhinyeriya, pilosopiya, teknolohiya ng impormasyon at komunikasyon, panitikan, sining at agham, pag-aalaga, medisina at iba pang kaugnay na larangan ng pag-aaral. Magsasagawa rin ito ng mga serbisyong pananaliksik at pagpapalawig bilang suporta sa sosyoekonomikong pag-unlad ng Antique, at magbibigay ng progresibong pamumuno sa mga larangan ng espesyalisasyon nito."}
                {activeLang === 'kr' && "Ang Unibersidad ang magaserbe nga panguna nga dalan para sa abanse nga edukasyon, teknolohiya, kag paghanas sa mga kurso parehas kang edukasyon, agrikultura, panggubat kang kagulangan, pangisda, maritime, ekolohiya, inhenyeriya, pilosopiya, ICT, literatura, sining kag agham, narsing, medisina, kag iba pa nga importante nga kurso. Magapatigayon man dya kang mga pananaliksik kag serbisyo sa komunidad para sa pag-uswag kang ekonomiya kag sosyedad sa Antique, kag magaserbe nga giya sa mga kahanas nga dya nagakabase."}
              </p>
            </div>

            <div className="vision-mission-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              <div className="glass statement-card vision-card" style={{ textAlign: 'left' }}>
                <div className="statement-badge">Vision</div>
                <p className="statement-text vision-text" style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                  {activeLang === 'en' && "A premier university in transforming lives, and building sustainable and resilient communities"}
                  {activeLang === 'fil' && "Nangungunang Pamantasan sa pagbabanyuhay at sa pagtatag ng matibay at likas-kayang komunidad"}
                  {activeLang === 'kr' && "Nagapanguna nga institusyon sa pagpabag-o kang kabuhi kag pagbalay kang mapag-on kag mapinadayunon nga komunidad"}
                </p>
              </div>

              <div className="glass statement-card mission-card" style={{ textAlign: 'left' }}>
                <div className="statement-badge">Mission</div>
                <p className="statement-text mission-text" style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                  {activeLang === 'en' && "To uplift the lives of the Antiqueños and the Filipinos, UA shall produce empowered individuals through quality instruction, innovative research and development programs, sustainable resource generation activities, and relevant extension services."}
                  {activeLang === 'fil' && "Upang mapaunlad ang buhay ng mga Antiqueño at ng mga Pilipino, ang University of Antique ay kinakailangang makalikha ng matatag na mga propesyonal sa pamamagitan ng de-kalidad na pagtuturo, mga inobatibong mga pananaliksik at mga programang pangkaunlaran, mga Gawain tungo sa pagkakaroon ng napananatili at pangmatagalang mga mapagkukunan, at mga serbisyong kapakipakinabang"}
                  {activeLang === 'kr' && "Para mapa-ugwad ang pangabuhi kang mga Antiqueño kag mga Pilipino, kinahanglan nga ang University of Antique makadihon kang mga propesyonal nga may kapag-on paagi sa kalidad nga pagpanudlo, mga inobatibo nga mga panalawsaw kag mga programa sa pagpasanyog, mga aktibidad nga may kaangtanan sa sustinable nga parangabuy-an, kag mapinuslanon nga mga serbisyo"}
                </p>
              </div>
            </div>

            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', textAlign: 'left', marginBottom: '1.25rem' }}>Goals & Objectives</h2>
            <div className="goals-accordion">
              {goalsData.map((goal) => {
                const isActive = activeGoal === goal.id;
                return (
                  <div key={goal.id} className={`goal-item ${isActive ? 'active' : ''}`} style={{ textAlign: 'left' }}>
                    <div 
                      className="goal-header" 
                      onClick={() => setActiveGoal(isActive ? null : goal.id)}
                    >
                      <div className="goal-title-container">
                        <span className="goal-title">{goal.title}</span>
                        <span className="goal-summary">{goal.summary}</span>
                      </div>
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        className="goal-icon"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                    <div className="goal-content">
                      <ul className="objectives-list">
                        {goal.objectives.map((obj, index) => (
                          <li key={index} className="objective-item">{obj}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
