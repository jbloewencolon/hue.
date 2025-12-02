export const SoundEngine = {
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