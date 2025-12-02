import React, { useState, createContext, useContext, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, Settings as SettingsIcon, BookOpen, X, Mic, Check, ChevronLeft, Volume2, VolumeX,
  Globe, Activity, Sprout, Heart, Briefcase, Lightbulb, Home, Flame, Anchor, CloudRain, Zap, Sun, Feather, MicOff,
  ArrowLeft, Trash2, ChevronUp, ChevronDown, TrendingUp, Info, Lock, ShieldAlert, Bug, Download, ExternalLink,
  RefreshCcw, AlignLeft, LogOut, Calendar, HelpCircle, Users, Github, EyeOff, Eye, Clock, Smartphone, Edit2
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* 0. UTILS & POLYFILLS                                                       */
/* -------------------------------------------------------------------------- */

const uuidv4 = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Added missing helper function for the chart
const getX = (date, startDate, endDate, width) => {
  const totalDuration = endDate - startDate;
  const elapsed = date - startDate;
  return (elapsed / totalDuration) * width;
};

/* -------------------------------------------------------------------------- */
/* 1. DATA & CONFIG                                                          */
/* -------------------------------------------------------------------------- */

const COLOR_DOMAINS = [
  { 
    id: 'purple', 
    name: 'Politics', 
    colors: ['#c084fc', '#a855f7'], 
    accent: '#7e22ce', 
    textColor: 'text-white',
    description: "Politics shapes safety, resources, and daily stress, even when we are not thinking about it. Checking in here can help you notice how the larger world is landing in your body and mood.",
    questions: [ 
      "What headlines are lingering in me today?", "Do I feel hopeful or drained?", "Where do I feel anger or worry?", "Do I feel like I have any power?", "What would help me feel a bit safer?", "Whose voice am I hearing most loudly right now?", "Is there a boundary I need to set with the news?", "How is the state of the world affecting my breathing?", "What is one small action that aligns with my values?", "Do I feel connected to a community or isolated?"
    ],
    responses: {
      1: "Politics feels mostly in the background, which can give your system a bit of breathing room today.",
      2: "Politics is lightly present, you notice it without it taking over your day.",
      3: "The Political is noticeable and may be quietly shaping your mood or focus.",
      4: "Politics feels very present and could be taking real space in your thoughts and energy.",
      5: "Politics is strongly alive for you right now, it might help to notice which issue or story stands out most."
    }
  },
  { 
    id: 'blue', 
    name: 'Body', 
    colors: ['#3b82f6', '#2563eb'], 
    accent: '#1d4ed8',
    textColor: 'text-white',
    description: "Your body often knows how you are before your mind catches up. Tuning in can show early signs of stress, burnout, or need for rest.",
    questions: [ 
      "What sensations do I notice first?", "Am I tired, wired, or steady?", "How is my breathing right now?", "Do I need food, water, or rest?", "Where does my body feel most at ease?", "Is there tension in my jaw or shoulders?", "What is my energy level on a scale of 1-10?", "How does the ground feel beneath my feet?", "If my body could speak one word, what would it be?", "What kind of movement does my body crave?"
    ],
    responses: {
      1: "Your body feels mostly in the background, this can be neutral or a sign that you are a bit disconnected.",
      2: "Your body is lightly on your radar, you may sense mild comfort or mild discomfort.",
      3: "Your body is speaking up a bit, certain sensations or needs are easier to notice.",
      4: "Your body is asking clearly for attention, rest, movement, or care.",
      5: "Body sensations are very intense today, it may help to move gently, breathe slowly, or tend to one specific need."
    }
  },
  { 
    id: 'green', 
    name: 'Growth', 
    colors: ['#4ade80', '#22c55e'], 
    accent: '#15803d',
    textColor: 'text-stone-900',
    description: "Growth is not just big achievements, it is also tiny shifts in how you respond to life. Checking in here supports a sense of direction and purpose.",
    questions: [ 
      "Where have I stretched lately?", "What am I learning about myself?", "Do I feel stuck or moving forward?", "What small risk am I ready for?", "What am I proud of this week?", "Is there a habit I am trying to build?", "What feels hard right now because it is new?", "Who is inspiring me to grow?", "Am I being patient with my own process?", "What is one seed I am planting today?"
    ],
    responses: {
      1: "Growth is not a big focus right now, which can be a needed pause or plateau.",
      2: "You sense small shifts, even if they are subtle or quiet.",
      3: "Growth is on your mind, you can see ways you are changing or want to change.",
      4: "You feel actively in a stretch zone, learning or challenging yourself in real ways.",
      5: "Growth feels very alive, which can be exciting or tiring, you are in a real season of change."
    }
  },
  { 
    id: 'jasmine', 
    name: 'Joy', 
    colors: ['#fde047', '#facc15'], 
    accent: '#a16207', 
    textColor: 'text-stone-900',
    description: "Jasmine (Joy) refuels resilience. Noticing even small sparks of joy can balance a focus on problems and remind you that pleasure and play are allowed.",
    questions: [ 
      "What felt good today, even briefly?", "When did I last laugh or smile?", "Do I feel light or heavy right now?", "What tiny joy is available today?", "Who or what brings me delight?", "Is there a song that lifts my spirits?", "Can I pause to appreciate something beautiful?", "What does 'play' look like for me today?", "Who makes me feel lighter?", "Am I allowing myself to feel good?"
    ],
    responses: {
      1: "Joy feels hard to find or quite dim today, that is a very human state.",
      2: "There are small threads of joy, even if they are easy to miss.",
      3: "You can name a few clear moments or sources of joy around you.",
      4: "Joy is a solid presence today, it is helping carry you a bit.",
      5: "Joy feels bright and vivid, this is a good moment to really savor what feels good."
    }
  },
  { 
    id: 'red', 
    name: 'Relationships', 
    colors: ['#f87171', '#ef4444'], 
    accent: '#b91c1c',
    textColor: 'text-stone-900',
    description: "Relationships deeply affect nervous systems, self worth, and daily stress. Checking in helps you notice where you feel nourished and where you feel drained.",
    questions: [ 
      "Who feels close to me today?", "Where do I feel misunderstood or unseen?", "Do I feel more connected or isolated?", "What boundary might I need right now?", "Who do I feel safe being myself with?", "Is there a conversation I am avoiding?", "Who have I been thinking about?", "Do I have the energy to socialize?", "What do I need from my friends right now?", "Am I feeling resentful or appreciative?"
    ],
    responses: {
      1: "Relationships feel quiet or distant right now, either by choice or circumstance.",
      2: "Connection is present in a gentle way, not demanding much from you.",
      3: "Relationships are on your mind, you are aware of certain people or dynamics today.",
      4: "Relationships are strongly affecting your emotions, for comfort, tension, or both.",
      5: "Your relational world feels very intense or tender, it may help to name one bond or conflict that is most alive."
    }
  },
  { 
    id: 'orange', 
    name: 'Occupation', 
    colors: ['#fb923c', '#f97316'], 
    accent: '#c2410c',
    textColor: 'text-stone-900',
    description: "Your main daily role shapes structure, identity, and stress. Noticing how you feel about it can guide healthier choices and limits.",
    questions: [ 
      "How do I feel about my work today?", "Am I energized, bored, or overwhelmed?", "Does my work feel meaningful right now?", "What part of my role drains me most?", "What support would help this feel lighter?", "Is my workload sustainable?", "Do I feel appreciated for what I do?", "Am I able to switch off when I stop working?", "What is one win I had recently?", "Is my identity tied too tightly to my productivity?"
    ],
    responses: {
      1: "Work or your main role is not very central today, this might be a day of distance or rest.",
      2: "Work is lightly present, you are aware of it without feeling strongly pulled.",
      3: "Your tasks and responsibilities are clearly on your mind.",
      4: "Work or your main role is a major source of focus, stress, or engagement right now.",
      5: "Occupation feels all consuming, it may help to notice one boundary or support that would ease the load."
    }
  },
  { 
    id: 'white', 
    name: 'Wonder', 
    colors: ['#f3f4f6', '#d1d5db'], 
    accent: '#374151', 
    textColor: 'text-stone-900',
    description: "Wonder and spirituality can offer meaning, comfort, and perspective beyond daily tasks. Checking in can reconnect you with what feels sacred or bigger than you.",
    questions: [ 
      "What gives my life a sense of meaning?", "Do I feel connected to anything bigger?", "When did I last feel awe or amazement?", "What practices help me feel grounded?", "Where do I feel most spiritually at home?", "Is there a mystery I am pondering?", "Do I feel a sense of gratitude today?", "How does nature look to me right now?", "What feels sacred in my daily life?", "Am I listening to my intuition?"
    ],
    responses: {
      1: "A sense of meaning or wonder feels muted today, and that is okay.",
      2: "There is a quiet sense of something bigger, even if it is not very clear.",
      3: "Wonder is noticeable, you feel some curiosity or connection beyond daily tasks.",
      4: "You feel strongly connected to something larger, through nature, ritual, art, or belief.",
      5: "Wonder and spirituality feel very alive, this may be a moment of deep meaning or insight."
    }
  },
  { 
    id: 'black', 
    name: 'Brainstorm', 
    colors: ['#334155', '#0f172a'], 
    accent: '#0f172a',
    textColor: 'text-white', 
    description: "Creativity is not only art, it is how you solve problems and imagine new possibilities. Checking in here supports play, innovation, and self expression.",
    questions: [ 
      "Do I feel curious or shut down today?", "What ideas have been tugging at me?", "Where do I feel a creative itch?", "What small thing could I make or try?", "What helps my ideas flow more freely?", "Am I judging my ideas before they form?", "What problem am I trying to solve?", "Is there a project I am excited about?", "How can I add a touch of beauty to my day?", "Do I have space to dream?"
    ],
    responses: {
      1: "Creative energy feels low or quiet, ideas may be resting for now.",
      2: "There are small sparks of ideas, even if they have not fully formed.",
      3: "Creativity is noticeable, you feel some pull to tinker, imagine, or make.",
      4: "Creative energy is strong, ideas and possibilities are actively showing up.",
      5: "Creativity feels vivid and alive, this could be a powerful time to capture or play with your ideas."
    }
  },
  { 
    id: 'teal', 
    name: 'Togetherness', 
    colors: ['#2dd4bf', '#14b8a6'], 
    accent: '#0f766e',
    textColor: 'text-white',
    description: "Spaces and communities shape nervous system safety. Noticing how your surroundings feel can reveal needs for change, comfort, or protection.",
    questions: [ 
      "Do I feel like I belong where I am?", "Does my physical space feel safe today?", "What in my environment soothes me?", "What in my environment stresses me?", "What small change would help me settle?", "Do I feel welcome in my community?", "Is my home a sanctuary right now?", "Who considers me 'one of them'?", "Do I feel like an outsider today?", "Where do I go to feel accepted?"
    ],
    responses: {
      1: "Togetherness is not very present in your awareness, or you may feel somewhat apart from things today.",
      2: "You feel mildly okay in your spaces and circles, even if not fully at home.",
      3: "Togetherness is noticeable, you are aware of where you fit and where you do not.",
      4: "Your sense of belonging or not belonging is strongly affecting how settled you feel.",
      5: "Togetherness feels very intense, you may feel deeply held or deeply out of place, both deserve care and attention."
    }
  },
  { 
    id: 'pink', 
    name: 'Passion', 
    colors: ['#f9a8d4', '#f472b6'], 
    accent: '#be185d',
    textColor: 'text-stone-900',
    description: "Passion includes romantic love, erotic energy, and deep aliveness. Checking in can show where you feel awake, connected, or shut down.",
    questions: [ 
      "Where do I feel most alive right now?", "Do I feel desired, cherished, or ignored?", "Am I connected to my own desire today?", "What kind of closeness do I crave?", "What would help me feel more loved?", "Is there a fire in my belly about something?", "Do I feel attractive today?", "What am I deeply enthusiastic about?", "Is there romance in my life?", "How am I expressing my love?"
    ],
    responses: {
      1: "Passion and romantic energy feel low or in the background, which can be a season of rest.",
      2: "There is a gentle sense of affection or desire, even if it is not very active.",
      3: "Love and passion are noticeable, you are aware of who or what lights you up.",
      4: "Passion is strong, and it may be pulling you toward connection, intimacy, or creative expression.",
      5: "Passion feels vivid and powerful, this is a lot of energy and can be both beautiful and vulnerable."
    }
  },
  { 
    id: 'brown', 
    name: 'Base', 
    colors: ['#a16207', '#78350f'], 
    accent: '#78350f', 
    textColor: 'text-white',
    description: "Stability is your sense of foundation, such as housing, money, routines, and inner steadiness. Checking in here can show what is needed for you to feel secure enough to grow.",
    questions: [ 
      "Do I feel basically safe today?", "How secure do home and money feel?", "Is my routine supporting or draining me?", "What feels most solid in my life now?", "What is one small way to add stability?", "Am I worried about the future?", "Do I have enough resources for today?", "Is my foundation shaky or firm?", "What anchors me when things get chaotic?", "How are my basic needs (food, sleep) being met?"
    ],
    responses: {
      1: "Your base feels shaky, like the ground is a bit uneven under your feet.",
      2: "There is some footing under you, even if it still feels a little thin or uncertain.",
      3: "You can feel a few solid roots, certain people, places, or routines help you stay grounded.",
      4: "Your base feels steady, like you have enough shelter, support, and rhythm to hold you.",
      5: "Stability feels rich and rooted, your foundations are holding well and giving you room to grow."
    }
  },
  { 
    id: 'gray', 
    name: 'Grief', 
    colors: ['#9ca3af', '#6b7280'], 
    accent: '#1f2937',
    textColor: 'text-stone-900',
    description: "Grief is not only about death, it is any response to loss or big change. Naming grief makes room for healing, rather than pushing it underground.",
    questions: [ 
      "What losses are close to the surface today?", "Where in my body do I feel my grief?", "Do I feel more numb or more tender?", "What do I wish I could say or do?", "What would feel comforting to my grieving self?", "Is there an old sadness visiting me?", "Am I allowing myself to cry if I need to?", "What memories are coming up today?", "Is my grief loud or quiet right now?", "How can I be gentle with my heart?"
    ],
    responses: {
      1: "Grief feels a bit further away today, which can offer a gentle rest, even if the loss still matters.",
      2: "Grief is present in a soft way, a quiet ache rather than a sharp wave.",
      3: "Grief is noticeable, close enough to touch your day even if you are functioning.",
      4: "Grief feels strong and may be shaping your thoughts, energy, or body in clear ways.",
      5: "Grief is vivid and intense right now, this is a lot to carry and you deserve tenderness and support with it."
    }
  }
];

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Morning' : 'Evening';
};

