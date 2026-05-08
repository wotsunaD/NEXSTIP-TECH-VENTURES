import React, { useState } from 'react';

const Logo = ({ className = "h-8 w-auto" }: { className?: string }) => {
  const [error, setError] = useState(false);

  if (!error) {
    return (
      <img 
        src="/logo.png" 
        alt="NEXSTIP Logo" 
        className={className}
        onError={() => setError(true)}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Fallback SVG if image fails to load
  return (
    <svg 
      viewBox="0 0 320 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path d="M20 60V20H32L48 45V20H58V60H46L30 35V60H20Z" fill="currentColor" className="text-emerald-400"/>
      <path d="M70 60V20H100V28H80V36H96V44H80V52H100V60H70Z" fill="currentColor" className="text-emerald-400"/>
      <path d="M115 20L145 60H155L125 20H115Z" fill="#2DD4BF"/>
      <path d="M145 20L115 60H125L155 20H145Z" stroke="#2DD4BF" strokeWidth="4" fill="none"/>
      <path d="M165 50C165 55.5 169.5 60 175 60H185C190.5 60 195 55.5 195 50V45H186V50C186 50.6 185.6 51 185 51H175C174.4 51 174 50.6 174 50V42H195V30C195 24.5 190.5 20 185 20H175C169.5 20 165 24.5 165 30V35H174V30C174 29.4 174.4 29 175 29H185C185.6 29 186 29.4 186 30V34H165V50Z" fill="currentColor" className="text-emerald-400"/>
      <path d="M205 28V20H235V28H225V60H215V28H205Z" fill="currentColor" className="text-emerald-400"/>
      <circle cx="250" cy="25" r="7" stroke="#2DD4BF" strokeWidth="4" fill="none"/>
      <rect x="246" y="38" width="8" height="22" rx="4" fill="#2DD4BF"/>
      <path d="M265 60V20H285C293.3 20 300 26.7 300 35C300 43.3 293.3 50 285 50H275V60H265ZM275 42H285C288.9 42 292 38.9 292 35C292 31.1 288.9 28 285 28H275V42Z" fill="currentColor" className="text-emerald-400"/>
    </svg>
  );
};

export default Logo;
