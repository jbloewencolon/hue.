import React from 'react';
import { SoundEngine } from '../../utils/SoundEngine';

export const PrimaryButton = ({ onClick, children, className = '', variant = 'primary', disabled = false, style={} }) => {
  const base = 'px-8 py-5 rounded-[2rem] font-ink font-bold text-sm tracking-wide flex items-center justify-center gap-3 transition-all duration-150 active:scale-95 disabled:opacity-50';
  const variants = {
    primary: 'bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg',
    secondary: 'bg-white/70 backdrop-blur-md text-stone-900 hover:bg-white/90 shadow-sm wet-paint',
  };
  return (
    <button type="button" onClick={(e) => { if (SoundEngine.playClick) SoundEngine.playClick(); if(onClick) onClick(e); }} disabled={disabled} className={`${base} ${variants[variant] || ''} ${className}`} style={style}>
      {children}
    </button>
  );
};

export default PrimaryButton;