const SoundEngine = {
  ctx: null,
  muted: false,
  chargeOsc: null,
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
  },
  resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(err => console.warn("Audio resume failed", err));
    }
  },
  setMute(isMuted) { this.muted = isMuted; },
  playOrganicTone(frequency, type = 'sine', decay = 0.3, volume = 0.1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + decay);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(t + decay);
  },
  playClick() { this.playOrganicTone(300, 'sine', 0.1, 0.05); },
  playHueTap(index) {
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
    this.playOrganicTone(scale[index % scale.length] || 440, 'sine', 0.15, 0.05);
  },
  playTick(value) { this.playOrganicTone(300 + value * 50, 'sine', 0.05, 0.03); },
  playChord() {
      this.playOrganicTone(261.63, 'sine', 2.0, 0.1); 
      setTimeout(() => this.playOrganicTone(329.63, 'sine', 2.0, 0.1), 100); 
      setTimeout(() => this.playOrganicTone(392.00, 'sine', 2.0, 0.1), 200); 
  },
  startCharge() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    this.stopCharge();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 2.0);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    this.chargeOsc = { osc, gain };
  },
  updateCharge(progress) {
    if (this.chargeOsc && this.ctx && !this.muted) {
      this.chargeOsc.osc.frequency.setTargetAtTime(100 + progress * 5, this.ctx.currentTime, 0.1);
    }
  },
  stopCharge() {
    if (this.chargeOsc && this.ctx) {
      try {
        this.chargeOsc.gain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.chargeOsc.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
        this.chargeOsc.osc.stop(this.ctx.currentTime + 0.1);
      } catch (e) {}
      this.chargeOsc = null;
    }
  },
  playRecStart() { if (this.playClick) this.playClick(); },
  playRecStop() { if (this.playClick) this.playClick(); }
};

