import React from 'react';

const Logo = ({ className = "h-8 w-auto" }: { className?: string }) => {
  return (
    <img 
      src="/logo.png" 
      alt="NEXSTIP Logo" 
      className={className}
      referrerPolicy="no-referrer"
    />
  );
};

export default Logo;
