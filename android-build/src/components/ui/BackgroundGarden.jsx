import React from 'react';
// I added 'Users' to this top list. Now the app loads it first thing!
import { Zap, Globe, Activity, Sprout, Heart, Briefcase, Lightbulb, Home, Flame, Anchor, CloudRain, Sparkles, Sun, Users } from 'lucide-react';
import { useHueContext } from '../../context/HueContext';
import { COLOR_DOMAINS } from '../../data/hues';

// Now this map will work because Users is defined at the top
const ICON_MAP = { purple: Globe, blue: Activity, green: Sprout, jasmine: Sun, red: Heart, orange: Briefcase, white: Sparkles, black: Lightbulb, teal: Users, pink: Flame, brown: Anchor, gray: CloudRain };

const BackgroundGarden = ({ isActive, showIcons = false }) => {
  const { settings } = useHueContext();
  if (settings.reduceMotion) return null;

  return (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
    <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-30' : 'opacity-0'}`} style={{ background: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)', backgroundSize: '400% 400%', filter: 'blur(40px)' }} />
    {[...Array(6)].map((_, i) => (
       <div key={i} className="absolute bg-stone-500/20 rounded-full blur-[1px]" style={{ width: Math.random() * 6 + 3 + 'px', height: Math.random() * 6 + 3 + 'px', left: Math.random() * 100 + '%', top: Math.random() * 100 + '%', animation: `floatPath ${(Math.random() * 10 + 10)}s ease-in-out infinite` }} />
    ))}
    {showIcons && COLOR_DOMAINS.map((d, i) => {
        const Icon = ICON_MAP[d.id] || Zap;
        return <div key={d.id} className="absolute" style={{ top: `${(i * 17 + 5) % 85}%`, left: `${(i * 37 + 10) % 85}%`, color: d.colors[1], opacity: 0.6, animation: isActive ? `floatPath ${20 + i}s ease-in-out -${i * 2}s infinite` : `floatPath ${20 + i}s ease-in-out -${i * 2}s infinite` }}><Icon size={32 + (i%3)*12} /></div>;
    })}
  </div>
)};

export default BackgroundGarden;