const DB_KEY = 'hue_journal_v6';
const SETTINGS_KEY = 'hue_settings_v1';

const DEFAULT_SETTINGS = {
    showTranscripts: true,
    enableVoice: true,
    autoDeleteDays: null, // null, 30, 90, 180
    highContrast: false,
    reduceMotion: false,
    reminderTime: null
};

const Repository = {
  async getAll() { const raw = localStorage.getItem(DB_KEY); return raw ? JSON.parse(raw) : []; },
  async getLastEntry() { const entries = await this.getAll(); return entries.length > 0 ? entries[0] : null; },
  async save(entry) {
    const entries = await this.getAll();
    const cleanEntry = { ...entry, transcript: entry.transcript || '' };
    localStorage.setItem(DB_KEY, JSON.stringify([cleanEntry, ...entries]));
    return true;
  },
  async update(id, text) {
    const entries = await this.getAll();
    const idx = entries.findIndex(e => e.id === id);
    if (idx !== -1) {
        entries[idx].transcript = text;
        localStorage.setItem(DB_KEY, JSON.stringify(entries));
        return true;
    }
    return false;
  },
  async delete(id) {
    const entries = await this.getAll();
    localStorage.setItem(DB_KEY, JSON.stringify(entries.filter((e) => e.id !== id)));
    return true;
  },
  async clear() { localStorage.removeItem(DB_KEY); return true; },
  async pruneOldEntries(days) {
      if (!days) return 0;
      const entries = await this.getAll();
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const keep = entries.filter(e => new Date(e.timestamp) >= cutoff);
      const removedCount = entries.length - keep.length;
      if (removedCount > 0) localStorage.setItem(DB_KEY, JSON.stringify(keep));
      return removedCount;
  }
};

