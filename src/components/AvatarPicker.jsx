// Definitions of the 8 different vector SVG avatars with unique backgrounds and features
const AVATARS = {
  "avatar-1": {
    name: "Developer Slate",
    svg: (id = "1") => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#grad-${id})`} />
        {/* Head */}
        <circle cx="50" cy="42" r="18" fill="#ffdbb5" />
        {/* Hair */}
        <path d="M30 40C30 25 40 20 50 20C60 20 70 25 70 40H66C66 32 60 28 50 28C40 28 34 32 34 40H30Z" fill="#1e1b4b" />
        {/* Glasses */}
        <rect x="36" y="38" width="10" height="8" rx="2" stroke="#1e1b4b" strokeWidth="2" fill="rgba(255,255,255,0.3)" />
        <rect x="54" y="38" width="10" height="8" rx="2" stroke="#1e1b4b" strokeWidth="2" fill="rgba(255,255,255,0.3)" />
        <line x1="46" y1="42" x2="54" y2="42" stroke="#1e1b4b" strokeWidth="2" />
        {/* Smile */}
        <path d="M46 52C46 54 48 55 50 55C52 55 54 54 54 52" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" />
        {/* Body (Shirt) */}
        <path d="M22 84C22 70 32 64 50 64C68 64 78 70 78 84V100H22V84Z" fill="#1f2937" />
        <path d="M44 64L50 72L56 64H44Z" fill="#ffdbb5" />
      </svg>
    )
  },
  "avatar-2": {
    name: "Designer Coral",
    svg: (id = "2") => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#fda4af" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#grad-${id})`} />
        {/* Head */}
        <circle cx="50" cy="44" r="17" fill="#fed7aa" />
        {/* Hair */}
        <circle cx="50" cy="32" r="10" fill="#78350f" />
        <path d="M33 44C33 32 40 27 50 27C60 27 67 32 67 44V52H33V44Z" fill="#78350f" />
        {/* Smile */}
        <path d="M47 53C47 55 48.5 56 50 56C51.5 56 53 55 53 53" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
        {/* Headphones */}
        <rect x="29" y="39" width="5" height="10" rx="2" fill="#1e293b" />
        <rect x="66" y="39" width="5" height="10" rx="2" fill="#1e293b" />
        <path d="M31 40C31 28 40 24 50 24C60 24 69 28 69 40" stroke="#1e293b" strokeWidth="2.5" fill="none" />
        {/* Body (Shirt) */}
        <path d="M24 86C24 72 34 66 50 66C66 66 76 72 76 86V100H24V86Z" fill="#ffffff" />
        <path d="M46 66L50 70L54 66H46Z" fill="#fed7aa" />
      </svg>
    )
  },
  "avatar-3": {
    name: "Analyst Forest",
    svg: (id = "3") => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#a7f3d0" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#grad-${id})`} />
        {/* Head */}
        <circle cx="50" cy="42" r="18" fill="#fcd34d" />
        {/* Hair */}
        <path d="M32 36C35 24 45 22 50 24C55 22 65 24 68 36H32Z" fill="#111827" />
        {/* Glasses */}
        <circle cx="41" cy="42" r="5" stroke="#111827" strokeWidth="1.5" />
        <circle cx="59" cy="42" r="5" stroke="#111827" strokeWidth="1.5" />
        <line x1="46" y1="42" x2="54" y2="42" stroke="#111827" strokeWidth="1.5" />
        {/* Smile */}
        <path d="M46 51C48 53 52 53 54 51" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
        {/* Body (Shirt & Tie) */}
        <path d="M22 84C22 71 32 64 50 64C68 64 78 71 78 84V100H22V84Z" fill="#374151" />
        <path d="M44 64L50 72L56 64H44Z" fill="#fcd34d" />
        {/* Tie */}
        <path d="M48 70L52 70L53 84L50 88L47 84L48 70Z" fill="#ef4444" />
      </svg>
    )
  },
  "avatar-4": {
    name: "Roboticist Amber",
    svg: (id = "4") => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#grad-${id})`} />
        {/* Head */}
        <circle cx="50" cy="44" r="17" fill="#ffdbb5" />
        {/* Hair */}
        <path d="M33 40C33 30 38 27 50 27C62 27 67 30 67 40V48H33V40Z" fill="#d97706" />
        {/* Hard Hat */}
        <path d="M30 30C35 18 65 18 70 30H30Z" fill="#f59e0b" />
        <rect x="26" y="28" width="48" height="3" rx="1.5" fill="#d97706" />
        {/* Smile */}
        <path d="M47 53C47 55 48.5 56 50 56C51.5 56 53 55 53 53" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
        {/* Body (Overalls) */}
        <path d="M24 86C24 72 34 66 50 66C66 66 76 72 76 86V100H24V86Z" fill="#1e3a8a" />
        {/* Shirt under overalls */}
        <path d="M42 66V75H58V66H42Z" fill="#f3f4f6" />
        <path d="M46 66L50 70L54 66H46Z" fill="#ffdbb5" />
      </svg>
    )
  },
  "avatar-5": {
    name: "Hacker Neon",
    svg: (id = "5") => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#afe3ef" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#grad-${id})`} />
        {/* Head */}
        <circle cx="50" cy="42" r="17" fill="#fed7aa" />
        {/* Hoodie */}
        <path d="M30 42C30 26 40 22 50 22C60 22 70 26 70 42V58H30V42Z" fill="#0f172a" />
        {/* Face opening */}
        <path d="M37 45C37 34 43 31 50 31C57 31 63 34 63 45V55H37V45Z" fill="#fed7aa" />
        {/* Eyes (Glowing) */}
        <rect x="42" y="42" width="4" height="2" fill="#06b6d4" />
        <rect x="54" y="42" width="4" height="2" fill="#06b6d4" />
        {/* Smile */}
        <path d="M47 50C48 51.5 52 51.5 53 50" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        {/* Body (Hoodie Body) */}
        <path d="M22 84C22 70 32 64 50 64C68 64 78 70 78 84V100H22V84Z" fill="#0f172a" />
        {/* Drawstrings */}
        <line x1="46" y1="64" x2="46" y2="76" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
        <line x1="54" y1="64" x2="54" y2="76" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  "avatar-6": {
    name: "Scientist Lavender",
    svg: (id = "6") => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ddd6fe" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#grad-${id})`} />
        {/* Head */}
        <circle cx="50" cy="44" r="17" fill="#ffdbb5" />
        {/* Hair */}
        <path d="M33 40C33 26 40 22 50 22C60 22 67 26 67 40V48H33V40Z" fill="#4b5563" />
        {/* Bun */}
        <circle cx="50" cy="18" r="7" fill="#4b5563" />
        {/* Goggles */}
        <rect x="34" y="38" width="32" height="8" rx="4" fill="rgba(6, 182, 212, 0.4)" stroke="#4b5563" strokeWidth="1.5" />
        <line x1="34" y1="42" x2="66" y2="42" stroke="#fff" strokeWidth="1" strokeDasharray="2" />
        {/* Smile */}
        <path d="M47 52C47 54 48.5 55 50 55C51.5 55 53 54 53 52" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" />
        {/* Body (Lab Coat) */}
        <path d="M24 86C24 72 34 66 50 66C66 66 76 72 76 86V100H24V86Z" fill="#f9fafb" />
        {/* Under shirt */}
        <path d="M44 66L50 74L56 66H44Z" fill="#ec4899" />
        <path d="M47 66L50 70L53 66H47Z" fill="#ffdbb5" />
      </svg>
    )
  },
  "avatar-7": {
    name: "Scholar Fuchsia",
    svg: (id = "7") => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#grad-${id})`} />
        {/* Head */}
        <circle cx="50" cy="45" r="17" fill="#fed7aa" />
        {/* Hair */}
        <path d="M33 45C33 30 38 25 50 25C62 25 67 30 67 45V50H33V45Z" fill="#030712" />
        {/* UA Logo */}
        <image href="/ua-logo.svg" x="30" y="10" width="40" height="40" />
        {/* Smile */}
        <path d="M47 54C47 56 48.5 57 50 57C51.5 57 53 56 53 54" stroke="#030712" strokeWidth="2" strokeLinecap="round" />
        {/* Body (Gown) */}
        <path d="M24 86C24 72 34 66 50 66C66 66 76 72 76 86V100H24V86Z" fill="#111827" />
        {/* Gold V-neck stole */}
        <path d="M42 66L50 82L58 66H52L50 78L48 66H42Z" fill="#fbbf24" />
      </svg>
    )
  },
  "avatar-8": {
    name: "Innovator Sunset",
    svg: (id = "8") => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill={`url(#grad-${id})`} />
        {/* Head */}
        <circle cx="50" cy="42" r="18" fill="#ffdbb5" />
        {/* Hair */}
        <path d="M32 40C32 25 40 22 50 22C60 22 68 25 68 40H32Z" fill="#3f3f46" />
        {/* Eyes & Smile */}
        <circle cx="43" cy="40" r="2.5" fill="#3f3f46" />
        <circle cx="57" cy="40" r="2.5" fill="#3f3f46" />
        <path d="M45 50C47 53 53 53 55 50" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round" />
        {/* Body */}
        <path d="M22 84C22 70 32 64 50 64C68 64 78 70 78 84V100H22V84Z" fill="#047857" />
        <path d="M44 64L50 72L56 64H44Z" fill="#ffdbb5" />
      </svg>
    )
  }
};

