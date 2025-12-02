import React, { useState } from 'react';
import { HueProvider, useHueContext } from './context/HueContext';
import { SoundEngine } from './utils/SoundEngine';

// Screens
import HomeScreen from './components/screens/HomeScreen';
import HueCheckInScreen from './components/screens/HueCheckInScreen';
import LibraryScreen from './components/screens/LibraryScreen';
import SpectrumScreen from './components/screens/SpectrumScreen';
import SettingsScreen from './components/screens/SettingsScreen';

// UI
import GlobalStyles from './components/ui/GlobalStyles';

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
      
      {/* Ripple Effects */}
      {ripples.map(r => (
        <div key={r.id} className="absolute rounded-full pointer-events-none animate-ripple z-50 bg-stone-400/20" style={{ left: r.x, top: r.y, width: 40, height: 40, marginLeft: -20, marginTop: -20 }} />
      ))}
      
      {/* Melt Transition Overlay */}
      {meltingHue && (
        <div className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center">
          <div className="w-10 h-10 rounded-full animate-melt" style={{ backgroundColor: meltingHue }} />
        </div>
      )}

      {/* Routing Logic */}
      {view === 'home' && <HomeScreen onAnalyzeComplete={startRandomCheckIn} onMenu={setView} />}
      {view === 'checkin' && <HueCheckInScreen colorDomain={activeDomain} onSave={goHome} onCancel={goHome} />}
      {view === 'settings' && <SettingsScreen onBack={goHome} />}
      {view === 'explore' && <LibraryScreen onBack={goHome} />}
      {view === 'spectrum' && <SpectrumScreen onBack={goHome} />}
    </div>
  );
};

const App = () => (
  <HueProvider>
    <AppFrame />
  </HueProvider>
);

export default App;