/* -------------------------------------------------------------------------- */
/* 2. HOOKS & CONTEXT                                                       */
/* -------------------------------------------------------------------------- */

const useHueState = () => {
  const [view, setView] = useState('home');
  const [activeDomain, setActiveDomain] = useState(null);
  const [meltingHue, setMeltingHue] = useState(null); // For melt transition
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Apply Auto-Prune on load if enabled
    if (settings.autoDeleteDays) Repository.pruneOldEntries(settings.autoDeleteDays);
  }, [settings]);

  const updateSetting = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const startRandomCheckIn = () => {
    let candidates = COLOR_DOMAINS;
    const selection = candidates[Math.floor(Math.random() * candidates.length)];
    
    // DELAY: Wait 0.5s after Tune In completes
    setTimeout(() => {
        // MELT EFFECT: Start the melt
        setMeltingHue(selection.colors[0]); 
        
        // Wait for melt to fully cover screen (1.5s) before mounting the new view
        setTimeout(() => {
            setActiveDomain(selection);
            setView('checkin');
            
            // Keep the melt overlay for a moment longer to allow the new view to paint
            setTimeout(() => setMeltingHue(null), 1200); 
        }, 1500); 
    }, 500); 
  };

  const goHome = () => setView('home');

  return { view, setView, activeDomain, setActiveDomain, meltingHue, startRandomCheckIn, goHome, settings, updateSetting };
};

