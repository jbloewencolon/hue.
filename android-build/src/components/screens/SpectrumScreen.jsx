import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, HelpCircle } from 'lucide-react';
import { Repository } from '../../data/repository';
import { COLOR_DOMAINS } from '../../data/hues';
import { SoundEngine } from '../../utils/SoundEngine';
import Guidebook from '../ui/Guidebook';
import SeasonalHuesChart from './SeasonalHuesChart';

const polarToCartesian = (cx, cy, r, angleDeg) => { const rad = ((angleDeg - 90) * Math.PI) / 180.0; return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }; };
const describeSector = (cx, cy, r, startAngle, endAngle) => { const start = polarToCartesian(cx, cy, r, startAngle); const end = polarToCartesian(cx, cy, r, endAngle); const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'; return ['M', cx, cy, 'L', start.x, start.y, 'A', r, r, 0, largeArcFlag, 1, end.x, end.y, 'Z'].join(' '); };

export const SpectrumScreen = ({ onBack }) => {
  const [entries, setEntries] = useState([]);
  const [selectedHueId, setSelectedHueId] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => { Repository.getAll().then(setEntries); }, []);

  const domainStats = COLOR_DOMAINS.map((domain) => {
    const subset = entries.filter((e) => e.colorId === domain.id);
    const count = subset.length;
    return { domain, count, avgVividness: count === 0 ? 0 : subset.reduce((sum, e) => sum + (e.vividness || 0), 0) / count };
  });

  const anglePer = 360 / Math.max(domainStats.length, 1);
  const center = 160; const maxRadius = 140;
  const selectedDomain = selectedHueId ? COLOR_DOMAINS.find((d) => d.id === selectedHueId) : null;

  return (
    <div className="h-full flex flex-col bg-canvas font-ink">
      <div className="p-6 border-b border-stone-200/50 flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <button onClick={() => { if(showGuide)setShowGuide(false); else onBack(); }} className="p-3 hover:bg-stone-100 rounded-full"><ArrowLeft className="w-7 h-7 text-stone-700" /></button>
        <h2 className="font-bold text-2xl text-stone-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500" /> {showGuide ? 'Guidebook' : 'Spectrum'}</h2>
        {/* Increased Guidebook Icon Size */}
        <button onClick={() => { if(SoundEngine.playClick)SoundEngine.playClick(); setShowGuide(!showGuide); }} className="p-2 hover:bg-stone-100 rounded-full text-stone-500"><HelpCircle size={28} /></button>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {showGuide ? (
            <Guidebook />
        ) : (
            <>
                <section className="bg-white/80 wet-paint rounded-[2.5rem] p-5 shadow-sm flex flex-col items-center">
                <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-400 mb-3">Holistic View</p>
                <svg viewBox="0 0 320 320" className="w-full max-w-xs drop-shadow-sm">
                    {[1,2,3,4,5].map(level => <circle key={level} cx={center} cy={center} r={60+(level/5)*(maxRadius-60)} fill="none" stroke="#e5e5e4" strokeWidth="1" strokeDasharray="4 4"/>)}
                    <circle cx={center} cy={center} r={60} fill="#f5f5f4" stroke="#e7e5e4" strokeWidth={2} />
                    <defs>{COLOR_DOMAINS.map((d) => (<linearGradient key={d.id} id={`grad-${d.id}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={d.colors[0]} /><stop offset="100%" stopColor={d.colors[1]} /></linearGradient>))}</defs>
                    {domainStats.map(({ domain, avgVividness, count }, index) => {
                    const startAngle = index * anglePer;
                    const pathD = describeSector(center, center, 60 + (avgVividness / 5) * (maxRadius - 60), startAngle, startAngle + anglePer * 0.9);
                    return count > 0 ? <path key={domain.id} d={pathD} fill={`url(#grad-${domain.id})`} opacity={selectedHueId && selectedHueId !== domain.id ? 0.35 : 0.95} onClick={() => setSelectedHueId(prev => prev === domain.id ? null : domain.id)} className="cursor-pointer transition-opacity" /> : null;
                    })}
                </svg>
                </section>
                {selectedDomain && (
                <section className="bg-white/90 wet-paint rounded-[2.5rem] p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between gap-3 mb-1">
                        <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-2xl border border-white/70 shadow-inner" style={{ background: `linear-gradient(135deg, ${selectedDomain.colors[0]}, ${selectedDomain.colors[1]})` }} /><div><p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-400">Trend</p><p className="text-base font-semibold text-stone-900">{selectedDomain.name}</p></div></div>
                        <div className="flex bg-stone-100 rounded-full p-1">{['week', 'month', 'year'].map(t => (<button key={t} onClick={() => { if(SoundEngine.playClick)SoundEngine.playClick(); setTimeRange(t); }} className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold transition-colors ${timeRange === t ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400'}`}>{t.charAt(0)}</button>))}</div>
                    </div>
                    <SeasonalHuesChart entries={entries.filter(e => e.colorId === selectedDomain.id)} timeRange={timeRange} color={selectedDomain.accent} />
                </section>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default SpectrumScreen