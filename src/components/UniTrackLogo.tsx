import React from 'react';

interface UniTrackLogoProps {
  className?: string;
  size?: number;
}

export const UniTrackLogo: React.FC<UniTrackLogoProps> = ({
  className = '',
  size = 40,
}) => {
  return (
    <div
      className={`group relative flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-md transition-transform duration-200 hover:scale-105 ${className}`}
      style={{
        width: size,
        height: size,
        background: 'var(--theme-gradient)',
        boxShadow: '0 4px 14px 0 var(--theme-glow)',
      }}
    >
      {/* Ambient glass glare highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/35 pointer-events-none" />

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[78%] h-[78%] drop-shadow-xs"
      >
        {/* Calendar Base Plate */}
        <rect
          x="14"
          y="24"
          width="72"
          height="62"
          rx="14"
          fill="#ffffff"
          fillOpacity="0.95"
        />

        {/* Top Header Accent Banner */}
        <path
          d="M14 36C14 29.3726 19.3726 24 26 24H74C80.6274 24 86 29.3726 86 36V42H14V36Z"
          fill="currentColor"
          className="text-slate-900/15"
        />

        {/* Calendar Spiral Rings / Pegs */}
        <rect x="28" y="14" width="7" height="18" rx="3.5" fill="#ffffff" />
        <rect x="65" y="14" width="7" height="18" rx="3.5" fill="#ffffff" />
        <circle cx="31.5" cy="23" r="1.5" fill="currentColor" className="text-slate-400" />
        <circle cx="68.5" cy="23" r="1.5" fill="currentColor" className="text-slate-400" />

        {/* Graduation Cap in Center */}
        <path
          d="M50 44L76 54L50 64L24 54L50 44Z"
          fill="currentColor"
          className="text-slate-900"
        />
        <path
          d="M50 64L70 56.5V66C70 71.5 50 77 50 77C50 77 30 71.5 30 66V56.5L50 64Z"
          fill="currentColor"
          className="text-slate-800"
        />

        {/* Tassel & Ribbon */}
        <path
          d="M76 54V67"
          stroke="#f59e0b"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="76" cy="68.5" r="3" fill="#f59e0b" />

        {/* Orbital Activity Dots (Odd/Even Week Pulse) */}
        <circle cx="28" cy="74" r="3" fill="#10b981" />
        <circle cx="38" cy="74" r="3" fill="#6366f1" />
        <circle cx="48" cy="74" r="3" fill="#f59e0b" />
      </svg>
    </div>
  );
};