const HueContext = createContext(null);
const HueProvider = ({ children }) => {
  const value = useHueState();
  return <HueContext.Provider value={value}>{children}</HueContext.Provider>;
};
const useHueContext = () => {
  const ctx = useContext(HueContext);
  if (!ctx) throw new Error('useHueContext must be used within a HueProvider');
  return ctx;
};

const useSound = () => {
  const [muted, setMuted] = useState(SoundEngine.muted || false);
  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    SoundEngine.setMute(next);
  };
  return { muted, toggleMute, SoundEngine };
};

const useTranscription = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) setTranscript((prev) => prev + ' ' + event.results[i][0].transcript);
        }
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const simulateTyping = () => {
    const phrases = ["Feeling calm...", "Storm passed...", "Quiet joy...", "Patience..."];
    let i = 0;
    const interval = setInterval(() => {
      setTranscript((prev) => {
        if (i >= phrases.length) { clearInterval(interval); setIsRecording(false); return prev; }
        const next = prev + (prev ? ' ' : '') + phrases[i]; i += 1; return next;
      });
    }, 1000);
  };

  const startRecording = () => {
    if (SoundEngine.playRecStart) SoundEngine.playRecStart();
    setIsRecording(true);
    if (recognitionRef.current) {
      try { recognitionRef.current.start(); } catch (e) { simulateTyping(); }
    } else { simulateTyping(); }
  };

  const stopRecording = () => {
    if (SoundEngine.playRecStop) SoundEngine.playRecStop();
    setIsRecording(false);
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch (e) {} }
  };

  return { isRecording, transcript, setTranscript, startRecording, stopRecording, clearTranscript: () => setTranscript('') };
};

