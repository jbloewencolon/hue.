import React, { createContext, useContext, useState, useEffect } from 'react';
import { COLOR_DOMAINS } from '../data/hues';
import { Repository, DEFAULT_SETTINGS, SETTINGS_KEY } from '../data/repository';

// 1. Define the State Logic (moved from App.jsx)
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

// 2. Create the Context Object
const HueContext = createContext(null);

// 3. EXPORT the Provider Component (This fixes the error)
export const HueProvider = ({ children }) => {
  const value = useHueState();
  return <HueContext.Provider value={value}>{children}</HueContext.Provider>;
};

// 4. EXPORT the Hook to use the context
export const useHueContext = () => {
  const ctx = useContext(HueContext);
  if (!ctx) throw new Error('useHueContext must be used within a HueProvider');
  return ctx;
};