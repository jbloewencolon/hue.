import React, { useState, useEffect } from 'react';
import { ArrowLeft, HelpCircle, Info, Zap, Globe, Activity, Sprout, Heart, Briefcase, Lightbulb, Home, Flame, Anchor, CloudRain, Sparkles, Sun, Edit2, Trash2 } from 'lucide-react';
import { Repository } from '../../data/repository';
import { SoundEngine } from '../../utils/SoundEngine';
import { COLOR_DOMAINS } from '../../data/hues';
import Guidebook from '../ui/Guidebook';


export const LibraryScreen = ({ onBack }) => {
  const [selectedHue, setSelectedHue] = useState(null);
  const [entries, setEntries] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  
  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => { Repository.getAll().then((all) => setEntries(all)); }, []);

  const handleSelectHue = (hue, index) => { setSelectedHue(hue); SoundEngine.playHueTap(index); };
  const entriesForSelected = selectedHue && entries ? entries.filter((e) => e.colorId === selectedHue.id).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) : [];

  const startEdit = (entry) => {
      setEditingId(entry.id);
      setEditText(entry.transcript || '');
  };

  const saveEdit = async () => {
      if (editingId) {
          await Repository.update(editingId, editText);
          setEntries(await Repository.getAll());
          setEditingId(null);
          setEditText('');
      }
  };

  const cancelEdit = () => {
      setEditingId(null);
      setEditText('');
  };

  return (
    <div className="h-full flex flex-col bg-canvas font-ink">
      <div className="p-6 border-b border-stone-200/50 flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <button onClick={() => { if(showGuide)setShowGuide(false); else if(selectedHue)setSelectedHue(null); else onBack(); }} className="p-3 hover:bg-stone-100 rounded-full"><ArrowLeft className="w-7 h-7 text-stone-700" /></button>
        <h2 className="font-bold text-2xl text-stone-900">{showGuide ? 'Guidebook' : (selectedHue ? selectedHue.name : 'Hue Library')}</h2>
        {/* Increased Guidebook Icon Size */}
        <button onClick={() => { if(SoundEngine.playClick)SoundEngine.playClick(); setShowGuide(!showGuide); }} className="p-2 hover:bg-stone-100 rounded-full text-stone-500"><HelpCircle size={28} /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        {showGuide ? (
            <Guidebook />
        ) : !selectedHue ? (
          <div className="grid grid-cols-2 gap-4">
            {COLOR_DOMAINS.map((domain, index) => {
              const Icon = ICON_MAP[domain.id] || Zap;
              return (
                <button key={domain.id} onClick={() => handleSelectHue(domain, index)} className="relative overflow-hidden rounded-[2rem] bg-white/80 wet-paint p-5 text-left shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[120px]">
                  <div className="absolute inset-0 opacity-70" style={{ background: `linear-gradient(135deg, ${domain.colors[0]}, ${domain.colors[1]})` }} />
                  <div className={`relative z-10 ${domain.textColor} opacity-90`}>
                    <div className="mb-3"><Icon size={28} /></div>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-80">{domain.id}</p>
                    <p className="mt-1 text-xl font-bold font-ink">{domain.name}</p>
                  </div>
                  {/* Removed Description from List View as requested */}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white/90 wet-paint rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden text-center">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `linear-gradient(135deg, ${selectedHue.colors[0]}, ${selectedHue.colors[1]})` }}></div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-stone-800">{selectedHue.name}</h3>
                    <p className="text-sm text-stone-600 mt-2 italic">"{selectedHue.description}"</p>
                </div>
            </div>
            
            {selectedHue.questions?.length > 0 && (
                <div className="bg-white/80 wet-paint rounded-[2.5rem] p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 justify-center">
                        <Info className="w-4 h-4 text-stone-400" />
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Prompts to consider</p>
                    </div>
                    <ul className="space-y-3 text-sm text-stone-700">
                        {selectedHue.questions.slice(0, 3).map((q, idx) => (
                            <li key={idx} className="flex gap-3 items-start">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: selectedHue.accent }} />
                                <span className="leading-snug">{q}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="bg-white/80 wet-paint rounded-[2.5rem] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3"><p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-stone-400">Past entries</p><p className="text-[11px] text-stone-400">{entriesForSelected.length} saved</p></div>
                {entriesForSelected.length === 0 && <p className="text-sm text-stone-500 text-center py-4">No entries yet.</p>}
                <div className="space-y-3">{entriesForSelected.map((entry) => (
                    <div key={entry.id} className="rounded-2xl border border-stone-100 bg-stone-50/80 px-4 py-3">
                        <div className="flex items-center justify-between gap-3 mb-2">
                            <p className="text-xs text-stone-500">{new Date(entry.timestamp).toLocaleString()}</p>
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-600">
                                <span>V</span><span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-900 text-stone-50">{entry.vividness}</span>
                            </div>
                        </div>
                        
                        {editingId === entry.id ? (
                            <div className="flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-200">
                                <textarea 
                                    className="w-full p-2 text-sm bg-white border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-400 outline-none resize-none"
                                    rows={3}
                                    value={editText} 
                                    onChange={(e) => setEditText(e.target.value)} 
                                />
                                <div className="flex gap-2 justify-end">
                                    <button onClick={cancelEdit} className="px-3 py-1 text-xs rounded-full bg-stone-100 text-stone-500">Cancel</button>
                                    <button onClick={saveEdit} className="px-3 py-1 text-xs rounded-full bg-stone-900 text-white">Save</button>
                                </div>
                            </div>
                        ) : (
                            <div className="group">
                                {entry.transcript && <p className="text-sm text-stone-700 line-clamp-3 mb-2">{entry.transcript}</p>}
                                <div className="flex justify-between items-end mt-3 pt-3 border-t border-stone-100">
                                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Actions</span>
                                    <div className="flex gap-4">
                                        <button onClick={() => startEdit(entry)} className="p-2 text-stone-400 hover:text-stone-600 rounded-full bg-stone-50 transition-colors"><Edit2 size={18} /></button>
                                        <button onClick={async () => { if(window.confirm('Delete?')) { await Repository.delete(entry.id); setEntries(await Repository.getAll()); }}} className="p-2 text-rose-300 hover:text-rose-500 rounded-full bg-stone-50 transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryScreen