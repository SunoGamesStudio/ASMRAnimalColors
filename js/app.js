// Main Application Controller with Refined Studio, 3-Crayon Tailored Palette, & Artwork Celebration
import { CATEGORIES, getAnimalColors } from './animals-data.js';
import { ColoringCanvas, prefetchAnimalSvg } from './coloring-canvas.js';
import { FireworksFX } from './plugins/fireworks-fx.js';
import { sounds } from './audio.js';
import { playables } from './playables-sdk.js';
import { gamification } from './gamification.js';

export const COIN_SVG = `<img src="assets/icons/dollar.webp" alt="Coins" class="coin-dollar-img"/>`;

class ColoringApp {
  constructor() {
    this.currentCategory = null;
    this.currentAnimal = null;
    this.currentAnimalIndex = 0;
    this.canvasEngine = null;
    this.fireworksFX = null;

    // 3 Animal-tailored crayons
    this.activeAnimalColors = null;

    // Secondary crayons for "More Colors" drawer
    this.allDrawerColors = [
      { hex: '#ef4444', name: 'Vibrant Red' },
      { hex: '#f97316', name: 'Juicy Orange' },
      { hex: '#facc15', name: 'Golden Yellow' },
      { hex: '#eab308', name: 'Sun Yellow' },
      { hex: '#84cc16', name: 'Lime Green' },
      { hex: '#22c55e', name: 'Emerald Green' },
      { hex: '#14b8a6', name: 'Teal' },
      { hex: '#06b6d4', name: 'Sky Cyan' },
      { hex: '#3b82f6', name: 'Ocean Blue' },
      { hex: '#6366f1', name: 'Indigo' },
      { hex: '#a855f7', name: 'Bug Purple' },
      { hex: '#ec4899', name: 'Bright Pink' },
      { hex: '#fb7185', name: 'Rose Petal' },
      { hex: '#fbcfe8', name: 'Peach Glow' },
      { hex: '#d97706', name: 'Earthy Tan' },
      { hex: '#854d0e', name: 'Cozy Brown' },
      { hex: '#64748b', name: 'Slate Gray' },
      { hex: '#1e293b', name: 'Midnight Black' },
      { hex: '#ffffff', name: 'Snow White', isWhite: true }
    ];

    this.selectedColor = '#facc15';
    this.selectedTool = 'crayon';

    // Special Neon & Glitter Palette (Locked by default - Unlocked via Rewarded Ad)
    this.isNeonUnlocked = false;
    this.neonPalette = [
      // Vibrant Electric Neon Colors
      { hex: '#ff007f', name: 'Neon Hot Pink', type: 'neon' },
      { hex: '#00f0ff', name: 'Electric Cyan', type: 'neon' },
      { hex: '#39ff14', name: 'Neon Lime', type: 'neon' },
      { hex: '#ffe600', name: 'Cyber Sun Yellow', type: 'neon' },
      { hex: '#ff3131', name: 'Neon Coral Red', type: 'neon' },
      { hex: '#bf00ff', name: 'Electric Violet', type: 'neon' },
      // Shimmering Glitter Colors
      { hex: '#ffd700', name: 'Glitter Gold', type: 'glitter' },
      { hex: '#ff69b4', name: 'Glitter Rose', type: 'glitter' },
      { hex: '#00e676', name: 'Glitter Emerald', type: 'glitter' },
      { hex: '#00e5ff', name: 'Glitter Ice Blue', type: 'glitter' },
      { hex: '#d500f9', name: 'Glitter Cosmic Violet', type: 'glitter' },
      { hex: '#ffffff', name: 'Glitter Diamond Star', type: 'glitter' }
    ];

    // Screens
    this.screenSplash = document.getElementById('screen-splash');
    this.screenCategories = document.getElementById('screen-categories');
    this.screenGallery = document.getElementById('screen-gallery');
    this.screenStudio = document.getElementById('screen-studio');

    // Modals
    this.modalLevelComplete = document.getElementById('modal-level-complete');
    this.modalConfirmClear = document.getElementById('modal-confirm-clear');
    this.modalChallenges = document.getElementById('modal-challenges');
    this.modalUnlockLevel = document.getElementById('modal-unlock-level');

    this.pendingUnlockAnimal = null;
    this.pendingUnlockLevelNumber = null;

    window.coloringApp = this;
    window.gamification = gamification;
    window.sounds = sounds;
    window.playables = playables;
    this.init();
  }

  async init() {
    console.log('[App] Initializing Refined Animal Coloring Safari...');

    // Notify YouTube Playables initial shell / first frame is ready
    playables.notifyFirstFrameReady();

    // YouTube Playables automatic pause & resume lifecycle integration
    playables.onPause(() => {
      console.log('[App] Received onPause from YouTube Playables - pausing all execution & saving progress');
      this.isGamePaused = true;
      document.getElementById('app')?.classList.add('game-paused');
      if (this.canvasEngine) {
        this.canvasEngine.pause();
      }
      this.pauseSplashVideo();
      this.pauseSplashSparkles();
      this.fireworksFX?.pause?.();
      gamification.saveState?.();
      sounds.stopSpongeStroke();
      sounds.stopClayStroke();
      sounds.stopDoughStroke();
      sounds.stopYarnStroke();
      sounds.stopTrunkSpray();
    });

    playables.onResume(() => {
      console.log('[App] Received onResume from YouTube Playables - resuming execution');
      this.isGamePaused = false;
      document.getElementById('app')?.classList.remove('game-paused');
      if (this.canvasEngine) {
        this.canvasEngine.resume();
      }
      if (this.screenSplash && this.screenSplash.classList.contains('active')) {
        this.playSplashVideo();
        this.resumeSplashSparkles();
      }
      this.fireworksFX?.resume?.();
    });

    // Special Neon & Glitter Palette: Locked by default until player watches Ad
    this.isNeonUnlocked = false;
    try {
      const resetKey = 'neon_palette_relocked_v40';
      if (!localStorage.getItem(resetKey)) {
        localStorage.setItem(resetKey, 'true');
        localStorage.removeItem('yt_color_unlocked_neon_palette');
        if (playables.cloudStore) {
          delete playables.cloudStore['unlocked_neon_palette'];
        }
      } else {
        const savedNeon = await playables.loadData('unlocked_neon_palette');
        if (savedNeon === true || savedNeon === 'true') {
          this.isNeonUnlocked = true;
        }
      }
    } catch (_) {
      this.isNeonUnlocked = false;
    }

    // Initialize Gamification
    await gamification.init();

    // Initialize Canvas Engine
    const canvasContainer = document.getElementById('canvas-container');
    this.canvasEngine = new ColoringCanvas(canvasContainer);

    // Initialize High-Performance Fireworks Celebration Engine
    const fireworksCanvas = document.getElementById('fireworks-canvas');
    this.fireworksFX = new FireworksFX(fireworksCanvas);

    // Canvas event callbacks - reveal completion tick ONLY (no auto popups)
    this.canvasEngine.onCompletionReady = () => {
      this.revealCompletionTick(true);
      sounds.playSparkle();
    };

    this.canvasEngine.onCompletionRevoked = () => {
      this.revealCompletionTick(false);
    };

    this.canvasEngine.onColorAction = (hex) => {
      gamification.recordColorUsed(hex);
    };

    this.canvasEngine.onCelebrate = () => {
      this.handleArtworkCelebration();
    };

    // State changes
    gamification.onChange(() => {
      this.updateBadges();
    });

    this.setupPalette();
    this.initTheme();
    this.initAudioControls();
    this.initVideoSplash();
    this.setupScreens();
    this.setupEvents();
    this.setupModals();
    this.renderCategoryCards();
    this.updateBadges();

    // Notify YouTube Playables the game has fully loaded and is interactive
    playables.notifyGameReady();
    playables.sendScore(gamification.coins || 100);
  }

