// YouTube Playables SDK Integration Layer (Official ytgame & Legacy YTPlayables)
// Handles YouTube Playables lifecycle, pause/resume, system audio sync, and unified cloud save
// with seamless fallbacks for local browser development, offline testing, and standalone play.

export class PlayablesManager {
  constructor() {
    this.sdk = window.ytgame || window.YTPlayables || null;
    this.isPlayables = !!this.sdk;
    this.pauseCallbacks = [];
    this.resumeCallbacks = [];
    this.audioChangeCallbacks = [];

    // Unified in-memory dictionary for cloud storage mapping
    this.cloudStore = {};
    this.cloudSaveTimer = null;
    this.isInitialized = false;
    this.loggedErrors = new Set(); // Rate-limiting deduplication for health logs

    this.setupGlobalErrorBoundary();
    this.init();
  }

  async init() {
    console.log('[Playables SDK] Initializing... YouTube environment detected:', this.isPlayables);

    // 1. YouTube Playables system lifecycle listeners
    if (window.ytgame && window.ytgame.system) {
      if (typeof window.ytgame.system.onPause === 'function') {
        window.ytgame.system.onPause(() => this.triggerPause());
      }
      if (typeof window.ytgame.system.onResume === 'function') {
        window.ytgame.system.onResume(() => this.triggerResume());
      }
      if (typeof window.ytgame.system.onAudioEnabledChange === 'function') {
        window.ytgame.system.onAudioEnabledChange((enabled) => {
          console.log('[Playables SDK] System Audio Enabled Change:', enabled);
          this.triggerAudioChange(enabled);
        });
      }
    } else if (window.YTPlayables) {
      if (typeof window.YTPlayables.onPause === 'function') {
        window.YTPlayables.onPause(() => this.triggerPause());
      }
      if (typeof window.YTPlayables.onResume === 'function') {
        window.YTPlayables.onResume(() => this.triggerResume());
      }
    }

    // 2. Standalone desktop window focus/blur fallback (ONLY for local browser dev outside YouTube)
    // NOTE: Official YouTube Playables Requirement explicitly mandates:
    // "Game MUST NOT use the Web Page Visibility API and MUST only use Playables SDK."
    if (!this.isPlayables) {
      window.addEventListener('blur', () => this.triggerPause());
      window.addEventListener('focus', () => this.triggerResume());
    }

    // 3. Pre-load Cloud Storage data into in-memory store
    await this.initStorage();
    this.isInitialized = true;
  }

