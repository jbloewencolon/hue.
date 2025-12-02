import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, EyeOff, Clock, Mic, Eye, Smartphone, VolumeX, Volume2, Download, Trash2 } from 'lucide-react';
import { useHueContext } from '../../context/HueContext';
import useSound from '../../hooks/useSound';
import { Repository } from '../../data/repository';
import Guidebook from '../ui/Guidebook';


export const SettingsScreen = ({ onBack }) => {
  const { muted, toggleMute } = useSound();
  const { settings, updateSetting } = useHueContext();
  const [showGuide, setShowGuide] = useState(false);

  const handleClearAll = async () => { if (window.confirm('This is permanent. Clear all?')) { await Repository.clear(); alert('Cleared.'); }};
  const handleExport = async () => {
      const all = await Repository.getAll();
      const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'hue-journal-backup.json'; a.click(); URL.revokeObjectURL(url);
      alert("Your data file is on your device. If you delete entries here, that file will remain.");
  };

  const SettingToggle = ({ icon:Icon, label, value, onClick, subLabel }) => (
      <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-100 rounded-full text-stone-600"><Icon size={18} /></div>
              <div><p className="font-bold text-stone-800 text-sm">{label}</p>{subLabel && <p className="text-[10px] text-stone-400">{subLabel}</p>}</div>
          </div>
          <button onClick={onClick} className={`w-12 h-6 rounded-full p-1 transition-colors ${value ? 'bg-stone-900' : 'bg-stone-200'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${value ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
      </div>
  );

  return (
    <div className="h-full flex flex-col bg-canvas font-ink">
      <div className="p-6 border-b border-stone-200/50 flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <button onClick={onBack} className="p-3 hover:bg-stone-100 rounded-full"><ArrowLeft className="w-7 h-7 text-stone-700" /></button>
        <h2 className="font-bold text-2xl text-stone-900">{showGuide ? 'Guidebook' : 'Settings'}</h2>
        <button onClick={() => { if(SoundEngine.playClick)SoundEngine.playClick(); setShowGuide(!showGuide); }} className="p-2 hover:bg-stone-100 rounded-full text-stone-500"><HelpCircle size={28} /></button>
      </div>
      <div className="p-8 space-y-8 overflow-y-auto no-scrollbar">
        {showGuide ? (
            <Guidebook />
        ) : (
            <>
                {/* PRIVACY */}
                <section className="bg-white/80 p-6 rounded-[2rem] wet-paint shadow-sm space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Reflection Privacy</h3>
                    <SettingToggle icon={EyeOff} label="Hide Transcripts" subLabel="Blur text in journal" value={!settings.showTranscripts} onClick={() => updateSetting('showTranscripts', !settings.showTranscripts)} />
                    <SettingToggle icon={Clock} label="Auto-Delete Old Entries" subLabel="Older than 90 days" value={settings.autoDeleteDays === 90} onClick={() => updateSetting('autoDeleteDays', settings.autoDeleteDays === 90 ? null : 90)} />
                </section>

                {/* INPUT & THEME */}
                <section className="bg-white/80 p-6 rounded-[2rem] wet-paint shadow-sm space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Input & Theme</h3>
                    <SettingToggle icon={Mic} label="Voice Reflection" subLabel="Use microphone" value={settings.enableVoice} onClick={() => updateSetting('enableVoice', !settings.enableVoice)} />
                    <SettingToggle icon={Eye} label="High Contrast" value={settings.highContrast} onClick={() => updateSetting('highContrast', !settings.highContrast)} />
                    <SettingToggle icon={Smartphone} label="Reduce Motion" value={settings.reduceMotion} onClick={() => updateSetting('reduceMotion', !settings.reduceMotion)} />
                    <SettingToggle icon={muted ? VolumeX : Volume2} label="Sound Effects" value={!muted} onClick={toggleMute} />
                </section>

                {/* DATA */}
                <section className="bg-white/80 p-6 rounded-[2rem] wet-paint shadow-sm space-y-4">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Data Management</h3>
                    <button onClick={handleExport} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-stone-900 text-stone-50 text-sm font-semibold shadow-sm"><Download size={16}/> Export Data</button>
                    <button onClick={handleClearAll} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-sm font-semibold"><Trash2 size={16}/> Clear Everything</button>
                </section>

                <section className="text-center text-xs text-stone-400 pb-8"><p>Hue v3.0 (Offline Build)</p><p className="mt-1">All data stays on this device.</p></section>
            </>
        )}
      </div>
    </div>
  );
};

export default SettingsScreen