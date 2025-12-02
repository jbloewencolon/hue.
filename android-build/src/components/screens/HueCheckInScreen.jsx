import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCcw, AlignLeft, Mic, Check, LogOut } from 'lucide-react';
import { useHueContext } from '../../context/HueContext';
import { useTranscription } from '../../hooks/useTranscription';
import { SoundEngine } from '../../utils/SoundEngine';
import { uuidv4, getTimeOfDay } from '../../utils/helpers';
import { Repository } from '../../data/repository';
import { Zap, Globe, Activity, Sprout, Heart, Briefcase, Lightbulb, Home, Flame, Anchor, CloudRain, Sparkles, Sun } from 'lucide-react'; // Need ICON_MAP icons here too or move ICON_MAP to utils

const ICON_MAP = { purple: Globe, blue: Activity, green: Sprout, jasmine: Sun, red: Heart, orange: Briefcase, white: Sparkles, black: Lightbulb, teal: Users, pink: Flame, brown: Anchor, gray: CloudRain };

export const HueCheckInScreen = ({ colorDomain, onSave, onCancel }) => {
  const { settings } = useHueContext();
  const [step, setStep] = useState('recording'); 
  const [vividness, setVividness] = useState(3);
  const [saving, setSaving] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');
  const [question, setQuestion] = useState('');
  const { isRecording, transcript, setTranscript, startRecording, stopRecording, clearTranscript } = useTranscription();
  
  useEffect(() => { if (colorDomain?.questions?.length) setQuestion(colorDomain.questions[0]); }, [colorDomain]);

  if (!colorDomain) return null;
  const Icon = ICON_MAP[colorDomain.id] || Zap;

  const handleSave = async () => {
    setSaving(true);
    const entry = { id: uuidv4(), timestamp: new Date().toISOString(), timeOfDay: getTimeOfDay(), colorId: colorDomain.id, domainName: colorDomain.name, vividness, mood: vividness * 20, transcript: transcript.trim() };
    await Repository.save(entry);
    SoundEngine.playChord();
    
    // Check-in response logic
    let msg = 'Hue noted. Thank you for listening inward.';
    if (colorDomain.responses && colorDomain.responses[vividness]) {
        msg = colorDomain.responses[vividness];
    } else {
        if (vividness >= 4) msg = `Your ${colorDomain.name} is vivid today. You deserve tenderness with this.`;
        else if (vividness <= 2) msg = `Your ${colorDomain.name} feels soft. A gentle presence.`;
    }

    setCompletionMessage(msg);
    setStep('saved');
    setSaving(false);
  };

  return (
    <div className="h-full flex flex-col bg-canvas transition-colors duration-500 font-sans-clean">
      
      {/* Hide Header in Saved Step */}
      {step !== 'saved' && (
        <div className="relative pt-12 pb-16 px-6 flex flex-col justify-between shrink-0 z-50 animate-slide-up" style={{ 
            background: `linear-gradient(to bottom, ${colorDomain.colors[0]}, ${colorDomain.colors[1]} 50%, rgba(255,255,255,0) 100%)`,
            maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' // Soft dissolve at bottom
        }}>
            <div className="flex items-center justify-between mb-4">
                <button onClick={onCancel} className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30"><ArrowLeft className="w-6 h-6" /></button>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/10 border border-white/10 text-white/90">
                    <Icon className="w-6 h-6" /> 
                    {/* SWAP: Icon shows ID (Color Name) */}
                    <span className="text-sm font-bold uppercase tracking-widest capitalize">{colorDomain.id}</span>
                </div>
                <div className="w-10" />
            </div>
            <div className={`${colorDomain.textColor} ${colorDomain.id === 'black' ? 'text-white' : ''}`}>
                {/* SWAP: Title shows Name (Topic) */}
                <h2 className="text-4xl sm:text-5xl font-ink font-bold leading-tight mb-2">How is your {colorDomain.name} today?</h2> 
                <p className="text-sm opacity-90 leading-relaxed max-w-sm">{colorDomain.description}</p>
            </div>
        </div>
      )}

      <div className={`flex-1 bg-canvas ${step === 'saved' ? 'mt-0' : '-mt-6 rounded-t-[2.5rem]'} relative z-10 flex flex-col overflow-hidden shadow-xl transition-all duration-500 animate-slide-up`} style={{ animationDelay: '0.1s' }}>
        {step === 'recording' && (
            <div className="flex-1 flex flex-col p-6 gap-6"> 
                <div className="bg-white p-6 rounded-[2rem] border border-stone-100/50 shadow-sm flex flex-col gap-4">
                    <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Prompt</p>
                    <p className="text-2xl font-ink text-stone-800 leading-snug">"{question}"</p>
                    <button onClick={() => setQuestion(colorDomain.questions[Math.floor(Math.random()*colorDomain.questions.length)])} className="self-start flex items-center gap-2 text-xs font-bold text-stone-500 bg-stone-50 px-4 py-2 rounded-full hover:bg-stone-100 transition-colors"><RefreshCcw className="w-3 h-3" /> New Question</button>
                </div>
                <div className="flex-1 bg-white/60 wet-paint rounded-[2rem] p-6 shadow-inner flex flex-col relative focus-within:ring-2 ring-stone-200/50 transition-all">
                    <div className="flex items-center justify-between mb-4"><span className="text-xs font-bold text-stone-400 uppercase flex items-center gap-2"><AlignLeft className="w-4 h-4"/> Note</span>{transcript && <button onClick={clearTranscript} className="text-xs text-stone-400 hover:text-stone-600">Clear</button>}</div>
                    <textarea className="flex-1 bg-transparent border-none resize-none outline-none text-base font-medium leading-relaxed italic text-stone-700 placeholder:text-stone-300" placeholder="Type your thoughts..." value={transcript} onChange={(e) => setTranscript(e.target.value)} />
                </div>
                <div className="mt-auto flex items-center gap-6">
                    {/* Voice Toggle: Only show if enabled in settings */}
                    {settings.enableVoice && (
                        <button onClick={isRecording ? stopRecording : startRecording} className={`h-16 w-16 rounded-full flex items-center justify-center shadow-lg transition-all bg-white/80 ${isRecording ? 'text-rose-500 animate-pulse' : 'text-stone-900'} ${!settings.enableVoice ? 'hidden' : ''}`}>
                      <Mic className="w-6 h-6" />
                    </button>
                    )}
                    {/* Opacity 90% on action buttons */}
                    <button onClick={() => { stopRecording(); setStep('vividness'); }} className="flex-1 h-16 rounded-2xl text-white font-bold text-base uppercase tracking-wider shadow-lg hover:brightness-110 hover:scale-[1.02] transition-all active:scale-95 opacity-90" style={{ backgroundColor: colorDomain.accent }}>Measure Hue</button>
                </div>
            </div>
        )}
        {step === 'vividness' && (
            <div className="flex-1 flex flex-col p-8 gap-8 relative overflow-hidden">
                {/* Reversed Gradient: Transparent Top -> Dark Bottom */}
                <div className="absolute inset-0 pointer-events-none" style={{ 
                    background: `linear-gradient(to bottom, transparent 0%, ${colorDomain.colors[1]} 100%)`, 
                    opacity: 0.1 + (vividness * 0.15) 
                }} />
                
                <div className="text-center relative z-10 mt-4"><h3 className="text-3xl font-ink font-bold text-stone-800">How strong is this hue?</h3></div>
                
                <div className="flex-1 flex flex-col justify-center relative z-10 px-4">
                    <div className="relative h-3 bg-stone-200/50 rounded-full mb-16"> 
                        <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-300" style={{ width: `${(vividness - 1) * 25}%`, background: colorDomain.accent }} />
                        <input type="range" min={1} max={5} value={vividness} onChange={(e) => { const v = Number(e.target.value); if(v!==vividness){SoundEngine.playTick(v); if(navigator.vibrate)navigator.vibrate(5);} setVividness(v); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                        <div className="absolute top-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl border-4 flex items-center justify-center transition-all duration-300 pointer-events-none z-10" style={{ left: `calc(${(vividness - 1) * 25}% - 32px)`, borderColor: colorDomain.accent }}>
                            {/* Number removed, just a clean indicator */}
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colorDomain.accent }} />
                        </div>
                    </div>
                    {/* Scale Info Labels */}
                    <div className="flex justify-between text-sm font-bold text-stone-500 uppercase tracking-widest px-1"><span>Faint</span><span>Vivid</span></div>
                </div>
                <div className="mt-auto flex items-center gap-6 relative z-20">
                    <button onClick={() => setStep('recording')} className="h-16 w-16 rounded-full bg-white/80 text-stone-500 shadow-lg flex items-center justify-center hover:bg-stone-50 active:scale-95 transition-all">
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    {/* Opacity 90% on action buttons */}
                    <button onClick={handleSave} disabled={saving} className="flex-1 h-16 rounded-2xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-95 opacity-90" style={{ background: colorDomain.accent }}>
                      {saving ? "Saving..." : <><Check className="w-6 h-6"/> Save Entry</>}
                    </button>
                </div>
            </div>
        )}
        {step === 'saved' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
                <div className="w-40 h-40 rounded-full flex items-center justify-center shadow-2xl mb-10 relative animate-breathe" style={{ background: `linear-gradient(135deg, ${colorDomain.colors[0]}, ${colorDomain.colors[1]})` }}><Icon size={80} className="text-white drop-shadow-md" /></div>
                <h2 className="text-3xl font-bold font-ink text-stone-900 mb-6">Hue Noted.</h2>
                <div className="bg-stone-50 p-8 rounded-[2.5rem] border border-stone-100/50 max-w-sm mb-10 shadow-sm"><p className="text-stone-600 text-lg font-medium leading-relaxed italic">"{completionMessage}"</p></div>
                <button onClick={onSave} className="flex items-center gap-3 px-10 py-5 rounded-full bg-stone-900 text-white font-bold text-lg shadow-lg hover:bg-stone-800 transition-transform active:scale-95"><LogOut className="w-5 h-5" /> Return Home</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default HueCheckInScreen