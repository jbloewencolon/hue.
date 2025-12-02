import React, { useState, useRef, useCallback } from 'react';
import { Activity, BookOpen, Settings as SettingsIcon } from 'lucide-react';
import { useHueContext } from '../../context/HueContext';
import { SoundEngine } from '../../utils/SoundEngine';
import BackgroundGarden from '../ui/BackgroundGarden';
import PrimaryButton from '../ui/PrimaryButton';

// --- HOME SCREEN (with hold-to-tune functionality) ---
const HOLD_DURATION_MS = 2500;
export const HomeScreen = ({ onAnalyzeComplete, onMenu }) => {
  const { settings } = useHueContext();
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const reqRef = useRef(null);
  const startTimeRef = useRef(0);

  const startHold = useCallback((e) => {
    if (e.type === 'touchstart') e.preventDefault();
    if (isHolding) return;
    setIsHolding(true); setIsPressed(true);
    if (navigator.vibrate) navigator.vibrate(10);
    SoundEngine.resumeContext(); SoundEngine.startCharge();
    startTimeRef.current = performance.now();

    const animate = (now) => {
      const elapsed = now - startTimeRef.current;
      const ratio = Math.min(1, elapsed / HOLD_DURATION_MS);
      const percent = ratio * 100;
      setProgress(percent);
      SoundEngine.updateCharge(percent);
      if (ratio >= 1) {
        setIsHolding(false); setIsPressed(false);
        SoundEngine.stopCharge();
        if (reqRef.current) cancelAnimationFrame(reqRef.current);
        onAnalyzeComplete();
        return;
      }
      reqRef.current = requestAnimationFrame(animate);
    };
    reqRef.current = requestAnimationFrame(animate);
  }, [isHolding, onAnalyzeComplete]);

  const stopHold = useCallback(() => {
    if (!isHolding) return;
    setIsHolding(false); setIsPressed(false);
    SoundEngine.stopCharge();
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    setProgress(0);
  }, [isHolding]);

  const radius = 130; const stroke = 24; const normRad = radius - stroke * 0.5; const circum = normRad * 2 * Math.PI;
  const strokeDashoffset = circum - (progress / 100) * circum;

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-canvas select-none font-sans-clean">
      <BackgroundGarden isActive={isHolding} showIcons={true} />
      {/* Halo Effect */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full bg-stone-300/30 blur-2xl transition-all duration-1000 ease-in-out pointer-events-none ${isPressed ? 'scale-125 opacity-60' : 'scale-75 opacity-0'}`} />
      
      <div className="relative z-50 flex flex-col h-full">
        <header className="px-8 pt-10 pb-4">
          <h1 className="font-ink text-7xl font-bold tracking-tighter text-stone-900 leading-none">Hue.</h1>
          <p className="text-xs text-stone-500 uppercase tracking-[0.25em] font-bold mt-2 ml-1">Resonance Analyzer</p>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-8">
          <div className="relative cursor-pointer touch-none" onMouseDown={startHold} onMouseUp={stopHold} onMouseLeave={stopHold} onTouchStart={startHold} onTouchEnd={stopHold}>
            <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] -rotate-90 pointer-events-none drop-shadow-xl" viewBox="0 0 320 320">
              <defs>
                <linearGradient id="hueRing" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" /><stop offset="50%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              <circle cx="160" cy="160" r={normRad} stroke="#e5e5e4" strokeWidth={stroke} fill="none" opacity="0.6" />
              {/* SMOOTH RING: Removed CSS transition for strokeDashoffset */}
              <circle cx="160" cy="160" r={normRad} stroke="url(#hueRing)" strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${circum} ${circum}`} style={{ strokeDashoffset }} />
            </svg>
            {/* TACTILE SHRINK: Scale 0.75 */}
            <div className={`w-[220px] h-[220px] rounded-full bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 shadow-2xl flex flex-col items-center justify-center gap-2 border-4 border-white/80 wet-paint ${isPressed && !settings.reduceMotion ? 'animate-squish-breathe' : ''}`} style={{ transform: isPressed ? 'scale(0.75)' : 'scale(1)', transition: 'transform 0.6s cubic-bezier(0.25, 1.5, 0.5, 1)' }}>
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-bold">Hold</span>
              <p className="text-2xl font-ink font-bold text-stone-800">Tune In</p>
            </div>
          </div>
        </main>

        <footer className="px-6 pb-8 pt-3">
          <div className="grid grid-cols-3 gap-3"> {/* Updated to 3 columns, removed Journal */}
            {[ {id: 'spectrum', icon: Activity, label: 'Spectrum'}, {id: 'explore', icon: BookOpen, label: 'Library'}, {id: 'settings', icon: SettingsIcon, label: 'Settings'} ].map(btn => (
                <PrimaryButton key={btn.id} variant="secondary" onClick={() => onMenu && onMenu(btn.id)} className="px-2 flex-col gap-2 h-24">
                  <btn.icon className="w-7 h-7 text-stone-500" />
                  <span className="text-stone-700 text-[10px] uppercase font-extrabold tracking-[0.15em]">{btn.label}</span>
                </PrimaryButton>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomeScreen;