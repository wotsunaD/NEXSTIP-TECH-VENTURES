import React from 'react';

const Logo = ({ className = "h-8 w-auto", light = true }: { className?: string, light?: boolean }) => {
  const darkColor = light ? "#FFFFFF" : "#0F172A";
  const tealColor = "#2DD4BF";

  return (
    <svg 
      viewBox="0 0 320 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* N */}
      <path d="M20 60V20H32L48 45V20H58V60H46L30 35V60H20Z" fill={darkColor}/>
      
      {/* E */}
      <path d="M70 60V20H100V28H80V36H96V44H80V52H100V60H70Z" fill={darkColor}/>
      
      {/* X - Stylized with one solid and one outlined stroke */}
      {/* Outlined stroke (top-right to bottom-left) */}
      <path d="M145 20L115 60H125L155 20H145Z" stroke={tealColor} strokeWidth="4" fill="none"/>
      {/* Solid stroke (top-left to bottom-right) */}
      <path d="M115 20L145 60H155L125 20H115Z" fill={tealColor}/>
      
      {/* S - More rounded as in the image */}
      <path d="M165 50C165 55.5 169.5 60 175 60H185C190.5 60 195 55.5 195 50V45H186V50C186 50.6 185.6 51 185 51H175C174.4 51 174 50.6 174 50V42H195V30C195 24.5 190.5 20 185 20H175C169.5 20 165 24.5 165 30V35H174V30C174 29.4 174.4 29 175 29H185C185.6 29 186 29.4 186 30V34H165V50Z" fill={darkColor}/>
      
      {/* T */}
      <path d="M205 28V20H235V28H225V60H215V28H205Z" fill={darkColor}/>
      
      {/* i - Outlined dot and rounded stem */}
      <circle cx="250" cy="25" r="7" stroke={tealColor} strokeWidth="4" fill="none"/>
      <rect x="246" y="38" width="8" height="22" rx="4" fill={tealColor}/>
      
      {/* P */}
      <path d="M265 60V20H285C293.3 20 300 26.7 300 35C300 43.3 293.3 50 285 50H275V60H265ZM275 42H285C288.9 42 292 38.9 292 35C292 31.1 288.9 28 285 28H275V42Z" fill={darkColor}/>
    </svg>
  );
};

export default Logo;
