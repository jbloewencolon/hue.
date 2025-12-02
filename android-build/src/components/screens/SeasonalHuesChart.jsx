import React from 'react';
import { getX } from '../../utils/helpers';

export const SeasonalHuesChart = ({ entries, timeRange, color }) => {
  const width = 300; const height = 100; const padding = 10;
  const now = new Date(); const startDate = new Date();
  if (timeRange === 'week') startDate.setDate(now.getDate() - 7);
  if (timeRange === 'month') startDate.setMonth(now.getMonth() - 1);
  if (timeRange === 'year') startDate.setFullYear(now.getFullYear() - 1);
  
  const data = (entries||[]).filter(e => new Date(e.timestamp) >= startDate).sort((a,b) => new Date(a.timestamp)-new Date(b.timestamp));
  const points = data.map(e => ({ x: getX(new Date(e.timestamp), startDate, now, width - 2 * padding) + padding, y: height - padding - ((e.vividness - 1) / 4) * (height - 2 * padding) }));
  const pathData = points.length > 1 ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') : '';

  return (
    <div className="w-full mt-4">
        {/* Added Title "Seasonal Patterns" as requested */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500">Seasonal Patterns</h4>
      </div>
      <p className="text-[10px] text-stone-400 text-center mb-2 italic">Tracking vividness over time.</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 overflow-visible">
        {[1,2,3,4,5].map(v => { const y = height-padding-((v-1)/4)*(height-2*padding); return <line key={v} x1={0} y1={y} x2={width} y2={y} stroke="#e5e5e4" strokeWidth="1" strokeDasharray="4 4" />; })}
        {points.length>1 && <path d={pathData} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
        {points.map((p,i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} stroke="white" strokeWidth="1.5" />)}
      </svg>
    </div>
  );
};

export default SeasonalHuesChart;