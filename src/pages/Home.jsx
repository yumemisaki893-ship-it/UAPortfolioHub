import React, { useState } from 'react';

const Home = ({ navigateTo, currentUser }) => {
  const [activeLang, setActiveLang] = useState('en');

  const handlePrimaryAction = () => {
    if (currentUser?.isAdmin) {
      navigateTo('office-admin');
    } else if (currentUser) {
      navigateTo('registrar-portal');
    } else {
      navigateTo('auth');
    }
  };

  const handleSecondaryAction = () => {
    navigateTo('directory');
  };

  return (
    <div className="home-container" style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      {/* Cinematic Hero Section */}
      <section 
        className="hero-section" 
        style={{ 
          position: 'relative',
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.95) 100%), url("/ua-gate.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: '#fff',
          textAlign: 'center',
          padding: '6rem 1.5rem',
          overflow: 'hidden'
        }}
      >
        {/* Subtle animated background glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(255,77,100,0.05) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', filter: 'blur(60px)' }}></div>

        <div className="container hero-content" style={{ maxWidth: '900px', position: 'relative', zIndex: 10 }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <span style={{ 
              display: 'inline-block', 
              padding: '0.4rem 1.2rem', 
              background: 'rgba(20,20,20,0.8)', 
              border: '1px solid rgba(255, 200, 0, 0.4)', 
              borderRadius: '30px', 
              fontSize: '0.85rem', 
              fontWeight: 600, 
              color: '#ffc800',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              Now available for all University of Antique students
            </span>
          </div>

          <h1 className="hero-title" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Access your official <br />
            <span style={{ 
              background: 'linear-gradient(90deg, #ffc800, #ff4d64)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>academic records.</span>
          </h1>
          
          <p className="hero-subtitle" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: '#888', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.6, fontWeight: 400 }}>
            A curated platform for students to present their projects, highlight specialized skills, and establish an early career presence.
          </p>

          <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary" 
              onClick={handlePrimaryAction}
              style={{ 
                background: '#ff4d64', 
                color: '#fff', 
                border: 'none', 
                padding: '0.9rem 2.2rem', 
                fontSize: '1.05rem', 
                fontWeight: 600, 
                borderRadius: '6px',
                boxShadow: '0 8px 25px rgba(255, 77, 100, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              Registrar Portal
            </button>
            <button 
              className="btn" 
              onClick={handleSecondaryAction}
              style={{ 
                background: 'rgba(20,20,20,0.8)', 
                color: '#fff', 
                border: '1px solid rgba(255,255,255,0.1)', 
                padding: '0.9rem 2.2rem', 
                fontSize: '1.05rem', 
                fontWeight: 600, 
                borderRadius: '6px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              Student Roster
            </button>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Mandate Section */}
      <section style={{ padding: '6rem 1.5rem', background: '#0a0a0a' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Language Selector */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '30px', padding: '0.25rem' }}>
              {['en', 'fil', 'kr'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  style={{
                    background: activeLang === lang ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: activeLang === lang ? '#fff' : '#888',
                    border: 'none',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {lang === 'en' ? 'English' : lang === 'fil' ? 'Filipino' : 'Kinaray-a'}
                </button>
              ))}
            </div>
          </div>

          {/* Mandate */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '2.5rem', marginBottom: '2rem', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'inline-block', background: 'rgba(255, 200, 0, 0.1)', color: '#ffc800', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
              Mandate
            </div>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#ccc' }}>
              {activeLang === 'en' && "The University shall primarily provide advanced education, higher technological, professional instruction and training in the fields of education, agriculture, forestry, fishery, maritime education, ecology, engineering, philosophy, information and communications technology, letters, arts and sciences, nursing, medicine and other relevant fields of study. It shall also undertake research and extension services in support of the socioeconomic development of Antique, and provide progressive leadership in its areas of specialization."}
              {activeLang === 'fil' && "Pangunahing magbibigay ang Unibersidad ng mas mataas na edukasyon, mas mataas na teknolohikal, propesyonal na pagtuturo at pagsasanay sa mga larangan ng edukasyon, agrikultura, paggugubat, pangingisda, edukasyong maritima, ekolohiya, inhinyeriya, pilosopiya, teknolohiya ng impormasyon at komunikasyon, panitikan, sining at agham, pag-aalaga, medisina at iba pang kaugnay na larangan ng pag-aaral. Magsasagawa rin ito ng mga serbisyong pananaliksik at pagpapalawig bilang suporta sa sosyoekonomikong pag-unlad ng Antique, at magbibigay ng progresibong pamumuno sa mga larangan ng espesyalisasyon nito."}
              {activeLang === 'kr' && "Ang Unibersidad ang magaserbe nga panguna nga dalan para sa abanse nga edukasyon, teknolohiya, kag paghanas sa mga kurso parehas kang edukasyon, agrikultura, panggubat kang kagulangan, pangisda, maritime, ekolohiya, inhenyeriya, pilosopiya, ICT, literatura, sining kag agham, narsing, medisina, kag iba pa nga importante nga kurso. Magapatigayon man dya kang mga pananaliksik kag serbisyo sa komunidad para sa pag-uswag kang ekonomiya kag sosyedad sa Antique, kag magaserbe nga giya sa mga kahanas nga dya nagakabase."}
            </p>
          </div>

          {/* Vision and Mission Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '2.5rem', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'inline-block', background: 'rgba(255, 77, 100, 0.1)', color: '#ff4d64', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                Vision
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#ccc' }}>
                {activeLang === 'en' && "A premier university in transforming lives, and building sustainable and resilient communities"}
                {activeLang === 'fil' && "Nangungunang Pamantasan sa pagbabanyuhay at sa pagtatag ng matibay at likas-kayang komunidad"}
                {activeLang === 'kr' && "Nagapanguna nga institusyon sa pagpabag-o kang kabuhi kag pagbalay kang mapag-on kag mapinadayunon nga komunidad"}
              </p>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '2.5rem', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'inline-block', background: 'rgba(92, 112, 255, 0.1)', color: '#5c70ff', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                Mission
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#ccc' }}>
                {activeLang === 'en' && "To uplift the lives of the Antiqueños and the Filipinos, UA shall produce empowered individuals through quality instruction, innovative research and development programs, sustainable resource generation activities, and relevant extension services."}
                {activeLang === 'fil' && "Upang maiangat ang pamumuhay ng mga Antiqueño at ng mga Pilipino, ang UA ay lilikha ng mga indibidwal na may kakayahan sa pamamagitan ng dekalidad na pagtuturo, makabagong pananaliksik at mga programa sa pagpapaunlad, mga likas-kayang aktibidad sa pagbuo ng mapagkukunan, at mga kaugnay na serbisyo ng pagpapalawig."}
                {activeLang === 'kr' && "Agud mapabakod ang kabuhi kang mga Antiqueño kag Pilipino, ang UA magapabaskug kang mga indibidwal paagi sa kalidad nga edukasyon, inobatibo nga pananaliksik kag programa sa pag-uswag, masustenir nga pagpangita kang pondo, kag mga nagakabagay nga serbisyo sa komunidad."}
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
