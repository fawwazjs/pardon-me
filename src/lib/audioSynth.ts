// Web Audio API ambient sound generator
// Generates a calming, gentle ambient piano / Rhodes soundscape

class AmbientPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: number | null = null;
  private masterGain: GainNode | null = null;

  // Gentle chord progression in F / Dm (warm, introspective, comforting)
  // Frequencies in Hz for chord voicings
  private chordVoicings: number[][] = [
    // Fmaj9: F3, C4, E4, G4, A4
    [174.61, 261.63, 329.63, 392.0, 440.0],
    // Dm9: D3, A3, C4, F4, E5
    [146.83, 220.0, 261.63, 349.23, 659.25],
    // Bbmaj7#11: Bb2, F3, A3, D4, E4
    [116.54, 174.61, 220.0, 293.66, 329.63],
    // Csus4add9: C3, G3, D4, F4, G4
    [130.81, 196.0, 293.66, 349.23, 392.0],
  ];

  private currentChordIndex = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public play() {
    if (this.isPlaying) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.playNextChord();
  }

  private playNextChord() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    const chord = this.chordVoicings[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chordVoicings.length;

    const now = this.ctx.currentTime;
    const chordDuration = 5.5; // seconds per chord progression

    // Arpeggiate notes gently
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Warm tone synthesis
      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);

      // Warm low-pass filter (Rhodes warm feel)
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800 + idx * 100, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + 4.0);

      // Gentle envelope: soft attack, sustained resonance, gentle decay
      const noteDelay = idx * 0.15 + Math.random() * 0.05;
      const noteStart = now + noteDelay;
      const noteVol = 0.08 / (idx === 0 ? 1.2 : 1.8);

      noteGain.gain.setValueAtTime(0.0001, noteStart);
      noteGain.gain.exponentialRampToValueAtTime(noteVol, noteStart + 0.4);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 5.0);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(noteStart);
      osc.stop(noteStart + 5.2);
    });

    this.timer = window.setTimeout(() => {
      this.playNextChord();
    }, (chordDuration - 0.8) * 1000);
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const ambientPlayer = typeof window !== "undefined" ? new AmbientPlayer() : null;