// Component to render a static SVG avatar image by ID or custom image Base64 string
export const AvatarImage = ({ avatarId, className = '', id = '', style = {} }) => {
  const isCustom = avatarId && avatarId.startsWith('data:image/');
  
  if (isCustom) {
    return (
      <img
        src={avatarId}
        alt="Profile"
        className={className}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          objectFit: 'cover',
          display: 'block',
          border: '1px solid var(--border-color)',
          ...style
        }}
      />
    );
  }

  const avatar = AVATARS[avatarId] || AVATARS["avatar-1"];
  const uniqId = id || avatarId;
  return (
    <div className={`avatar-container-svg ${className}`} style={{ width: '100%', height: '100%', display: 'flex', ...style }}>
      {avatar.svg(uniqId)}
    </div>
  );
};

// Component allowing the user to pick an avatar from the grid
export const AvatarPicker = ({ selectedId, onSelect }) => {
  return (
    <div className="form-group">
      <label className="form-label">Choose Profile Avatar</label>
      <span className="form-hint">Select a character persona representing you</span>
      <div className="avatar-grid">
        {Object.entries(AVATARS).map(([id, info]) => (
          <button
            key={id}
            type="button"
            className={`avatar-option ${selectedId === id ? 'selected' : ''}`}
            onClick={() => onSelect(id)}
            title={info.name}
            aria-label={`Select avatar ${info.name}`}
          >
            {info.svg(`picker-${id}`)}
          </button>
        ))}
      </div>
    </div>
  );
};
