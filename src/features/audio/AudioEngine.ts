import type { SoundEffectType } from "./audio.types";

class SyntheticAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isInitialized: boolean = false;
  private currentVolume: number = 0.7;

  public initialize() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === "suspended") {
        void this.ctx.resume();
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.currentVolume;
      this.masterGain.connect(this.ctx.destination);
      
      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported or blocked:", e);
    }
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
  }

  public playTone(frequencyHz: number, durationSec: number = 0.3, enabled: boolean = true) {
    if (!enabled) return;
    this.initialize();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequencyHz, now);
    osc.frequency.exponentialRampToValueAtTime(frequencyHz * 1.618034, now + durationSec * 0.8);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + durationSec);
  }

  public play(type: SoundEffectType, enabled: boolean = true) {
    if (!enabled) return;
    this.initialize();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    switch (type) {
      case "click": {
        // Soft UI tap
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case "blip": {
        // Radar sweep detection ping
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(2400, now + 0.08);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.0, now + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }

      case "confirm": {
        // Dual-tone success confirmation
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // E5

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }

      case "warning": {
        // Two-tone warning alert
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(330, now + 0.1);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }

      case "critical": {
        // High-priority alarm sweep
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.linearRampToValueAtTime(440, now + 0.2);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }

      case "pulse": {
        // Deep sovereign bass pulse
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(65.41, now); // Sub-harmonic C2
        subOsc.frequency.exponentialRampToValueAtTime(32.7, now + 0.5);

        subGain.gain.setValueAtTime(0.25, now);
        subGain.gain.linearRampToValueAtTime(0.001, now + 0.5);

        subOsc.connect(subGain);
        subGain.connect(this.masterGain);

        // Golden Ratio Shimmer
        const shimmerOsc = this.ctx.createOscillator();
        const shimmerGain = this.ctx.createGain();
        shimmerOsc.type = "sawtooth";
        shimmerOsc.frequency.setValueAtTime(880, now);
        shimmerOsc.frequency.exponentialRampToValueAtTime(1760 * 1.618, now + 0.35);

        shimmerGain.gain.setValueAtTime(0.04, now);
        shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

        shimmerOsc.connect(shimmerGain);
        shimmerGain.connect(this.masterGain);

        subOsc.start(now);
        shimmerOsc.start(now);
        subOsc.stop(now + 0.5);
        shimmerOsc.stop(now + 0.35);
        break;
      }
    }
  }
}

export const audioEngine = new SyntheticAudioEngine();
