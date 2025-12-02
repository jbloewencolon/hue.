import { useState, useEffect, useRef } from 'react';
import { SoundEngine } from '../utils/SoundEngine';

export const useTranscription = () => {
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