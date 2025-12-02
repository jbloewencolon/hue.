import { useState } from 'react';
import { SoundEngine } from '../utils/SoundEngine';

export const useSound = () => {
  const [muted, setMuted] = useState(SoundEngine.muted || false);
  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    SoundEngine.setMute(next);
  };
  return { muted, toggleMute, SoundEngine };
};

export default useSound;