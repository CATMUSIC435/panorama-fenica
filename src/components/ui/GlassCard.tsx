import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  noHover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = React.memo(({ children, className = '', noHover = false }) => {
  return (
    <div className={`glass-card ${!noHover ? 'glass-card-hover' : ''} p-6 rounded-3xl relative overflow-hidden group ${className}`}>
      {!noHover && (
        <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 transition-all duration-500 blur-xl"></div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});
