import { useState, useEffect } from 'react';
import { getStudents } from '../utils/storage';

const goalsData = [
  {
    id: 1,
    title: "GOAL 1 (ACADEMICS)",
    shortTitle: "Academics",
    category: "Academic Excellence",
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
    shortTitle: "Research",
    category: "Scientific Innovation",
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
    shortTitle: "Extension",
    category: "Community Engagement",
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
    shortTitle: "Resource Gen",
    category: "Sustainable Operations",
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
    shortTitle: "Governance",
    category: "Good Governance",
    summary: "Enhance good governance and efficient administrative services",
    objectives: [
      "Objective 5.1. To reinforce good governance and effective and efficient operations in the university",
      "Objective 5.2. To build safe, secure, gender responsive, sustainable environment, and student friendly campuses"
    ]
  }
];

const getGoalIcon = (id) => {
  switch (id) {
    case 1:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="goal-selector-icon">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="goal-selector-icon">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="goal-selector-icon">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="goal-selector-icon">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      );
    case 5:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="goal-selector-icon">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M12 17V11" />
        </svg>
      );
    default:
      return null;
  }
}; // campuses data imported from '../data/campuses.json'

const Home = ({ navigateTo, currentUser }) => {
  const [activeLang, setActiveLang] = useState('en'); // 'en' | 'fil' | 'kr'
  const [activeGoal, setActiveGoal] = useState(1);
  const [time, setTime] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [registeredCount, setRegisteredCount] = useState(0);
  const [uaStudentCount, setUaStudentCount] = useState(19482);

  useEffect(() => {
    // 1. Digital Clock ticking
    const updateTime = () => {
      const now = new Date();
      
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const pad = (num) => String(num).padStart(2, '0');
      
      setTime(`${pad(displayHours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`);
      
      const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      setDateStr(now.toLocaleDateString('en-US', options));
    };
    
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    // 2. Fetch actual registered portfolios count
    const loadRegisteredCount = async () => {
      try {
        const list = await getStudents();
        setRegisteredCount(list.length);
      } catch (err) {
        console.error(err);
      }
    };
    loadRegisteredCount();

    // 3. Real-time UA student number dynamic updates (fluctuates to simulate activity)
    const uaCountInterval = setInterval(() => {
      setUaStudentCount(prev => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, 1, or 2
        return prev + change;
      });
    }, 4000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(uaCountInterval);
    };
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="badge-promo home-hover-lift animate-fade-in">
            Now available for all University of Antique students
          </div>

          <h1 className="hero-title animate-slide-up">
            Build your professional{' '}
            <span className="hero-title-gradient hero-gradient-loop">digital portfolio</span>.
          </h1>
          
          <p className="hero-subtitle animate-slide-up-delay-1">
            A curated platform for students to present their projects, highlight specialized skills, and establish an early career presence.
          </p>
          
          <div className="hero-actions animate-slide-up-delay-2">
            {!currentUser ? (
              <button 
                className="btn btn-primary btn-lg-premium btn-view-portfolio"
                onClick={() => navigateTo('auth')}
              >
                Create Your Profile
              </button>
            ) : currentUser.isAdmin ? (
              <button 
                className="btn btn-primary btn-lg-premium btn-view-portfolio"
                onClick={() => navigateTo('directory')}
              >
                Manage Portfolios
              </button>
            ) : (
              <button 
                className="btn btn-primary btn-lg-premium btn-view-portfolio"
                onClick={() => navigateTo('profile-detail', { id: currentUser.studentId })}
              >
                View My Portfolio
              </button>
            )}
            <button 
              className="btn btn-secondary btn-lg-premium"
              onClick={() => navigateTo(currentUser ? 'directory' : 'auth')}
            >
              Explore Directory
            </button>
          </div>

          <div className="hero-live-status-bar home-hover-lift animate-slide-up-delay-3">
            <span className="status-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="status-icon">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="status-text clock-value">{time}</span>
              <span className="status-subtext">({dateStr})</span>
            </span>
            <span className="status-divider">|</span>
            <span className="status-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="status-icon">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
              <span className="status-text">{uaStudentCount.toLocaleString()}</span>
              <span className="status-subtext">UA Students</span>
            </span>
            <span className="status-divider">|</span>
            <span className="status-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="status-icon">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <span className="status-text">{registeredCount}</span>
              <span className="status-subtext">Portfolios</span>
            </span>
          </div>
        </div>
      </section>

      <section className="home-vision-mission">
        <div className="container">
          <div className="section-header">
            <div className="lang-selector">
              <div className="lang-slider"></div>
              <button 
                className={`lang-tab ${activeLang === 'en' ? 'active' : ''}`}
                onClick={() => setActiveLang('en')}
                onMouseEnter={() => setActiveLang('en')}
              >
                English
              </button>
              <button 
                className={`lang-tab ${activeLang === 'fil' ? 'active' : ''}`}
                onClick={() => setActiveLang('fil')}
                onMouseEnter={() => setActiveLang('fil')}
              >
                Filipino
              </button>
              <button 
                className={`lang-tab ${activeLang === 'kr' ? 'active' : ''}`}
                onClick={() => setActiveLang('kr')}
                onMouseEnter={() => setActiveLang('kr')}
              >
                Kinaray-a
              </button>
            </div>
          </div>

          {/* Mandate Panel */}
          <div className="statement-card mandates-card home-hover-lift animate-fade-in">
            <div className="statement-badge">Mandate</div>
            <p className="statement-text mandates-text">
              {activeLang === 'en' && "The University shall primarily provide advanced education, higher technological, professional instruction and training in the fields of education, agriculture, forestry, fishery, maritime education, ecology, engineering, philosophy, information and communications technology, letters, arts and sciences, nursing, medicine and other relevant fields of study. It shall also undertake research and extension services in support of the socioeconomic development of Antique, and provide progressive leadership in its areas of specialization."}
              {activeLang === 'fil' && "Pangunahing magbibigay ang Unibersidad ng mas mataas na edukasyon, mas mataas na teknolohikal, propesyonal na pagtuturo at pagsasanay sa mga larangan ng edukasyon, agrikultura, paggugubat, pangingisda, edukasyong maritima, ekolohiya, inhinyeriya, pilosopiya, teknolohiya ng impormasyon at komunikasyon, panitikan, sining at agham, pag-aalaga, medisina at iba pang kaugnay na larangan ng pag-aaral. Magsasagawa rin ito ng mga serbisyong pananaliksik at pagpapalawig bilang suporta sa sosyoekonomikong pag-unlad ng Antique, at magbibigay ng progresibong pamumuno sa mga larangan ng espesyalisasyon nito."}
              {activeLang === 'kr' && "Ang Unibersidad ang magaserbe nga panguna nga dalan para sa abanse nga edukasyon, teknolohiya, kag paghanas sa mga kurso parehas kang edukasyon, agrikultura, panggubat kang kagulangan, pangisda, maritime, ekolohiya, inhenyeriya, pilosopiya, ICT, literatura, sining kag agham, narsing, medisina, kag iba pa nga importante nga kurso. Magapatigayon man dya kang mga pananaliksik kag serbisyo sa komunidad para sa pag-uswag kang ekonomiya kag sosyedad sa Antique, kag magaserbe nga giya sa mga kahanas nga dya nagakabase."}
            </p>
          </div>

          <div className="vision-mission-grid">
            <div className="statement-card vision-card home-hover-lift">
              <div className="statement-badge">Vision</div>
              <p className="statement-text vision-text">
                {activeLang === 'en' && "A premier university in transforming lives, and building sustainable and resilient communities"}
                {activeLang === 'fil' && "Nangungunang Pamantasan sa pagbabanyuhay at sa pagtatag ng matibay at likas-kayang komunidad"}
                {activeLang === 'kr' && "Nagapanguna nga institusyon sa pagpabag-o kang kabuhi kag pagbalay kang mapag-on kag mapinadayunon nga komunidad"}
              </p>
            </div>

            <div className="statement-card mission-card home-hover-lift">
              <div className="statement-badge">Mission</div>
              <p className="statement-text mission-text">
                {activeLang === 'en' && "To uplift the lives of the Antiqueños and the Filipinos, UA shall produce empowered individuals through quality instruction, innovative research and development programs, sustainable resource generation activities, and relevant extension services."}
                {activeLang === 'fil' && "Upang mapaunlad ang buhay ng mga Antiqueño at ng mga Pilipino, ang University of Antique ay kinakailangang makalikha ng matatag na mga propesyonal sa pamamagitan ng de-kalidad na pagtuturo, mga inobatibong mga pananaliksik at mga programang pangkaunlaran, mga Gawain tungo sa pagkakaroon ng napananatili at pangmatagalang mga mapagkukunan, at mga serbisyong kapakipakinabang"}
                {activeLang === 'kr' && "Para mapa-ugwad ang pangabuhi kang mga Antiqueño kag mga Pilipino, kinahanglan nga ang University of Antique makadihon kang mga propesyonal nga may kapag-on paagi sa kalidad nga pagpanudlo, mga inobatibo nga mga panalawsaw kag mga programa sa pagpasanyog, mga aktibidad nga may kaangtanan sa sustinable nga parangabuy-an, kag mapinuslanon nga mga serbisyo"}
              </p>
            </div>
          </div>

          {/* Goals & Objectives Section */}
          <div className="goals-section">
            <div className="goals-section-header">
              <h2>Goals & Objectives</h2>
              <p className="goals-section-subtitle">Strategic pillars driving the University of Antique forward</p>
            </div>

            <div className="goals-compact-panel home-hover-lift">
              <div className="goals-tab-bar" role="tablist" aria-label="University goals">
                {goalsData.map(goal => (
                  <button
                    key={goal.id}
                    type="button"
                    role="tab"
                    aria-selected={activeGoal === goal.id}
                    className={`goals-tab ${activeGoal === goal.id ? 'active' : ''}`}
                    onClick={() => setActiveGoal(goal.id)}
                    onMouseEnter={() => setActiveGoal(goal.id)}
                  >
                    {getGoalIcon(goal.id)}
                    <span className="goals-tab-label">{goal.shortTitle}</span>
                    <span className="goals-tab-category">{goal.category}</span>
                  </button>
                ))}
              </div>

              {(() => {
                const selectedGoal = goalsData.find(g => g.id === activeGoal) || goalsData[0];
                return (
                  <div className="goals-tab-panel" key={selectedGoal.id}>
                    <div className="goals-tab-panel-header">
                      <div className="goals-tab-panel-meta">
                        <span className="goals-tab-panel-badge">Goal {selectedGoal.id}</span>
                        <span className="goals-tab-panel-category">{selectedGoal.category}</span>
                      </div>
                      <h3 className="goals-tab-panel-title">{selectedGoal.title}</h3>
                      <p className="goals-tab-panel-summary">{selectedGoal.summary}</p>
                    </div>

                    <ul className="goals-objectives-grid">
                      {selectedGoal.objectives.map((obj, i) => {
                        const match = obj.match(/^Objective\s+\d+\.\d+\.\s*(.*)/i);
                        const objText = match ? match[1] : obj;
                        const objNumber = obj.match(/^Objective\s+(\d+\.\d+)/i)?.[1] || `${selectedGoal.id}.${i + 1}`;
                        return (
                          <li key={i} className="goals-objective-item">
                            <span className="goals-objective-num">{objNumber}</span>
                            <span className="goals-objective-text">{objText}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })()}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