  // Preloads cloud storage into cache
  async initStorage() {
    try {
      if (window.ytgame && window.ytgame.game && typeof window.ytgame.game.loadData === 'function') {
        const raw = await window.ytgame.game.loadData();
        if (raw) {
          try {
            this.cloudStore = JSON.parse(raw);
            console.log('[Playables SDK] Successfully loaded unified save data from ytgame cloud');
            return;
          } catch (pe) {
            console.warn('[Playables SDK] Error parsing ytgame cloud data:', pe);
          }
        }
      }
    } catch (e) {
      console.warn('[Playables SDK] ytgame.game.loadData failed, falling back:', e);
    }

    // Fallback: populate from localStorage if available
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('yt_color_')) {
          const subKey = key.replace('yt_color_', '');
          try {
            this.cloudStore[subKey] = JSON.parse(localStorage.getItem(key));
          } catch (_) {}
        }
      }
    } catch (_) {}
  }

  // Notify YouTube the first frame / initial shell is rendered
  notifyFirstFrameReady() {
    console.log('[Playables SDK] Notifying First Frame Ready');
    if (window.ytgame && window.ytgame.game && typeof window.ytgame.game.firstFrameReady === 'function') {
      try {
        window.ytgame.game.firstFrameReady();
      } catch (err) {
        console.warn('[Playables SDK] ytgame.game.firstFrameReady error:', err);
      }
    } else if (window.YTPlayables && typeof window.YTPlayables.firstFrameReady === 'function') {
      try {
        window.YTPlayables.firstFrameReady();
      } catch (err) {
        console.warn('[Playables SDK] YTPlayables.firstFrameReady error:', err);
      }
    }
  }

  // Notify YouTube the game has finished loading and is ready for user interaction
  notifyGameReady() {
    console.log('[Playables SDK] Notifying Game Ready');
    if (window.ytgame && window.ytgame.game && typeof window.ytgame.game.gameReady === 'function') {
      try {
        window.ytgame.game.gameReady();
      } catch (err) {
        console.warn('[Playables SDK] ytgame.game.gameReady error:', err);
      }
    } else if (window.YTPlayables && typeof window.YTPlayables.gameReady === 'function') {
      try {
        window.YTPlayables.gameReady();
      } catch (err) {
        console.warn('[Playables SDK] YTPlayables.gameReady error:', err);
      }
    }
  }

  // Report player score / progress to YouTube Playables
  async sendScore(score) {
    const intScore = Math.floor(Number(score)) || 0;
    console.log('[Playables SDK] sendScore:', intScore);
    if (window.ytgame && window.ytgame.engagement && typeof window.ytgame.engagement.sendScore === 'function') {
      try {
        await window.ytgame.engagement.sendScore({ value: intScore });
        return;
      } catch (err) {
        console.warn('[Playables SDK] ytgame.engagement.sendScore error:', err);
      }
    }
    if (window.ytgame && window.ytgame.game && typeof window.ytgame.game.sendScore === 'function') {
      try {
        await window.ytgame.game.sendScore({ value: intScore });
        return;
      } catch (err) {
        console.warn('[Playables SDK] ytgame.game.sendScore error:', err);
      }
    }
  }

  onPause(cb) {
    this.pauseCallbacks.push(cb);
  }

  onResume(cb) {
    this.resumeCallbacks.push(cb);
  }

  onAudioChange(cb) {
    this.audioChangeCallbacks.push(cb);
  }

  triggerPause() {
    console.log('[Playables SDK] Game Paused');
    // Ensure any pending cloud save is flushed immediately on pause
    this.flushCloudSave();

    this.pauseCallbacks.forEach(cb => {
      try { cb(); } catch (e) { console.error(e); }
    });
  }

  triggerResume() {
    console.log('[Playables SDK] Game Resumed');
    this.resumeCallbacks.forEach(cb => {
      try { cb(); } catch (e) { console.error(e); }
    });
  }

  triggerAudioChange(enabled) {
    this.audioChangeCallbacks.forEach(cb => {
      try { cb(enabled); } catch (e) { console.error(e); }
    });
  }

  // Query system audio state (true = sound on, false = muted)
  isSystemAudioEnabled() {
    if (window.ytgame && window.ytgame.system && typeof window.ytgame.system.isAudioEnabled === 'function') {
      try {
        return window.ytgame.system.isAudioEnabled();
      } catch (_) {}
    }
    return true;
  }

  // Cloud Save / Progress storage (Unified store for ytgame & localStorage fallback)
  async saveData(key, value) {
    this.cloudStore[key] = value;

    // 1. Immediately store in localStorage fallback
    try {
      localStorage.setItem(`yt_color_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('localStorage setItem failed:', e);
    }

    // 2. Debounced save to official ytgame cloud
    this.scheduleCloudSave();
    return true;
  }

  scheduleCloudSave() {
    if (this.cloudSaveTimer) clearTimeout(this.cloudSaveTimer);
    this.cloudSaveTimer = setTimeout(() => {
      this.flushCloudSave();
    }, 400);
  }

  async flushCloudSave() {
    if (this.cloudSaveTimer) {
      clearTimeout(this.cloudSaveTimer);
      this.cloudSaveTimer = null;
    }

    const payload = JSON.stringify(this.cloudStore);

    // Official modern YouTube Playables SDK
    if (window.ytgame && window.ytgame.game && typeof window.ytgame.game.saveData === 'function') {
      try {
        await window.ytgame.game.saveData(payload);
        return;
      } catch (e) {
        console.warn('[Playables SDK] ytgame.game.saveData error:', e);
      }
    }

    // Legacy cloudStorage fallback
    if (window.YTPlayables && window.YTPlayables.cloudStorage && typeof window.YTPlayables.cloudStorage.setItem === 'function') {
      try {
        await window.YTPlayables.cloudStorage.setItem('all_data', payload);
      } catch (e) {
        console.warn('[Playables SDK] YTPlayables.cloudStorage.setItem error:', e);
      }
    }
  }

  async loadData(key) {
    // Return cached value if present
    if (this.cloudStore[key] !== undefined) {
      return this.cloudStore[key];
    }

    // Legacy or localStorage fallback
    try {
      const localVal = localStorage.getItem(`yt_color_${key}`);
      if (localVal) {
        const parsed = JSON.parse(localVal);
        this.cloudStore[key] = parsed;
        return parsed;
      }
    } catch (e) {
      console.warn('localStorage getItem failed:', e);
    }

    return null;
  }

  // Global Error Boundary & Health Logging to YouTube Playables (ytgame.health)
  setupGlobalErrorBoundary() {
    window.onerror = (message, source, lineno, colno, error) => {
      const errStr = error
        ? (error.stack || error.message || String(error))
        : `${message} (${source || 'unknown'}:${lineno || 0}:${colno || 0})`;
      console.error('[YouTube Playables Error Boundary]', errStr);
      this.logError(errStr);
      return false;
    };

    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      const errStr = reason
        ? (reason.stack || reason.message || String(reason))
        : 'Unhandled Promise Rejection';
      console.error('[YouTube Playables Unhandled Rejection]', errStr);
      this.logError(errStr);
    });
  }

  // Reports error to YouTube stability telemetry (with deduplication & rate limiting)
  logError(error) {
    const errorStr = typeof error === 'string' ? error : (error?.message || error?.stack || JSON.stringify(error));
    if (!errorStr || this.loggedErrors.has(errorStr)) return;
    this.loggedErrors.add(errorStr);

    if (window.ytgame && window.ytgame.health && typeof window.ytgame.health.logError === 'function') {
      try {
        window.ytgame.health.logError(errorStr);
      } catch (e) {
        console.warn('[Playables SDK] ytgame.health.logError error:', e);
      }
    }
  }

  // Reports warning to YouTube stability telemetry
  logWarning(warning) {
    const warnStr = typeof warning === 'string' ? warning : (warning?.message || String(warning));
    if (!warnStr || this.loggedErrors.has(warnStr)) return;
    this.loggedErrors.add(warnStr);

    if (window.ytgame && window.ytgame.health && typeof window.ytgame.health.logWarning === 'function') {
      try {
        window.ytgame.health.logWarning(warnStr);
      } catch (e) {
        console.warn('[Playables SDK] ytgame.health.logWarning error:', e);
      }
    }
  }

  // Rewarded Ads Integration (ytgame.ads.requestRewardedAd)
  // Automatically pauses game execution & mutes sound before ad, and resumes after
  async requestRewardedAd(rewardId = 'unlock_special_neon_colors') {
    console.log('[Playables SDK] Requesting Rewarded Ad for:', rewardId);
    this.triggerPause();

    let rewardGranted = false;
    try {
      if (window.ytgame && window.ytgame.ads && typeof window.ytgame.ads.requestRewardedAd === 'function') {
        try {
          rewardGranted = await window.ytgame.ads.requestRewardedAd(rewardId);
        } catch (adErr) {
          // If running in development/local test environment outside real YouTube container, simulate completion
          const isDevHost = ['localhost', '127.0.0.1'].includes(window.location.hostname) ||
                            window.location.hostname.startsWith('192.168.') ||
                            window.location.hostname.startsWith('10.');
          if (isDevHost) {
            console.info('[Playables SDK] Local test environment: ad API unavailable outside YouTube shell, simulating rewarded ad completion.');
            await new Promise(r => setTimeout(r, 600));
            rewardGranted = true;
          } else {
            throw adErr;
          }
        }
      } else {
        // Fallback for standalone/local browser development:
        console.info('[Playables SDK] Standalone environment detected. Simulating rewarded ad completion.');
        await new Promise(r => setTimeout(r, 600));
        rewardGranted = true;
      }
    } catch (err) {
      console.warn('[Playables SDK] requestRewardedAd failed or was dismissed:', err);
      this.logWarning('Rewarded ad dismissed or failed: ' + (err?.message || String(err)));
      rewardGranted = false;
    } finally {
      this.triggerResume();
    }
    return !!rewardGranted;
  }

  // Interstitial Ads Integration (ytgame.ads.requestInterstitialAd)
  async requestInterstitialAd() {
    console.log('[Playables SDK] Requesting Interstitial Ad');
    this.triggerPause();

    try {
      if (window.ytgame && window.ytgame.ads && typeof window.ytgame.ads.requestInterstitialAd === 'function') {
        await window.ytgame.ads.requestInterstitialAd();
      }
    } catch (err) {
      console.warn('[Playables SDK] requestInterstitialAd error:', err);
    } finally {
      this.triggerResume();
    }
  }
}

export const playables = new PlayablesManager();
window.playables = playables;