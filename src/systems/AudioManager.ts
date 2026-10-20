/**
 * KINGDOM OF MURABBA™ | Procedural Web Audio API Synthesizer Engine
 * Bridges directly to features/audio/AudioEngine for unified AudioContext management.
 */

import { audioEngine } from '../features/audio/AudioEngine';

class AudioManagerEngine {
  private isEnabled: boolean = true;

  public initContext(): boolean {
    audioEngine.initialize();
    return true;
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  public setVolume(vol: number): void {
    audioEngine.setVolume(vol);
  }

  public playKeyClick(): void {
    audioEngine.play('click', this.isEnabled);
  }

  public playTotemTone(freqHz: number): void {
    audioEngine.playTone(freqHz, 0.35, this.isEnabled);
  }

  public playGlobalPulse(): void {
    audioEngine.play('pulse', this.isEnabled);
  }

  public playRadarPing(): void {
    audioEngine.play('blip', this.isEnabled);
  }

  public playBioScanChirp(): void {
    audioEngine.play('confirm', this.isEnabled);
  }

  public playAlert(): void {
    audioEngine.play('critical', this.isEnabled);
  }
}

export const AudioManager = new AudioManagerEngine();
