import { playables } from './playables-sdk.js';

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.muteListeners = [];
    this.noiseBuffer = null;
    this.spongeScrubStep = 0;
    this.spongeBuffer = null;
    this.spongeStrokeSource = null;
    this.spongeStrokeGain = null;
    this.spongeStrokePlaying = false;
    this.spongeWatchdogTimer = null;
    this.spongeDabTimeout = null;
    this.startBuffer = null;
    this.startAudio = null;
    this.startSource = null;
    this.eraserBuffer = null;
    this.errorBuffer = null;
    this.yarnBuffer = null;
    this.yarnAudio = null;
    this.yarnStrokeSource = null;
    this.yarnStrokeGain = null;
    this.yarnStrokePlaying = false;
    this.yarnWatchdogTimer = null;
    this.yarnDabTimeout = null;
    this.trunkBuffer = null;
    this.trunkAudio = null;
    this.trunkStrokeSource = null;
    this.trunkStrokeGain = null;
    this.trunkStrokePlaying = false;
    this.trunkWatchdogTimer = null;
    this.trunkDabTimeout = null;
    this.clayScrubStep = 0;
    this.doughScrubStep = 0;
    this.yarnScrubStep = 0;
    this.trunkSprayStep = 0;
    this.musicEnabled = true;
    this.soundsEnabled = true;
    try {
      const savedMusic = localStorage.getItem('coloring_game_music_enabled');
      if (savedMusic !== null) this.musicEnabled = savedMusic === 'true';
      const savedSounds = localStorage.getItem('coloring_game_sounds_enabled');
      if (savedSounds !== null) this.soundsEnabled = savedSounds === 'true';
    } catch (e) {}
    this.audioSettingsListeners = [];
    this.currentBgmTrack = 'track_1';
    try {
      const savedTrack = localStorage.getItem('coloring_game_music_track');
      if (savedTrack) {
        if (['track_1', 'track_2', 'track_3'].includes(savedTrack)) {
          this.currentBgmTrack = savedTrack;
        } else if (savedTrack === 'calm_zen' || savedTrack === 'music_box') {
          this.currentBgmTrack = 'track_1';
        } else if (savedTrack === 'sunny_melody') {
          this.currentBgmTrack = 'track_2';
        } else if (savedTrack === 'playful_toys') {
          this.currentBgmTrack = 'track_3';
        }
      }
    } catch (e) {}

    this.initAudioContext();
    this.setupPlayablesIntegration();
    this.setupMobileAudioUnlock();
    this.initStartSound();
    this.initWooSound();
    this.initSqueakSound();
    this.initSpongeSound();
    this.initEraserSound();
    this.initErrorSound();
    this.initYarnSound();
    this.initTrunkSound();
  }

  initStartSound() {
    try {
      this.startAudio = new Audio('assets/Sounds/Start.mp3');
      this.startAudio.preload = 'auto';
      if (this.ctx) {
        fetch('assets/Sounds/Start.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.startBuffer = decoded; })
          .catch(() => {});
      }
    } catch (e) {}
  }

  initWooSound() {
    try {
      this.wooAudio = new Audio('assets/Sounds/Woo.mp3');
      this.wooAudio.preload = 'auto';
      if (this.ctx) {
        fetch('assets/Sounds/Woo.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.wooBuffer = decoded; })
          .catch(() => {});
      }
    } catch (e) {}
  }

  initSqueakSound() {
    try {
      this.squeakAudio = new Audio('assets/Sounds/Squeak.mp3');
      this.squeakAudio.preload = 'auto';
      if (this.ctx) {
        fetch('assets/Sounds/Squeak.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.squeakBuffer = decoded; })
          .catch(() => {});
      }
    } catch (e) {}
  }

  initSpongeSound() {
    try {
      this.spongeAudio = new Audio('assets/Sounds/Sponge.mp3');
      this.spongeAudio.preload = 'auto';
      if (this.ctx) {
        fetch('assets/Sounds/Sponge.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.spongeBuffer = decoded; })
          .catch(() => {});
      }
    } catch (e) {}
  }

  initEraserSound() {
    try {
      this.eraserAudio = new Audio('assets/Sounds/Eraser_01.mp3');
      this.eraserAudio.preload = 'auto';
      if (this.ctx) {
        fetch('assets/Sounds/Eraser_01.mp3')
          .then(res => {
            if (!res.ok) throw new Error('Not found');
            return res.arrayBuffer();
          })
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.eraserBuffer = decoded; })
          .catch(() => {
            fetch('assets/Sounds/Eraser.mp3')
              .then(res => res.arrayBuffer())
              .then(buf => this.ctx.decodeAudioData(buf))
              .then(decoded => { this.eraserBuffer = decoded; })
              .catch(() => {});
          });
      }
    } catch (e) {}
  }

  initErrorSound() {
    try {
      this.errorAudio = new Audio('assets/Sounds/Error.mp3');
      this.errorAudio.preload = 'auto';
      if (this.ctx) {
        fetch('assets/Sounds/Error.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.errorBuffer = decoded; })
          .catch(() => {});
      }
    } catch (e) {}
  }

  initYarnSound() {
    try {
      this.yarnAudio = new Audio('assets/Sounds/Yarn.mp3');
      this.yarnAudio.preload = 'auto';
      if (this.ctx) {
        fetch('assets/Sounds/Yarn.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.yarnBuffer = decoded; })
          .catch(() => {});
      }
    } catch (e) {}
  }

  initTrunkSound() {
    try {
      this.trunkAudio = new Audio('assets/Sounds/Trunk.mp3');
      this.trunkAudio.preload = 'auto';
      if (this.ctx) {
        fetch('assets/Sounds/Trunk.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.trunkBuffer = decoded; })
          .catch(() => {});
      }
    } catch (e) {}
  }

  // Pre-generates pink noise buffer for warm, organic frypan & sponge friction
  createNoiseBuffer() {
    if (!this.ctx) return null;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 2.0); // 2 seconds
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.45;
      }
      return this.noiseBuffer;
    } catch (e) {
      return null;
    }
  }

  getNoiseBuffer() {
    if (!this.noiseBuffer && this.ctx) {
      this.createNoiseBuffer();
    }
    return this.noiseBuffer || this.createFallbackNoiseBuffer();
  }

  createFallbackNoiseBuffer() {
    if (!this.ctx) return null;
    const len = Math.floor(this.ctx.sampleRate * 0.15);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
    return buf;
  }

  // Robust Mobile Audio Unlock: Unlocks WebAudio on first touch/tap on iOS & Android
  setupMobileAudioUnlock() {
    const unlock = () => {
      this.unlockAudio();
    };
    ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown', 'click'].forEach(evt => {
      window.addEventListener(evt, unlock, { capture: true, passive: true });
      document.addEventListener(evt, unlock, { capture: true, passive: true });
    });
  }

  unlockAudio() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (!this.spongeBuffer) {
        fetch('assets/Sounds/Sponge.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.spongeBuffer = decoded; })
          .catch(() => {});
      }
      if (!this.startBuffer) {
        fetch('assets/Sounds/Start.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.startBuffer = decoded; })
          .catch(() => {});
      }
      if (!this.eraserBuffer) {
        fetch('assets/Sounds/Eraser_01.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.eraserBuffer = decoded; })
          .catch(() => {});
      }
      if (!this.errorBuffer) {
        fetch('assets/Sounds/Error.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.errorBuffer = decoded; })
          .catch(() => {});
      }
      if (!this.wooBuffer) {
        fetch('assets/Sounds/Woo.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.wooBuffer = decoded; })
          .catch(() => {});
      }
      if (!this.yarnBuffer) {
        fetch('assets/Sounds/Yarn.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.yarnBuffer = decoded; })
          .catch(() => {});
      }
      if (!this.trunkBuffer) {
        fetch('assets/Sounds/Trunk.mp3')
          .then(res => res.arrayBuffer())
          .then(buf => this.ctx.decodeAudioData(buf))
          .then(decoded => { this.trunkBuffer = decoded; })
          .catch(() => {});
      }
      if (!this.noiseBuffer) {
        this.createNoiseBuffer();
      }
      // iOS Safari physical audio hardware unmute via 1-sample silent buffer
      try {
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.destinationNode);
        source.start(0);
      } catch (e) {}
    }
    if (!this.muted && this.musicEnabled && !this.bgmPlaying) {
      this.startBgm();
    }
  }

  setupPlayablesIntegration() {
    // Synchronize with YouTube system audio
    if (playables && typeof playables.onAudioChange === 'function') {
      playables.onAudioChange((enabled) => {
        this.setMuted(!enabled);
      });
      // Initial state
      if (typeof playables.isSystemAudioEnabled === 'function') {
        const enabled = playables.isSystemAudioEnabled();
        if (!enabled) this.setMuted(true);
      }
    }

    if (playables && typeof playables.onPause === 'function') {
      playables.onPause(() => {
        this.stopBgm();
        this.stopSpongeStroke();
        this.stopClayStroke();
        this.stopDoughStroke();
        this.stopYarnStroke();
        this.stopTrunkSpray();
        if (this.ctx && this.ctx.state === 'running') {
          this.ctx.suspend().catch(() => {});
        }
      });
    }

    if (playables && typeof playables.onResume === 'function') {
      playables.onResume(() => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        if (!this.muted && this.musicEnabled) {
          this.startBgm();
        }
      });
    }
  }

  initAudioContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      this.ctx = new AudioCtx();
      try {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 1, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      } catch (_) {}
    }
  }

  get destinationNode() {
    if (!this.masterGain && this.ctx) {
      try {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 1, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      } catch (_) {}
    }
    return this.masterGain || (this.ctx ? this.ctx.destination : null);
  }

  resume() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  canPlaySfx() {
    return !this.muted && this.soundsEnabled;
  }

  canPlayMusic() {
    return !this.muted && this.musicEnabled;
  }

  onMuteChange(cb) {
    this.muteListeners.push(cb);
  }

  notifyMuteListeners() {
    this.muteListeners.forEach(cb => {
      try { cb(this.muted); } catch (e) { console.error(e); }
    });
  }

  setMuted(isMuted) {
    this.muted = !!isMuted;
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 1, this.ctx.currentTime);
      } catch (_) {}
    }
    [this.startAudio, this.wooAudio, this.squeakAudio, this.spongeAudio, this.eraserAudio, this.errorAudio, this.yarnAudio, this.trunkAudio].forEach(a => {
      if (a) {
        try {
          if (this.muted) { a.pause(); a.muted = true; }
          else { a.muted = false; }
        } catch (_) {}
      }
    });
    if (this.muted) {
      this.stopBgm();
      this.stopSpongeStroke();
      this.stopClayStroke();
      this.stopDoughStroke();
      this.stopYarnStroke();
      this.stopTrunkSpray();
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend().catch(() => {});
      }
    } else {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (this.musicEnabled) {
        this.startBgm();
      }
    }
    this.notifyMuteListeners();
    this.notifyAudioSettingsChange();
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = !!enabled;
    try {
      localStorage.setItem('coloring_game_music_enabled', this.musicEnabled ? 'true' : 'false');
    } catch (e) {}
    if (!this.musicEnabled) {
      this.stopBgm();
    } else if (!this.muted) {
      this.startBgm();
    }
    this.notifyAudioSettingsChange();
  }

  setSoundsEnabled(enabled) {
    this.soundsEnabled = !!enabled;
    try {
      localStorage.setItem('coloring_game_sounds_enabled', this.soundsEnabled ? 'true' : 'false');
    } catch (e) {}
    if (!this.soundsEnabled) {
      this.stopSpongeStroke();
      this.stopClayStroke();
      this.stopDoughStroke();
      this.stopYarnStroke();
      this.stopTrunkSpray();
    }
    this.notifyAudioSettingsChange();
  }

  toggleMusic() {
    this.setMusicEnabled(!this.musicEnabled);
    return this.musicEnabled;
  }

  toggleSounds() {
    this.setSoundsEnabled(!this.soundsEnabled);
    return this.soundsEnabled;
  }

  onAudioSettingsChange(cb) {
    this.audioSettingsListeners.push(cb);
  }

  notifyAudioSettingsChange() {
    this.audioSettingsListeners.forEach(cb => {
      try {
        cb({
          musicEnabled: this.musicEnabled,
          soundsEnabled: this.soundsEnabled,
          currentBgmTrack: this.currentBgmTrack,
          muted: this.muted
        });
      } catch (e) {
        console.error(e);
      }
    });
  }

  // Stop Game Start sound (e.g. when user clicks Play and transitions to Categories)
  stopStart() {
    if (this.startSource) {
      try {
        this.startSource.stop();
      } catch (e) {}
      this.startSource = null;
    }
    if (this.startAudio) {
      try {
        this.startAudio.pause();
        this.startAudio.currentTime = 0;
      } catch (e) {}
    }
  }

  // Game Start sound when opening Splash screen ('Start.mp3' in Assets)
  playStart(volume = 0.85) {
    if (!this.canPlaySfx()) return;
    this.resume();
    this.stopStart();

    if (this.ctx && this.ctx.state === 'running' && this.startBuffer) {
      try {
        const now = this.ctx.currentTime;
        const source = this.ctx.createBufferSource();
        source.buffer = this.startBuffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, now);
        source.connect(gain);
        gain.connect(this.destinationNode);
        source.start(now);
        this.startSource = source;
        source.onended = () => {
          if (this.startSource === source) this.startSource = null;
        };
        return;
      } catch (e) {}
    }

    try {
      if (!this.startAudio) {
        this.startAudio = new Audio('assets/Sounds/Start.mp3');
      }
      this.startAudio.currentTime = 0;
      this.startAudio.volume = volume;
      const p = this.startAudio.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    } catch (e) {}
  }

  playGameStart(volume = 0.85) {
    this.playStart(volume);
  }

  // Playful pop / water-drop sound on color tap
  playPop(freqMultiplier = 1.0) {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = 480 * (0.9 + Math.random() * 0.3) * freqMultiplier;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.destinationNode);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {
      console.warn('Audio playPop error:', e);
    }
  }

  // Musical chime / xylophone note for palette selection
  playChime(noteIndex = 0) {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx) return;

    try {
      // Pentatonic scale frequencies: C5, D5, E5, G5, A5, C6, D6, E6
      const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
      const freq = scale[noteIndex % scale.length];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.destinationNode);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {}
  }

  // Bubbly button click
  playClick() {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.06);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.destinationNode);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // Squeak & soft paper-friction brush marker stroke sound (Audible on mobile speakers)
  playBrush() {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;

      // 1. Playful warm harmonic stroke tone (chubby marker nib)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const f = 520 + Math.random() * 260; // 520Hz - 780Hz
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);
      osc.frequency.exponentialRampToValueAtTime(f + 70, now + 0.07);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.destinationNode);
      osc.start(now);
      osc.stop(now + 0.09);

      // 2. Paper texture friction noise (crayon/felt-tip sliding on paper)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.06);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.45;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1600 + Math.random() * 400, now);
      filter.Q.setValueAtTime(1.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.14, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.destinationNode);

      whiteNoise.start(now);
    } catch (e) {}
  }

  // ASMR Marker Initial Contact Tap: Soft paper impulse + felt touch
  playMarkerTap() {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

      gain.gain.setValueAtTime(0.20, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      osc.connect(gain);
      gain.connect(this.destinationNode);
      osc.start(now);
      osc.stop(now + 0.06);

      // Soft squeak impulse snippet on contact
      this.playMarkerSqueak(0.20);
    } catch (e) {}
  }

  // ASMR Felt Marker Stroke Glide: Velvety Paper Friction + Textured Nib Grain
  playMarkerStroke(speed = 1) {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const dur = 0.085;

      // 1. Organic paper friction noise (chunky felt-tip sliding on paper)
      const bufferSize = Math.floor(this.ctx.sampleRate * dur);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.38;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      const centerFreq = 1850 + Math.min(speed * 30, 700) + (Math.random() - 0.5) * 150;
      filter.frequency.setValueAtTime(centerFreq, now);
      filter.Q.setValueAtTime(1.6, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.destinationNode);
      noise.start(now);

      // 2. Tactile felt nib harmonic grain from Squeak.mp3 buffer
      if (this.squeakBuffer && Math.random() < 0.60) {
        const squeak = this.ctx.createBufferSource();
        squeak.buffer = this.squeakBuffer;
        squeak.playbackRate.setValueAtTime(0.92 + Math.random() * 0.22, now);
        const sqGain = this.ctx.createGain();
        sqGain.gain.setValueAtTime(0.09, now);
        sqGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        squeak.connect(sqGain);
        sqGain.connect(this.destinationNode);
        squeak.start(now);
        squeak.stop(now + 0.09);
      }
    } catch (e) {}
  }

  // ASMR Felt Marker Squeak & Friction Glide (Uses decoded Squeak.mp3 with pitch-shifted tactile texture)
  playMarkerSqueak(volume = 0.45) {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (this.ctx && this.ctx.state === 'running' && this.squeakBuffer) {
      try {
        const now = this.ctx.currentTime;
        const source = this.ctx.createBufferSource();
        source.buffer = this.squeakBuffer;
        source.playbackRate.setValueAtTime(0.94 + Math.random() * 0.14, now);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        source.connect(gain);
        gain.connect(this.destinationNode);
        source.start(now);
        source.stop(now + 0.35);
        return;
      } catch (e) {}
    }
    if (this.squeakAudio) {
      try {
        this.squeakAudio.currentTime = 0;
        this.squeakAudio.volume = volume;
        this.squeakAudio.play().catch(() => {});
      } catch (e) {}
    }
  }

  // ASMR Soft Rubber Eraser Tap on Paper (initial contact)
  playEraser() {
    if (!this.canPlaySfx()) return;
    this.resume();

    // 1. WebAudio decoded Eraser.mp3 buffer with soft, gentle volume
    if (this.ctx && this.ctx.state === 'running' && this.eraserBuffer) {
      try {
        const now = this.ctx.currentTime;
        const source = this.ctx.createBufferSource();
        source.buffer = this.eraserBuffer;
        source.playbackRate.setValueAtTime(1.02 + Math.random() * 0.12, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        source.connect(gain);
        gain.connect(this.destinationNode);
        source.start(now);
        source.stop(now + 0.20);
        return;
      } catch (e) {}
    }

    // 2. Audio element fallback
    try {
      if (!this.eraserAudio) {
        this.eraserAudio = new Audio('assets/Sounds/Eraser_01.mp3');
      }
      this.eraserAudio.currentTime = 0;
      this.eraserAudio.volume = 0.35;
      this.eraserAudio.play().catch(() => {});
    } catch (e) {}
  }

  // ASMR Soft Rubber Scrubbing on Paper: Velvety Rubber Drag Friction
  playEraserRub(speed = 1) {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const dur = 0.085;

      // 1. Soft textured rubber-paper friction noise
      const bufferSize = Math.floor(this.ctx.sampleRate * dur);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.30;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      const centerFreq = 1250 + Math.min(speed * 25, 450) + (Math.random() - 0.5) * 100;
      filter.frequency.setValueAtTime(centerFreq, now);
      filter.Q.setValueAtTime(1.3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.destinationNode);
      noise.start(now);

      // 2. Soft grain snippet from Eraser.mp3
      if (this.eraserBuffer && Math.random() < 0.65) {
        const source = this.ctx.createBufferSource();
        source.buffer = this.eraserBuffer;
        source.playbackRate.setValueAtTime(0.98 + Math.random() * 0.16, now);
        const rubGain = this.ctx.createGain();
        rubGain.gain.setValueAtTime(0.12, now);
        rubGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        source.connect(rubGain);
        rubGain.connect(this.destinationNode);
        source.start(now);
        source.stop(now + 0.10);
      }
    } catch (e) {}
  }

  // ASMR Wet Sponge Dab on Canvas (Real Sponge.mp3 tactile squish)
  playSpongeSquish() {
    if (!this.canPlaySfx()) return;
    this.resume();

    // 1. WebAudio decoded Sponge.mp3 buffer
    if (this.ctx && this.ctx.state === 'running' && this.spongeBuffer) {
      try {
        const now = this.ctx.currentTime;
        const source = this.ctx.createBufferSource();
        source.buffer = this.spongeBuffer;
        // Subtle organic pitch variation for realistic tactile variety
        source.playbackRate.setValueAtTime(0.95 + Math.random() * 0.1, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(1.5, now);
        // Snappy tactile dab envelope
        gain.gain.setValueAtTime(1.5, now + 0.28);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

        source.connect(gain);
        gain.connect(this.destinationNode);
        source.start(now);
        source.stop(now + 0.44);
        return;
      } catch (e) {}
    }

    // 2. Audio element fallback
    try {
      if (!this.spongeAudio) {
        this.spongeAudio = new Audio('assets/Sounds/Sponge.mp3');
      }
      this.spongeAudio.currentTime = 0;
      this.spongeAudio.volume = 1.0;
      this.spongeAudio.play().catch(() => {});
      clearTimeout(this.spongeDabTimeout);
      this.spongeDabTimeout = setTimeout(() => {
        if (!this.spongeStrokePlaying && this.spongeAudio) {
          try {
            this.spongeAudio.pause();
            this.spongeAudio.currentTime = 0;
          } catch (e) {}
        }
      }, 420);
      return;
    } catch (e) {}

    // 3. Fallback synthetic oscillator squish if buffer not ready yet
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360 + Math.random() * 60, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
      oscGain.gain.setValueAtTime(0.48, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
      osc.connect(oscGain);
      oscGain.connect(this.destinationNode);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  }

  // ASMR Sponge Continuous Stroke / Scrub (Plays Sponge.mp3 smoothly while dragging)
  playSpongeStroke() {
    if (!this.canPlaySfx()) return;
    this.resume();

    // 1. WebAudio decoded Sponge.mp3 loop
    if (this.ctx && this.ctx.state === 'running' && this.spongeBuffer) {
      try {
        const now = this.ctx.currentTime;

        // If stroke loop is already active, sustain volume and refresh watchdog
        if (this.spongeStrokeSource && this.spongeStrokeGain) {
          this.spongeStrokeGain.gain.cancelScheduledValues(now);
          this.spongeStrokeGain.gain.setValueAtTime(1.5, now);
          this.resetSpongeStrokeWatchdog();
          return;
        }

        // Start seamless continuous sponge sound
        const source = this.ctx.createBufferSource();
        source.buffer = this.spongeBuffer;
        source.loop = true;
        source.playbackRate.setValueAtTime(1.0, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(1.5, now + 0.03);

        source.connect(gain);
        gain.connect(this.destinationNode);

        source.start(now);
        this.spongeStrokeSource = source;
        this.spongeStrokeGain = gain;
        this.spongeStrokePlaying = true;

        this.resetSpongeStrokeWatchdog();
        return;
      } catch (e) {}
    }

    // 2. Audio element fallback
    try {
      if (!this.spongeAudio) {
        this.spongeAudio = new Audio('assets/Sounds/Sponge.mp3');
      }
      this.spongeStrokePlaying = true;
      this.spongeAudio.loop = true;
      this.spongeAudio.volume = 0.85;
      if (this.spongeAudio.paused) {
        this.spongeAudio.play().catch(() => {});
      }
      this.resetSpongeStrokeWatchdog();
      return;
    } catch (e) {}

    // 3. Fallback synthetic friction if buffer not ready yet
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const noiseBuf = this.getNoiseBuffer();
      if (noiseBuf) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuf;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2200 + Math.random() * 400, now);
        filter.Q.setValueAtTime(1.8, now);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.52, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.destinationNode);
        noise.start(now, Math.random(), 0.085);
      }
    } catch (e) {}
  }

  // Watchdog timer: automatically stops stroke if finger pauses on canvas (> 180ms)
  resetSpongeStrokeWatchdog() {
    clearTimeout(this.spongeWatchdogTimer);
    this.spongeWatchdogTimer = setTimeout(() => {
      this.stopSpongeStroke();
    }, 180);
  }

  // Stops any active sponge sound immediately on touch release or finger pause
  stopSpongeStroke() {
    clearTimeout(this.spongeWatchdogTimer);
    clearTimeout(this.spongeDabTimeout);
    this.spongeStrokePlaying = false;

    // WebAudio stop with smooth 40ms anti-pop decay
    if (this.spongeStrokeSource) {
      try {
        const src = this.spongeStrokeSource;
        const gain = this.spongeStrokeGain;
        this.spongeStrokeSource = null;
        this.spongeStrokeGain = null;

        if (this.ctx && gain) {
          const now = this.ctx.currentTime;
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
          setTimeout(() => {
            try { src.stop(); src.disconnect(); } catch (e) {}
          }, 45);
        } else {
          try { src.stop(); } catch (e) {}
        }
      } catch (e) {}
    }

    // Audio element fallback stop
    if (this.spongeAudio) {
      try {
        this.spongeAudio.loop = false;
        this.spongeAudio.pause();
        this.spongeAudio.currentTime = 0;
      } catch (e) {}
    }
  }

  // ASMR Play-Doh (Squishy Dough) Compression Pop & Pillowy Thump
  playDoughSquish() {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;

      // 1. Warm Pillowy Dough Thump (Sine pitch slide from 180Hz down to 65Hz)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      const startF = 180 + Math.random() * 30;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startF, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.14);

      oscGain.gain.setValueAtTime(0.55, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(oscGain);
      oscGain.connect(this.destinationNode);
      osc.start(now);
      osc.stop(now + 0.16);

      // 2. Air pocket bubble release ("Schloop / Pfoop")
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = 'sine';
      const popF = 340 + Math.random() * 70;
      popOsc.frequency.setValueAtTime(popF, now + 0.015);
      popOsc.frequency.exponentialRampToValueAtTime(popF * 0.65, now + 0.07);

      popGain.gain.setValueAtTime(0.28, now + 0.015);
      popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      popOsc.connect(popGain);
      popGain.connect(this.destinationNode);
      popOsc.start(now + 0.015);
      popOsc.stop(now + 0.085);

      // 3. Moist dough squish puff (audible texture friction)
      const noiseBuf = this.getNoiseBuffer();
      if (noiseBuf) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuf;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1150 + Math.random() * 200, now);
        filter.Q.setValueAtTime(1.6, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.38, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.destinationNode);
        noise.start(now, Math.random(), 0.11);
      }
    } catch (e) {}
  }

  // ASMR Play-Doh Continuous Rolling / Extruder Glide (Rhythmic, velvety dough-kneading sound)
  playDoughStroke() {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;
      this.doughScrubStep = (this.doughScrubStep || 0) + 1;
      const isAlt = this.doughScrubStep % 2 === 1;

      // 1. Soft dough rolling friction (rich velvety clay squelch)
      const noiseBuf = this.getNoiseBuffer();
      if (noiseBuf) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuf;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        const f = isAlt ? (1350 + Math.random() * 180) : (1100 + Math.random() * 160);
        filter.frequency.setValueAtTime(f, now);
        filter.Q.setValueAtTime(2.0, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.42, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.destinationNode);
        noise.start(now, Math.random(), 0.10);
      }

      // 2. Gentle tactile dough squish glide tone
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      const toneF = isAlt ? (230 + Math.random() * 30) : (195 + Math.random() * 25);
      osc.frequency.setValueAtTime(toneF, now);
      osc.frequency.exponentialRampToValueAtTime(toneF * (isAlt ? 0.90 : 1.10), now + 0.085);

      oscGain.gain.setValueAtTime(0.24, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(oscGain);
      oscGain.connect(this.destinationNode);
      osc.start(now);
      osc.stop(now + 0.095);
    } catch (e) {}
  }

  stopDoughStroke() {
    this.doughScrubStep = 0;
  }

  // ASMR Wool Yarn / Thread Glide (Plays Yarn.mp3 smoothly while drawing)
  playYarnGlide() {
    if (!this.canPlaySfx()) return;
    this.resume();

    // 1. WebAudio decoded Yarn.mp3 loop
    if (this.ctx && this.ctx.state === 'running' && this.yarnBuffer) {
      try {
        const now = this.ctx.currentTime;

        // If continuous stroke is already active, sustain volume & reset watchdog
        if (this.yarnStrokeSource && this.yarnStrokeGain) {
          this.yarnStrokeGain.gain.cancelScheduledValues(now);
          this.yarnStrokeGain.gain.setValueAtTime(0.85, now);
          this.resetYarnStrokeWatchdog();
          return;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = this.yarnBuffer;
        source.loop = true;
        source.playbackRate.setValueAtTime(1.0, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.85, now + 0.03);

        source.connect(gain);
        gain.connect(this.destinationNode);

        source.start(now);
        this.yarnStrokeSource = source;
        this.yarnStrokeGain = gain;
        this.yarnStrokePlaying = true;

        this.resetYarnStrokeWatchdog();
        return;
      } catch (e) {}
    }

    // 2. Audio element fallback
    try {
      if (!this.yarnAudio) {
        this.yarnAudio = new Audio('assets/Sounds/Yarn.mp3');
      }
      this.yarnStrokePlaying = true;
      this.yarnAudio.loop = true;
      this.yarnAudio.volume = 0.85;
      if (this.yarnAudio.paused) {
        this.yarnAudio.play().catch(() => {});
      }
      this.resetYarnStrokeWatchdog();
      return;
    } catch (e) {}

    // 3. Fallback synthetic friction if buffer not ready yet
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      this.yarnScrubStep = (this.yarnScrubStep || 0) + 1;
      const isAlt = this.yarnScrubStep % 2 === 1;

      const noiseBuf = this.getNoiseBuffer();
      if (noiseBuf) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuf;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        const f = isAlt ? (2600 + Math.random() * 200) : (2200 + Math.random() * 180);
        filter.frequency.setValueAtTime(f, now);
        filter.Q.setValueAtTime(1.6, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.09, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.destinationNode);
        noise.start(now, Math.random(), 0.085);
      }

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      const toneF = isAlt ? (340 + Math.random() * 25) : (290 + Math.random() * 20);
      osc.frequency.setValueAtTime(toneF, now);
      osc.frequency.exponentialRampToValueAtTime(toneF * 0.95, now + 0.07);

      oscGain.gain.setValueAtTime(0.045, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      osc.connect(oscGain);
      oscGain.connect(this.destinationNode);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // ASMR Wool Knot / Thread Tap (Plays Yarn.mp3 tactile tap / knot)
  playYarnKnot() {
    if (!this.canPlaySfx()) return;
    this.resume();

    // 1. WebAudio decoded Yarn.mp3 one-shot dab
    if (this.ctx && this.ctx.state === 'running' && this.yarnBuffer) {
      try {
        const now = this.ctx.currentTime;
        const source = this.ctx.createBufferSource();
        source.buffer = this.yarnBuffer;
        source.playbackRate.setValueAtTime(1.05 + Math.random() * 0.08, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.85, now);
        gain.gain.setValueAtTime(0.85, now + 0.22);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        source.connect(gain);
        gain.connect(this.destinationNode);
        source.start(now);
        source.stop(now + 0.40);
        return;
      } catch (e) {}
    }

    // 2. Audio element fallback
    try {
      if (!this.yarnAudio) {
        this.yarnAudio = new Audio('assets/Sounds/Yarn.mp3');
      }
      this.yarnAudio.currentTime = 0;
      this.yarnAudio.volume = 0.85;
      this.yarnAudio.play().catch(() => {});
      clearTimeout(this.yarnDabTimeout);
      this.yarnDabTimeout = setTimeout(() => {
        if (!this.yarnStrokePlaying && this.yarnAudio) {
          try {
            this.yarnAudio.pause();
            this.yarnAudio.currentTime = 0;
          } catch (e) {}
        }
      }, 400);
      return;
    } catch (e) {}

    // 3. Fallback synthetic pluck if buffer not ready yet
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.09);

      oscGain.gain.setValueAtTime(0.12, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.10);

      osc.connect(oscGain);
      oscGain.connect(this.destinationNode);
      osc.start(now);
      osc.stop(now + 0.11);
    } catch (e) {}
  }

  resetYarnStrokeWatchdog() {
    clearTimeout(this.yarnWatchdogTimer);
    this.yarnWatchdogTimer = setTimeout(() => {
      this.stopYarnStroke();
    }, 180);
  }

  stopYarnStroke() {
    clearTimeout(this.yarnWatchdogTimer);
    this.yarnScrubStep = 0;
    if (this.yarnStrokePlaying) {
      this.yarnStrokePlaying = false;
      if (this.yarnStrokeGain && this.ctx && this.ctx.state === 'running') {
        try {
          const now = this.ctx.currentTime;
          this.yarnStrokeGain.gain.cancelScheduledValues(now);
          this.yarnStrokeGain.gain.setValueAtTime(this.yarnStrokeGain.gain.value, now);
          this.yarnStrokeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
          const oldSource = this.yarnStrokeSource;
          setTimeout(() => {
            try { oldSource?.stop(); oldSource?.disconnect(); } catch (e) {}
          }, 80);
        } catch (e) {}
      }
      this.yarnStrokeSource = null;
      this.yarnStrokeGain = null;
      if (this.yarnAudio) {
        try {
          this.yarnAudio.pause();
          this.yarnAudio.currentTime = 0;
        } catch (e) {}
      }
    }
  }

  // High-Pressure Elephant Trunk Spray (Plays Trunk.mp3 smoothly while spraying)
  playTrunkSpray() {
    if (!this.canPlaySfx()) return;
    this.resume();

    // 1. WebAudio decoded Trunk.mp3 loop
    if (this.ctx && this.ctx.state === 'running' && this.trunkBuffer) {
      try {
        const now = this.ctx.currentTime;

        // If spray loop is already active, sustain volume and refresh watchdog
        if (this.trunkStrokeSource && this.trunkStrokeGain) {
          this.trunkStrokeGain.gain.cancelScheduledValues(now);
          this.trunkStrokeGain.gain.setValueAtTime(0.9, now);
          this.resetTrunkSprayWatchdog();
          return;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = this.trunkBuffer;
        source.loop = true;
        source.playbackRate.setValueAtTime(1.0, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.9, now + 0.04);

        source.connect(gain);
        gain.connect(this.destinationNode);

        source.start(now);
        this.trunkStrokeSource = source;
        this.trunkStrokeGain = gain;
        this.trunkStrokePlaying = true;

        this.resetTrunkSprayWatchdog();
        return;
      } catch (e) {}
    }

    // 2. Audio element fallback
    try {
      if (!this.trunkAudio) {
        this.trunkAudio = new Audio('assets/Sounds/Trunk.mp3');
      }
      this.trunkStrokePlaying = true;
      this.trunkAudio.loop = true;
      this.trunkAudio.volume = 0.9;
      if (this.trunkAudio.paused) {
        this.trunkAudio.play().catch(() => {});
      }
      this.resetTrunkSprayWatchdog();
      return;
    } catch (e) {}

    // 3. Fallback synthetic spray if buffer not ready yet
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      this.trunkSprayStep = (this.trunkSprayStep || 0) + 1;
      const isAlt = this.trunkSprayStep % 2 === 1;

      const noiseBuf = this.getNoiseBuffer();
      if (noiseBuf) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuf;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        const centerF = isAlt ? (1650 + Math.random() * 250) : (1350 + Math.random() * 200);
        filter.frequency.setValueAtTime(centerF, now);
        filter.Q.setValueAtTime(2.2, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.24, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.destinationNode);
        noise.start(now, Math.random(), 0.12);
      }

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      const startF = isAlt ? (580 + Math.random() * 80) : (440 + Math.random() * 60);
      osc.frequency.setValueAtTime(startF, now);
      osc.frequency.exponentialRampToValueAtTime(startF * 0.45, now + 0.08);

      oscGain.gain.setValueAtTime(0.14, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(oscGain);
      oscGain.connect(this.destinationNode);
      osc.start(now);
      osc.stop(now + 0.095);
    } catch (e) {}
  }

  // Playful Elephant Trumpet + Splatter Burst (Tool Select or Initial Tap)
  playTrunkBurst() {
    if (!this.canPlaySfx()) return;
    this.resume();

    // 1. WebAudio decoded Trunk.mp3 burst
    if (this.ctx && this.ctx.state === 'running' && this.trunkBuffer) {
      try {
        const now = this.ctx.currentTime;
        const source = this.ctx.createBufferSource();
        source.buffer = this.trunkBuffer;
        source.playbackRate.setValueAtTime(1.02 + Math.random() * 0.06, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.9, now);
        gain.gain.setValueAtTime(0.9, now + 0.28);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

        source.connect(gain);
        gain.connect(this.destinationNode);
        source.start(now);
        source.stop(now + 0.50);
        return;
      } catch (e) {}
    }

    // 2. Audio element fallback
    try {
      if (!this.trunkAudio) {
        this.trunkAudio = new Audio('assets/Sounds/Trunk.mp3');
      }
      this.trunkAudio.currentTime = 0;
      this.trunkAudio.volume = 0.9;
      this.trunkAudio.play().catch(() => {});
      clearTimeout(this.trunkDabTimeout);
      this.trunkDabTimeout = setTimeout(() => {
        if (!this.trunkStrokePlaying && this.trunkAudio) {
          try {
            this.trunkAudio.pause();
            this.trunkAudio.currentTime = 0;
          } catch (e) {}
        }
      }, 500);
      return;
    } catch (e) {}

    // 3. Fallback synthetic trumpet & rush
    if (!this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.22);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.12);
      filter.frequency.exponentialRampToValueAtTime(800, now + 0.24);

      oscGain.gain.setValueAtTime(0.16, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.destinationNode);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  resetTrunkSprayWatchdog() {
    clearTimeout(this.trunkWatchdogTimer);
    this.trunkWatchdogTimer = setTimeout(() => {
      this.stopTrunkSpray();
    }, 180);
  }

  stopTrunkSpray() {
    clearTimeout(this.trunkWatchdogTimer);
    this.trunkSprayStep = 0;
    if (this.trunkStrokePlaying) {
      this.trunkStrokePlaying = false;
      if (this.trunkStrokeGain && this.ctx && this.ctx.state === 'running') {
        try {
          const now = this.ctx.currentTime;
          this.trunkStrokeGain.gain.cancelScheduledValues(now);
          this.trunkStrokeGain.gain.setValueAtTime(this.trunkStrokeGain.gain.value, now);
          this.trunkStrokeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          const oldSource = this.trunkStrokeSource;
          setTimeout(() => {
            try { oldSource?.stop(); oldSource?.disconnect(); } catch (e) {}
          }, 90);
        } catch (e) {}
      }
      this.trunkStrokeSource = null;
      this.trunkStrokeGain = null;
      if (this.trunkAudio) {
        try {
          this.trunkAudio.pause();
          this.trunkAudio.currentTime = 0;
        } catch (e) {}
      }
    }
  }

  // Aliases for backwards-compatibility
  playClaySquish() { this.playDoughSquish(); }
  playClayStroke() { this.playDoughStroke(); }
  stopClayStroke() { this.stopDoughStroke(); }

  // ASMR Watery Plop sound for Magic Fill bucket
  playFillPlop() {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Fundamental water pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.destinationNode);
      osc.start(now);
      osc.stop(now + 0.17);

      // Gentle harmonic shimmer
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1046.5, now + 0.03);
      osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.12);

      gain2.gain.setValueAtTime(0.12, now + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc2.connect(gain2);
      gain2.connect(this.destinationNode);
      osc2.start(now + 0.03);
      osc2.stop(now + 0.23);
    } catch (e) {}
  }

  // Bright double-tone coin collect chime
  playCoin() {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // High B5 -> E6 chime
      [987.77, 1318.51].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.28, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);

        osc.connect(gain);
        gain.connect(this.destinationNode);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch (e) {}
  }

  // Sparkling star rating pop
  playStar(index = 0) {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx) return;

    try {
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
      const freq = freqs[index % freqs.length];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.destinationNode);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch (e) {}
  }

  // Mystical gift explosion chime
  playGift() {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(this.destinationNode);
          osc.start(now);
          osc.stop(now + 0.38);
        }, idx * 60);
      });
    } catch (e) {}
  }

  // Level unlock fanfare
  playLevelUnlock() {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx) return;

    try {
      const notes = [392.00, 523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.connect(gain);
          gain.connect(this.destinationNode);
          osc.start(now);
          osc.stop(now + 0.32);
        }, idx * 90);
      });
    } catch (e) {}
  }

  // Tactile Error / Insufficient credits buzz sound (Error.mp3)
  playError() {
    if (!this.canPlaySfx()) return;
    this.resume();

    // 1. WebAudio decoded Error.mp3 buffer
    if (this.ctx && this.ctx.state === 'running' && this.errorBuffer) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.errorBuffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.9, this.ctx.currentTime);
        source.connect(gain);
        gain.connect(this.destinationNode);
        source.start(0);
        return;
      } catch (e) {}
    }

    // 2. Audio element fallback
    try {
      if (!this.errorAudio) {
        this.errorAudio = new Audio('assets/Sounds/Error.mp3');
      }
      this.errorAudio.currentTime = 0;
      this.errorAudio.volume = 0.9;
      this.errorAudio.play().catch(() => {});
    } catch (e) {}
  }

  // Gentle sparkle chime when reaching 90% completion
  playSparkle() {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx) return;

    try {
      const notes = [1046.50, 1318.51, 1567.98, 2093.00];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.18, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(this.destinationNode);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.38);
      });
    } catch (e) {}
  }

  // Ultra-soft, gentle ASMR fairy-dust micro-crystal shimmer for glitter coloring (Lite & relaxing, zero headache)
  playGlitterShimmer() {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const now = this.ctx.currentTime;
      // High delicate crystalline micro-frequencies (soothing, gentle fairy dust)
      const shimmerNotes = [1760.00, 1975.53, 2093.00, 2349.32, 2637.02];
      const freq = shimmerNotes[Math.floor(Math.random() * shimmerNotes.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      // Gentle subtle upward micro-glissando for airy fairy-dust texture
      osc.frequency.exponentialRampToValueAtTime(freq * 1.06, now + 0.08);

      // Very soft whisper gain (0.026) so it feels like a subtle ASMR shimmer, never harsh or loud
      gain.gain.setValueAtTime(0.026, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.10);

      osc.connect(gain);
      gain.connect(this.destinationNode);

      osc.start(now);
      osc.stop(now + 0.11);
    } catch (e) {}
  }

  // Plays celebration 'Woo.mp3' from assets/Sounds
  playWoo() {
    if (!this.canPlaySfx()) return;
    this.resume();

    // 1. WebAudio decoded buffer (instant, hardware-synchronized)
    if (this.ctx && this.ctx.state === 'running' && this.wooBuffer) {
      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.wooBuffer;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.9, this.ctx.currentTime);
        source.connect(gain);
        gain.connect(this.destinationNode);
        source.start(0);
        return;
      } catch (e) {}
    }

    // 2. Audio element fallback
    try {
      if (!this.wooAudio) {
        this.wooAudio = new Audio('assets/Sounds/Woo.mp3');
      }
      this.wooAudio.currentTime = 0;
      this.wooAudio.volume = 0.9;
      this.wooAudio.play().catch(() => {});
    } catch (e) {}
  }

  // Majestic celebration fanfare + 'Woo.mp3' celebration sound
  playFanfare() {
    if (!this.canPlaySfx()) return;
    this.resume();

    // Play Woo.mp3 audio asset for completion
    this.playWoo();

    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      if (this.lastFanfareTime && (now - this.lastFanfareTime < 1.2)) {
        return;
      }
      this.lastFanfareTime = now;
      const notes = [
        { f: 523.25, time: 0.0, dur: 0.14 },    // C5
        { f: 659.25, time: 0.14, dur: 0.14 },   // E5
        { f: 783.99, time: 0.28, dur: 0.14 },   // G5
        { f: 1046.50, time: 0.42, dur: 0.55 },  // C6
        { f: 1318.51, time: 0.42, dur: 0.55 }   // E6 chord harmony
      ];

      notes.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now + note.time);
        gain.gain.setValueAtTime(0.28, now + note.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur);
        osc.connect(gain);
        gain.connect(this.destinationNode);
        osc.start(now + note.time);
        osc.stop(now + note.time + note.dur + 0.05);
      });
    } catch (e) {}
  }

  // Fireworks rocket launch whoosh
  playFireworkLaunch() {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.22);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.destinationNode);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  // Fireworks explosion pop & crackle
  playFireworkBurst() {
    if (!this.canPlaySfx()) return;
    this.resume();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Low punchy thump
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.18);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.destinationNode);
      osc.start(now);
      osc.stop(now + 0.23);

      // Crackle sparkles
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          if (!this.ctx || !this.canPlaySfx()) return;
          const t = this.ctx.currentTime;
          const cOsc = this.ctx.createOscillator();
          const cGain = this.ctx.createGain();
          cOsc.type = 'square';
          cOsc.frequency.setValueAtTime(1600 + Math.random() * 1400, t);
          cGain.gain.setValueAtTime(0.035, t);
          cGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
          cOsc.connect(cGain);
          cGain.connect(this.destinationNode);
          cOsc.start(t);
          cOsc.stop(t + 0.05);
        }, 60 + i * 45);
      }
    } catch (e) {}
  }

  // Ambient Zen Art Therapy Background Music (3 Calming Compositions)
  startBgm() {
    if (!this.canPlayMusic()) return;
    this.resume();
    if (this.bgmPlaying && this.bgmTimer) return;
    this.bgmPlaying = true;

    const tracks = {
      // Track 1: Zen Garden / Ambient Calm (Soft soothing pentatonic chimes & stream)
      track_1: {
        tempo: 680,
        type: 'sine',
        notes: [
          329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 659.25,
          493.88, 440.00, 392.00, 440.00, 493.88, 392.00, 329.63
        ],
        gain: 0.082,
        attack: 0.04,
        decay: 0.72
      },
      // Track 2: Lotus Peace / Tibetan Singing Chimes & Healing Harmonic Waves
      track_2: {
        tempo: 820,
        type: 'sine',
        notes: [
          261.63, 392.00, 523.25, 587.33, 659.25, 587.33, 523.25, 392.00,
          440.00, 349.23, 392.00, 523.25, 659.25, 783.99, 659.25, 523.25
        ],
        gain: 0.076,
        attack: 0.06,
        decay: 0.90
      },
      // Track 3: Bamboo Breeze / Serene Forest Meditation Flute & Harp
      track_3: {
        tempo: 580,
        type: 'triangle',
        notes: [
          293.66, 349.23, 392.00, 440.00, 523.25, 587.33, 523.25, 440.00,
          392.00, 349.23, 440.00, 523.25, 587.33, 440.00, 293.66
        ],
        gain: 0.070,
        attack: 0.03,
        decay: 0.55
      }
    };

    // Backward-compatibility aliases
    tracks.calm_zen = tracks.track_1;
    tracks.music_box = tracks.track_1;
    tracks.sunny_melody = tracks.track_2;
    tracks.playful_toys = tracks.track_3;

    const currentTrack = tracks[this.currentBgmTrack] || tracks.track_1;
    const notes = currentTrack.notes;
    let noteIdx = 0;

    const tick = () => {
      if (!this.bgmPlaying || !this.canPlayMusic()) return;
      try {
        if (this.ctx && this.ctx.state === 'running') {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = currentTrack.type || 'sine';
          osc.frequency.setValueAtTime(notes[noteIdx % notes.length], now);

          const attack = currentTrack.attack || 0.04;
          const decay = currentTrack.decay || 0.65;
          const targetGain = currentTrack.gain || 0.08;

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(targetGain, now + attack);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);

          osc.connect(gain);
          gain.connect(this.destinationNode);

          osc.start(now);
          osc.stop(now + attack + decay + 0.02);
          noteIdx++;
        } else if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      } catch (e) {}

      this.bgmTimer = setTimeout(tick, currentTrack.tempo || 680);
    };

    tick();
  }

  setBgmTrack(trackId) {
    const validTracks = ['track_1', 'track_2', 'track_3'];
    if (!validTracks.includes(trackId)) {
      if (trackId === 'calm_zen' || trackId === 'music_box') trackId = 'track_1';
      else if (trackId === 'sunny_melody') trackId = 'track_2';
      else if (trackId === 'playful_toys') trackId = 'track_3';
      else trackId = 'track_1';
    }
    this.currentBgmTrack = trackId;
    try {
      localStorage.setItem('coloring_game_music_track', trackId);
    } catch (e) {}

    // If currently playing, smoothly restart with new track
    if (this.bgmPlaying) {
      this.stopBgm();
      this.startBgm();
    }
    this.notifyAudioSettingsChange();
  }

  stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sounds = new SoundEngine();