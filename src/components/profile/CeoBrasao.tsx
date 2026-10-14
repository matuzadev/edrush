/**
 * CeoBrasao — brasão exclusivo do CEO (email hardcoded, verificado server-side).
 * Renderizado apenas quando isCeo === true na resposta da API de perfil.
 * Sem libs externas — SVG inline + CSS animations via Tailwind arbitrary + keyframes globais.
 */

export function CeoBrasao() {
  return (
    <span
      className="ceo-brasao inline-flex items-center justify-center relative"
      title="CEO · EdRush"
      aria-label="Fundador e CEO do EdRush"
      role="img"
    >
      {/* Glow de fundo animado */}
      <span
        className="absolute inset-0 rounded-full blur-md opacity-60 ceo-glow-pulse"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, #f59e0b 0%, #d97706 50%, transparent 80%)',
        }}
      />

      {/* SVG do brasão */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 ceo-shimmer"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ceo-gold-main" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#fde68a" />
            <stop offset="30%"  stopColor="#f59e0b" />
            <stop offset="65%"  stopColor="#b45309" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="ceo-gold-shine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"  stopColor="#fef3c7" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#92400e" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="ceo-emerald-accent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"  stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="ceo-drop-shadow">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#92400e" floodOpacity="0.7" />
          </filter>
        </defs>

        {/* Escudo principal */}
        <path
          d="M14 2.5
             L23.5 6.5
             L23.5 15
             C23.5 19.8 19.5 23.5 14 25.5
             C8.5 23.5 4.5 19.8 4.5 15
             L4.5 6.5
             Z"
          fill="url(#ceo-gold-main)"
          filter="url(#ceo-drop-shadow)"
        />

        {/* Reflexo superior do escudo */}
        <path
          d="M14 2.5
             L23.5 6.5
             L23.5 12
             C23.5 12 19 11 14 11
             C9 11 4.5 12 4.5 12
             L4.5 6.5
             Z"
          fill="url(#ceo-gold-shine)"
        />

        {/* Borda interna do escudo */}
        <path
          d="M14 4.5
             L21.5 7.8
             L21.5 15
             C21.5 18.8 18.3 22 14 23.8
             C9.7 22 6.5 18.8 6.5 15
             L6.5 7.8
             Z"
          fill="none"
          stroke="#fde68a"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />

        {/* Coroa no centro */}
        <g transform="translate(7.5, 7)">
          {/* Base da coroa */}
          <rect x="1" y="7.5" width="12" height="3" rx="1" fill="url(#ceo-emerald-accent)" />
          {/* Dentes da coroa */}
          <polygon points="1,7.5 2.5,3.5 4,7.5"   fill="url(#ceo-emerald-accent)" />
          <polygon points="5,7.5 6.5,1.5 8,7.5"   fill="url(#ceo-emerald-accent)" />
          <polygon points="9,7.5 10.5,3.5 12,7.5" fill="url(#ceo-emerald-accent)" />
          {/* Brilho da coroa */}
          <rect x="1" y="7.5" width="12" height="1" rx="0.5" fill="white" fillOpacity="0.25" />
          {/* Gemas na coroa */}
          <circle cx="2.5"  cy="6.5" r="1" fill="#fde68a" />
          <circle cx="6.5"  cy="4.5" r="1.2" fill="#fef3c7" />
          <circle cx="10.5" cy="6.5" r="1" fill="#fde68a" />
        </g>

        {/* Estrela de 4 pontas no topo do escudo */}
        <path
          d="M14 3.5 L14.4 5.1 L16 5.1 L14.7 6 L15.2 7.6 L14 6.7 L12.8 7.6 L13.3 6 L12 5.1 L13.6 5.1 Z"
          fill="#fef3c7"
          fillOpacity="0.9"
        />
      </svg>

      <style>{`
        @keyframes ceo-glow {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50%       { opacity: 0.75; transform: scale(1.15); }
        }
        @keyframes ceo-shimmer {
          0%   { filter: brightness(1) drop-shadow(0 0 2px #f59e0b88); }
          50%  { filter: brightness(1.18) drop-shadow(0 0 5px #fde68aaa); }
          100% { filter: brightness(1) drop-shadow(0 0 2px #f59e0b88); }
        }
        .ceo-glow-pulse {
          animation: ceo-glow 2.8s ease-in-out infinite;
        }
        .ceo-shimmer {
          animation: ceo-shimmer 2.8s ease-in-out infinite;
        }
        .ceo-brasao:hover .ceo-shimmer {
          filter: brightness(1.3) drop-shadow(0 0 8px #fde68acc) !important;
          animation-play-state: paused;
        }
      `}</style>
    </span>
  );
}