/* -------------------------------------------------------------------------- */
/* 3. GLOBAL STYLES                                                          */
/* -------------------------------------------------------------------------- */

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .font-ink { font-family: 'Lora', serif; color: #1c1917; }
    .font-sans-clean { font-family: 'Inter', sans-serif; }

    .bg-canvas {
      background-color: #fdfbf7;
      background-image: 
        repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 3px),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
    }
    .wet-paint {
      box-shadow: 
        0 10px 20px -5px rgba(0,0,0,0.15),
        inset 0 2px 4px rgba(255,255,255,0.8),
        inset 0 -2px 4px rgba(0,0,0,0.05);
      border: 1px solid rgba(255,255,255,0.3);
    }
    .wet-paint-active:active { transform: scale(0.98); box-shadow: 0 5px 10px -2px rgba(0,0,0,0.1), inset 0 4px 8px rgba(0,0,0,0.05); }

    .high-contrast { filter: contrast(1.1) brightness(0.95); }
    .high-contrast .text-stone-400 { color: #57534e !important; } 
    
    @keyframes squish-breathe { 0%, 100% { transform: scale(0.96); } 50% { transform: scale(0.98); } }
    .animate-squish-breathe { animation: squish-breathe 4s ease-in-out infinite; }
    
    @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.05); opacity: 1; } }
    .animate-breathe { animation: breathe 6s ease-in-out infinite; }

    @keyframes ripple-effect { 0% { transform: scale(0); opacity: 0.4; } 100% { transform: scale(4); opacity: 0; } }
    .animate-ripple { animation: ripple-effect 1.2s cubic-bezier(0, 0, 0.2, 1) forwards; }
    
    @keyframes melt-expand {
        0% { transform: scale(0.1); opacity: 0; }
        40% { opacity: 0.9; } /* Reduced opacity from 1.0 to 0.9 */
        100% { transform: scale(50); opacity: 0.9; }
    }
    /* SLOWED DOWN: 3s animation for deeper feel */
    .animate-melt { 
        animation: melt-expand 3.0s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; 
        filter: blur(100px); 
        will-change: transform, opacity;
    }

    /* Meditative Slide Up - Slower & Softer (1.8s) */
    @keyframes slide-up-fade {
        0% { transform: translateY(40px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up { 
        animation: slide-up-fade 1.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; 
        will-change: transform, opacity;
    }

    @keyframes floatPath {
      0% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(40px, -60px) rotate(10deg); } 
      66% { transform: translate(-30px, -40px) rotate(-5deg); }
      100% { transform: translate(0, 0) rotate(0deg); }
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

/* -------------------------------------------------------------------------- */
/* 4. REUSABLE COMPONENTS                                                   */
/* -------------------------------------------------------------------------- */

const PrimaryButton = ({ onClick, children, className = '', variant = 'primary', disabled = false, style={} }) => {
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

const ICON_MAP = { purple: Globe, blue: Activity, green: Sprout, jasmine: Sun, red: Heart, orange: Briefcase, white: Sparkles, black: Lightbulb, teal: Users, pink: Flame, brown: Anchor, gray: CloudRain };

const Guidebook = () => (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {[
            { icon: <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-blue-400" />, title: "Hues (Color Domains)", subtitle: "What is a Hue?", text: "A Hue is one area of your life that carries feeling (like Body, Joy, Grief, or Politics). Each color helps you check in with that part of your world." },
            { icon: <AlignLeft className="w-6 h-6 text-stone-600" />, title: "Vividness Scale", subtitle: "What is the Vividness Scale?", text: "This scale lets you choose how present a Hue feels today, from Faint to Vivid. It is about noticing intensity, not judging yourself. Slide to the level that feels closest to your experience right now, then let that be enough." },
            { icon: <Home className="w-6 h-6 text-stone-600" />, title: "Home Screen", subtitle: "What is the Home screen?", text: "This is your starting place, where you can see your Hues and choose one to check in with today. Tap a color or a Hue name when you are ready to notice how that part of your life feels." },
            { icon: <TrendingUp className="w-6 h-6 text-emerald-500" />, title: "Spectrum Page", subtitle: "What is the Spectrum page?", text: "The Spectrum page shows gentle patterns in your Hues over time, like which colors have been quiet or loud lately. Choose a Hue to see how its vividness has shifted. Use this as a way to understand your seasons, not as a grade or goal." },
            { icon: <BookOpen className="w-6 h-6 text-amber-600" />, title: "Library", subtitle: "What is the Library?", text: "The Library gathers your past check ins, notes, and voice reflections in one place, like a private archive of your inner weather. Visit when you want to remember what was happening around strong days, quiet days, or important shifts." },
            { icon: <AlignLeft className="w-6 h-6 text-stone-400" />, title: "Notes", subtitle: "What are Notes?", text: "Notes let you put a few words around why a Hue feels the way it does today. Write as much or as little as you like, a single sentence is enough to give future you some context." },
        ].map((item, i) => (
            <section key={i} className="bg-white/80 wet-paint rounded-[2.5rem] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    {item.icon}
                    <h3 className="font-bold text-lg text-stone-800">{item.title}</h3>
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">{item.subtitle}</h4>
                <p className="text-stone-600 leading-relaxed text-sm">{item.text}</p>
            </section>
        ))}
    </div>
);

const BackgroundGarden = ({ isActive, showIcons = false }) => {
  const { settings } = useHueContext();
  if (settings.reduceMotion) return null; // Accessibility: Kill background motion if requested

  return (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
    <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-30' : 'opacity-0'}`} style={{ background: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)', backgroundSize: '400% 400%', filter: 'blur(40px)' }} />
    {[...Array(6)].map((_, i) => (
       <div key={i} className="absolute bg-stone-500/20 rounded-full blur-[1px]" style={{ width: Math.random() * 6 + 3 + 'px', height: Math.random() * 6 + 3 + 'px', left: Math.random() * 100 + '%', top: Math.random() * 100 + '%', animation: `floatPath ${(Math.random() * 10 + 10)}s ease-in-out infinite` }} />
    ))}
    {showIcons && COLOR_DOMAINS.map((d, i) => {
        const Icon = ICON_MAP[d.id] || Zap;
        // Increased icon opacity from 0.3 to 0.6 for brightness
        return <div key={d.id} className="absolute" style={{ top: `${(i * 17 + 5) % 85}%`, left: `${(i * 37 + 10) % 85}%`, color: d.colors[1], opacity: 0.6, animation: isActive ? `floatPath ${20 + i}s ease-in-out -${i * 2}s infinite` : `floatPath ${20 + i}s ease-in-out -${i * 2}s infinite` }}><Icon size={32 + (i%3)*12} /></div>;
    })}
  </div>
)};

/* -------------------------------------------------------------------------- */
/* 5. SCREENS                                                               */
/* -------------------------------------------------------------------------- */

const SeasonalHuesChart = ({ entries, timeRange, color }) => {
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

const HueCheckInScreen = ({ colorDomain, onSave, onCancel }) => {
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

const LibraryScreen = ({ onBack }) => {
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

// --- HOME SCREEN (with hold-to-tune functionality) ---
const HOLD_DURATION_MS = 2500;
const HomeScreen = ({ onAnalyzeComplete, onMenu }) => {
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

const polarToCartesian = (cx, cy, r, angleDeg) => { const rad = ((angleDeg - 90) * Math.PI) / 180.0; return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }; };
const describeSector = (cx, cy, r, startAngle, endAngle) => { const start = polarToCartesian(cx, cy, r, startAngle); const end = polarToCartesian(cx, cy, r, endAngle); const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'; return ['M', cx, cy, 'L', start.x, start.y, 'A', r, r, 0, largeArcFlag, 1, end.x, end.y, 'Z'].join(' '); };

const SpectrumScreen = ({ onBack }) => {
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

const SettingsScreen = ({ onBack }) => {
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

/* -------------------------------------------------------------------------- */
/* 6. APP FRAME & TRANSITION OVERLAY                                        */
/* -------------------------------------------------------------------------- */

const AppFrame = () => {
  const { view, setView, activeDomain, startRandomCheckIn, goHome, meltingHue, settings } = useHueContext();
  const [ripples, setRipples] = useState([]);

  const handleGlobalClick = (e) => {
    SoundEngine.resumeContext();
    if(settings.reduceMotion) return;
    const id = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    setRipples(p => [...p, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples(p => p.filter(r => r.id !== id)), 800);
  };

  return (
    <div onClick={handleGlobalClick} className={`w-full h-[100dvh] sm:h-[850px] sm:w-[420px] bg-canvas text-stone-900 font-sans mx-auto my-auto ring-1 ring-stone-900/5 cursor-pointer relative overflow-hidden ${settings.highContrast ? 'high-contrast' : ''}`}>
      <GlobalStyles />
      {ripples.map(r => <div key={r.id} className="absolute rounded-full pointer-events-none animate-ripple z-50 bg-stone-400/20" style={{ left: r.x, top: r.y, width: 40, height: 40, marginLeft: -20, marginTop: -20 }} />)}
      {meltingHue && <div className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center"><div className="w-10 h-10 rounded-full animate-melt" style={{ backgroundColor: meltingHue }} /></div>}

      {view === 'home' && <HomeScreen onAnalyzeComplete={startRandomCheckIn} onMenu={setView} />}
      {view === 'checkin' && <HueCheckInScreen colorDomain={activeDomain} onSave={goHome} onCancel={goHome} />}
      {/* Archive Screen removed from router */}
      {view === 'settings' && <SettingsScreen onBack={goHome} />}
      {view === 'explore' && <LibraryScreen onBack={goHome} />}
      {view === 'spectrum' && <SpectrumScreen onBack={goHome} />}
    </div>
  );
};

const App = () => ( <HueProvider> <AppFrame /> </HueProvider> );

export default App;