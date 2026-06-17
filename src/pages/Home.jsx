import React, { useState, useEffect, useRef } from 'react';
import { getStudents } from '../utils/storage';
import campusesData from '../data/campuses.json';

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
]; // campuses data imported from '../data/campuses.json'

const Home = ({ navigateTo, currentUser, currentTheme }) => {
  const [activeLang, setActiveLang] = useState('en'); // 'en' | 'fil' | 'kr'
  const [activeGoal, setActiveGoal] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState(campusesData[0]);
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
          <div className="badge-promo animate-fade-in">
            Now available for all University of Antique students
          </div>

          <h1 className="hero-title animate-slide-up">
            Build your professional <br />
            <span className="hero-title-gradient">digital portfolio.</span>
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

          <div className="hero-live-status-bar animate-slide-up-delay-3">
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
          <div className="glass statement-card mandates-card animate-fade-in">
            <div className="statement-badge">Mandate</div>
            <p className="statement-text mandates-text">
              {activeLang === 'en' && "The University shall primarily provide advanced education, higher technological, professional instruction and training in the fields of education, agriculture, forestry, fishery, maritime education, ecology, engineering, philosophy, information and communications technology, letters, arts and sciences, nursing, medicine and other relevant fields of study. It shall also undertake research and extension services in support of the socioeconomic development of Antique, and provide progressive leadership in its areas of specialization."}
              {activeLang === 'fil' && "Pangunahing magbibigay ang Unibersidad ng mas mataas na edukasyon, mas mataas na teknolohikal, propesyonal na pagtuturo at pagsasanay sa mga larangan ng edukasyon, agrikultura, paggugubat, pangingisda, edukasyong maritima, ekolohiya, inhinyeriya, pilosopiya, teknolohiya ng impormasyon at komunikasyon, panitikan, sining at agham, pag-aalaga, medisina at iba pang kaugnay na larangan ng pag-aaral. Magsasagawa rin ito ng mga serbisyong pananaliksik at pagpapalawig bilang suporta sa sosyoekonomikong pag-unlad ng Antique, at magbibigay ng progresibong pamumuno sa mga larangan ng espesyalisasyon nito."}
              {activeLang === 'kr' && "Ang Unibersidad ang magaserbe nga panguna nga dalan para sa abanse nga edukasyon, teknolohiya, kag paghanas sa mga kurso parehas kang edukasyon, agrikultura, panggubat kang kagulangan, pangisda, maritime, ekolohiya, inhenyeriya, pilosopiya, ICT, literatura, sining kag agham, narsing, medisina, kag iba pa nga importante nga kurso. Magapatigayon man dya kang mga pananaliksik kag serbisyo sa komunidad para sa pag-uswag kang ekonomiya kag sosyedad sa Antique, kag magaserbe nga giya sa mga kahanas nga dya nagakabase."}
            </p>
          </div>

          <div className="vision-mission-grid">
            <div className="glass statement-card vision-card">
              <div className="statement-badge">Vision</div>
              <p className="statement-text vision-text">
                {activeLang === 'en' && "A premier university in transforming lives, and building sustainable and resilient communities"}
                {activeLang === 'fil' && "Nangungunang Pamantasan sa pagbabanyuhay at sa pagtatag ng matibay at likas-kayang komunidad"}
                {activeLang === 'kr' && "Nagapanguna nga institusyon sa pagpabag-o kang kabuhi kag pagbalay kang mapag-on kag mapinadayunon nga komunidad"}
              </p>
            </div>

            <div className="glass statement-card mission-card">
              <div className="statement-badge">Mission</div>
              <p className="statement-text mission-text">
                {activeLang === 'en' && "To uplift the lives of the Antiqueños and the Filipinos, UA shall produce empowered individuals through quality instruction, innovative research and development programs, sustainable resource generation activities, and relevant extension services."}
                {activeLang === 'fil' && "Upang mapaunlad ang buhay ng mga Antiqueño at ng mga Pilipino, ang University of Antique ay kinakailangang makalikha ng matatag na mga propesyonal sa pamamagitan ng de-kalidad na pagtuturo, mga inobatibong mga pananaliksik at mga programang pangkaunlaran, mga Gawain tungo sa pagkakaroon ng napananatili at pangmatagalang mga mapagkukunan, at mga serbisyong kapakipakinabang"}
                {activeLang === 'kr' && "Para mapa-ugwad ang pangabuhi kang mga Antiqueño kag mga Pilipino, kinahanglan nga ang University of Antique makadihon kang mga propesyonal nga may kapag-on paagi sa kalidad nga pagpanudlo, mga inobatibo nga mga panalawsaw kag mga programa sa pagpasanyog, mga aktibidad nga may kaangtanan sa sustinable nga parangabuy-an, kag mapinuslanon nga mga serbisyo"}
              </p>
            </div>
          </div>

          {/* Campuses Map Section */}
          <div className="campuses-section animate-slide-up-delay-2">
            <h2 className="section-title">Campuses of University of Antique</h2>
            <p className="section-subtitle">
              UA serves the province of Antique through its strategically located campuses. Select a campus to explore details.
            </p>
            
            <div className="campuses-grid">
              {/* Detail Column */}
              <div className="campus-detail-column">
                <div className="campus-list">
                  {campusesData.map((campus) => {
                    const isSelected = selectedCampus.id === campus.id;
                    return (
                      <button 
                        key={campus.id}
                        className={`campus-list-item glass ${isSelected ? 'selected' : ''}`}
                        onMouseEnter={() => setSelectedCampus(campus)}
                        onClick={() => setSelectedCampus(campus)}
                      >
                        <span className="campus-dot" style={{ backgroundColor: campus.color }}></span>
                        <div className="campus-item-meta">
                          <span className="campus-item-name">{campus.name}</span>
                          <span className="campus-item-loc">{campus.location}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Glassmorphic Info Card */}
                <div className="campus-info-card glass animate-fade-in" key={selectedCampus.id}>
                  <div className="campus-card-header">
                    <div className="campus-header-badge" style={{ backgroundColor: `${selectedCampus.color}15`, color: selectedCampus.color, border: `1px solid ${selectedCampus.color}30` }}>
                      Est. {selectedCampus.established}
                    </div>
                    <h3>{selectedCampus.name}</h3>
                    <div className="campus-card-loc">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {selectedCampus.location}
                    </div>
                  </div>

                  <div className="campus-card-body">
                    <img src={selectedCampus.photo} alt={`${selectedCampus.name} photo`} className="campus-info-img" />
                    <p className="campus-desc">{selectedCampus.description}</p>
                    <div className="campus-contact">
                      <p><strong>Address:</strong> {selectedCampus.address}</p>
                      <p><strong>Phone:</strong> {selectedCampus.phone}</p>
                      <p><strong>Email:</strong> {selectedCampus.email}</p>
                    </div>
                    <div className="campus-specializations">
                      <div className="spec-label">Key Specializations</div>
                      <p className="spec-text">{selectedCampus.specialization}</p>
                    </div>
                  </div>

                  <div className="campus-card-actions">
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => navigateTo('directory', { campus: selectedCampus.name })}
                      style={{ width: '100%', minHeight: '38px', borderRadius: 'var(--border-radius-md)' }}
                    >
                      Browse Student Portfolios
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Goals & Objectives Accordion */}
          <div className="goals-section">
            <h2>Goals & Objectives</h2>
            <div className="goals-accordion">
              {goalsData.map((goal) => {
                const isActive = activeGoal === goal.id;
                return (
                  <div 
                    key={goal.id} 
                    className={`goal-item ${isActive ? 'active' : ''}`}
                    onMouseEnter={() => setActiveGoal(goal.id)}
                    onMouseLeave={() => setActiveGoal(null)}
                  >
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
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
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
