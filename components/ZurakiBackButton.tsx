
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ZurakiBackButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  variant?: 'circular' | 'rounded';
}

export const ZurakiBackButton: React.FC<ZurakiBackButtonProps> = ({ 
  onClick, 
  label, 
  className = '', 
  disabled = false,
  variant = 'circular'
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      disabled={disabled}
      aria-label={label ? `Back — ${label}` : 'Go Back'}
      title="Go back"
      className={`
        group relative flex items-center justify-center gap-2 
        transition-all duration-200 active:scale-90
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
        ${variant === 'circular' ? 'w-11 h-11 rounded-full' : 'px-4 py-2 rounded-xl'}
        bg-white/5 border border-cyber-cyan/30 backdrop-blur-md
        hover:border-cyber-cyan hover:bg-cyber-cyan/10 
        hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]
        active:shadow-[0_0_20px_rgba(0,243,255,0.5)]
        ${className}
      `}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-cyber-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <ArrowLeft 
        size={20} 
        className="text-white group-hover:text-cyber-cyan group-hover:drop-shadow-[0_0_5px_#00f3ff] transition-all" 
      />
      
      {label && (
        <span className="hidden md:block text-xs font-bold uppercase tracking-widest text-white group-hover:text-cyber-cyan transition-colors">
          {label}
        </span>
      )}
    </button>
  );
};