  initTheme() {
    let savedTheme = 'ivory';
    try {
      savedTheme = localStorage.getItem('animal_coloring_theme') || 'ivory';
    } catch (e) {}

    this.applyTheme(savedTheme, false);

    // Bind all theme dot / swatch buttons across settings modals
    document.querySelectorAll('.theme-dot-btn, .theme-swatch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const theme = btn.getAttribute('data-theme');
        if (theme) {
          sounds.playClick();
          this.applyTheme(theme, true);
        }
      });
    });
  }

  applyTheme(themeKey, animate = true) {
    const validThemes = ['ivory', 'peach', 'blue', 'pink', 'dark'];
    if (!validThemes.includes(themeKey)) themeKey = 'ivory';

    document.documentElement.setAttribute('data-game-theme', themeKey);
    document.body.setAttribute('data-game-theme', themeKey);
    try {
      localStorage.setItem('animal_coloring_theme', themeKey);
    } catch (e) {}

    // Update active state on all swatch & dot buttons
    document.querySelectorAll('.theme-dot-btn, .theme-swatch-btn').forEach(btn => {
      const isMatch = btn.getAttribute('data-theme') === themeKey;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
    });

    console.log(`[Theme] Applied game background theme: ${themeKey}`);
  }

  initAudioControls() {
    // Synchronize switches with sound engine state
    const syncAudioSwitches = () => {
      document.querySelectorAll('.music-toggle-input').forEach(input => {
        input.checked = sounds.musicEnabled;
      });
      document.querySelectorAll('.sounds-toggle-input').forEach(input => {
        input.checked = sounds.soundsEnabled;
      });
    };

    // Synchronize track buttons across all modals
    const syncTrackButtons = () => {
      const activeTrack = sounds.currentBgmTrack || 'track_1';
      document.querySelectorAll('.music-track-btn').forEach(btn => {
        const isMatch = btn.dataset.track === activeTrack;
        btn.classList.toggle('active', isMatch);
        btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
      });
    };

    syncAudioSwitches();
    syncTrackButtons();

    // Dedicated Music toggle listeners
    document.querySelectorAll('.music-toggle-input').forEach(input => {
      input.addEventListener('change', (e) => {
        sounds.playClick();
        sounds.setMusicEnabled(e.target.checked);
        syncAudioSwitches();
      });
    });

    // Dedicated Sounds (SFX) toggle listeners
    document.querySelectorAll('.sounds-toggle-input').forEach(input => {
      input.addEventListener('change', (e) => {
        sounds.playClick();
        sounds.setSoundsEnabled(e.target.checked);
        syncAudioSwitches();
      });
    });

    // Track selection button listeners
    document.querySelectorAll('.music-track-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const trackId = btn.dataset.track;
        if (trackId) {
          sounds.playClick();
          if (!sounds.musicEnabled) {
            sounds.setMusicEnabled(true);
            syncAudioSwitches();
          }
          sounds.setBgmTrack(trackId);
          syncTrackButtons();
        }
      });
    });

    // Auto-sync when audio state changes externally (e.g. YouTube SDK focus/unmute)
    sounds.onAudioSettingsChange(() => {
      syncAudioSwitches();
      syncTrackButtons();
    });
  }

  showToast(msg, icon = '✨') {
    const toast = document.getElementById('app-toast');
    const toastText = document.getElementById('toast-text');
    const toastIcon = document.getElementById('toast-icon');
    if (!toast) return;

    if (toastText) toastText.textContent = msg;
    if (toastIcon) toastIcon.textContent = icon;

    toast.classList.remove('hidden');
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2400);
  }

  setupScreens() {
    const urlParams = new URLSearchParams(window.location.search);
    const screenParam = urlParams.get('screen');
    const catParam = (urlParams.get('category') || urlParams.get('cat') || '').toLowerCase();
    const animalParam = (urlParams.get('animal') || urlParams.get('id') || '').toLowerCase();
    const actionParam = (urlParams.get('action') || urlParams.get('test') || '').toLowerCase();

    // Data testing action parameters
    if (actionParam === 'unlockall' || actionParam === 'unlock') {
      this.testUnlockAll();
    } else if (actionParam === 'reset' || actionParam === 'resetdata') {
      this.testResetData();
    }

    if (screenParam === 'studio') {
      let targetCat = CATEGORIES[0];
      if (catParam) {
        const found = CATEGORIES.find(c => c.id.toLowerCase() === catParam || c.name.toLowerCase().includes(catParam));
        if (found) targetCat = found;
      }
      this.currentCategory = targetCat;

      let targetAnimal = targetCat.animals[0];
      let targetIndex = 0;
      if (animalParam) {
        const foundIdx = targetCat.animals.findIndex(a => 
          a.id.toLowerCase() === animalParam || 
          a.name.toLowerCase() === animalParam ||
          a.name.toLowerCase().includes(animalParam) || 
          a.file.toLowerCase().includes(animalParam)
        );
        if (foundIdx !== -1) {
          targetAnimal = targetCat.animals[foundIdx];
          targetIndex = foundIdx;
        }
      }
      this.openStudio(targetAnimal, targetIndex);
      return;
    } else if (screenParam === 'gallery') {
      let targetCat = CATEGORIES[0];
      if (catParam) {
        const found = CATEGORIES.find(c => c.id.toLowerCase() === catParam || c.name.toLowerCase().includes(catParam));
        if (found) targetCat = found;
      }
      this.currentCategory = targetCat;
      this.showScreen('gallery');
      return;
    } else if (screenParam === 'categories' || screenParam === 'home') {
      this.showScreen('categories');
      return;
    }
    this.showScreen('splash');
  }

  testUnlockAll() {
    console.log('[Test Harness] Unlocking all animals and giving 999 coins');
    CATEGORIES.forEach(cat => {
      gamification.progress[cat.id] = { unlockedLevel: 999, levels: {} };
    });
    gamification.coins = 999;
    gamification.saveState();
    gamification.updateCoinDisplay();
    this.showToast('⭐ Test Mode: All Animals Unlocked & 999 Coins!');
  }

  testResetData() {
    console.log('[Test Harness] Resetting player progress');
    try {
      localStorage.clear();
      if (playables && playables.cloudStore) {
        playables.cloudStore = {};
        playables.flushCloudSave();
      }
    } catch (_) {}
    this.isNeonUnlocked = false;
    gamification.coins = 100;
    gamification.progress = {};
    CATEGORIES.forEach(cat => {
      gamification.progress[cat.id] = { unlockedLevel: 1, levels: {} };
    });
    gamification.saveState();
    gamification.updateCoinDisplay();
    this.setupPalette();
    this.showToast('🔄 Test Mode: Clean State (100 Coins)');
  }

  showScreen(name) {
    [this.screenSplash, this.screenCategories, this.screenGallery, this.screenStudio].forEach(s => {
      if (s) s.classList.remove('active');
    });

    if (name === 'splash') {
      if (this.screenSplash) this.screenSplash.classList.add('active');
      this.playSplashVideo();
      // If user navigated back to splash and play was previously revealed, keep it visible
      const footer = document.querySelector('.splash-video-footer');
      if (footer && this.splashPlayRevealed) {
        footer.classList.remove('hidden');
        footer.classList.add('visible');
      }
      this.resumeSplashSparkles();
    } else {
      this.pauseSplashVideo();
      const footer = document.querySelector('.splash-video-footer');
      if (footer) {
        footer.classList.remove('visible');
        footer.classList.add('hidden');
      }
    }
    if (name === 'categories' || name === 'home') {
      this.renderCategoryCards();
      if (this.screenCategories) this.screenCategories.classList.add('active');
    }
    if (name === 'gallery') {
      if (this.currentCategory) this.renderGalleryAnimals();
      if (this.screenGallery) this.screenGallery.classList.add('active');
    }
    if (name === 'studio') {
      if (this.screenStudio) this.screenStudio.classList.add('active');
      this.revealCompletionTick(this.canvasEngine.ninetyPercentReached);
    }

    this.updateBadges();
  }

  updateBadges() {
    gamification.updateCoinDisplay();

    const hasChallenges = gamification.hasUnclaimedChallenges();
    document.querySelectorAll('.challenge-dot').forEach(dot => {
      dot.style.display = hasChallenges ? 'block' : 'none';
    });
  }

  renderCategoryCards() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;
    grid.innerHTML = '';

    CATEGORIES.forEach(cat => {
      const card = document.createElement('button');
      card.className = 'category-ref-card';
      card.setAttribute('data-cat-id', cat.id);
      card.style.setProperty('--circle-bg', cat.circleBg || cat.color);

      // Squircle card matching reference design with large circular animal illustration
      card.innerHTML = `
        <div class="cat-circle-badge">
          <img src="${cat.icon}?v=6" alt="${cat.name}" class="cat-circle-img" onerror="this.outerHTML='<span class=\\'cat-fallback-emoji\\'>${cat.emoji}</span>'"/>
        </div>
        <div class="cat-card-label">${cat.shortName || cat.name}</div>
      `;

      // Open category into Drawing Studio (Level 1)
      card.addEventListener('click', () => {
        sounds.playPop(1.2);
        this.openCategory(cat);
      });

      grid.appendChild(card);
    });
  }

  openCategory(cat) {
    this.currentCategory = cat;
    document.getElementById('gallery-title').textContent = cat.name;
    this.renderGalleryAnimals();

    // Directly open Drawing Page (Level 1) for all categories
    if (cat.animals && cat.animals.length > 0) {
      const firstAnimal = cat.animals[0];
      this.openStudio(firstAnimal, 0);
      return;
    }

    this.showScreen('gallery');
  }

  renderGalleryAnimals() {
    const cat = this.currentCategory;
    const grid = document.getElementById('animal-grid');
    grid.innerHTML = '';

    // Warm cache for the first few animals in category
    if (cat && cat.animals) {
      cat.animals.slice(0, 4).forEach(a => prefetchAnimalSvg(a.path));
    }

    if (cat && cat.animals) {
      cat.animals.forEach((animal, idx) => {
        const levelNumber = idx + 1;
        const isUnlocked = gamification.isLevelUnlocked(cat.id, levelNumber);
        const levelInfo = gamification.getLevelInfo(cat.id, levelNumber);
        const isCompleted = !!levelInfo.completed;

        const card = document.createElement('button');
        card.className = `animal-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`;

        card.innerHTML = `
          <div class="animal-thumb-wrapper">
            <img src="${animal.path}?v=2" alt="${animal.name}" loading="lazy" class="animal-thumb"/>
            ${isCompleted ? `
              <div class="completed-badge">
                <span>✓ Done</span>
              </div>
            ` : !isUnlocked ? `
              <div class="lock-overlay">
                <span class="lock-icon">🔒</span>
                <span class="lock-cost">50 ${COIN_SVG}</span>
              </div>
            ` : ''}
          </div>
          <div class="animal-label">${animal.name}</div>
        `;

        card.addEventListener('click', () => {
          if (isUnlocked) {
            sounds.playClick();
            this.openStudio(animal, idx);
          } else {
            sounds.playPop(0.8);
            this.promptUnlockAnimal(cat, animal, levelNumber);
          }
        });

        grid.appendChild(card);
      });
    }

    // Append the LAST Option in all 6 Galleries: Blank Canvas (Unlocked, No Level, Free Drawing)
    const blankCard = document.createElement('button');
    blankCard.type = 'button';
    blankCard.className = 'animal-card unlocked blank-canvas-card';
    blankCard.title = 'Blank Canvas - Free Draw';
    blankCard.innerHTML = `
      <div class="animal-thumb-wrapper blank-thumb-wrapper">
        <div class="blank-canvas-icon-wrap">
          <svg viewBox="0 0 48 48" width="48" height="48" fill="none" class="blank-easel-svg">
            <rect x="6" y="8" width="36" height="26" rx="3.5" fill="#FFFFFF" stroke="#007AFF" stroke-width="2.6" stroke-dasharray="3.5 2.5"/>
            <path d="M14 34 L10 44 M34 34 L38 44" stroke="#94a3b8" stroke-width="2.6" stroke-linecap="round"/>
            <path d="M24 34 L24 43" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round"/>
            <path d="M19 16 C19 14.5, 23 13, 27 15 C31 17, 31 21, 28 23 C26 24.5, 24 23, 22 24 C20 25, 19 23, 19 21 Z" fill="#FFAE73" opacity="0.35"/>
            <circle cx="21" cy="18" r="1.8" fill="#FF3B30"/>
            <circle cx="26" cy="17" r="1.8" fill="#007AFF"/>
            <circle cx="27" cy="22" r="1.8" fill="#34C759"/>
            <circle cx="22" cy="22" r="1.8" fill="#AF52DE"/>
            <path d="M30 11 L33 8 L35 10 L32 13 Z" fill="#FF9500"/>
            <path d="M37 6 L38 8 L40 9 L38 10 L37 12 L36 10 L34 9 L36 8 Z" fill="#FFCC00"/>
          </svg>
        </div>
        <div class="blank-badge-pill">Free Draw</div>
      </div>
      <div class="animal-label">Blank Canvas</div>
    `;

    blankCard.addEventListener('click', () => {
      sounds.playClick();
      this.openStudio({ id: 'blank_canvas', name: 'Blank Canvas', isBlankCanvas: true }, -1);
    });

    grid.appendChild(blankCard);
  }

  async openStudio(animal, animalIndex) {
    const isBlank = !!(animal && animal.isBlankCanvas);
    this.currentAnimal = animal;
    this.currentAnimalIndex = animalIndex !== undefined ? animalIndex : 0;

    if (!isBlank) {
      gamification.resetCurrentLevelColors();
      if (this.currentCategory) {
        gamification.setLastPlayedAnimal(this.currentCategory.id, animal);
      }
    }

    const skipBtn = document.getElementById('btn-skip-studio');

    if (isBlank) {
      if (skipBtn) skipBtn.classList.add('hidden');

      const titleEl = document.getElementById('studio-animal-name');
      if (titleEl) titleEl.textContent = 'Art Studio • Free Draw';

      // Header title: ART STUDIO (No Level number as requested!)
      const levelHeadline = document.getElementById('studio-level-headline');
      if (levelHeadline) levelHeadline.textContent = 'ART STUDIO';

      const pillName = document.getElementById('studio-pill-name');
      if (pillName) pillName.textContent = 'BLANK CANVAS';

      const pillAvatar = document.getElementById('studio-pill-avatar');
      if (pillAvatar) {
        pillAvatar.src = 'assets/icons/Selection.svg';
      }
    } else {
      if (skipBtn) skipBtn.classList.remove('hidden');

      const levelNum = this.currentAnimalIndex + 1;
      const titleEl = document.getElementById('studio-animal-name');
      if (titleEl) {
        titleEl.textContent = `Level ${levelNum} • ${animal.name}`;
      }

      // Santa Reference Header elements
      const levelHeadline = document.getElementById('studio-level-headline');
      if (levelHeadline) {
        levelHeadline.textContent = `LEVEL ${levelNum}`;
      }
      const pillName = document.getElementById('studio-pill-name');
      if (pillName) {
        pillName.textContent = animal.name.toUpperCase();
      }
      const pillAvatar = document.getElementById('studio-pill-avatar');
      if (pillAvatar) {
        pillAvatar.src = animal.path;
      }
    }

    this.showScreen('studio');

    // Retrieve curated colors
    try {
      if (isBlank) {
        this.activeAnimalColors = [
          { hex: '#ef4444', name: 'Bright Red' },
          { hex: '#f59e0b', name: 'Sunny Yellow' },
          { hex: '#10b981', name: 'Fresh Green' },
          { hex: '#0ea5e9', name: 'Sky Blue' },
          { hex: '#8b5cf6', name: 'Magic Purple' }
        ];
        this.selectedColor = '#ef4444';
        this.setupPalette();
      } else {
        const rawColors = getAnimalColors(animal, this.currentCategory?.id);
        if (Array.isArray(rawColors) && rawColors.length > 0) {
          this.activeAnimalColors = rawColors.map(c => {
            if (typeof c === 'string') return { hex: c, name: c };
            if (c && c.hex) return c;
            return { hex: '#eab308', name: 'Golden Yellow' };
          });
        } else {
          this.activeAnimalColors = [
            { hex: '#eab308', name: 'Golden Yellow' },
            { hex: '#f97316', name: 'Warm Orange' },
            { hex: '#3b82f6', name: 'Sky Blue' }
          ];
        }
        this.selectedColor = (this.activeAnimalColors[0] && this.activeAnimalColors[0].hex) ? this.activeAnimalColors[0].hex : '#eab308';
        this.setupPalette();
      }
    } catch (paletteErr) {
      console.warn('Error setting up palette colors:', paletteErr);
      this.selectedColor = '#eab308';
    }

    // Close options dropdown if open
    this.toggleStudioMenu(false);

    // Reset completion tick & banner
    this.revealCompletionTick(false);
    const completionBanner = document.getElementById('canvas-completion-banner');
    if (completionBanner) completionBanner.classList.add('hidden');

    // Show loading state
    const loader = document.getElementById('studio-loader');
    if (loader) {
      loader.textContent = isBlank ? 'Preparing Blank Canvas... 🎨' : `Loading ${animal.name}... 🎨`;
      loader.classList.add('visible');
    }

    try {
      if (isBlank) {
        await this.canvasEngine.loadBlankCanvas();
      } else {
        await this.canvasEngine.loadAnimal(animal);
      }
    } catch (err) {
      console.error('Failed to load canvas:', err);
    } finally {
      if (loader) loader.classList.remove('visible');
    }

    // Retain user's chosen tool (fill bucket, sponge, or crayon) across animals silently (no awkward sound on start)
    const toolToRetain = (this.selectedTool && this.selectedTool !== 'eraser') ? this.selectedTool : 'crayon';
    this.selectTool(toolToRetain, true);
    this.selectColor(this.selectedColor);

    // Check if drawing was already >= 85%
    if (!isBlank && this.canvasEngine.ninetyPercentReached) {
      this.revealCompletionTick(true);
      if (completionBanner) completionBanner.classList.remove('hidden');
    }

    // Prefetch the NEXT animal in the background so Next/Skip is instantaneous!
    if (!isBlank) {
      const nextIdx = (this.currentAnimalIndex || 0) + 1;
      if (this.currentCategory && this.currentCategory.animals && this.currentCategory.animals[nextIdx]) {
        prefetchAnimalSvg(this.currentCategory.animals[nextIdx].path);
      }
    }
  }

  revealCompletionTick(show) {
    const tickBtn = document.getElementById('btn-complete-tick');
    if (!tickBtn) return;
    if (show) {
      tickBtn.classList.remove('hidden');
      tickBtn.classList.add('revealed');
    } else {
      tickBtn.classList.remove('revealed');
      tickBtn.classList.add('hidden');
    }
  }

  // Spectacular Fireworks Celebration with fanfare and confetti explosions
  handleArtworkCelebration() {
    const cat = this.currentCategory || CATEGORIES[0];
    const animal = this.currentAnimal || (cat && cat.animals ? cat.animals[this.currentAnimalIndex || 0] : null);
    const animalName = animal ? animal.name : 'Masterpiece';

    this.revealCompletionTick(false);

    // Play victory fanfare + Woo.mp3 celebration sound
    sounds.playFanfare();

    // Trigger high-power ConfettiFX multi-cannon explosion
    if (this.canvasEngine && this.canvasEngine.confettiFX) {
      this.canvasEngine.confettiFX.burstCelebration(this.canvasEngine.width / 2, this.canvasEngine.height * 0.45, 95);
      this.canvasEngine.confettiFX.fountainBothSides(65);
    }

    // Spectacular full-screen Fireworks Celebration!
    // (Replaces old 'Completed Popup' with dazzling morale-boosting fireworks)
    if (this.fireworksFX) {
      this.fireworksFX.startCelebration(() => {
        this.showCompletionModal();
      });
    } else {
      setTimeout(() => {
        this.showCompletionModal();
      }, 2000);
    }
  }

  // Smooth modal transition once the celebration finishes
  showCompletionModal() {
    const cat = this.currentCategory || CATEGORIES[0];
    const animal = this.currentAnimal || (cat && cat.animals ? cat.animals[this.currentAnimalIndex || 0] : null);
    const animalName = animal ? animal.name : 'Masterpiece';
    const totalAnimals = cat && cat.animals ? cat.animals.length : 30;
    const levelNumber = (this.currentAnimalIndex || 0) + 1;

    // Complete in gamification (awards coins only once!)
    const result = (cat && cat.id) 
      ? gamification.completeLevel(cat.id, levelNumber, totalAnimals) 
      : { firstTime: false, coinsEarned: 0, hasNextLevel: false };

    // Export player's actual artwork to show in the celebration popup
    const artworkDataUrl = this.canvasEngine.exportMergedPNG();
    const artworkImg = document.getElementById('completion-artwork-img');
    if (artworkImg) {
      artworkImg.src = artworkDataUrl;
    }

    // Save Artwork to Gallery button ("Save Drawing")
    const saveBtn = document.getElementById('btn-save-artwork');
    if (saveBtn) {
      saveBtn.classList.remove('saved');
      saveBtn.innerHTML = '<span class="save-icon">💾</span><span class="save-text">Save Drawing</span>';
      saveBtn.onclick = () => {
        sounds.playSparkle();
        try {
          const link = document.createElement('a');
          const safeName = (animalName || 'Drawing').replace(/[^a-z0-9]/gi, '_');
          link.download = `Coloring_${safeName}.png`;
          link.href = artworkDataUrl;
          link.click();
          saveBtn.classList.add('saved');
          saveBtn.innerHTML = '<span class="save-icon">✓</span><span class="save-text">Drawing Saved!</span>';
          this.showToast('Drawing saved! 🎨✨', '💾');
          setTimeout(() => {
            if (saveBtn) {
              saveBtn.classList.remove('saved');
              saveBtn.innerHTML = '<span class="save-icon">💾</span><span class="save-text">Save Drawing</span>';
            }
          }, 2400);
        } catch (err) {
          console.warn('Save failed:', err);
        }
      };
    }

    // Coin Reward: Always display +20 Coins reward when drawing is completed!
    const rewardPill = document.getElementById('completion-reward-pill');
    const rewardText = document.getElementById('completion-reward-text');
    if (rewardPill && rewardText) {
      const earned = (result && typeof result.coinsEarned === 'number' && result.coinsEarned > 0) ? result.coinsEarned : 20;
      rewardText.textContent = `+${earned} Coins`;
      rewardPill.classList.remove('hidden');
    }
    gamification.updateCoinDisplay();

    // Replay Button
    const replayBtn = document.getElementById('btn-replay-level');
    if (replayBtn) {
      replayBtn.onclick = () => {
        sounds.playClick();
        this.closeModal(this.modalLevelComplete);
        this.canvasEngine.clearColor();
        this.openStudio(animal, this.currentAnimalIndex);
      };
    }

    // Primary Next Button (clean "Next ➔" without animal name)
    const nextBtn = document.getElementById('btn-next-level');
    const nextThumb = document.getElementById('next-animal-thumb');
    const nextText = document.getElementById('btn-next-animal-text');

    if (nextThumb) nextThumb.style.display = 'none';
    if (nextText) nextText.textContent = `Next ➔`;

    const isLastAnimalInCat = (!cat || !cat.animals || this.currentAnimalIndex >= cat.animals.length - 1);

    if (!isLastAnimalInCat && result.hasNextLevel && cat.animals[result.nextLevelNumber - 1]) {
      const nextAnimal = cat.animals[result.nextLevelNumber - 1];
      if (nextBtn) {
        nextBtn.onclick = () => {
          sounds.playClick();
          this.closeModal(this.modalLevelComplete);
          this.openStudio(nextAnimal, result.nextLevelNumber - 1);
        };
      }
    } else {
      if (nextBtn) {
        nextBtn.onclick = () => {
          sounds.playClick();
          this.closeModal(this.modalLevelComplete);
          this.showScreen('categories'); // Open Home Screen i.e. Page 2!
        };
      }
    }

    this.openModal(this.modalLevelComplete);
  }

  skipToNextLevel() {
    const cat = this.currentCategory || CATEGORIES[0];
    if (!cat || !cat.animals || cat.animals.length === 0) return;

    const currentIndex = this.currentAnimalIndex || 0;
    const isLastAnimal = currentIndex >= cat.animals.length - 1;

    // If someone taps SKIP at LAST image of every category: open Home Page i.e. Page 2 without deduction of coins!
    if (isLastAnimal) {
      sounds.playClick();
      if (this.canvasEngine) {
        this.canvasEngine.triggerAutoSave();
      }
      this.showToast(`Completed ${cat.name}! Back to Home 🏠`, '🎉');
      this.showScreen('categories');
      return;
    }

    const nextIndex = currentIndex + 1;
    const nextLevelNumber = nextIndex + 1;

    // Check if player has 50 coins to skip one level/challenge without coloring
    const success = gamification.skipLevelWithCoins(cat.id, nextLevelNumber, 50);
    if (success) {
      if (nextIndex < cat.animals.length) {
        const nextAnimal = cat.animals[nextIndex];
        this.showToast('Level Skipped! (-50 Coins)', '⏭️');
        this.openStudio(nextAnimal, nextIndex);
      }
    } else {
      sounds.playError();
      this.showToast('Need 50 Coins to skip! Color more animals to earn coins ⭐', '🪙');
    }
  }

  promptUnlockAnimal(cat, animal, levelNumber) {
    this.pendingUnlockAnimal = animal;
    this.pendingUnlockLevelNumber = levelNumber;

    const titleEl = document.getElementById('unlock-level-title');
    if (titleEl) titleEl.textContent = `Unlock ${animal.name}?`;

    const descEl = document.getElementById('unlock-level-desc');
    if (descEl) descEl.style.display = 'none';

    const costVal = document.querySelector('.unlock-cost-badge .cost-val');
    if (costVal) costVal.innerHTML = `${COIN_SVG} 50 Coins`;

    const notice = document.getElementById('unlock-insufficient-notice');
    if (notice) notice.classList.add('hidden');

    this.openModal(this.modalUnlockLevel);
  }

  setupPalette() {
    // 1. Primary 3 crayons tailored for current animal
    const primaryTray = document.getElementById('primary-crayons-tray');
    if (primaryTray) {
      primaryTray.innerHTML = '';
      const colors = (this.activeAnimalColors && this.activeAnimalColors.length) ? this.activeAnimalColors : [
        { hex: '#eab308', name: 'Golden Yellow' },
        { hex: '#f97316', name: 'Warm Orange' },
        { hex: '#3b82f6', name: 'Sky Blue' }
      ];

      colors.forEach((c, idx) => {
        const hex = (c && c.hex) ? c.hex : (typeof c === 'string' ? c : '#eab308');
        const name = (c && c.name) ? c.name : 'Color';
        const btn = document.createElement('button');
        btn.className = `crayon-btn ${c && c.isWhite ? 'crayon-white' : ''}`;
        btn.style.setProperty('--crayon-color', hex);
        btn.title = name;
        btn.dataset.hex = hex;

        if (this.selectedColor && hex.toLowerCase() === this.selectedColor.toLowerCase()) {
          btn.classList.add('selected');
        }

        btn.addEventListener('click', () => {
          sounds.playChime(idx);
          this.selectColor(hex, btn);
        });

        primaryTray.appendChild(btn);
      });
    }

    // 2. Secondary "More Colors" tray
    const secondaryTray = document.getElementById('secondary-crayons-tray');
    if (secondaryTray) {
      secondaryTray.innerHTML = '';
      (this.allDrawerColors || []).forEach((c, idx) => {
        const hex = (c && c.hex) ? c.hex : (typeof c === 'string' ? c : '#eab308');
        const name = (c && c.name) ? c.name : 'Color';
        const btn = document.createElement('button');
        btn.className = `crayon-btn ${c && c.isWhite ? 'crayon-white' : ''}`;
        btn.style.setProperty('--crayon-color', hex);
        btn.title = name;
        btn.dataset.hex = hex;

        if (this.selectedColor && hex.toLowerCase() === this.selectedColor.toLowerCase()) {
          btn.classList.add('selected');
        }

        btn.addEventListener('click', () => {
          sounds.playChime(idx + 3);
          this.selectColor(hex, btn);
          this.toggleMoreColors(false);
        });

        secondaryTray.appendChild(btn);
      });
    }

    // 3. Special Neon & Glitter Palette
    const neonContainer = document.getElementById('neon-crayons-container');
    if (neonContainer) {
      neonContainer.innerHTML = '';
      if (!this.isNeonUnlocked) {
        const unlockBtn = document.createElement('button');
        unlockBtn.id = 'btn-unlock-neon-ad';
        unlockBtn.className = 'btn-unlock-neon-ad';
        unlockBtn.title = 'Watch a quick ad to unlock special neon & glitter colors';
        unlockBtn.innerHTML = `
          <span class="ad-badge-icon">🎬</span>
          <span class="ad-badge-text">Watch Ad to Unlock Neon &amp; Glitter Colors</span>
        `;
        unlockBtn.addEventListener('click', async () => {
          sounds.playClick();
          unlockBtn.disabled = true;
          unlockBtn.style.opacity = '0.75';
          unlockBtn.innerHTML = `
            <span class="ad-badge-icon">⏳</span>
            <span class="ad-badge-text">Watching Quick Ad...</span>
          `;
          const granted = await playables.requestRewardedAd('unlock_special_neon_colors');
          if (granted) {
            this.isNeonUnlocked = true;
            await playables.saveData('unlocked_neon_palette', true);
            sounds.playSparkle();
            sounds.playFanfare();
            this.showToast('✨ Neon & Glitter Colors Unlocked!', '🌟');
            this.setupPalette();
          } else {
            unlockBtn.disabled = false;
            unlockBtn.style.opacity = '1';
            unlockBtn.innerHTML = `
              <span class="ad-badge-icon">🎬</span>
              <span class="ad-badge-text">Watch Ad to Unlock Neon &amp; Glitter Colors</span>
            `;
          }
        });
        neonContainer.appendChild(unlockBtn);
      } else {
        this.neonPalette.forEach((c, idx) => {
          const btn = document.createElement('button');
          btn.className = `crayon-btn ${c.type === 'glitter' ? 'glitter-crayon' : 'neon-crayon'}`;
          btn.style.setProperty('--crayon-color', c.hex);
          btn.title = c.name;
          btn.dataset.hex = c.hex;

          if (c.hex.toLowerCase() === this.selectedColor.toLowerCase()) {
            btn.classList.add('selected');
          }

          if (c.type === 'glitter') {
            btn.innerHTML = `<span class="glitter-sparkle-badge" aria-hidden="true">✨</span>`;
          }

          btn.addEventListener('click', () => {
            sounds.playChime((idx % 6) + 1);
            sounds.playSparkle();
            this.selectColor(c.hex, btn);
            this.toggleMoreColors(false);
          });

          neonContainer.appendChild(btn);
        });
      }
    }
  }

  selectColor(hex, targetBtn = null) {
    this.selectedColor = hex;
    const wasEraser = this.selectedTool === 'eraser' || this.canvasEngine?.activeTool === 'eraser';
    this.canvasEngine.setColor(hex);

    // If eraser was active, return cleanly to previous tool or crayon
    if (wasEraser) {
      this.selectTool(this.previousTool && this.previousTool !== 'eraser' ? this.previousTool : 'crayon', true);
    }

    // Highlight selected crayon across primary & secondary
    document.querySelectorAll('.crayon-btn').forEach(btn => btn.classList.remove('selected'));
    if (targetBtn) {
      targetBtn.classList.add('selected');
    } else {
      const match = document.querySelector(`.crayon-btn[data-hex="${hex}"]`);
      if (match) match.classList.add('selected');
    }
  }

  selectTool(toolName, silent = false) {
    if (this.selectedTool !== 'eraser') {
      this.previousTool = this.selectedTool;
    }
    this.selectedTool = toolName;
    this.canvasEngine.setTool(toolName, silent);
    document.querySelectorAll('.tool-btn').forEach(btn => {
      if (btn.dataset.tool === toolName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const cornerEraser = document.getElementById('btn-corner-eraser');
    if (cornerEraser) {
      cornerEraser.classList.toggle('active', toolName === 'eraser');
    }
  }

  toggleMoreColors(open) {
    const drawer = document.getElementById('more-colors-drawer');
    if (!drawer) return;
    if (open === undefined) {
      drawer.classList.toggle('hidden');
    } else if (open) {
      drawer.classList.remove('hidden');
    } else {
      drawer.classList.add('hidden');
    }
  }

  toggleStudioMenu(open) {
    const modal = document.getElementById('studio-options-dropdown');
    if (!modal) return;
    const shouldOpen = open === undefined ? modal.classList.contains('hidden') : !!open;
    if (shouldOpen) {
      modal.classList.remove('hidden');
      const musicInput = modal.querySelector('.music-toggle-input');
      if (musicInput) musicInput.checked = sounds.musicEnabled;
      const soundsInput = modal.querySelector('.sounds-toggle-input');
      if (soundsInput) soundsInput.checked = sounds.soundsEnabled;
    } else {
      modal.classList.add('hidden');
    }
  }

  openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
  }

  closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
  }

  setupModals() {
    // 1. Completion Modal Buttons
    const replayBtn = document.getElementById('btn-replay-level');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        sounds.playClick();
        this.closeModal(this.modalLevelComplete);
        this.canvasEngine.clearColor();
        this.openStudio(this.currentAnimal, this.currentAnimalIndex);
      });
    }

    const modalGalleryBtn = document.getElementById('btn-modal-gallery');
    if (modalGalleryBtn) {
      modalGalleryBtn.addEventListener('click', () => {
        sounds.playClick();
        this.closeModal(this.modalLevelComplete);
        this.showScreen('gallery');
      });
    }

    // 2. Clear Confirmation Modal
    document.getElementById('btn-confirm-clear-action').addEventListener('click', () => {
      this.canvasEngine.clearColor();
      this.closeModal(this.modalConfirmClear);
      this.toggleStudioMenu(false);
    });

    document.getElementById('btn-cancel-clear-action').addEventListener('click', () => {
      sounds.playClick();
      this.closeModal(this.modalConfirmClear);
    });

    // 3. Challenges Modal
    document.querySelectorAll('.btn-open-challenges, #home-btn-challenges').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playPop(1.2);
        this.renderChallengesList();
        this.openModal(this.modalChallenges);
      });
    });

    document.querySelectorAll('.btn-close-challenges').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        this.closeModal(this.modalChallenges);
      });
    });

    // 4. Animal Unlock Modal
    document.getElementById('btn-confirm-unlock').addEventListener('click', () => {
      if (!this.pendingUnlockAnimal) return;
      const success = gamification.unlockLevelWithCoins(this.currentCategory.id, this.pendingUnlockLevelNumber, 50);
      if (success) {
        sounds.playLevelUnlock();
        this.closeModal(this.modalUnlockLevel);
        this.renderGalleryAnimals();
        this.openStudio(this.pendingUnlockAnimal, this.pendingUnlockLevelNumber - 1);
        this.showToast(`Unlocked ${this.pendingUnlockAnimal.name}! 🌟`, '🔓');
      } else {
        sounds.playError();
        const notice = document.getElementById('unlock-insufficient-notice');
        if (notice) {
          notice.classList.remove('hidden');
          setTimeout(() => notice.classList.add('hidden'), 3500);
        }
      }
    });

    document.getElementById('btn-cancel-unlock').addEventListener('click', () => {
      sounds.playClick();
      this.closeModal(this.modalUnlockLevel);
    });
  }

  renderChallengesList() {
    const listEl = document.getElementById('challenges-list');
    listEl.innerHTML = '';

    gamification.challenges.forEach(ch => {
      const isComplete = ch.current >= ch.target;
      const isClaimed = !!ch.claimed;

      const card = document.createElement('div');
      card.className = `challenge-item ${isClaimed ? 'claimed' : isComplete ? 'ready-to-claim' : ''}`;

      const pct = Math.min(100, Math.round((ch.current / ch.target) * 100));

      card.innerHTML = `
        <div class="challenge-icon">${ch.icon || '🎯'}</div>
        <div class="challenge-details">
          <div class="challenge-title">${ch.title}</div>
          <div class="challenge-desc">${ch.desc}</div>
          <div class="challenge-progress-bar">
            <div class="progress-fill" style="width: ${pct}%"></div>
          </div>
          <div class="challenge-progress-text">${ch.current} / ${ch.target}</div>
        </div>
        <div class="challenge-action">
          ${isClaimed ? `
            <span class="claimed-badge">✓ Done</span>
          ` : isComplete ? `
            <button class="bubbly-btn claim-reward-btn" data-id="${ch.id}">CLAIM +${ch.reward} ${COIN_SVG}</button>
          ` : `
            <div class="challenge-uncompleted-actions">
              <span class="reward-pill">+${ch.reward} ${COIN_SVG}</span>
              <button class="bubbly-btn skip-challenge-btn" data-id="${ch.id}" title="Skip Challenge without Coloring (50 Coins)">Skip (50 Coins)</button>
            </div>
          `}
        </div>
      `;

      const claimBtn = card.querySelector('.claim-reward-btn');
      if (claimBtn) {
        claimBtn.addEventListener('click', () => {
          gamification.claimChallengeReward(ch.id);
          this.renderChallengesList();
        });
      }

      const skipBtn = card.querySelector('.skip-challenge-btn');
      if (skipBtn) {
        skipBtn.addEventListener('click', () => {
          const success = gamification.skipChallengeWithCoins(ch.id, 50);
          if (success) {
            this.showToast('Challenge Skipped! (-50 Coins)', '🎯');
            this.renderChallengesList();
          } else {
            sounds.playError();
            this.showToast('Need 50 Coins to skip challenge! ⭐', '🪙');
          }
        });
      }

      listEl.appendChild(card);
    });
  }

  setupEvents() {
    // Start game / explore animals (if present)
    // Splash Screen: Start game / enter categories
    const btnSplashPlay = document.getElementById('btn-splash-play');
    if (btnSplashPlay) {
      btnSplashPlay.addEventListener('click', () => {
        sounds.playPop(1.4);
        sounds.startBgm();
        this.showScreen('categories');
      });
    }

    // Skip to next animal / level (50 Coins)
    const btnSkipStudio = document.getElementById('btn-skip-studio');
    if (btnSkipStudio) {
      btnSkipStudio.addEventListener('click', () => {
        this.skipToNextLevel();
      });
    }

    // Audio toggle
    const muteToggles = document.querySelectorAll('.btn-mute-toggle');
    muteToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.toggleMute();
      });
    });

    // Synchronize mute state automatically across all screens and YouTube system audio
    sounds.onMuteChange((isMuted) => {
      document.querySelectorAll('.mute-toggle-icon').forEach(el => {
        el.textContent = isMuted ? '🔇' : '🔊';
      });
      document.querySelectorAll('.mute-toggle-label').forEach(el => {
        el.textContent = isMuted ? 'Unmute' : 'Mute';
      });
      muteToggles.forEach(b => {
        if (!b.querySelector('.mute-toggle-label')) {
          b.textContent = isMuted ? '🔇' : '🔊';
        }
      });
      document.body.classList.toggle('audio-muted', isMuted);
    });

    // Back & Home navigation buttons
    const btnBackCategories = document.getElementById('btn-back-categories');
    if (btnBackCategories) {
      btnBackCategories.addEventListener('click', () => {
        sounds.playClick();
        this.showScreen('splash');
      });
    }

    const btnHomeGallery = document.getElementById('btn-home-gallery');
    if (btnHomeGallery) {
      btnHomeGallery.addEventListener('click', () => {
        sounds.playClick();
        this.showScreen('categories');
      });
    }

    // Categories Settings Modal (Page 2)
    const toggleCategoriesSettings = (open) => {
      const dd = document.getElementById('categories-options-dropdown');
      if (!dd) return;
      const shouldOpen = open === undefined ? dd.classList.contains('hidden') : !!open;
      if (shouldOpen) {
        dd.classList.remove('hidden');
        const musicInput = dd.querySelector('.music-toggle-input');
        if (musicInput) musicInput.checked = sounds.musicEnabled;
        const soundsInput = dd.querySelector('.sounds-toggle-input');
        if (soundsInput) soundsInput.checked = sounds.soundsEnabled;
      } else {
        dd.classList.add('hidden');
      }
    };

    const btnCategoriesSettings = document.getElementById('btn-categories-settings');
    if (btnCategoriesSettings) {
      btnCategoriesSettings.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.playClick();
        toggleCategoriesSettings();
      });
    }

    // Gallery Settings Modal (Page 3)
    const toggleGallerySettings = (open) => {
      const dd = document.getElementById('gallery-options-dropdown');
      if (!dd) return;
      const shouldOpen = open === undefined ? dd.classList.contains('hidden') : !!open;
      if (shouldOpen) {
        dd.classList.remove('hidden');
        const musicInput = dd.querySelector('.music-toggle-input');
        if (musicInput) musicInput.checked = sounds.musicEnabled;
        const soundsInput = dd.querySelector('.sounds-toggle-input');
        if (soundsInput) soundsInput.checked = sounds.soundsEnabled;
      } else {
        dd.classList.add('hidden');
      }
    };

    const btnGallerySettings = document.getElementById('btn-gallery-settings');
    if (btnGallerySettings) {
      btnGallerySettings.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.playClick();
        toggleGallerySettings();
      });
    }

    // Studio Settings Button
    const btnSettings = document.getElementById('btn-studio-settings');
    if (btnSettings) {
      btnSettings.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.playClick();
        this.toggleStudioMenu();
      });
    }

    // Modal Close Buttons (✕) and Backdrops
    document.querySelectorAll('.settings-modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.playClick();
        this.toggleStudioMenu(false);
        toggleCategoriesSettings(false);
        toggleGallerySettings(false);
      });
    });

    document.querySelectorAll('.settings-modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleStudioMenu(false);
        toggleCategoriesSettings(false);
        toggleGallerySettings(false);
      });
    });

    document.querySelectorAll('.settings-modal-sheet').forEach(sheet => {
      sheet.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });



    const btnStudioHome = document.getElementById('btn-studio-home');
    if (btnStudioHome) {
      btnStudioHome.addEventListener('click', () => {
        sounds.playClick();
        this.canvasEngine.triggerAutoSave();
        this.showScreen('categories');
      });
    }

    const btnBrushToggle = document.getElementById('btn-studio-brush-toggle');
    if (btnBrushToggle) {
      btnBrushToggle.addEventListener('click', () => {
        sounds.playClick();
        this.selectTool('crayon');
      });
    }

    const btnVip = document.getElementById('btn-studio-vip');
    if (btnVip) {
      btnVip.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.playPop(1.2);
        this.toggleMoreColors();
      });
    }

    const btnStudioGallery = document.getElementById('btn-studio-gallery');
    if (btnStudioGallery) {
      btnStudioGallery.addEventListener('click', () => {
        sounds.playClick();
        this.canvasEngine.triggerAutoSave();
        this.showScreen('gallery');
      });
    }

    const btnBackStudio = document.getElementById('btn-back-studio');
    if (btnBackStudio) {
      btnBackStudio.addEventListener('click', () => {
        sounds.playClick();
        this.canvasEngine.triggerAutoSave();
        this.showScreen('gallery');
      });
    }

    const btnHomeStudio = document.getElementById('btn-home-studio');
    if (btnHomeStudio) {
      btnHomeStudio.addEventListener('click', () => {
        sounds.playClick();
        this.canvasEngine.triggerAutoSave();
        this.showScreen('home');
      });
    }

    // Tool switching
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.tool) {
          this.selectTool(btn.dataset.tool);
        }
      });
    });

    // Undo
    document.getElementById('btn-undo').addEventListener('click', () => {
      this.canvasEngine.undo();
    });

    // Top-Left Corner Eraser Tool Toggle
    const btnCornerEraser = document.getElementById('btn-corner-eraser');
    if (btnCornerEraser) {
      btnCornerEraser.addEventListener('click', () => {
        sounds.playClick();
        if (this.selectedTool === 'eraser') {
          this.selectTool(this.previousTool && this.previousTool !== 'eraser' ? this.previousTool : 'crayon');
        } else {
          this.selectTool('eraser');
        }
      });
    }

    // More Colors Toggle
    document.getElementById('btn-toggle-more-colors').addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.playClick();
      this.toggleMoreColors();
    });

    document.getElementById('btn-close-more-colors').addEventListener('click', () => {
      sounds.playClick();
      this.toggleMoreColors(false);
    });

    // Options Menu (if present)
    const btnStudioMenu = document.getElementById('btn-studio-menu');
    if (btnStudioMenu) {
      btnStudioMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        sounds.playClick();
        this.toggleStudioMenu();
      });
    }

    window.addEventListener('click', (e) => {
      if (!e.target.closest('.studio-options-wrapper')) {
        this.toggleStudioMenu(false);
      }
      if (!e.target.closest('#categories-options-dropdown') && !e.target.closest('#btn-categories-settings')) {
        const catDropdown = document.getElementById('categories-options-dropdown');
        if (catDropdown) catDropdown.classList.add('hidden');
      }
      if (!e.target.closest('#gallery-options-dropdown') && !e.target.closest('#btn-gallery-settings')) {
        const galDropdown = document.getElementById('gallery-options-dropdown');
        if (galDropdown) galDropdown.classList.add('hidden');
      }
      if (!e.target.closest('.more-colors-drawer') && !e.target.closest('#btn-toggle-more-colors')) {
        this.toggleMoreColors(false);
      }
    });

    // Save Picture
    document.getElementById('btn-save-picture').addEventListener('click', () => {
      sounds.playPop(1.5);
      const dataUrl = this.canvasEngine.exportMergedPNG();
      try {
        const a = document.createElement('a');
        a.href = dataUrl;
        const cleanName = (this.currentAnimal ? this.currentAnimal.name : 'animal').replace(/[^a-zA-Z0-9]/g, '_');
        a.download = `ColoringSafari_${cleanName}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        console.warn('Download link error in iframe:', e);
      }

      this.canvasEngine.triggerAutoSave();
      this.showToast('Picture saved! 🎨✨', '💾');
      this.toggleStudioMenu(false);
    });

    // Clear Picture (with confirmation)
    document.getElementById('btn-clear-picture').addEventListener('click', () => {
      this.toggleStudioMenu(false);
      this.openModal(this.modalConfirmClear);
    });

    // Green Completion Tick in Drawing Canvas Left Bottom Corner
    document.getElementById('btn-complete-tick').addEventListener('click', () => {
      this.revealCompletionTick(false);
      this.canvasEngine.celebrateCompletion();
    });
  }

  initVideoSplash() {
    this.splashVideo = document.getElementById('splash-video');
    if (!this.splashVideo) return;

    // Explicitly set muted attributes on DOM element to pass browser autoplay policies
    this.splashVideo.muted = true;
    this.splashVideo.defaultMuted = true;
    this.splashVideo.playsInline = true;

    const syncMotion = () => {
      const isReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (this.isGamePaused || isReduced) {
        this.pauseSplashVideo();
      } else if (this.screenSplash && this.screenSplash.classList.contains('active')) {
        this.playSplashVideo();
      }
    };

    this.splashVideo.addEventListener('loadeddata', syncMotion);
    this.splashVideo.addEventListener('canplay', syncMotion);
    this.splashVideo.addEventListener('canplaythrough', syncMotion);

    // Splash Play button is instantly visible & ready on page load
    const footer = document.querySelector('.splash-video-footer');
    this.splashPlayRevealed = true;
    if (footer) {
      footer.classList.remove('hidden');
      footer.classList.add('visible');
    }

    const revealPlayBtn = () => {
      if (!footer) return;
      this.splashPlayRevealed = true;
      footer.classList.remove('hidden');
      footer.classList.add('visible');
    };

    // Reveal at ~3.2 seconds into the video (when elephant concludes paint spray and title is settled)
    this.splashVideo.addEventListener('timeupdate', () => {
      if (this.splashVideo.currentTime >= 3.2) {
        revealPlayBtn();
      }
    });

    // Also reveal on video loop or completion if timeupdate stepped over
    this.splashVideo.addEventListener('ended', revealPlayBtn);

    // Tap/click anywhere on splash screen to reveal Play immediately (skip waiting)
    this.screenSplash?.addEventListener('pointerdown', (e) => {
      if (!e.target.closest('#btn-splash-play')) {
        revealPlayBtn();
      }
    });

    // Safety fallback only after full duration in case video buffering delays timeupdate
    setTimeout(revealPlayBtn, 4500);

    // Immediate splash video attempt
    this.playSplashVideo();

    // Fallback on first gesture if browser blocks autoplay before interaction
    const onFirstGesture = () => {
      if (this.screenSplash && this.screenSplash.classList.contains('active')) {
        this.playSplashVideo();
      }
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('touchstart', onFirstGesture);
    };
    window.addEventListener('pointerdown', onFirstGesture, { passive: true });
    window.addEventListener('touchstart', onFirstGesture, { passive: true });

    // Standalone fallback: sync video on window blur/focus if needed outside YouTube
    if (!playables.isPlayables) {
      window.addEventListener('blur', () => this.pauseSplashVideo());
      window.addEventListener('focus', () => {
        if (this.screenSplash && this.screenSplash.classList.contains('active') && !this.isGamePaused) {
          this.playSplashVideo();
        }
      });
    }

    // Initialize foreground sparkles
    this.initSplashSparkles();
  }

  initSplashSparkles() {
    const canvas = document.getElementById('splash-sparkles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.splashSparklesAnim = null;
    const particles = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr) || 360;
      canvas.height = Math.floor(rect.height * dpr) || 640;
    };

    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 22; i++) {
      particles.push({
        x: Math.random() * (canvas.width || 360),
        y: Math.random() * (canvas.height || 640),
        size: Math.random() * 2.8 + 2.0,
        speedY: Math.random() * 0.45 + 0.25,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.65 + 0.35,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.04 + 0.02
      });
    }

    const render = () => {
      if (!this.screenSplash || !this.screenSplash.classList.contains('active')) {
        this.splashSparklesAnim = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      for (const p of particles) {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulse += p.pulseSpeed;

        if (p.y < -15) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }

        const alpha = p.opacity * (0.55 + 0.45 * Math.sin(p.pulse));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 6;

        // 4-pointed golden sparkle star
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -s * 2);
        ctx.quadraticCurveTo(0, 0, s * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, s * 2);
        ctx.quadraticCurveTo(0, 0, -s * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s * 2);
        ctx.fill();

        ctx.restore();
      }

      this.splashSparklesAnim = requestAnimationFrame(render);
    };

    this.renderSplashSparkles = render;
    render();
  }

  resumeSplashSparkles() {
    if (!this.splashSparklesAnim && this.renderSplashSparkles) {
      this.renderSplashSparkles();
    }
  }

  pauseSplashSparkles() {
    if (this.splashSparklesAnim) {
      cancelAnimationFrame(this.splashSparklesAnim);
      this.splashSparklesAnim = null;
    }
  }

  playSplashVideo() {
    if (this.splashVideo) {
      this.splashVideo.muted = true;
      const p = this.splashVideo.play();
      if (p !== undefined) {
        p.catch(err => {
          console.warn('[Splash] Video play waiting for gesture:', err);
        });
      }
    }
  }

  pauseSplashVideo() {
    if (this.splashVideo) {
      this.splashVideo.pause();
    }
  }
}

// Instantiate App
window.addEventListener('DOMContentLoaded', () => {
  window.coloringApp = new ColoringApp();
});