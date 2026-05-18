import type { BLSParameters } from '../../types/clinical';

export const DEFAULT_BLS_PARAMS: BLSParameters = {
  speed: 1.2,
  size: 24,
  color: '#6366f1',
  shape: 'circle',
  path: 'linear',
  background: '#0d1117',
  audioEnabled: true,
  audioTone: 'sine',
  audioVolume: 0.3,
};

export class BLSEngine {
  private params: BLSParameters;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animFrame: number | null = null;
  private startTime: number | null = null;
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private panner: StereoPannerNode | null = null;
  private gain: GainNode | null = null;
  private running = false;

  constructor(params: BLSParameters = DEFAULT_BLS_PARAMS) {
    this.params = { ...params };
  }

  start(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.running = true;
    this.startTime = performance.now();
    if (this.params.audioEnabled) this.initAudio();
    this.loop();
  }

  stop(): void {
    this.running = false;
    if (this.animFrame !== null) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
    this.stopAudio();
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  updateParams(params: Partial<BLSParameters>): void {
    const wasAudioEnabled = this.params.audioEnabled;
    this.params = { ...this.params, ...params };
    if (params.audioEnabled !== undefined) {
      if (params.audioEnabled && !wasAudioEnabled && this.running) this.initAudio();
      else if (!params.audioEnabled && wasAudioEnabled) this.stopAudio();
    }
    if (this.gain && params.audioVolume !== undefined) {
      this.gain.gain.value = params.audioVolume;
    }
  }

  get isRunning(): boolean {
    return this.running;
  }

  get currentParams(): BLSParameters {
    return { ...this.params };
  }

  private loop(): void {
    if (!this.running || !this.ctx || !this.canvas) return;
    const now = performance.now();
    const elapsed = (now - (this.startTime ?? now)) / 1000;

    // Position: sin wave cycles at `speed` cycles per second
    const t = (Math.sin(elapsed * this.params.speed * Math.PI) + 1) / 2; // 0-1
    const x = t * (this.canvas.width - this.params.size * 2) + this.params.size;
    const y = this.canvas.height / 2;

    // Clear with background
    this.ctx.fillStyle = this.params.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw track line
    this.ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(this.params.size, y);
    this.ctx.lineTo(this.canvas.width - this.params.size, y);
    this.ctx.stroke();

    // Draw shape
    this.ctx.fillStyle = this.params.color;
    this.drawShape(this.ctx, x, y, this.params.size / 2);

    // Update audio panning (t: 0=left, 1=right → pan: -1 to 1)
    if (this.panner) {
      this.panner.pan.value = t * 2 - 1;
    }

    this.animFrame = requestAnimationFrame(() => this.loop());
  }

  private drawShape(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number
  ): void {
    ctx.beginPath();
    switch (this.params.shape) {
      case 'circle':
        ctx.arc(x, y, r, 0, Math.PI * 2);
        break;
      case 'diamond':
        ctx.moveTo(x, y - r);
        ctx.lineTo(x + r, y);
        ctx.lineTo(x, y + r);
        ctx.lineTo(x - r, y);
        ctx.closePath();
        break;
      case 'star': {
        for (let i = 0; i < 5; i++) {
          const outerAngle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const innerAngle = outerAngle + (2 * Math.PI) / 10;
          if (i === 0) {
            ctx.moveTo(x + r * Math.cos(outerAngle), y + r * Math.sin(outerAngle));
          } else {
            ctx.lineTo(x + r * Math.cos(outerAngle), y + r * Math.sin(outerAngle));
          }
          ctx.lineTo(
            x + r * 0.4 * Math.cos(innerAngle),
            y + r * 0.4 * Math.sin(innerAngle)
          );
        }
        ctx.closePath();
        break;
      }
      case 'butterfly':
        // Left wing
        ctx.ellipse(x - r * 0.5, y, r * 0.8, r * 0.4, -Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        // Right wing
        ctx.beginPath();
        ctx.ellipse(x + r * 0.5, y, r * 0.8, r * 0.4, Math.PI / 4, 0, Math.PI * 2);
        break;
    }
    ctx.fill();
  }

  private initAudio(): void {
    if (typeof window === 'undefined') return;
    try {
      this.audioCtx = new AudioContext();
      this.oscillator = this.audioCtx.createOscillator();
      this.panner = this.audioCtx.createStereoPanner();
      this.gain = this.audioCtx.createGain();

      this.oscillator.type =
        this.params.audioTone === 'square' ? 'square' : 'sine';
      this.oscillator.frequency.value = 440;
      this.gain.gain.value = this.params.audioVolume;

      this.oscillator.connect(this.panner);
      this.panner.connect(this.gain);
      this.gain.connect(this.audioCtx.destination);
      this.oscillator.start();
    } catch {
      // Audio context not available (e.g., SSR or blocked)
    }
  }

  private stopAudio(): void {
    try {
      this.oscillator?.stop();
      this.oscillator?.disconnect();
      this.panner?.disconnect();
      this.gain?.disconnect();
      this.audioCtx?.close();
    } catch {
      // Ignore errors during teardown
    }
    this.oscillator = null;
    this.panner = null;
    this.gain = null;
    this.audioCtx = null;
  }
}
